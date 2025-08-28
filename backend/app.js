import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import passport from './config/passport.js';
import dotenv from 'dotenv';
import multer from "multer";
import { dbConnect } from './config/mongoDB.js';
import http from 'http';
import { Server } from 'socket.io'; // Import Server from socket.io
import { socketHandler } from './utils/socketHandler.js';
import './workers/index.js'; // Initialize workers
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, { // Initialize Socket.IO with the http server
    cors: {
        origin: ["http://localhost:5173", "https://tktplz-05.vercel.app"], // Make sure this matches your client-side origin
        credentials: true
    }
});

dbConnect();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const upload = multer();

app.use(express.json({ limit: "10mb" })); // increase the limit for parsed json
app.use(express.urlencoded({ limit: "10mb", extended: true })); // for form data
// app.use(upload.none());
app.use(cookieParser());

app.use(passport.initialize());

// Routes
import organiserRoutes from './routes/organizerRoute.js';
app.use("/api/organizer", organiserRoutes);

import hallRoutes from './routes/hallRoutes.js';
app.use("/api/halls", hallRoutes);

import eventRoute from './routes/eventRoutes.js';
app.use("/api/event", eventRoute);

import authRoutes from './routes/authRoutes.js';
app.use("/api/auth", authRoutes);

import adminRoutes from './routes/adminRoutes.js';
app.use("/api/admin", adminRoutes);

import bookingRoutes from './routes/bookingRoutes.js';
app.use("/api/booking", bookingRoutes);

import paymentRoutes from './routes/paymentRoutes.js';
app.use("/api/payment", paymentRoutes);

import ticketRoutes from './routes/ticketRoutes.js';
app.use("/api/ticket", ticketRoutes);

import userRoutes from './routes/userRoutes.js';
app.use("/api/user", userRoutes);


// Use Socket.IO handler
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);
    socketHandler(io, socket); // Pass io and socket to the handler
});

// ⬇️ Attach io to app so it's accessible everywhere
app.set('io', io);

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server running on port ${PORT} 🚀`);
    console.log(`Socket.IO listening on port ${PORT}`);
});