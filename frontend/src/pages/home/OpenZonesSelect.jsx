import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingStore } from '../../store/bookingStore';
import { v4 as uuidv4 } from 'uuid';

const fetchTicketCategories = async (eventId) => {
  if (!eventId) {
    return { categories: [], showTime: "", eventDetails: null };
  }
  try {
    const res = await fetch(`http://localhost:3000/api/event/get-price-details/${eventId}`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return {
      categories: data.result?.price || [],
      showTime: data.result?.event?.scheduleStart
        ? new Date(data.result.event.scheduleStart).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
      eventDetails: data.result?.event || null
    };
  } catch (err) {
    return { categories: [], showTime: "", eventDetails: null };
  }
};

export default function OpenZonesSelect() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const setBookingInfo = useBookingStore((state) => state.setBookingInfo);
  const [categories, setCategories] = useState([]);
  const [showTime, setShowTime] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const bookingId = uuidv4();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await fetchTicketCategories(eventId);
      setCategories(data.categories);
      setShowTime(data.showTime);
      setEventDetails(data.eventDetails);
      // Initialize selected with 0 for each category
      const initialSelected = {};
      data.categories.forEach((cat) => {
        initialSelected[cat.id] = 0;
      });
      setSelected(initialSelected);
      setLoading(false);
    }
    fetchData();
  }, [eventId]);

  const handleChange = (id, delta, max) => {
    setSelected((prev) => {
      const prevVal = Number(prev[id]) || 0;
      const safeMax = typeof max === 'number' && !isNaN(max) ? max : 9999;
      const newVal = Math.max(0, Math.min(prevVal + delta, safeMax));
      return { ...prev, [id]: newVal };
    });
  };

  const totalTickets = Object.values(selected).reduce((a, b) => a + (Number(b) || 0), 0);
  const totalPrice = categories.reduce(
    (sum, cat) => sum + ((Number(selected[cat.id]) || 0) * (Number(cat.price) || 0)),
    0
  );

  // Prepare selected categories for booking info
  const selectedCategories = categories
    .filter(cat => (selected[cat.id] || 0) > 0)
    .map(cat => ({
      id: cat.id,
      type: cat.type,
      price: cat.price,
      count: selected[cat.id] || 0
    }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="max-w-xl w-full mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8 relative">
        <h2 className="text-3xl font-extrabold text-indigo-800 mb-2 text-center tracking-tight drop-shadow-sm font-mont">
          Select Your Tickets
        </h2>
        <div className="text-center text-gray-500 mb-8">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-base shadow-sm">
            Show Date: {showTime}
          </span>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat, idx) => {
              const available = (Number(cat.numberOfTickets) || 0) - (Number(cat.ticketsSold) || 0);
              const isSelected = (selected[cat.id] || 0) > 0;
              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between border rounded-xl px-5 py-4 bg-gray-50 transition-all duration-200 shadow-sm relative group ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'}`}
                >
                  <div>
                    <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      {cat.type}
                      {isSelected && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white font-semibold">Selected</span>}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      <span className="font-semibold text-blue-700">₹{Number(cat.price).toLocaleString()}</span> &middot;{' '}
                      <span className={available === 0 ? 'text-red-500 font-semibold' : ''}>{available} available</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-2xl font-bold text-gray-600 flex items-center justify-center transition-all duration-150 border border-gray-300 shadow-sm active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-300 ${selected[cat.id] === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleChange(cat.id, -1, available)}
                      disabled={selected[cat.id] === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-lg font-semibold text-gray-800">
                      {selected[cat.id] || 0}
                    </span>
                    <button
                      className={`w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-2xl font-bold text-white flex items-center justify-center transition-all duration-150 border border-blue-600 shadow-sm active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-300 ${selected[cat.id] >= available ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleChange(cat.id, 1, available)}
                      disabled={selected[cat.id] >= available}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                      </svg>
                    </button>
                  </div>
                  {idx < categories.length - 1 && <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200 group-hover:bg-blue-200 transition-all" style={{ marginLeft: 24, marginRight: 24 }} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Sticky summary bar for mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 border-t border-blue-100 shadow-lg py-4 px-4 md:static md:shadow-none md:border-none md:bg-transparent md:p-0 mt-8">
          <div className="max-w-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <span className="text-lg font-semibold text-gray-700">Total Tickets: <span className="text-blue-700">{totalTickets}</span></span>
              <span className="text-lg font-semibold text-gray-700">Total Price: <span className="text-blue-700">₹{totalPrice.toLocaleString()}</span></span>
            </div>
            <button
              className={`mt-2 md:mt-0 w-full md:w-auto py-3 px-8 rounded-lg text-lg font-bold transition-all duration-200 shadow-md md:shadow-none ${totalTickets > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              disabled={totalTickets === 0}
              onClick={() => {
                setBookingInfo({
                  categories: selectedCategories,
                  price: totalPrice,
                  numberOfTickets: totalTickets,
                  bookingId,
                  eventId,
                  eventDetails: eventDetails ? {
                    eventName: eventDetails.name,
                    location: eventDetails.location,
                    city: eventDetails.city,
                    state: eventDetails.state,
                    area_name: eventDetails.area_name,
                    type: eventDetails.type,
                    date: eventDetails.scheduleStart
                      ? new Date(eventDetails.scheduleStart).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : undefined,
                  } : { eventId },
                });
                navigate(`/booking-summary/${bookingId}`);
              }}
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
