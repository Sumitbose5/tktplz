import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import passport from './config/passport.js';
import dotenv from 'dotenv';
import multer from "multer";
import { dbConnect } from './config/mongoDB.js';
dotenv.config();

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
