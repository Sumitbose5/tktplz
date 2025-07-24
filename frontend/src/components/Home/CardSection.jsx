import React, { useState, useRef, useEffect } from "react";
import { FiHeart, FiShare2, FiClock, FiMapPin, FiStar, FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// const events = [
//     {
//         id: 1,
//         image: "https://picsum.photos/800/600?random=7",
//         rating: 4.8,
//         name: "Epic Music Festival 2025",
//         genre: "Concert",
//         date: "March 15, 2025",
//         location: "Central Park, NYC",
//         price: "$89",
//         attendees: "2.5k",
//         isLiked: false
//     },
//     {
//         id: 2,
//         image: "https://picsum.photos/800/600?random=8",
//         rating: 4.6,
//         name: "Art & Design Expo",
//         genre: "Exhibition",
//         date: "April 8, 2025",
//         location: "Museum of Modern Art",
//         price: "$45",
//         attendees: "1.8k",
//         isLiked: true
//     },
//     {
//         id: 3,
//         image: "https://picsum.photos/800/600?random=9",
//         rating: 4.9,
//         name: "Tech Innovation Summit",
//         genre: "Conference",
//         date: "May 12, 2025",
//         location: "Convention Center",
//         price: "$199",
//         attendees: "3.2k",
//         isLiked: false
//     },
//     {
//         id: 4,
//         image: "https://picsum.photos/800/600?random=10",
//         rating: 4.7,
//         name: "Comedy Night Special",
//         genre: "Comedy",
//         date: "June 3, 2025",
//         location: "Laugh Factory",
//         price: "$35",
//         attendees: "950",
//         isLiked: false
//     },
//     {
//         id: 5,
//         image: "https://picsum.photos/800/600?random=10",
//         rating: 4.7,
//         name: "Comedy Night Special",
//         genre: "Comedy",
//         date: "June 3, 2025",
//         location: "Laugh Factory",
//         price: "$35",
//         attendees: "950",
//         isLiked: false
//     }
// ];

export const CardSection = ({ name, events: propEvents }) => {
    const eventsToShow = Array.isArray(propEvents) && propEvents.length > 0 ? propEvents : events;
    const [likedEvents, setLikedEvents] = useState(
        eventsToShow.reduce((acc, event) => ({ ...acc, [event.id]: event.isLiked }), {})
    );
    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const navigate = useNavigate();

    const checkArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 0);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        checkArrows();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkArrows);
        window.addEventListener('resize', checkArrows);
        return () => {
            el.removeEventListener('scroll', checkArrows);
            window.removeEventListener('resize', checkArrows);
        };
    }, []);

    const scrollBy = (offset) => {
        scrollRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
    };
 
    const toggleLike = (eventId) => {
        setLikedEvents(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    return (
        <section className="w-full relative">
            {/* Section Title */}
            {name && (
                <h3 className="text-2xl font-bold mb-4 ml-2 text-gray-800">{name}</h3>
            )}
            {/* Arrow Buttons */}
            {showLeft && (
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full"
                    style={{ marginLeft: '-24px' }}
                    onClick={() => scrollBy(-320)}
                    aria-label="Scroll left"
                >
                    <FiChevronLeft className="w-6 h-6" />
                </button>
            )}
            {showRight && (
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 md:p-3 rounded-full"
                    style={{ marginRight: '-24px' }}
                    onClick={() => scrollBy(320)}
                    aria-label="Scroll right"
                >
                    <FiChevronRight className="w-6 h-6" />
                </button>
            )}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
            >
                {eventsToShow.map((event) => (
                    <div
                        key={event.id}
                        className="min-w-[270px] max-w-[300px] flex-shrink-0 group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                    >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                            <img
                                src={event.posterUrl}
                                alt={event.name}
                                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <button 
                                    onClick={() => toggleLike(event.id)}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                        likedEvents[event.id] 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <FiHeart className={`w-4 h-4 ${likedEvents[event.id] ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                                    <FiShare2 className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Rating */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                                <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-white text-xs font-medium">{event.rating}</span>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="p-5">
                            {/* Event Type Badge */}
                            <div className="mb-3">
                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {event.genre}
                                </span>
                            </div>
                            {/* Event Name */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                {event.name}
                            </h3>
                            {/* Event Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <FiClock className="w-4 h-4 text-blue-500" />
                                    <span>
                                        {new Date(event.scheduleStart).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </span>
                                </div>
                                {/* <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <FiMapPin className="w-4 h-4 text-blue-500" />
                                    <span className="line-clamp-1">{event.city}, {event.state}</span>
                                </div> */}
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <FiUsers className="w-4 h-4 text-blue-500" />
                                    <span>{event.totalBookings} attending</span>
                                </div>
                            </div>
                            {/* CTA Button */}
                            <button
                                className="w-full bg-[#1A73E8] hover:bg-[#1760c4] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                                onClick={() => navigate(`/event/${event._id || event.id}`)}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

