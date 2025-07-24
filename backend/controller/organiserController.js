import { organiser } from "../drizzle/organiserSchema.js";
import { db } from "../config/db.js"
import { and, eq } from 'drizzle-orm';

export const createOrganiser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and phone are required.",
            });
        }

        const cleanedEmail = email.trim();
        const cleanedPhone = phone.trim();
        const cleanedName = name.trim();

        const isEmailTaken = await db
            .select()
            .from(organiser)
            .where(eq(organiser.email, cleanedEmail));

        if (Array.isArray(isEmailTaken) && isEmailTaken.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const isPhoneNoTaken = await db
            .select()
            .from(organiser)
            .where(eq(organiser.phone, cleanedPhone));

        if (Array.isArray(isPhoneNoTaken) && isPhoneNoTaken.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Phone Number already exists",
            });
        }

        const insertOrganiser = await db.insert(organiser).values({
            name: cleanedName,
            email: cleanedEmail,
            phone: cleanedPhone,
        });

        return res.status(200).json({
            success: true,
            message: "Organiser created successfully",
        });
    } catch (err) {
        console.error("Error creating organiser:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};



export const deleteOrganiser = async (req, res) => {
    try {
        const { email, id } = req.body;

        // Validate inputs
        if (!email || !id) {
            return res.status(400).json({
                success: false,
                message: "Email and ID are required.",
            });
        }

        const cleanedEmail = email.trim();

        // Fetch the organiser to ensure existence
        const organiserToDelete = await db
            .select()
            .from(organiser)
            .where( 
                and(eq(organiser.email, cleanedEmail), eq(organiser.id, id))
            );

        if (!Array.isArray(organiserToDelete) || organiserToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organiser with this email and ID does not exist",
            });
        }

        // Proceed to delete
        const deleteOrg = await db
            .delete(organiser)
            .where(eq(organiser.id, id));

        console.log("Deleted organiser:", deleteOrg);

        return res.status(200).json({
            success: true,
            message: "Organiser deleted successfully",
        });
    } catch (err) {
        console.error("Delete organiser error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};


