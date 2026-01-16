import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [accountType, setAccountType] = useState('passenger');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    carModel: '',
    carColor: '',
    carRegistrationNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = {
        ...formData,
        accountType
      };
      
      await register(userData);
      toast.success(`${accountType === 'passenger' ? 'Passenger' : 'Driver'} registered successfully!`);
      navigate(accountType === 'passenger' ? '/passenger/dashboard' : '/driver/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">UPM Student Cab</h1>
          <p className="text-blue-100">Register as {accountType}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Account Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAccountType('passenger')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                accountType === 'passenger'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => setAccountType('driver')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                accountType === 'driver'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Driver
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number (e.g., +6012345678)"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* Driver Specific Fields */}
          {accountType === 'driver' && (
            <>
              <input
                type="text"
                name="carModel"
                placeholder="Car Model"
                value={formData.carModel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                name="carColor"
                placeholder="Car Color"
                value={formData.carColor}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                name="carRegistrationNumber"
                placeholder="Car Registration Number"
                value={formData.carRegistrationNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="px-6 py-4 border-t text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
