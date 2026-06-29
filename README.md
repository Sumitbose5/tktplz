<p align="center">
  <img src="https://res.cloudinary.com/dgxc8nspo/image/upload/v1749873899/maw2lnlkowbftjvtldna.png" alt="TktPlz Logo" width="200"/>
</p>

# TktPlz

TktPlz is a full-stack ticket booking and event discovery platform for movies, concerts, college fests, online events, registrations, and general admission events.

The platform supports real-time seat selection, temporary seat and ticket locking, Razorpay payments, QR-based entry verification, organizer dashboards, admin workflows, refunds, payouts, and event analytics.

---

## Overview

TktPlz connects three main groups:

- **Users** discover events, select seats or ticket categories, pay securely, download tickets, and use QR codes for entry.
- **Organizers** create and manage events, track revenue and ticket sales, scan QR tickets at the venue, and view event analytics.
- **Admins/Moderators** manage halls, seat layouts, events, organizers, payouts, support issues, and secure admin invites.

The booking flow is designed around short-lived locks so that two users cannot buy the same seat or oversell the same ticket category while they are checking out.

---

## Tech Stack

### Frontend

- **React 19** with **Vite**
- **TailwindCSS**
- **React Router**
- **TanStack Query**
- **Zustand**
- **Socket.IO Client**
- **Axios**
- **Razorpay Checkout integration**
- **QR scanner libraries** for organizer-side validation

### Backend

- **Node.js**
- **Express.js**
- **Socket.IO**
- **BullMQ**
- **Redis / ioredis**
- **Razorpay**
- **Puppeteer** for ticket PDF generation
- **Nodemailer / Resend** for emails

### Data & Auth

- **MySQL** with **Drizzle ORM**
- **MongoDB** for additional app data
- **Firebase Admin**
- **Google OAuth**
- **OTP-based authentication**
- **TOTP verification for admins**
- **JWT / cookie-based protected flows**

### Deployment

- Frontend: **Vercel**
- Backend: **Render** or any Node-compatible host
- Redis, MySQL, MongoDB, Cloudinary, Firebase, and Razorpay configured through environment variables

---

## Key Features

### User Features

- Browse categorized events such as movies, concerts, fests, online sessions, and registrations.
- View event details, schedule, location, poster, ticket types, and pricing.
- Select reserved seats for seating-based events.
- Select ticket categories or zones for open, online, or registration-based events.
- See a booking summary with base price, convenience fee, and total amount.
- Complete payment through Razorpay.
- Receive booking confirmation emails.
- Download ticket PDFs with QR codes.
- View previous orders and ticket details.
- Request cancellations and refunds where applicable.

### Organizer Features

- Register/login as an organizer.
- Add banking details for payout processing.
- Create and manage events.
- Configure event type, poster, schedule, venue, pricing, and ticket categories.
- View dashboard metrics such as tickets sold, gross revenue, pending payments, and event count.
- Open event-level analytics including ticket distribution and revenue.
- Scan attendee QR codes from the organizer dashboard.
- Validate tickets at the venue and prevent duplicate entry.
- View payout receipts made available by admins.

### Admin Features

- Secure admin authentication with invite links and TOTP.
- Manage organizers.
- Manage halls, screens, and seat layouts.
- Verify and manage events.
- Review support issues.
- Track platform financials and payouts.
- Initiate, mark, and publish organizer payout receipts.

---

## Booking & Seat Locking

Seat locking is one of the core flows in TktPlz. It prevents multiple users from booking the same seat or overselling a limited ticket category while checkout is in progress.

### Why Locking Is Needed

When a user moves from selection to booking summary/payment, the selected item should become temporarily unavailable to everyone else. If the user pays successfully, the booking is confirmed. If the user abandons checkout, the item should become available again automatically.

### Seating Events

For reserved seating events, each selected seat is locked in Redis with this key pattern:

```txt
locked:seat:<eventId>:<seatId>
```

The value stored is the `userId` of the user who locked the seat.

The backend uses Redis `SET` with `NX` and `EX`:

- `NX` means the key is only created if it does not already exist.
- `EX 600` gives the lock a 10-minute expiry.

If the key already exists, the seat is considered locked by another user and the booking summary request returns a conflict response.

After a successful lock:

1. A BullMQ unlock job is scheduled with a 10-minute delay.
2. Socket.IO emits `seats-locked` to the event room.
3. Other connected users immediately see those seats as unavailable.

When the lock expires or the unlock job runs, the backend deletes the Redis lock only if it still belongs to the same user. Socket.IO then emits `seats-unlocked` so clients can make those seats selectable again.

### Ticket Category / Zone Events

For open, online, and registration-style events, the app locks ticket quantity instead of individual seats.

Redis uses two types of keys:

```txt
tickets:lock:<eventId>:<ticketType>:<userId>
tickets:tempLock:<eventId>:<ticketType>
```

- `tickets:lock:*` stores how many tickets a specific user is holding.
- `tickets:tempLock:*` stores the currently locked quantity for that ticket type across all users.

Availability is calculated as:

```txt
available = numberOfTickets - ticketsSold - currentlyLocked
```

If enough tickets are available, Redis increments the temporary lock count, stores the user's lock, and schedules a BullMQ job to release it after 10 minutes.

### Successful Payment

After Razorpay payment verification:

1. The backend creates a confirmed ticket row.
2. For seating events, selected seat details and seat labels are stored in the ticket.
3. For category/zone events, sold ticket counts are incremented.
4. Event and organizer counters are updated.
5. The temporary Redis locks are removed.
6. The user receives a booking confirmation email.

### Manual Unlock

If a user leaves checkout, changes selection, or needs cleanup before payment completion, the `/api/booking/unlock-items` endpoint can release their active locks and remove queued unlock jobs.

---

## QR-Based Ticket Logic

TktPlz uses signed QR data so organizers can verify that a ticket QR was generated by the backend and has not been manually tampered with.

### QR Generation

When a ticket PDF is generated, the backend:

1. Fetches the ticket using the order ID.
2. Creates an HMAC SHA-256 hash using `TICKET_SECRET`.
3. Hashes the ticket's internal `ticket.id`.
4. Builds QR payload JSON:

```json
{
  "ticketId": "ticket-id",
  "hash": "signed-hmac-hash"
}
```

5. Converts that JSON payload into a QR image using the `qrcode` package.
6. Embeds the QR image inside the ticket PDF generated with Puppeteer.

The QR payload does not need to expose all ticket details. It only carries the ticket ID and signature. The backend resolves the rest from the database during verification.

### Organizer QR Verification

Organizers use the scanner page available in the organizer dashboard.

The frontend scanner:

1. Reads the QR code using the device camera.
2. Parses the QR JSON.
3. Sends `ticketId` and `hash` to:

```txt
POST /api/organizer/scan-qr
```

The backend then:

1. Recomputes the HMAC hash using the same `TICKET_SECRET`.
2. Rejects the QR if the provided hash does not match.
3. Fetches the ticket, user, and event details from the database.
4. Rejects the ticket if it is not `CONFIRMED`.
5. Rejects the ticket if it was already checked in.
6. Rejects the ticket if the event has already ended.
7. Marks the ticket as checked in:

```txt
checkInStatus = CHECKED_IN
qr_status = used
```

8. Returns attendee, event, ticket type, seat/zone, and status details to the organizer UI.

This prevents fake QR payloads and duplicate scans for the same ticket.

---

## Folder Structure

```txt
tktplz/
|-- README.md
|-- backend/
|   |-- app.js                         # Express app, Socket.IO server, route mounting, worker init
|   |-- bookingStrategies/             # Booking strategy handlers by event type
|   |-- config/                        # DB, Redis, Razorpay, Passport, Cloudinary, MongoDB config
|   |-- controller/                    # Route controllers for auth, booking, events, payments, tickets, etc.
|   |-- drizzle/                       # Drizzle schemas and migration metadata
|   |-- eventStrategies/               # Event creation/update strategies by event type
|   |-- firebase/                      # Firebase admin setup
|   |-- mail-syntax/                   # Email templates
|   |-- middlewares/                   # Auth, upload, pricing, and booking lock middleware
|   |-- models/                        # MongoDB models
|   |-- queues/                        # BullMQ queue definitions
|   |-- routes/                        # Express route definitions
|   |-- services/                      # Shared business services such as complete booking
|   |-- utils/                         # QR, OTP, token, socket, TOTP, unlock helpers
|   `-- workers/                       # BullMQ workers for unlocks and event cleanup
|
`-- frontend/
    |-- index.html
    |-- vite.config.js
    |-- src/
    |   |-- App.jsx                    # Main route tree
    |   |-- api/                       # Frontend API helpers
    |   |-- components/
    |   |   |-- Home/                  # Home/header/search/category UI
    |   |   `-- Other/                 # Seat selection, timers, payment, loaders, modals
    |   |-- context/                   # Auth, location, modal context
    |   |-- firebase/                  # Firebase frontend setup
    |   |-- layout/                    # Admin and organizer protected layouts
    |   |-- pages/
    |   |   |-- admin/                 # Admin dashboard, halls, events, payouts, support
    |   |   |-- admin-auth/            # Admin login and invite QR flow
    |   |   |-- auth/                  # User auth pages
    |   |   |-- home/                  # Public/user booking pages
    |   |   |-- org-auth/              # Organizer auth pages
    |   |   `-- org-pages/             # Organizer dashboard, events, analytics, QR scanner
    |   |-- store/                     # Zustand booking store
    |   `-- utils/                     # Frontend utility helpers
    `-- public/
        `-- images/                    # Public static images
```

---

## Important Backend Flows

### Booking Summary

```txt
POST /api/booking/get-booking-summary
```

Middleware flow:

1. `getPrices` loads event pricing.
2. `lockItems` locks seats or ticket quantities.
3. `getBookingSummary` returns selected item details and total price.

### Payment

```txt
POST /api/payment/create-order
POST /api/payment/verify-payment
```

Payment verification validates the Razorpay signature. On success, `completeBooking` persists the ticket, updates counters, unlocks temporary Redis holds, and sends the confirmation email.

### Ticket PDF

```txt
POST /api/ticket/generate-ticket-pdf
```

Generates the printable/downloadable ticket PDF with event details, booking details, and QR code.

### Organizer QR Scan

```txt
POST /api/organizer/scan-qr
```

Verifies ticket authenticity, ticket status, event validity, and duplicate entry.

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `PORT` from `.env`, defaulting to `5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs through Vite, typically at:

```txt
http://localhost:5173
```

### Database

```bash
cd backend
npm run db:generate
npm run db:migrate
```

---

## Environment Variables

The project expects environment variables for:

- MySQL database connection
- MongoDB connection
- Redis connection
- Razorpay keys and webhook secret
- Google OAuth credentials
- JWT/session secrets
- OTP/email provider credentials
- Cloudinary credentials
- Firebase credentials
- `TICKET_SECRET` for QR signing
- Frontend `VITE_BASE_URL`

Keep secrets out of source control and configure them separately for local, staging, and production environments.

---

## Project Highlights

- Real-time booking experience through Socket.IO rooms per event.
- Redis-backed 10-minute locking for seats and ticket categories.
- BullMQ cleanup workers for abandoned checkouts.
- HMAC-signed QR tickets with organizer-side validation.
- Razorpay order creation, signature verification, refunds, and payout flows.
- Separate user, organizer, and admin experiences.
- Drizzle ORM schemas for strongly structured relational data.

