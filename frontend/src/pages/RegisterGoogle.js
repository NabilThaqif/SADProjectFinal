import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { authService } from '../services/apiService';

export const RegisterGoogle = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('passenger');
  const [loading, setLoading] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [profileData, setProfileData] = useState({
    phoneNumber: '',
    carModel: '',
    carColor: '',
    carRegistrationNumber: ''
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await authService.googleRegister({
        token: credentialResponse.credential,
        accountType
      });

      const { token, user, isNewUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (isNewUser) {
        // New user - show profile completion form
        setNewUser(user);
        setShowProfileCompletion(true);
        toast.info('Profile setup required - please fill in your details');
      } else {
        // Existing user - redirect to dashboard
        toast.success(`${accountType === 'passenger' ? 'Passenger' : 'Driver'} login successful!`);
        navigate(accountType === 'passenger' ? '/passenger/dashboard' : '/driver/dashboard');
      }
    } catch (error) {
      console.error('Google registration error:', error);
      const errorMessage = error.response?.data?.message || 'Google registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google authentication failed');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();

    if (!profileData.phoneNumber) {
      toast.error('Please provide a phone number');
      return;
    }

    if (accountType === 'driver') {
      if (!profileData.carModel || !profileData.carColor || !profileData.carRegistrationNumber) {
        toast.error('Please fill in all vehicle details');
        return;
      }
    }

    setLoading(true);
    try {
      await authService.completeProfile(profileData);
      toast.success('Profile completed successfully!');
      navigate(accountType === 'passenger' ? '/passenger/dashboard' : '/driver/dashboard');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  if (showProfileCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-blue-100">Welcome {newUser?.firstName}!</p>
          </div>

          <form onSubmit={handleCompleteProfile} className="p-6 space-y-4">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (e.g., +6012345678)"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {accountType === 'driver' && (
              <>
                <input
                  type="text"
                  name="carModel"
                  placeholder="Car Model"
                  value={profileData.carModel}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="text"
                  name="carColor"
                  placeholder="Car Color"
                  value={profileData.carColor}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="text"
                  name="carRegistrationNumber"
                  placeholder="Car Registration Number"
                  value={profileData.carRegistrationNumber}
                  onChange={handleProfileChange}
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
              {loading ? 'Completing...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">UPM Student Cab</h1>
          <p className="text-blue-100">Register as {accountType}</p>
        </div>

        <form className="p-6 space-y-4">
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

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              width="300"
              theme="outline"
            />
          </div>

          <div className="relative flex items-center gap-4 my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Link
            to="/register-traditional"
            className="block w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition text-center"
          >
            Register with Email
          </Link>
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

export default RegisterGoogle;
