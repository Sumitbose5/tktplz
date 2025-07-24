import { sql } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidv4 } from 'uuid';


export const organiser = mysqlTable('organiser_table', {
    id: varchar('id', { length: 36 }).primaryKey().$default(() => uuidv4()),
    name: varchar('name', { length: 50 }).notNull(),
    email: varchar('email', { length: 50 }).notNull().unique(),
    phone: varchar('phone', { length: 12 }).notNull().unique(),
    role: varchar('role', { length: 20 }).default('organiser'),

    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at')
        .default(sql`CURRENT_TIMESTAMP`) 
        .onUpdateNow()
})