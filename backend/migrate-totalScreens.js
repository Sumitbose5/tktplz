import { db } from "./config/db.js";
import { halls } from "./drizzle/hallSchema.js";
import { screenTable } from "./drizzle/screenSchema.js";
import { eq } from "drizzle-orm";

async function migrateTotalScreens() {
    try {
        console.log("Starting totalScreens migration...");
        
        // Get all halls
        const allHalls = await db.select().from(halls);
        console.log(`Found ${allHalls.length} halls to migrate`);
        
        for (const hall of allHalls) {
            console.log(`Migrating hall: ${hall.name} (ID: ${hall.id})`);
            
            // Get all screens for this hall
            const screens = await db.select().from(screenTable).where(eq(screenTable.hallId, hall.id));
            const screenIds = screens.map(screen => screen.id);
            
            console.log(`Found ${screenIds.length} screens for hall ${hall.name}`);
            
            // Update the hall with the screen IDs array
            await db.update(halls)
                .set({ totalScreens: screenIds })
                .where(eq(halls.id, hall.id));
                
            console.log(`Updated hall ${hall.name} with ${screenIds.length} screen IDs`);
        }
        
        console.log("Migration completed successfully!");
        
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrateTotalScreens(); 