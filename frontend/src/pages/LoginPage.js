import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import authService from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('ahmad@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(false);

  const handleLogin = async (e, selectedAccountType = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password, selectedAccountType);
      
      // Check if account type selection is required
      if (response.requiresAccountSelection) {
        setShowAccountTypeSelection(true);
        setLoading(false);
        return;
      }
      
      if (response.success) {
        toast.success('Login successful!');
        setTimeout(() => {
          const user = response.user;
          navigate(
            user.accountType === 'driver' ? '/driver-dashboard' : '/passenger-dashboard'
          );
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      if (!showAccountTypeSelection) {
        setLoading(false);
      }
    }
  };

  const handleAccountTypeSelection = (accountType) => {
    setShowAccountTypeSelection(false);
    handleLogin(null, accountType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Account Type Selection Modal */}
      {showAccountTypeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Account Type</h2>
            <p className="text-gray-600 mb-6">You have both passenger and driver accounts. Please choose which account to access:</p>
            
            <div className="space-y-4">
              <button
                onClick={() => handleAccountTypeSelection('passenger')}
                className="w-full p-6 border-2 border-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="text-4xl mb-2">👤</div>
                <h3 className="font-bold text-gray-800 text-lg">Passenger</h3>
                <p className="text-sm text-gray-600">Book and take rides</p>
              </button>
              
              <button
                onClick={() => handleAccountTypeSelection('driver')}
                className="w-full p-6 border-2 border-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <div className="text-4xl mb-2">🚗</div>
                <h3 className="font-bold text-gray-800 text-lg">Driver</h3>
                <p className="text-sm text-gray-600">Offer rides and earn money</p>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Login to your UPM Student Cab account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Test Accounts:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Passenger:</strong> ahmad@example.com / password123
            </p>
            <p>
              <strong>Driver:</strong> mohammad@example.com / password123
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
