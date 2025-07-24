import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from '../../store/bookingStore';
import axios from 'axios';
import { TktPlzSpinner } from '../../components/Other/Spinner';

const font = {
  mont: "font-mont",
};

function formatCurrency(amount) {
  if (typeof amount !== "number") return "";
  return "₹" + amount.toLocaleString();
}

function BookingSummary() {
  const navigate = useNavigate();
  const bookingInfo = useBookingStore((state) => state.bookingInfo);
  const {
    eventDetails = {},
    selectedSeats = [],
    categories = [],
    eventId = "",
    type = "",
    categoriesBody = [], // for open/online
  } = bookingInfo;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Selected Seats : ", selectedSeats);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prepare request body
        let body = { eventId, eventDetails };
        if (eventDetails.type === 'Seating') {
          body.selectedSeats = selectedSeats;
        } else if (eventDetails.type === 'Open' || eventDetails.type === 'Online') {
          body.categoriesBody = categoriesBody.length ? categoriesBody : categories;
        }
        // Call API
        const res = await axios.post('http://localhost:3000/api/booking/get-booking-summary', body);
        setSummary(res.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to fetch booking summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
    // eslint-disable-next-line
  }, []);

  // Prevent page scroll
  React.useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-0 flex flex-col items-center border border-gray-200 relative" style={{ minHeight: 600, maxHeight: 700, overflow: 'hidden' }}>
        {/* Receipt Header (sticky) */}
        <div className="w-full rounded-t-2xl bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6 flex flex-col items-center border-b-2 border-dashed border-gray-300" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm mb-1">Booking Receipt</h1>
          <span className="inline-block px-3 py-0.5 bg-white/80 text-blue-700 rounded-full font-medium text-sm shadow-sm mt-1">
            {eventDetails.eventName || "Event"}
          </span>
        </div>

        {/* Main Content (scrollable) */}
        <div className="w-full flex-1 flex flex-col px-5 py-4 overflow-y-auto" style={{ maxHeight: 'unset', minHeight: 0 }}>
          {loading ? (
            <div className="flex-1 flex items-center justify-center"><TktPlzSpinner /></div>
          ) : error ? (
            <div className="text-red-500 text-center my-8">{error}</div>
          ) : summary ? (
            <>
              {/* Event & Venue Details */}
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-gray-500 font-semibold text-xs">Date & Time</div>
                  <div className="text-base text-blue-800 font-bold">
                    {eventDetails.date ? eventDetails.date : "-"}
                  </div>
                </div>
                {eventDetails.hallName && (
                  <div>
                    <div className="text-gray-500 font-semibold text-xs">Venue</div>
                    <div className="text-base text-blue-800 font-bold">
                      {eventDetails.hallName}
                      {eventDetails.screenNo ? `, Screen ${eventDetails.screenNo}` : ""}
                      {eventDetails.city ? `, ${eventDetails.city}` : ""}
                    </div>
                  </div>
                )}
              </div>

              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-300 my-3" />

              {/* Booking Details */}
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-900 mb-2">Your Booking</div>
                {/* Seating event: show seat_label and category */}
                {eventDetails.type === 'Seating' && Array.isArray(summary.seats) && summary.seats.length > 0 && (
                  <div>
                    <div className="text-gray-700 mb-1">Selected Seats:</div>
                    <div className="flex flex-wrap gap-2">
                      {summary.seats.map((seat, idx) => (
                        <span key={seat.id || idx} className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold shadow">
                          {seat.seat_label} 
                          {/* <span className="text-xs text-blue-200">({seat.category})</span> */}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Open/Online event: show categories and count */}
                {(eventDetails.type === 'Open' || eventDetails.type === 'Online') && Array.isArray(summary.seats) && summary.seats.length > 0 && (
                  <div>
                    <div className="text-gray-700 mb-1 text-sm">Ticket Categories:</div>
                    <div className="space-y-1">
                      {summary.seats.map((cat, idx) => (
                        <div key={cat.id || idx} className="flex items-center gap-2 bg-blue-50 rounded px-2 py-1 text-sm">
                          <span className="font-semibold text-blue-800 whitespace-nowrap">{cat.category}</span>
                          <span className="text-gray-700">x {cat.count}</span>
                          <span className="text-gray-700">@ ₹{parseFloat(cat.price).toLocaleString()}</span>
                          <span className="ml-auto text-gray-900 font-semibold">Subtotal: ₹{cat.subtotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Unpaid or no selection */}
                {Array.isArray(summary.seats) && summary.seats.length === 0 && (
                  <div className="text-gray-400 italic">No seats or tickets selected.</div>
                )}
                <div className="mt-3 text-gray-700 text-sm">Number of Tickets: <span className="font-semibold">{
                  eventDetails.type === 'Seating'
                    ? summary.seats.length
                    : summary.seats.reduce((acc, cat) => acc + (cat.count || 0), 0)
                }</span></div>
              </div>

              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-300 my-3" />

              {/* Price Summary */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-base font-semibold text-gray-800 mb-1">
                  <span>Seat/Ticket Amount</span>
                  <span>{formatCurrency(summary.totalSeatAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-base text-gray-700 mb-1">
                  <span>Convenience Fee</span>
                  <span>{formatCurrency(summary.totalConvenienceFee)}</span>
                </div>
                <div className="flex items-center justify-between text-base text-gray-700 mb-1">
                  <span>IGST (18%)</span>
                  <span>{formatCurrency(summary.gstAmount)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2" />
                <div className="flex items-center justify-between text-xl font-bold text-indigo-700">
                  <span>Total</span>
                  <span>{formatCurrency(summary.totalAmount)}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Action Buttons (sticky at bottom) */}
        <div className="w-full px-5 py-3 bg-white rounded-b-2xl border-t border-gray-200 flex flex-col md:flex-row gap-2 justify-center items-center shadow-inner" style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
          <button
            className="w-full md:w-auto py-3 px-8 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md"
            onClick={() => {
              // Placeholder for payment logic
              alert('Proceeding to payment...');
            }}
            disabled={summary && summary.totalAmount === 0}
          >
            Pay Now
          </button>
          <button
            className="w-full md:w-auto py-3 px-8 rounded-lg text-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200 shadow"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
