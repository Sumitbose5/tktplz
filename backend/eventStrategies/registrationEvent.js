import { and, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { participants } from "../drizzle/participantInfo.js";
import { events } from "../drizzle/eventSchema.js";
import { ticketCategories, ticketPrices } from "../drizzle/ticketPrices.js";
import { eventCleanupQueue } from "../queues/eventCleanupQueue.js";
import { v4 as uuidv4 } from 'uuid';
import Form from "../models/FormSchema.js";

export const registrationEvent = async (req, res) => {
    try {

        const {
            eventName, organiserID, type, subtype, description, location, city, state, area_name, eventInstructions,
            start, end, maxParticipantAllowed, platformForOnlineEvent, requiresRegistration, isPaid,
            eventLink, bookingCutoffType, bookingCutoffMinutesBeforeStart, bookingCutoffTimestamp, pricingOption, categorizedPrices, flatPrice,
            eligibility_age, genre, language, ratingCode, ticketsCancellable,
            pin, isOnline, eligibility_criteria, registrationFields, isCompetition, participationType, minTeamMembers, maxTeamMembers
        } = req.body;

        // Validate start and end times
        const scheduleStart = new Date(start);
        const scheduleEnd = new Date(end);
        if (isNaN(scheduleStart.getTime()) || isNaN(scheduleEnd.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid start or end datetime format" });
        }

        // Handle booking cutoff logic
        let bookingCloseTime = null;
        let parsedBookingCutoffTimestamp = null;

        if (bookingCutoffType === 'before_start') {
            if (!bookingCutoffMinutesBeforeStart) {
                return res.status(400).json({ error: 'bookingCutoffMinutesBeforeStart is required' });
            }
            bookingCloseTime = new Date(scheduleStart.getTime() - bookingCutoffMinutesBeforeStart * 60000);
        }

        if (bookingCutoffType === 'custom_time') {
            if (!bookingCutoffTimestamp) {
                return res.status(400).json({ error: 'bookingCutoffTimestamp is required' });
            }

            parsedBookingCutoffTimestamp = new Date(bookingCutoffTimestamp);
            if (isNaN(parsedBookingCutoffTimestamp.getTime())) {
                return res.status(400).json({ error: 'Invalid bookingCutoffTimestamp format' });
            }

            bookingCloseTime = parsedBookingCutoffTimestamp;
        }

        // Create event id
        const eventID = uuidv4();

        await db.insert(events)
            .values({
                id: eventID, name: eventName, organiserID, type, sub_type: subtype, description, location, city, state, area_name, eventInstructions,
                scheduleStart, scheduleEnd, maxParticipantAllowed, platformForOnlineEvent, requiresRegistration, isPaid, isPublished: true,
                eventLink, bookingCutoffType, bookingCutoffMinutesBeforeStart, bookingCutoffTimestamp: parsedBookingCutoffTimestamp,
                bookingCloseTime,
                eligibility_age: typeof eligibility_age === 'number' ? eligibility_age : 0,
                genre,
                language,
                ratingCode,
                isTicketsCancelleable: ticketsCancellable,
                pin, isOnline, eligibility_criteria, isCompetition, participationType, minTeamMembers, maxTeamMembers
            })

        // Insert into ticket categories
        if (pricingOption === "categorized") {
            await db.insert(ticketCategories).values(categorizedPrices.map(price => ({
                eventId: eventID,
                type: price.type,
                numberOfTickets: price.numberOfTickets,
                price: price.price
            })));
        }

        if (pricingOption === "flat") {
            await db.insert(ticketPrices).values({
                eventId: eventID,
                flatPrice,
                numberOfTickets: maxParticipantAllowed,
            });
        }

        // Save the form schema (to be filled by the participant) in mongo DB

        // Map the JSON fields to objects that match FieldSchema
        const fieldSchemas = registrationFields.map(field => ({
            label: field.name,
            type: field.type,
            required: field.required,
            options: field.options || []  // Handle optional 'options' field
        }));

        // Create the Form document
        const newForm = new Form({
            eventID,
            teamRegistration: participationType === "team" ? true : false,
            fields: fieldSchemas
        });

        // Save to MongoDB
        const savedForm = await newForm.save();

        // Save the savedForm ID in event's formSchemaID
        await db.update(events)
            .set({ formSchemaID: savedForm._id.toString() })
            .where(eq(events.id, eventID));

        // Schedule cleanup job for event end
        await eventCleanupQueue.add(
            'cleanup-event',
            { eventId: eventID, eventType: type },
            { delay: scheduleEnd.getTime() - Date.now(), jobId: `cleanup-${eventID}` }
        );

        return res.status(201).json({
            success: true,
            message: "Registration event created successfully",
            eventID
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const registerForEvent = async (participant) => {
    const { name, email, role, affiliation, college, eventID } = participant;

    try {
        // Check if the participant is already registered for the event
        const existingParticipant = await db
            .select()
            .from(participants)
            .where(
                and(
                    eq(participants.email, email),
                    eq(participants.eventID, eventID)
                )
            );

        if (existingParticipant.length > 0) {
            throw new Error(`Participant with email ${email} has already registered for this event`);
        }

        // Insert the participant into the database
        await db.insert(participants).values({
            name,
            email,
            role,
            affiliation,
            college,
            eventID
        });

        return { success: true, message: "Participant registered successfully" };

    } catch (error) {
        // Re-throw the error so it can be handled by the caller
        throw new Error(`Registration failed: ${error.message}`);
    }
};



export const registerAllAtOnce = async (req, res) => {
    try {
        const { participants } = req.body;

        // Validate the input
        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing participants array"
            });
        }

        const failed = [];

        for (let i = 0; i < participants.length; i++) {
            try {
                await registerForEvent(participants[i]);
            } catch (error) {
                failed.push({
                    email: participants[i].email,
                    name: participants[i].name,
                    reason: error.message
                });
            }
        }

        if (failed.length > 0) {
            return res.status(207).json({
                success: false,
                message: "Some participants failed to register",
                failed
            });
        }

        return res.status(200).json({
            success: true,
            message: "All participants registered successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${err.message}`
        });
    }
};
