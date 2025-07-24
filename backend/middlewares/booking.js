import { db } from "../config/db.js";
import { events } from "../drizzle/eventSchema.js";
import { ticketPrices, ticketCategories } from "../drizzle/ticketPrices.js";
import { eq } from "drizzle-orm";


export const getPrices = async (req, res, next) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ success: false, message: 'eventId is required' });
        }

        // Get the event details from the events table using eventId
        const eventData = await db.select().from(events).where(eq(events.id, eventId));
        if (!eventData || eventData.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // if the event is unpaid
        if(!eventData[0].isPaid) {
            req.priceInfo = {
                price: 0,
                event: eventData[0],
                categories: null,
                type: "unpaid"
            };
            return next();
        }

        // Try to fetch price details from ticketPrices using eventId
        const ticketPriceData = await db.select().from(ticketPrices).where(eq(ticketPrices.eventId, eventId));
        if (ticketPriceData && ticketPriceData.length > 0) {
            req.priceInfo = {
                price: ticketPriceData[0],
                event: eventData[0],
                categories: null,
                type: "flat"
            };
            return next();
        }

        // If not found in ticketPrices, try ticketCategories using eventId
        const ticketCategoryData = await db.select().from(ticketCategories).where(eq(ticketCategories.eventId, eventId));
        console.log(ticketCategoryData);
        if (ticketCategoryData && ticketCategoryData.length > 0) {
            req.priceInfo = {
                price: null,
                event: eventData[0], 
                categories: ticketCategoryData, 
                type: "category"
            };
            return next();
        }

        // If neither found, return not found
        return res.status(404).json({
            success: false,
            message: 'No price details found for this event'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};