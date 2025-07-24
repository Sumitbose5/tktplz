import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelection from "../../components/Other/SeatSelection";
import { useBookingStore } from '../../store/bookingStore';
import axios from 'axios';

export default function SeatStructure() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const bookingInfo = useBookingStore((state) => state.bookingInfo);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:3000/api/event/get-event/${eventId}`);
        setEventData(res.data.data);
      } catch (e) {
        setError("Failed to load event details.");
      }
      setLoading(false);
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error || !eventData) return <div className="text-center text-red-600 p-8">{error || "Event not found."}</div>;

  const eventName = eventData.name || "";
  const hallName = eventData.hall?.name || "";
  const screenNo = eventData.screen?.screen_no || "";
  const city = eventData.hall?.city || eventData.city || "";
  // Format date and time to a nice format
  const dateRaw = eventData.scheduleStart || "";
  const date = dateRaw
    ? new Date(dateRaw).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const screenId = eventData.screen?.id || "";

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow-lg border border-gray-200 transition-colors cursor-pointer relative"
      > 
        ← Back
      </button>
      <div className="pb-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {eventName ? `${eventName} - ` : ""}
              {hallName ? `${hallName} - ` : ""}
              Seat Structure{screenNo ? ` - Screen ${screenNo}` : ""}
            </h1>
          </div>
          <SeatSelection 
            screenID={screenId}
            eventId={eventId}
            eventName={eventName}
            hallName={hallName}
            screenNo={screenNo}
            city={city}
            date={date}
          />
        </div>
      </div>
    </div>
  );
} 