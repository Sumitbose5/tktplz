import { useState, useEffect } from "react";
import { FiMenu, FiSearch, FiBell, FiHeart } from "react-icons/fi";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";

const CityPickerModal = ({ open, onClose, onSelect, currentCity }) => {
  const cities = ["Jamshedpur", "Ranchi"];
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px] flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Select Your City</h2>
        <div className="flex flex-col gap-3 w-full">
          {cities.map((city) => (
            <button
              key={city}
              className={`w-full px-4 py-2 rounded-lg font-medium border transition-all duration-200 ${
                currentCity === city
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
              }`}
              onClick={() => onSelect(city)}
            >
              {city}
            </button>
          ))}
        </div>
        <button
          className="mt-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Header = ({ onLocationClick, currentCity }) => {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { showLoginModal, modalType, setSidebarOpen, isSidebarOpen } = useModal();
  const { user, setUser } = useAuth();
  const { city, setCityState } = useLocation();
  // const [cityModalOpen, setCityModalOpen] = useState(false); // Removed

  // const handleCitySelect = (selectedCity) => { // Removed
  //   setCityState(selectedCity, "Jharkhand"); // Only city, state is fixed for now
  //   setCityModalOpen(false);
  // };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`static top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        {/* Logo with animation */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src="/public/images/logo2.png" 
              alt="TktPlz Logo" 
              className="h-10 transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex-1 mx-4 relative max-w-2xl">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, movies, concerts, workshops..."
              className="w-full bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button className="p-1 hover:bg-gray-200/50 rounded-full transition-colors duration-200">
                <FiBell className="text-gray-500 hover:text-blue-600" />
              </button>
              <button className="p-1 hover:bg-gray-200/50 rounded-full transition-colors duration-200">
                <FiHeart className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Part */}
        <div className="flex items-center gap-3">
          {/* Location Picker Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer rounded-none focus:outline-none focus:ring-0"
            onClick={onLocationClick}
            style={{
              borderWidth: "1px",
              fontSize: "1rem",
              letterSpacing: "0.01em"
            }}
          >
            <span className="text-lg">📍</span>
            <span className="font-semibold">{currentCity || "Select City"}</span>
          </button>
          {user ? (
            // Enhanced logged in state
            <div className="flex items-center gap-3">
              <button className="relative group cursor-pointer" onClick={() => setSidebarOpen(true)}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <FaUserCircle className="text-2xl text-blue-600 relative z-10" />
              </button>
              <button
                className="hidden cursor-pointer sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="font-medium">Hi, {user.name ? user.name : "Guest"}</span>
              </button>
            </div>
          ) : (
            // Enhanced sign in buttons
            <div className="flex items-center gap-3">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => showLoginModal()}
              >
                Sign In
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="text-xl text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation Menu */}
      <nav className={`flex justify-between items-center px-6 lg:px-10 py-3 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? 'border-gray-200' : 'border-transparent'
      }`}>
        <div className="flex gap-6 lg:gap-8">
          {[
            { to: "/", label: "Movies", icon: "🎬" },
            { to: "/", label: "Streams", icon: "📺" },
            { to: "/", label: "Concerts", icon: "🎵" },
            { to: "/", label: "Workshops", icon: "🎨" }
          ].map((item) => (
            <NavLink 
              key={item.label}
              to={item.to} 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="flex gap-4 lg:gap-6">
          <NavLink 
            to="/org-login" 
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎪</span>
            <span className="hidden sm:inline">List My Show</span>
          </NavLink>
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎁</span>
            <span className="hidden sm:inline">Offers</span>
          </NavLink>
        </div>
      </nav>
      {/* <CityPickerModal // Removed
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={handleCitySelect}
        currentCity={city}
      /> */}
    </header>
  );
}