import express from "express";
const router = express.Router();

import { getBookingSummary} from "../controller/bookingController.js";
import { getPrices } from "../middlewares/booking.js";

router.post("/get-booking-summary", getPrices, getBookingSummary);

export default router;