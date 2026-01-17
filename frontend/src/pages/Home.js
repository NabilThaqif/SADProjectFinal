import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMap, FiUsers, FiDollarSign, FiSmartphone } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <FiMap /> UPM Student Cab
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Ride Share Made Easy for UPM Students
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              UPM Student Cab is a convenient and affordable ride-sharing platform designed specifically for UPM students. Book a ride in seconds or become a driver and earn money.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                Get Started <FiArrowRight />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl h-80 flex items-center justify-center text-white text-6xl">
            🚗
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-16 text-center">Why Choose UPM Student Cab?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <FiSmartphone className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book a ride with just a few taps. Quick and hassle-free booking process.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <FiDollarSign className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Affordable Prices</h3>
              <p className="text-gray-600">Get the best rates among ride-sharing services. Transparent pricing, no hidden costs.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <FiUsers className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safe & Trusted</h3>
              <p className="text-gray-600">Verified drivers and passengers. Real-time tracking and emergency support.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <FiMap className="text-4xl text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Available</h3>
              <p className="text-gray-600">Available around the clock. Get a ride whenever you need one, day or night.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-16 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* For Passengers */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              👤
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">For Passengers</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                <p className="text-gray-600">Sign up and create your account</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                <p className="text-gray-600">Enter pickup and dropoff locations</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                <p className="text-gray-600">View fare and available drivers</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</span>
                <p className="text-gray-600">Book and pay securely</p>
              </div>
            </div>
          </div>

          {/* For Drivers */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              🚗
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">For Drivers</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                <p className="text-gray-600">Register with vehicle details</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                <p className="text-gray-600">Verify documents and get approved</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                <p className="text-gray-600">Set yourself online and receive offers</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</span>
                <p className="text-gray-600">Complete rides and earn money</p>
              </div>
            </div>
          </div>

          {/* For Campus */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              🎓
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Campus Community</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                <p className="text-gray-600">Student-friendly pricing</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                <p className="text-gray-600">Safe rides with verified users</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                <p className="text-gray-600">Earn extra income as a driver</p>
              </div>
              <div className="flex gap-4">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</span>
                <p className="text-gray-600">24/7 support and safety features</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of UPM students already using UPM Student Cab</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Create Account Now <FiArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 UPM Student Cab. All rights reserved.</p>
          <p className="mt-2">Safe, Affordable, Reliable Ride Sharing for UPM Students</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
