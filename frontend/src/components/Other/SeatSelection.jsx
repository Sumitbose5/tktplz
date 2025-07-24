import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useBookingStore } from '../../store/bookingStore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Dynamic zone colors - can be extended for more zones
const zoneColors = {
  'Regular': 'bg-gray-300 hover:bg-gray-400',
  'Executive': 'bg-blue-300 hover:bg-blue-400',
  'Premium': 'bg-purple-300 hover:bg-purple-400',
  'VIP': 'bg-yellow-300 hover:bg-yellow-400',
  'Gold': 'bg-yellow-400 hover:bg-yellow-500',
  'Silver': 'bg-gray-400 hover:bg-gray-500',
  'Bronze': 'bg-orange-300 hover:bg-orange-400',
  'Platinum': 'bg-indigo-300 hover:bg-indigo-400',
  'Diamond': 'bg-pink-300 hover:bg-pink-400',
  'Royal': 'bg-red-300 hover:bg-red-400'
};

// Get color for any zone name
const getZoneColor = (zoneName) => {
  return zoneColors[zoneName] || 'bg-gray-300 hover:bg-gray-400';
};

export default function SeatSelection({ screenID, eventId, eventName, hallName, screenNo, city, date }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(null);
  const bookingId = uuidv4();

  const setBookingInfo = useBookingStore((state) => state.setBookingInfo);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => { 
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/halls/seats/${screenID}/${eventId}`);
        if (response.data.success) {
          setSeats(response.data.seats);
          setPrice(response.data.price);
        } else {
          setError("Failed to fetch seats");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching seats");
      } finally {
        setLoading(false);
      }
    };

    if (screenID && eventId) {
      fetchSeats();
    }
  }, [screenID, eventId]);

  // Group seats by zone and row
  const groupedSeats = useMemo(() => {
    const grouped = {};
    
    seats.forEach(seat => {
      if (!seat.isGap && seat.seatType && seat.row) {
        const zone = seat.seatType;
        if (!grouped[zone]) {
          grouped[zone] = {};
        }
        if (!grouped[zone][seat.row]) {
          grouped[zone][seat.row] = [];
        }
        grouped[zone][seat.row].push(seat);
      }
    });

    // Sort seats within each row by column
    Object.keys(grouped).forEach(zone => {
      Object.keys(grouped[zone]).forEach(row => {
        grouped[zone][row].sort((a, b) => a.col - b.col);
      });
    });

    return grouped;
  }, [seats]);

  // Get unique zones in the order: normal/regular, executive, premium, VIP, then others
  const zones = useMemo(() => {
    const lower = s => s?.toLowerCase?.() || '';
    const allZones = [];
    const seen = new Set();
    seats.forEach(seat => {
      if (!seat.isGap && !seen.has(seat.seatType)) {
        seen.add(seat.seatType);
        allZones.push(seat.seatType);
      }
    });
    // Define preferred order
    const preferred = [
      allZones.find(z => ["normal", "regular"].includes(lower(z))),
      allZones.find(z => lower(z) === "executive"),
      allZones.find(z => lower(z) === "premium"),
      allZones.find(z => lower(z) === "vip")
    ].filter(Boolean);
    // Add any other zones not in preferred
    const others = allZones.filter(z => !preferred.includes(z));
    return [...preferred, ...others];
  }, [seats]);

  // Sort rows in descending order (K to A) so A row is at the bottom facing screen
  const sortRowsDescending = (rows) => {
    return rows.sort((a, b) => b.localeCompare(a));
  };

  const handleSeatClick = (seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        if (prev.length >= 10) {
          alert("You can select a maximum of 10 tickets only.");
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const isSeatSelected = (seat) => {
    return selectedSeats.find(s => s.id === seat.id);
  };

  // Convert seat column to integer
  const getSeatNumber = (col) => {
    return Math.floor(col);
  };

  // Helper: Map seatType to price (if price is array)
  const priceMap = useMemo(() => {
    if (!price) return {};
    if (Array.isArray(price)) {
      // price is an array of objects with type and price
      return price.reduce((acc, p) => {
        acc[p.type] = parseFloat(p.price);
        return acc;
      }, {});
    } else if (price && price.type && price.price) {
      // single price object
      return { [price.type]: parseFloat(price.price) };
    }
    return {};
  }, [price]);

  // Helper: Count selected seats by type
  const selectedByType = useMemo(() => {
    const map = {};
    selectedSeats.forEach(seat => {
      if (!map[seat.seatType]) map[seat.seatType] = [];
      map[seat.seatType].push(seat);
    });
    return map;
  }, [selectedSeats]);

  // Helper: Calculate total price
  const totalPrice = useMemo(() => {
    let total = 0;
    Object.entries(selectedByType).forEach(([type, seats]) => {
      const seatPrice = priceMap[type] || 0;
      total += seatPrice * seats.length;
    });
    return total;
  }, [selectedByType, priceMap]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Screen */}
      {/* <div className="text-center mb-8">
        <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-lg mb-2">
          <i className="fas fa-tv mr-2"></i>SCREEN
        </div>
      </div> */}

      {/* Seat Layout */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Show price info for each zone/seat type */}
        {Array.isArray(price) && price.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-800">Seat Prices</h4>
            <div className="flex flex-wrap gap-6">
              {price.map(p => (
                <div key={p.type} className="flex items-center gap-2 text-sm">
                  <span className={`font-semibold ${getZoneColor(p.type).split(' ')[0]} px-2 py-1 rounded`}>{p.type}</span>
                  <span className="text-gray-700">₹{parseFloat(p.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-8">
          {/* Render zones in reverse order so normal/regular is at the bottom */}
          {[...zones].reverse().map((zone, idx, arr) => {
            const isNormalZone = ["normal", "regular"].includes((zone || "").toLowerCase());
            return (
              <div key={zone} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">{zone} Section</h3>
                <div className="space-y-3">
                  {sortRowsDescending(Object.keys(groupedSeats[zone])).map(row => (
                    <div key={row} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium text-gray-600">{row}</span>
                      <div className="flex gap-2">
                        {seats
                          .filter(seat => seat.seatType === zone && seat.row === row)
                          .sort((a, b) => a.col - b.col)
                          .map(seat => (
                            seat.isGap ? (
                              <div key={seat.id} style={{ width: '2rem', height: '2rem' }} className="inline-block" />
                            ) : (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.isBooked}
                                className={`
                                  w-8 h-8 text-xs font-medium rounded transition-all duration-200 flex items-center justify-center cursor-pointer
                                  ${seat.isBooked 
                                    ? 'bg-red-400 cursor-not-allowed' 
                                    : isSeatSelected(seat)
                                      ? 'bg-green-500 text-white scale-110 shadow-lg'
                                      : getZoneColor(zone)
                                  }
                                  ${!seat.isBooked && !isSeatSelected(seat) ? 'hover:scale-105 hover:shadow-md' : ''}
                                `}
                              >
                                {getSeatNumber(seat.col)}
                              </button>
                            )
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Screen image for the normal/regular zone */}
                {isNormalZone && (
                  <div className="flex flex-col items-center mt-8 mb-2">
                    <img 
                      src="/images/screen.png" 
                      alt="Screen" 
                      className="w-48 md:w-72 lg:w-80 drop-shadow-md object-cover object-center" 
                      style={{ maxHeight: '40px' }} 
                    />
                    <span className="mt-1 text-xs font-semibold text-gray-700 tracking-wide uppercase">Screen this side</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3 text-gray-800">Legend</h4>
        <div className="flex flex-wrap gap-4">
          {zones.map(zone => (
            <div key={zone} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${getZoneColor(zone).split(' ')[0]}`}></div>
              <span className="text-sm text-gray-700">{zone}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="font-semibold text-gray-800">Selected Seats ({selectedSeats.length})</h4>
                <p className="text-sm text-gray-600">
                  {selectedSeats.map(seat => `${seat.row}${getSeatNumber(seat.col)}`).join(', ')}
                </p>
                {/* Show breakdown by type */}
                <div className="mt-2 space-y-1">
                  {Object.entries(selectedByType).map(([type, seats]) => (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <span className={`font-semibold ${getZoneColor(type).split(' ')[0]} px-2 py-1 rounded`}>{type}</span>
                      <span>x {seats.length}</span>
                      <span>₹{(priceMap[type] || 0).toLocaleString()} each</span>
                      <span className="ml-2 text-gray-500">= ₹{((priceMap[type] || 0) * seats.length).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-gray-800 mb-2">Total: ₹{totalPrice.toLocaleString()}</div>
                <button
                  onClick={() => {
                    setBookingInfo({
                      selectedSeats: selectedSeats.map(seat => seat.id || ""),
                      bookingId,
                      eventDetails: {
                        eventName,
                        hallName,
                        screenNo,
                        city,
                        date,
                        type: "Seating"
                      },
                      eventId
                    });
                    navigate(`/booking-summary/${bookingId}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Proceed to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 