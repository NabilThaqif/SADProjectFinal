# UPM Student Cab - E-Hailing Application

A comprehensive web-based e-hailing application built for UPM students. The application connects passengers with drivers for ride-sharing services with real-time features and secure payment processing.

## Project Structure

```
UPM Student Cab/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB data models
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication & validation
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Main server entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API service calls
    │   ├── context/         # Context API state management
    │   ├── hooks/           # Custom React hooks
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    └── .env.example
```

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your configuration:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upm-student-cab
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. **Start MongoDB:**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

6. **Run the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/verify-phone` - Verify phone number

#### Passenger Endpoints
- `PUT /api/passengers/profile` - Update profile
- `POST /api/passengers/search-ride` - Search for available rides
- `POST /api/passengers/book-ride` - Book a ride
- `GET /api/passengers/ride-history` - Get booking history
- `POST /api/passengers/rate-driver/:rideId` - Rate driver

#### Driver Endpoints
- `PUT /api/drivers/profile` - Update profile
- `PUT /api/drivers/status` - Set availability status
- `PUT /api/drivers/location` - Update current location
- `GET /api/drivers/available-rides` - Get available ride requests
- `POST /api/drivers/accept-ride/:rideId` - Accept ride
- `POST /api/drivers/reject-ride/:rideId` - Reject ride
- `PUT /api/drivers/pickup-status/:rideId` - Update pickup status
- `POST /api/drivers/complete-ride/:rideId` - Complete ride
- `POST /api/drivers/rate-passenger/:rideId` - Rate passenger
- `GET /api/drivers/ride-history` - Get completed rides
- `GET /api/drivers/wallet` - Get wallet balance

#### Messages & Notifications
- `POST /api/messages` - Send message
- `GET /api/messages/:rideId` - Get ride messages
- `GET /api/notifications` - Get user notifications

## Frontend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. **Start development server:**
```bash
npm start
```

Application will open at `http://localhost:3000`

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Password Hashing**: bcryptjs
- **Validation**: Custom validators

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Maps**: Leaflet (optional, for live tracking)
- **Icons**: React Icons
- **Notifications**: React Toastify

## Features

### Passenger Features
1. **Registration & Authentication**
   - Create account with username, password, phone number
   - JWT-based login/logout

2. **Profile Management**
   - Edit personal information
   - Upload profile picture
   - Manage payment methods (debit/credit card)

3. **Ride Booking**
   - Search rides with pickup and dropoff locations
   - View fare estimates
   - Book rides with preferred payment method

4. **Live Tracking**
   - Real-time driver location updates
   - View driver details (car model, plate number, rating)
   - Estimated arrival time

5. **Communication**
   - In-app messaging with driver
   - Real-time notifications

6. **Payment**
   - Card or cash payment options
   - Automatic deduction for card payments
   - Payment history tracking

7. **Rating & Review**
   - Rate drivers on driving skills, friendliness, cleanliness, punctuality
   - View driver ratings

### Driver Features
1. **Registration & Authentication**
   - Create account with vehicle details
   - Provide driving license and vehicle ownership documents

2. **Profile Management**
   - Edit personal and vehicle information
   - Upload car pictures
   - Manage bank account details

3. **Availability Management**
   - Toggle active/inactive status
   - Receive ride offers when active

4. **Ride Management**
   - View nearby ride requests
   - Accept or reject rides
   - Update pickup status (successful/failed)
   - Complete rides and process payments

5. **Financial Management**
   - In-app wallet for earnings
   - View transaction history
   - Withdraw funds to bank account

6. **Rating System**
   - Rate passengers on punctuality, cleanliness, manners
   - View passenger ratings

## Real-Time Features (Socket.io)

The application uses Socket.io for real-time updates:

1. **Location Updates** - Driver location shared with passenger
2. **Ride Notifications** - Instant notifications for ride offers and updates
3. **Messages** - Real-time chat between driver and passenger
4. **Status Updates** - Live status changes during rides

## Database Schema

### User (Base Schema)
- username
- password (hashed)
- firstName, lastName
- phoneNumber
- profilePicture
- accountType (passenger/driver)
- rating
- isActive

### Passenger (extends User)
- debitCreditCard
- bookingHistory
- emergencyContacts
- paymentHistory

### Driver (extends User)
- Vehicle info (model, color, registration number)
- Bank details
- Current location (GeoJSON)
- Wallet balance
- Completed rides count
- Documents verification

### Ride
- passenger (ref)
- driver (ref)
- Pickup/dropoff locations with coordinates
- Fare and distance
- Status and payment info
- Route history with timestamps

### Rating
- Rater and ratee
- Specific criteria ratings
- Overall rating
- Comment

### Message
- Sender and receiver
- Message content
- Read status
- Associated ride

## Security Considerations

1. **Password Security**
   - Passwords hashed with bcryptjs
   - Minimum 6 characters required

2. **Authentication**
   - JWT tokens with 7-day expiration
   - Token validation on protected routes
   - Role-based access control

3. **Data Validation**
   - Input validation on all endpoints
   - Email and phone number format validation

4. **CORS**
   - Configured for cross-origin requests
   - Frontend URL specified in environment

## Future Enhancements

1. **Payment Integration**
   - Stripe/PayPal integration for card payments
   - Wallet top-up functionality

2. **Maps Integration**
   - Google Maps API for location services
   - Real-time route calculation

3. **SMS Verification**
   - Twilio integration for OTP verification
   - Phone number validation

4. **Advanced Features**
   - Ride scheduling
   - Favorite drivers/routes
   - Referral system
   - Passenger insurance
   - Driver verification documents management

5. **Performance**
   - Image optimization and CDN
   - Database query optimization
   - Redis caching for frequently accessed data

6. **Mobile App**
   - React Native mobile application
   - Native maps integration
   - Push notifications

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify port 5000 is not in use

### Frontend Connection Issues
- Check REACT_APP_API_URL in .env
- Ensure backend server is running
- Clear browser cache and reload

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage if needed

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

**Note**: This is a development version. Ensure proper configuration of payment gateways, SMS services, and maps APIs before deploying to production.
