# UPM Student Cab - Implementation Details

## Database Structure (Firestore Collections)

### 1. Users Collection
Stores basic user information for both passengers and drivers.

```javascript
{
  uid: "user_id",
  firstName: "Ahmad",
  lastName: "Hassan",
  email: "ahmad@example.com",
  phoneNumber: "+60123456789",
  accountType: "passenger", // or "driver"
  password: "hashed_password",
  profilePicture: "url_or_null",
  rating: 4.5,
  totalRatings: 10,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. Drivers Collection
Specific information for driver accounts.

```javascript
{
  uid: "driver_id",
  firstName: "Mohammad",
  lastName: "Ali",
  email: "mohammad@example.com",
  phoneNumber: "+60111111111",
  carModel: "Toyota Vios",
  carColor: "Silver",
  carRegistration: "WXY1234",
  licenseNumber: "D-1234567",
  isActive: true,
  bankAccountNumber: "1234567890",
  bankAccountName: "Mohammad Ali",
  bankName: "Maybank",
  carPicture: "url_or_null",
  walletBalance: 250.50,
  completedRides: 45,
  rating: 4.7,
  totalRatings: 25,
  currentLocation: {
    latitude: 3.1219,
    longitude: 101.6869
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. Passengers Collection
Specific information for passenger accounts.

```javascript
{
  uid: "passenger_id",
  firstName: "Ahmad",
  lastName: "Hassan",
  email: "ahmad@example.com",
  phoneNumber: "+60123456789",
  cardDetails: {
    cardNumber: "****1234",
    cardHolder: "Ahmad Hassan",
    expiryDate: "12/25",
    cvv: "***"
  },
  emergencyContact: {
    name: "Hassan Ali",
    phone: "+60133333333"
  },
  completedRides: 15,
  rating: 4.5,
  totalRatings: 10,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 4. Rides Collection
Contains ride booking information.

```javascript
{
  rideId: "ride_id",
  passengerId: "passenger_id",
  driverId: "driver_id",
  pickupLocation: {
    address: "UPM Main Gate",
    latitude: 3.1219,
    longitude: 101.6869
  },
  dropoffLocation: {
    address: "Pavilion KL",
    latitude: 3.1575,
    longitude: 101.6804
  },
  pickupTime: Timestamp,
  estimatedFare: 18.5,
  actualFare: 18.5,
  rideStatus: "completed", // pending, accepted, in_progress, completed, cancelled
  pickupStatus: "successful", // successful, failed
  paymentMethod: "card", // card, cash
  paymentStatus: "completed", // pending, completed, failed
  pickedUpAt: Timestamp,
  completedAt: Timestamp,
  rating: {
    drivingSkills: 5,
    friendliness: 4,
    carCleanliness: 5,
    punctuality: 5
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 5. Payments Collection
Payment transaction records.

```javascript
{
  paymentId: "payment_id",
  rideId: "ride_id",
  passengerId: "passenger_id",
  driverId: "driver_id",
  amount: 18.5,
  paymentMethod: "card", // card, cash
  paymentStatus: "completed", // pending, completed, failed
  cardLastFour: "1234",
  transactionDate: Timestamp,
  description: "UPM Main Gate to Pavilion KL",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 6. Ratings Collection
Driver and passenger ratings.

```javascript
{
  ratingId: "rating_id",
  rideId: "ride_id",
  ratedBy: "user_id",
  ratedUser: "user_id",
  ratingType: "passenger_to_driver", // passenger_to_driver, driver_to_passenger
  rating: 4.75,
  // For driver ratings by passengers
  drivingSkills: 5,
  friendliness: 4,
  carCleanliness: 5,
  punctuality: 5,
  // For passenger ratings by drivers
  punctuality: 5,
  cleanliness: 5,
  manners: 5,
  comment: "Great driver, safe and friendly",
  ratedAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 7. Messages Collection
In-app messaging between drivers and passengers.

```javascript
{
  messageId: "message_id",
  rideId: "ride_id",
  senderId: "user_id",
  recipientId: "user_id",
  message: "I will be at the pickup location in 5 minutes",
  timestamp: Timestamp,
  isRead: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 8. Notifications Collection
Real-time notifications for users.

```javascript
{
  notificationId: "notification_id",
  userId: "user_id",
  type: "driver_arrived", // ride_accepted, ride_cancelled, driver_arrived, ride_completed, etc.
  title: "Driver Arrived",
  message: "Your driver Mohammad has arrived at the pickup location",
  rideId: "ride_id",
  timestamp: Timestamp,
  isRead: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Authentication Flow

### Registration
1. User enters details (name, email, phone, password, account type)
2. For drivers: Additional vehicle and license information
3. Password is hashed using bcryptjs
4. Firebase Auth user is created
5. User document is stored in Firestore
6. JWT token is generated and returned

### Login
1. User provides email and password
2. System fetches user from Firestore by email
3. Password is verified using bcryptjs
4. JWT token is generated
5. Token is stored in localStorage on frontend

### Protected Routes
- All API endpoints require JWT token in Authorization header
- Token is verified on each request
- User information is extracted from token claims

## Payment Flow

### Passenger to Driver Payment (Card)
1. Passenger selects card payment during booking
2. Ride is completed
3. Fare amount is deducted from passenger's bank account (simulated)
4. Payment record is created
5. Driver's wallet is credited automatically
6. Passenger receives confirmation

### Cash Payment
1. Passenger selects cash payment during booking
2. Ride is completed
3. Driver confirms cash payment received
4. Payment record is created
5. Driver updates their wallet

## Fare Calculation

```javascript
const basefare = 3.0; // RM 3.00
const pricePerKm = 1.5; // RM 1.50 per km
const fare = basefare + distance * pricePerKm;
```

Example: 10 km ride = RM 3.00 + (10 × RM 1.50) = RM 18.50

## Real-time Features (Socket.io)

### Driver Location Updates
- Driver sends location every 5 seconds
- Location is broadcast to assigned passenger
- Passenger sees driver's real-time position on map

### Messages
- Instant messaging between driver and passenger
- Delivered to specific ride conversation
- Includes read receipts

### Notifications
- Driver arrival notification
- Ride completion notification
- Payment confirmation notification

## Search Algorithm

Currently implemented as:
1. Get all active drivers
2. Filter by proximity (optional, in production would use geospatial queries)
3. Return available drivers to passenger
4. Passenger selects and books
5. System sends offer to nearest driver first

In production, would use:
- Geohashing for efficient location-based queries
- Real-time driver matching algorithm
- Surge pricing during peak hours

## Security Measures

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens for API authentication
- Firebase Auth for additional security
- Environment variables for sensitive data
- CORS enabled for specific domains
- Input validation on all endpoints
- Rate limiting (recommended for production)

## Error Handling

- Global error middleware catches all errors
- Appropriate HTTP status codes returned
- Error messages sent to client
- Errors logged for debugging
- Validation errors return 400 Bad Request

## Testing Credentials

Test accounts with pre-populated data:

### Passenger Account
- Email: ahmad@example.com
- Password: password123
- Phone: +60123456789
- Status: 15 completed rides, 4.5 rating

### Driver Account #1
- Email: mohammad@example.com
- Password: password123
- Phone: +60111111111
- Vehicle: Toyota Vios (WXY1234)
- Status: 45 completed rides, 4.7 rating, RM 250.50 balance

### Driver Account #2
- Email: fatimah@example.com
- Password: password123
- Phone: +60122222222
- Vehicle: Perodua Myvi (ABC5678)
- Status: 38 completed rides, 4.6 rating, RM 180.75 balance

## Frontend Component Structure

```
src/
├── pages/
│   ├── Home.js - Landing page
│   ├── LoginPage.js - Login page
│   ├── PassengerDashboardPage.js - Passenger dashboard
│   └── DriverDashboardPage.js - Driver dashboard
├── services/
│   ├── authService.js - Authentication API calls
│   ├── rideService.js - Ride management API calls
│   └── driverService.js - Driver-specific API calls
├── config/
│   └── firebase.js - Firebase configuration
├── context/
│   └── AuthContext.js - Authentication context
├── hooks/
│   └── useAuth.js - Custom auth hook
└── App.js - Main app component with routing
```

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.js - Firebase initialization
│   ├── controllers/
│   │   ├── authController.js - Auth endpoints
│   │   ├── driverController.js - Driver endpoints
│   │   └── passengerController.js - Passenger endpoints
│   ├── middleware/
│   │   └── auth.js - JWT authentication
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── passengerRoutes.js
│   │   └── messageRoutes.js
│   ├── utils/
│   │   ├── database.js - Firestore helpers
│   │   └── helpers.js - Utility functions
│   ├── seeds/
│   │   └── dummyData.js - Test data seeding
│   └── server.js - Main server file
```

## Performance Optimization

- Firestore indexes created for common queries
- Efficient pagination for ride history
- Real-time updates via Socket.io
- Local storage caching for user data
- Lazy loading of components
- Optimized images and assets

## Future Enhancements

1. Advanced Geospatial Queries
   - Use Firestore geohashing for efficient location searches
   - Real-time driver proximity matching

2. Payment Gateway Integration
   - Integrate Stripe or 2Checkout for actual payments
   - Support multiple payment methods

3. Map Integration
   - Google Maps API for real-time tracking
   - Route optimization
   - ETA calculations

4. Ratings and Reviews
   - Photo uploads with ratings
   - Detailed review system
   - Driver/Passenger reputation management

5. Admin Dashboard
   - Monitor all rides
   - Manage users
   - Handle disputes
   - View analytics

6. Mobile App
   - React Native version
   - Push notifications
   - Offline support

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project created and configured
- [ ] Database collections created with indexes
- [ ] CORS properly configured
- [ ] SSL certificates set up
- [ ] Rate limiting implemented
- [ ] Error logging set up
- [ ] Monitoring and analytics configured
- [ ] Backup strategy defined
- [ ] Security audit completed
