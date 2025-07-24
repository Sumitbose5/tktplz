import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TermsAndConditions } from "../../components/Other/Terms&Condition";
import { useBookingStore } from '../../store/bookingStore';

// Helper for font classes
const font = {
  inter: "font-inter",
  mont: "font-montserrat"
};

const EventInfo = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const setBookingInfo = useBookingStore((state) => state.setBookingInfo);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(`http://localhost:3000/api/event/get-event/${eventId}`);
        setEvent(res.data.data);
      } catch (e) {
        setErr("Failed to load event details.");
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-lg text-gray-600">Loading event...</div>
      </div>
    );
  }

  if (err || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-lg text-red-500">{err || "Event not found."}</div>
      </div>
    );
  }

  console.log("Event : ", event);

  // Calculate event duration
  let duration = null;
  if (event.scheduleStart && event.scheduleEnd) {
    const start = new Date(event.scheduleStart);
    const end = new Date(event.scheduleEnd);
    const diffMs = end - start;
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      duration = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
    }
  }

  // Responsive: mobile = flex-col, desktop = flex-row
  return (
    <div className={`${font.inter} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
      {/* Top Section: Poster + Details */}
      <div className="relative w-full">
        {/* Blurry Poster BG */}
        <div
          className="absolute inset-0 h-[320px] sm:h-[400px] w-full z-0"
          style={{
            backgroundImage: `url(${event.posterUrl || event.poster || "/images/default-poster.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(24px) brightness(0.5)",
            WebkitFilter: "blur(24px) brightness(0.5)",
            transition: "background-image 0.3s"
          }}
        />
        {/* Overlay for dark effect */}
        <div className="absolute inset-0 h-[320px] sm:h-[400px] w-full bg-black/60 z-10" />
        {/* Main Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center md:items-center gap-8 px-4 sm:px-12 py-10 sm:py-12" style={{ minHeight: 320 }}>
          {/* Poster */}
          <div className="w-40 h-56 sm:w-56 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0 bg-white/10">
            <img
              src={event.posterUrl || event.poster || "/images/default-poster.jpg"}
              alt={event.name || "Event Poster"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">{event.name || "Event Title"}</h1>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3 text-white">
              {event.genre && <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">{event.genre}</span>}
              {event.type && <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">{event.type}</span>}
              {/* Registration Online/Offline Badge */}
              {event.type === 'Registration' && (
                <span className={`px-3 py-1 rounded font-semibold ${event.isOnline ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                  {event.isOnline ? 'Online' : 'Offline'}
                </span>
              )}
              {/* {event.language && <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">{event.language}</span>} */}
              {typeof event.rating !== "undefined" && event.rating !== null && (
                <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold border border-yellow-300 text-black flex justify-center items-center">
                  {Number(event.rating).toFixed(1)} / 5
                </span>
              )}
            </div>
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-base text-white mb-2">
              <div>
                <span className="font-semibold">Date:</span>{' '}
                {event.scheduleStart ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-white/20 text-white font-semibold">
                    {new Date(event.scheduleStart).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold">TBA</span>
                )}
              </div>
              <div>
                <span className="font-semibold">Time:</span>{' '}
                {event.scheduleStart ? new Date(event.scheduleStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
              </div>
              {duration && (
                <div>
                  <span className="font-semibold">Duration:</span> {duration}
                </div>
              )}
              {/* Venue details based on event type */}
              {event.type === 'Seating' ? (
                <>
                  {event.hall && event.hall.name && (
                    <div>
                      <span className="font-semibold">Hall:</span> {event.hall.name}
                    </div>
                  )}
                  {event.screen && event.screen.screen_no && (
                    <div>
                      <span className="font-semibold">Screen:</span> {event.screen.screen_no}
                    </div>
                  )}
                </>
              ) : event.type === 'Open' ? (
                <div>
                  <span className="font-semibold">Location:</span>{' '}
                  {event.location || event.city || 'TBA'}
                </div>
              ) : event.type === 'Registration' && !event.isOnline ? (
                <div>
                  <span className="font-semibold">Location:</span>{' '}
                  {event.location || event.city || 'TBA'}
                </div>
              ) : null}
              {/* Participant and booking info for non-seating events */}
              {event.type !== 'Seating' && (
                <>
                  <div>
                    <span className="font-semibold">Capacity:</span>{' '}
                    {event.maxParticipantAllowed === 0 ? 'Unlimited' : event.maxParticipantAllowed || 'TBA'}
                  </div>
                  <div>
                    <span className="font-semibold">{event.type === 'Registration' ? 'Registered' : 'Booked'}:</span>{' '}
                    {event.totalBookings || 0}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Description & Instructions */}
      <div className="relative z-30 max-w-3xl mx-auto bg-white rounded-t-3xl shadow-lg -mt-12 sm:-mt-20 px-4 sm:px-10 py-10">
       {/* Eligibility Criteria for Registration */}
       {event.type === 'Registration' && event.eligibility_criteria && (
         <section className="mb-8">
           <h2 className={`${font.mont} text-xl font-semibold mb-3 text-gray-900`}>Eligibility Criteria</h2>
           <p className="text-gray-700 leading-relaxed whitespace-pre-line">
             {event.eligibility_criteria}
           </p>
         </section>
       )}
        {/* Description */}
        <section className="mb-8">
          <h2 className={`${font.mont} text-2xl font-semibold mb-3 text-gray-900`}>About the Event</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description || "No description available."}
          </p>
        </section>
        {/* Instructions */}
        {event.eventInstructions && Array.isArray(event.eventInstructions) && event.eventInstructions.filter(ins => ins && ins.trim()).length > 0 && (
          <section className="mb-8">
            <h2 className={`${font.mont} text-xl font-semibold mb-3 text-gray-900`}>Instructions</h2>
            <ul className="list-disc pl-6 text-gray-700">
              {event.eventInstructions.filter(ins => ins && ins.trim()).map((ins, idx) => (
                <li key={idx} className="mb-1">{ins}</li>
              ))}
            </ul>
          </section>
        )}
        {event.eventInstructions && typeof event.eventInstructions === 'string' && event.eventInstructions.trim() && (
          <section className="mb-8">
            <h2 className={`${font.mont} text-xl font-semibold mb-3 text-gray-900`}>Instructions</h2>
            <ul className=" pl-6 text-gray-700">
              {event.eventInstructions.split("\n").filter(ins => ins && ins.trim()).map((ins, idx) => (
                <li key={idx} className="mb-1">{ins}</li>
              ))}
            </ul>
          </section>
        )}
        {/* Organizer */}
        {event.organiser && (
          <section className="mb-4">
            <h2 className={`${font.mont} text-lg font-semibold mb-1 text-gray-900`}>Organized by</h2>
            <div className="text-gray-800">{event.organiser}</div>
          </section>
        )}
      </div>

      {/* Fixed Proceed to Book Button */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-2xl px-4 pb-4 pointer-events-auto">
          <button
            className={`${font.mont} w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white text-lg font-semibold py-3 rounded-2xl shadow-xl hover:from-blue-800 hover:to-purple-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => setShowTerms(true)}
          >
            {event.type === 'Registration' ? 'Proceed to Register' : 'Proceed to Book'}
          </button>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowTerms(false)}
            >
              &times;
            </button>
            <TermsAndConditions />
            <div className="flex justify-end mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold shadow"
                onClick={() => {
                  setShowTerms(false);
                  if (event.type === 'Registration') {
                    navigate(`/register-participants/${event.id}`);
                  } else if (event.type === 'Open') {
                    navigate(`/book/open/${event.id}`);
                  } else {
                    setBookingInfo({
                      eventDetails: {
                        eventId: event.id,
                        // ...other details if needed
                      }
                    });
                    navigate(`/book/s/${event.id}`);
                  }
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInfo;
