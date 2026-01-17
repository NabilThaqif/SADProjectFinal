import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import authService from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Verification, 3: Role Selection, 4: Vehicle Info (if driver)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Information
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Step 3: Account Type
  const [accountType, setAccountType] = useState('passenger');

  // Step 4: Driver Information
  const [driverInfo, setDriverInfo] = useState({
    carModel: '',
    carColor: '',
    carRegistration: '',
    licenseNumber: '',
  });

  // Step 2: Phone Verification
  const [verificationCode, setVerificationCode] = useState('');

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDriverInfoChange = (e) => {
    const { name, value } = e.target;
    setDriverInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateBasicInfo = () => {
    if (
      !basicInfo.firstName ||
      !basicInfo.lastName ||
      !basicInfo.email ||
      !basicInfo.phoneNumber ||
      !basicInfo.password
    ) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (basicInfo.password !== basicInfo.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (basicInfo.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handlePhoneVerification = async () => {
    setLoading(true);
    try {
      const response = await authService.verifyPhoneNumber(
        basicInfo.phoneNumber,
        verificationCode
      );

      if (response.success) {
        toast.success('Phone number verified!');
        setStep(3);
      }
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToRoleSelection = async () => {
    if (validateBasicInfo()) {
      setLoading(true);
      try {
        // Simulate sending verification code
        toast.success('Verification code sent to your phone');
        setStep(2);
      } catch (err) {
        toast.error('Failed to send verification code');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        accountType === 'driver'
          ? {
              ...basicInfo,
              accountType,
              ...driverInfo,
            }
          : {
              ...basicInfo,
              accountType,
            };

      // Remove confirmPassword before sending
      delete payload.confirmPassword;

      const response = await authService.register(payload);

      if (response.success) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate(
            accountType === 'driver'
              ? '/driver-dashboard'
              : '/passenger-dashboard'
          );
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, accountType === 'driver' ? 4 : null]
              .filter(Boolean)
              .map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    stepNum <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
              ))}
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  accountType === 'driver'
                    ? (step / 4) * 100
                    : (step / 3) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600 mb-6">Join UPM Student Cab today</p>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={basicInfo.firstName}
                onChange={handleBasicInfoChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={basicInfo.lastName}
                onChange={handleBasicInfoChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={basicInfo.email}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={basicInfo.phoneNumber}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={basicInfo.password}
                onChange={handleBasicInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={basicInfo.confirmPassword}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={handleContinueToRoleSelection}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Continuing...' : 'Continue'}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Login
              </button>
            </p>
          </form>
        )}

        {/* Step 2: Phone Verification */}
        {step === 2 && (
          <form className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <FiArrowLeft /> Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Phone</h1>
            <p className="text-gray-600 mb-6">
              Enter the verification code sent to {basicInfo.phoneNumber}
            </p>

            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              required
            />

            <p className="text-sm text-gray-600">
              Test code: <span className="font-bold">123456</span>
            </p>

            <button
              type="button"
              onClick={handlePhoneVerification}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}

        {/* Step 3: Role Selection */}
        {step === 3 && (
          <form className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <FiArrowLeft /> Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Type</h1>
            <p className="text-gray-600 mb-6">Select your account type to continue</p>

            <div
              onClick={() => {
                setAccountType('passenger');
              }}
              className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                accountType === 'passenger'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-bold text-gray-800">Passenger</h3>
              <p className="text-sm text-gray-600">Book and take rides</p>
            </div>

            <div
              onClick={() => {
                setAccountType('driver');
              }}
              className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                accountType === 'driver'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="font-bold text-gray-800">Driver</h3>
              <p className="text-sm text-gray-600">Offer rides and earn money</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (accountType === 'driver') {
                  setStep(4);
                } else {
                  setStep(5); // Would handle registration without vehicle info
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 4: Driver Vehicle Information */}
        {step === 4 && accountType === 'driver' && (
          <form className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <FiArrowLeft /> Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Information</h1>
            <p className="text-gray-600 mb-6">Tell us about your vehicle</p>

            <input
              type="text"
              name="carModel"
              placeholder="Car Model (e.g., Toyota Vios)"
              value={driverInfo.carModel}
              onChange={handleDriverInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="carColor"
              placeholder="Car Color"
              value={driverInfo.carColor}
              onChange={handleDriverInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="carRegistration"
              placeholder="Registration Number"
              value={driverInfo.carRegistration}
              onChange={handleDriverInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="licenseNumber"
              placeholder="Driving License Number"
              value={driverInfo.licenseNumber}
              onChange={handleDriverInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
