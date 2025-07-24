import { mysqlTable, int, varchar, timestamp, decimal, json } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './userSchema.js';
import { events } from './eventSchema.js';
import { datetime } from 'drizzle-orm/mysql-core';

export const tickets = mysqlTable('tickets', {
  id: varchar('id', { length: 36 }).primaryKey().$default(() => uuidv4()),

  userId: varchar('user_id', {length: 36}).notNull().references(() => users.id),
  eventId: varchar('event_id', {length: 36}).notNull().references(() => events.id),
  bookingID: varchar('booking_id', { length: 36 }).notNull().unique(), // change this by using unique uuid

  eventType: varchar('event_type', { length: 50 }), // "movie", "concert", "hackathon", etc.
  numberOfTickets: int('number_of_tickets').default(1),
  qr: varchar('qr', { length: 250 }).notNull(),

  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),

  status: varchar('status', { length: 50 }).default('PENDING'), // 'CONFIRMED' | 'CANCELLED' | 'PENDING'
  paymentMethod: varchar('payment_method', { length: 50 }), // 'CARD' | 'UPI' | 'WALLET'

  // Movie
  hall_name: varchar('hall_name', { length: 50 }),
  screen_no: int('screen_no'),
  seat_type: varchar('seat_type', { length: 50 }).default('Normal'), // 'Normal' | 'Executive'
  seat_no: varchar('seat_no', { length: 200 }),
  seatNumbers: json('seat_numbers'), // For storing multiple seat numbers

  // Concert
  zone: varchar('zone', { length: 50 }),

  // Online Event
  access_link: varchar('access_link', { length: 200 }),
  valid_till: datetime('valid_till').notNull(),

  // College Fest
  eventIncluded: json('event_included'), // Array of sub-event names or IDs

  // Hackathon
  team_name: varchar('team_name', { length: 50 }),
  studentInfo: json('student_info'), // Array of { name, email, role, college }

  // Attendance
  checkInStatus: varchar('check_in_status', { length: 25 }).default('NOT_CHECKED_IN'),

  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow()
});
