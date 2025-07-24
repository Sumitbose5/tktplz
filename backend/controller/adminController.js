import { db } from "../config/db.js";
import { events } from "../drizzle/eventSchema.js";
import { eq } from "drizzle-orm";
import { organiser } from "../drizzle/organiserSchema.js";



export const eventApproval = async (req, res) => {
    try {
        // Fetch pending events and join with organiser to get organiser name
        const pendingEvents = await db
            .select({
                ...events,
                organiserName: organiser.name
            })
            .from(events)
            .leftJoin(organiser, eq(events.organiserID, organiser.id))
            .where(eq(events.verificationStatus, "pending")); // Note: status is 'pending' (lowercase) in schema

        res.status(200).json({
            success: true,
            message: "Pending events fetched successfully",
            data: pendingEvents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching pending events",
            error: error.message,
        });
    }
};


export const approveReq = async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "eventID is required"
            });
        }

        const updated = await db
            .update(events)
            .set({ verificationStatus: "approved", isVerified: true })
            .where(eq(events.id, eventId));

        if (updated.affectedRows === 0 && updated.length === 0) {
            // drizzle-orm may return affectedRows or an array depending on dialect
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event approved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error approving event",
            error: error.message
        });
    }
};


export const rejectReq = async (req, res) => {
    try {
        const { eventId, reason } = req.body;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "eventID is required"
            });
        }

        // Optionally, you can store the rejection reason in a field if your schema supports it.
        // For now, just update the status.
        const updated = await db
            .update(events)
            .set({ verificationStatus: "rejected", isVerified: false })
            .where(eq(events.id, eventId));

        if (updated.affectedRows === 0 && updated.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event rejected successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error rejecting event",
            error: error.message
        });
    }
};

