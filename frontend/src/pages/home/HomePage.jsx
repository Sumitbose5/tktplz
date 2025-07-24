import { Banner } from "../../components/Home/Banner";
import { CardSection } from "../../components/Home/CardSection";
import { Header } from "../../components/Home/Header";
import ImageCarousel from "../../components/Home/ImageCarousel";
import { useAuth } from "../../context/AuthContext";
import { TktPlzSpinner } from "../../components/Other/Spinner";
import { useEffect, useState } from "react";
import { getAllEvents } from "../../api/Home";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "../../context/LocationContext";

const allCities = [
  "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad", "Ahmedabad", "Chandigarh", "Chennai", "Pune", "Kolkata", "Kochi",
  "Jamshedpur", "Ranchi", "Lucknow", "Indore", "Bhopal", "Nagpur", "Jaipur", "Surat", "Patna", "Kanpur", "Varanasi", "Agra", "Vadodara", "Ludhiana", "Nashik", "Meerut", "Rajkot", "Amritsar", "Allahabad", "Aurangabad"
];

const CityPickerModal = ({ open, onClose, onSelect, currentCity }) => {
  const [search, setSearch] = useState("");
  if (!open) return null;
  const filteredCities = allCities.filter(city => city.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Select Your City</h2>
        <input
          type="text"
          placeholder="Search for your city"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
        <div className="w-full max-h-72 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredCities.length > 0 ? filteredCities.map(city => (
              <button
                key={city}
                className={`w-full text-base py-2 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-gray-800 hover:bg-blue-50 ${currentCity === city ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => onSelect(city)}
              >
                {city}
              </button>
            )) : (
              <div className="col-span-full text-gray-400 text-center py-4">No cities found.</div>
            )}
          </div>
        </div>
        <button
          className="mt-6 text-blue-600 hover:underline text-sm font-semibold"
          onClick={onClose}
        >
          Hide All Cities
        </button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const { loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const { city, setCityState } = useLocation();
  const [cityModalOpen, setCityModalOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleCitySelect = (selectedCity) => {
    setCityState(selectedCity, "Jharkhand");
    setCityModalOpen(false);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['eventData'],
    queryFn: getAllEvents
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const allEvents = data?.data || [];
  const filteredEvents = city ? allEvents.filter(e => e.city?.toLowerCase() === city.toLowerCase()) : allEvents;
  
  // Event filtering by type
  const movieEvents = filteredEvents.filter(event => event.type === 'Seating' && event.sub_type === 'Movie');
  const liveEvents = filteredEvents.filter(event => event.type === 'Open' && event.sub_type === 'Concert');
  const onlineEvents = allEvents.filter(event => event.type === 'Online');
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.scheduleStart);
    const now = new Date();
    return eventDate > now;
  });
  const hackathons = allEvents.filter(event => event.type === 'Registration' && event.sub_type === 'Hackathon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onLocationClick={() => setCityModalOpen(true)} currentCity={city} />
      <CityPickerModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={handleCitySelect}
        currentCity={city}
      />

      {loading ? (
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center">
            <TktPlzSpinner />
            <p className="mt-4 text-gray-600 font-medium animate-pulse">
              Loading amazing experiences...
            </p>
          </div>
        </div>
      ) : (
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Hero Section */}
          <section className="relative">
            <ImageCarousel />
          </section>

          {/* Welcome Section */}
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {city ? `Events in ${city}` : 'Discover Amazing Events'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {city 
                  ? `Explore the best events happening in ${city}. From movies to concerts, find your perfect entertainment.`
                  : 'Select your city to discover local events, movies, concerts, and more.'
                }
              </p>
            </div>
          </section>

          {/* Movies Section */}
          {movieEvents.length > 0 && (
            <section className="py-8 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Now Showing</h2>
                  <p className="text-gray-600 text-lg">Latest movies in theaters near you</p>
                </div>
                <CardSection events={movieEvents} />
              </div>
            </section>
          )}

          {/* Live Events Section */}
          {liveEvents.length > 0 && (
            <section className="py-8 px-4 bg-white/50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Live Events</h2>
                  <p className="text-gray-600 text-lg">Experience the energy of live performances</p>
                </div>
                <CardSection events={liveEvents} />
              </div>
            </section>
          )}

          {/* Online Events Section */}
          {onlineEvents.length > 0 && (
            <section className="py-8 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Virtual Events</h2>
                  <p className="text-gray-600 text-lg">Join events from anywhere in the world</p>
                </div>
                <CardSection events={onlineEvents} />
              </div>
            </section>
          )}

          {/* Hackathon Section */}
          {hackathons.length > 0 && (
            <section className="py-8 px-4 bg-white/50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Hackathon</h2>
                  <p className="text-gray-600 text-lg">Participate in exciting hackathons</p>
                </div>
                <CardSection events={hackathons} />
              </div>
            </section>
          )}

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <section className="py-8 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Coming Soon</h2>
                  <p className="text-gray-600 text-lg">Mark your calendar for these upcoming events</p>
                </div>
                <CardSection events={upcomingEvents} />
              </div>
            </section>
          )}

          {/* Banner Section */}
          <section className="py-8 px-4">
            <div className="max-w-full mx-auto">
              <Banner img="/public/images/banner.png" />
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Create Your Own Event?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of organizers who trust TktPlz for their events
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  Start Organizing
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}