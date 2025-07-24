import { seats } from '../drizzle/seatSchema.js';
import { db } from '../config/db.js';
import { inArray } from 'drizzle-orm';

export const getBookingSummary = async (req, res) => {
    try {
        const { price, event, categories, type } = req.priceInfo;
        const { selectedSeats, eventDetails, categoriesBody } = req.body;

        console.log("Selected Seats : ", selectedSeats);
        console.log("Event Details : ", eventDetails);
        console.log("Categories Body : ", categoriesBody);

        // 1. Handle unpaid events
        if (type === "unpaid") {
            return res.json({
                seats: [],
                totalSeatAmount: 0,
                totalConvenienceFee: 0,
                gstAmount: 0,
                totalAmount: 0,
            });
        }

        // 2. Handle Open/Online events (paid)
        if (eventDetails && (eventDetails.type === "Open" || eventDetails.type === "Online")) {
            if (!Array.isArray(categoriesBody) || categoriesBody.length === 0) {
                return res.status(400).json({ error: "No ticket categories provided" });
            }
            let totalSeatAmount = 0;
            let totalConvenienceFee = 0;
            let seatsInfo = [];
            categoriesBody.forEach(cat => {
                const count = parseInt(cat.count, 10) || 0;
                const price = parseFloat(cat.price || 0);
                const subtotal = count * price;
                const convenienceFee = parseFloat((subtotal * 0.05).toFixed(2));
                totalSeatAmount += subtotal;
                totalConvenienceFee += convenienceFee;
                seatsInfo.push({
                    id: cat.id,
                    category: cat.type,
                    price: price,
                    count: count,
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    convenienceFee: convenienceFee,
                });
            });
            const gstAmount = parseFloat((totalConvenienceFee * 0.18).toFixed(2));
            const totalAmount = parseFloat((totalSeatAmount + totalConvenienceFee + gstAmount).toFixed(2));
            return res.json({
                seats: seatsInfo,
                totalSeatAmount: parseFloat(totalSeatAmount.toFixed(2)),
                totalConvenienceFee: parseFloat(totalConvenienceFee.toFixed(2)),
                gstAmount: gstAmount,
                totalAmount: totalAmount,
            });
        }

        // 3. Seating event logic (existing)
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({ error: "No seats selected" });
        }
        // Fetch seat details from the database
        const seatsData = await db
            .select()
            .from(seats)
            .where(inArray(seats.id, selectedSeats));
        if (!seatsData || seatsData.length === 0) {
            return res.status(404).json({ error: "No valid seats found" });
        }
        let totalSeatAmount = 0;
        let totalConvenienceFee = 0;
        let seatsInfo = [];
        if (type === "flat") {
            const flatPrice = parseFloat(price.price || 0);
            seatsInfo = seatsData.map(seat => {
                const convenienceFee = parseFloat((flatPrice * 0.05).toFixed(2));
                totalSeatAmount += flatPrice;
                totalConvenienceFee += convenienceFee;
                return {
                    id: seat.id,
                    category: seat.seatType || "Regular",
                    price: parseFloat(flatPrice.toFixed(2)),
                    convenienceFee: convenienceFee,
                    row: seat.row,
                    col: seat.col,
                    seat_label: seat.seat_label,
                };
            });
        } else if (type === "category" && Array.isArray(categories)) {
            seatsInfo = seatsData.map(seat => {
                const seatCategory = categories.find(
                    cat => cat.type === seat.seatType
                );
                const categoryPrice = seatCategory ? parseFloat(seatCategory.price || 0) : 0;
                const convenienceFee = parseFloat((categoryPrice * 0.05).toFixed(2));
                totalSeatAmount += categoryPrice;
                totalConvenienceFee += convenienceFee;
                return {
                    id: seat.id,
                    category: seat.seatType || "Regular",
                    price: parseFloat(categoryPrice.toFixed(2)),
                    convenienceFee: convenienceFee,
                    row: seat.row,
                    col: seat.col,
                    seat_label: seat.seat_label,
                };
            });
        } else {
            seatsInfo = seatsData.map(seat => {
                const seatPrice = parseFloat(seat.price || 0);
                const convenienceFee = parseFloat((seatPrice * 0.05).toFixed(2));
                totalSeatAmount += seatPrice;
                totalConvenienceFee += convenienceFee;
                return {
                    id: seat.id,
                    category: seat.seatType || "Regular",
                    price: parseFloat(seatPrice.toFixed(2)),
                    convenienceFee: convenienceFee,
                    row: seat.row,
                    col: seat.col,
                    seat_label: seat.seat_label,
                };
            });
        }
        const gstAmount = parseFloat((totalConvenienceFee * 0.18).toFixed(2));
        const totalAmount = parseFloat((totalSeatAmount + totalConvenienceFee + gstAmount).toFixed(2));
        return res.json({
            seats: seatsInfo,
            totalSeatAmount: parseFloat(totalSeatAmount.toFixed(2)),
            totalConvenienceFee: parseFloat(totalConvenienceFee.toFixed(2)),
            gstAmount: gstAmount,
            totalAmount: totalAmount,
        });
    } catch (error) {
        console.error("Error in getBookingSummary:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
