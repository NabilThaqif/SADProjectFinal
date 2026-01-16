# UPM Student Cab - File Directory & Overview

## 📁 Complete File Structure

```
UPM Student Cab/
├── 📄 README.md                          # Main project documentation
├── 📄 QUICKSTART.md                      # Quick start guide (5 min setup)
├── 📄 INSTALLATION.md                    # Detailed installation steps
├── 📄 API_DOCUMENTATION.md               # Complete API reference
├── 📄 PROJECT_SUMMARY.md                 # Project overview and features
├── 📄 FILE_INDEX.md                      # This file
│
├── 📁 backend/
│   ├── 📄 package.json                   # Node.js dependencies
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 .gitignore                     # Git ignore rules
│   │
│   └── 📁 src/
│       ├── 📄 server.js                  # Main server entry point (Start here!)
│       │
│       ├── 📁 models/                    # MongoDB Mongoose schemas
│       │   ├── 📄 User.js                # Base user schema with auth
│       │   ├── 📄 Passenger.js           # Passenger account extension
│       │   ├── 📄 Driver.js              # Driver account extension
│       │   ├── 📄 Ride.js                # Ride/booking schema
│       │   ├── 📄 Rating.js              # User rating schema
│       │   ├── 📄 Message.js             # In-app messaging schema
│       │   ├── 📄 Payment.js             # Payment records schema
│       │   └── 📄 Notification.js        # Notifications schema
│       │
│       ├── 📁 controllers/               # Business logic handlers
│       │   ├── 📄 authController.js      # Login, register, profile
│       │   ├── 📄 passengerController.js # Passenger features
│       │   └── 📄 driverController.js    # Driver features
│       │
│       ├── 📁 routes/                    # API endpoint definitions
│       │   ├── 📄 authRoutes.js          # /auth/* endpoints
│       │   ├── 📄 passengerRoutes.js     # /passengers/* endpoints
│       │   ├── 📄 driverRoutes.js        # /drivers/* endpoints
│       │   └── 📄 messageRoutes.js       # /messages/* endpoints
│       │
│       ├── 📁 middleware/
│       │   └── 📄 auth.js                # JWT authentication, role checks
│       │
│       ├── 📁 utils/
│       │   ├── 📄 helpers.js             # Helper functions (fare calc, validation)
│       │   └── 📄 database.js            # MongoDB connection
│       │
│       └── 📁 services/                  # (Folder for future services)
│
└── 📁 frontend/
    ├── 📄 package.json                   # React dependencies
    ├── 📄 .env.example                   # Environment variables template
    ├── 📄 .gitignore                     # Git ignore rules
    ├── 📄 tailwind.config.js             # Tailwind CSS configuration
    ├── 📄 postcss.config.js              # PostCSS configuration
    │
    ├── 📁 public/
    │   └── 📄 index.html                 # HTML entry point
    │
    └── 📁 src/
        ├── 📄 App.js                     # Main app component & routes
        ├── 📄 index.js                   # React DOM render entry
        ├── 📄 index.css                  # Global styles
        │
        ├── 📁 pages/                     # Full page components
        │   ├── 📄 Login.js               # Login page (Start here!)
        │   ├── 📄 Register.js            # Registration page
        │   ├── 📄 PassengerDashboard.js  # Passenger main interface
        │   └── 📄 DriverDashboard.js     # Driver main interface
        │
        ├── 📁 components/                # Reusable components
        │   └── (To be added as needed)
        │
        ├── 📁 services/
        │   ├── 📄 api.js                 # Axios API client setup
        │   └── 📄 apiService.js          # API service methods
        │
        ├── 📁 context/
        │   └── 📄 AuthContext.js         # Authentication context
        │
        └── 📁 hooks/
            └── 📄 useAuth.js             # Custom auth hook
```

## 📊 File Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Backend Files** | 13 | Controllers, Models, Routes, Utils, Server |
| **Frontend Files** | 14 | Pages, Services, Context, Hooks, App |
| **Configuration** | 7 | package.json, .env.example, config files |
| **Documentation** | 5 | README, Guides, API Docs, This file |
| **Total Files** | 39 | Complete application |

## 🚀 Getting Started

### For First-Time Setup:
1. Read: [INSTALLATION.md](./INSTALLATION.md) - Detailed step-by-step
2. Then: [QUICKSTART.md](./QUICKSTART.md) - Quick reference

### For Understanding the Code:
1. Backend entry: [backend/src/server.js](./backend/src/server.js)
2. Frontend entry: [frontend/src/App.js](./frontend/src/App.js)
3. Models: [backend/src/models/](./backend/src/models/)
4. API: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### For Project Overview:
1. Read: [README.md](./README.md) - Full project documentation
2. Read: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Features and architecture

## 📚 Documentation Guide

| File | Purpose | Read When |
|------|---------|-----------|
| [README.md](./README.md) | Complete overview | Want full understanding |
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup | Need quick setup |
| [INSTALLATION.md](./INSTALLATION.md) | Detailed installation | Step-by-step help needed |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | All API endpoints | Building features |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Features & architecture | Understanding project scope |
| [FILE_INDEX.md](./FILE_INDEX.md) | This file | Navigation & overview |

## 🔑 Key Files Explained

### Backend Core Files

**[server.js](./backend/src/server.js)** - Application Entry Point
- Initializes Express server
- Sets up Socket.io for real-time features
- Configures middleware (CORS, JSON parsing)
- Establishes MongoDB connection
- Mounts all API routes
- **How to run**: `cd backend && npm run dev`

**[authController.js](./backend/src/controllers/authController.js)** - Authentication Logic
- User registration (Passenger & Driver)
- Login and token generation
- Profile retrieval
- Phone verification

**[passengerController.js](./backend/src/controllers/passengerController.js)** - Passenger Features
- Profile updates
- Ride searching and booking
- Ride history
- Driver rating system

**[driverController.js](./backend/src/controllers/driverController.js)** - Driver Features
- Profile and vehicle management
- Availability status
- Location updates
- Ride acceptance/rejection
- Ride completion and payment
- Passenger rating
- Wallet management

### Data Models

**[User.js](./backend/src/models/User.js)** - Base User Schema
- Username and password (hashed)
- Personal information
- Rating system
- Uses discriminator pattern for Passenger/Driver differentiation

**[Passenger.js](./backend/src/models/Passenger.js)** - Passenger Extension
- Extends User model
- Payment card information
- Booking history
- Emergency contacts

**[Driver.js](./backend/src/models/Driver.js)** - Driver Extension
- Extends User model
- Vehicle details (model, color, registration)
- Current location (GeoJSON)
- Bank account information
- Wallet and earnings
- Document verification status

**[Ride.js](./backend/src/models/Ride.js)** - Ride Information
- Passenger and driver references
- Location data with coordinates
- Fare calculation
- Payment and status tracking
- Route history with timestamps

### Frontend Core Files

**[App.js](./frontend/src/App.js)** - React Application Root
- Routes and navigation
- Auth provider setup
- Toast notifications
- **How to run**: `cd frontend && npm start`

**[Login.js](./frontend/src/pages/Login.js)** - Authentication Page
- Username/password form
- Login logic
- Error handling
- Redirect to appropriate dashboard

**[Register.js](./frontend/src/pages/Register.js)** - Registration Page
- Account type selection
- Form validation
- Separate fields for drivers
- Password hashing on backend

**[PassengerDashboard.js](./frontend/src/pages/PassengerDashboard.js)** - Passenger Interface
- Ride booking form
- Fare estimation
- Ride history view
- Profile management
- Driver rating interface

**[DriverDashboard.js](./frontend/src/pages/DriverDashboard.js)** - Driver Interface
- Availability toggle
- Available rides list
- Ride acceptance
- Pickup status updates
- Ride completion
- Passenger rating
- Wallet display

### Services & Utilities

**[apiService.js](./frontend/src/services/apiService.js)** - API Methods
- Auth service (login, register, verify)
- Passenger service (ride booking, history, rating)
- Driver service (rides, acceptance, completion)
- Message service
- Notification service

**[AuthContext.js](./frontend/src/context/AuthContext.js)** - State Management
- User state management
- Login/logout functions
- Error handling
- Token persistence

**[helpers.js](./backend/src/utils/helpers.js)** - Utility Functions
- Fare calculation
- Rating calculations
- Email/phone validation
- Token generation

## 🔌 API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `POST /api/auth/verify-phone` - Verify phone

### Passengers
- `PUT /api/passengers/profile` - Update profile
- `POST /api/passengers/search-ride` - Search rides
- `POST /api/passengers/book-ride` - Book ride
- `GET /api/passengers/ride-history` - Get history
- `POST /api/passengers/rate-driver/:id` - Rate driver

### Drivers
- `PUT /api/drivers/profile` - Update profile
- `PUT /api/drivers/status` - Set availability
- `PUT /api/drivers/location` - Update location
- `GET /api/drivers/available-rides` - Get rides
- `POST /api/drivers/accept-ride/:id` - Accept ride
- `POST /api/drivers/complete-ride/:id` - Complete ride
- `POST /api/drivers/rate-passenger/:id` - Rate passenger
- `GET /api/drivers/wallet` - Get wallet

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

## 💾 Database Collections

MongoDB collections created automatically:

1. **users** - All user accounts (Passenger & Driver)
2. **passengers** - Passenger-specific data (via User discriminator)
3. **drivers** - Driver-specific data (via User discriminator)
4. **rides** - Ride bookings and history
5. **ratings** - User ratings and reviews
6. **messages** - In-app messages
7. **payments** - Payment records
8. **notifications** - User notifications

## 🛠️ Technology Stack Reference

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "socket.io": "^4.7.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "axios": "^1.5.0",
  "socket.io-client": "^4.7.2",
  "tailwindcss": "^3.3.3"
}
```

## 🔒 Security Layers

1. **Password Security**: Bcryptjs hashing
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: Role-based middleware (passenger/driver)
4. **Input Validation**: Phone, email, data type checks
5. **CORS**: Configured origin restrictions
6. **Error Handling**: Secure error messages

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upm-student-cab
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎯 Development Workflow

1. **Make Changes**
   - Backend: Edit files in `backend/src/`
   - Frontend: Edit files in `frontend/src/`

2. **Hot Reload**
   - Backend: Nodemon automatically restarts
   - Frontend: React automatically refreshes

3. **Test Changes**
   - Backend: Use Postman or curl
   - Frontend: Use browser dev tools

4. **Debug**
   - Backend: Check terminal logs
   - Frontend: Check browser console (F12)

## 📦 Deployment Checklist

- [ ] Update .env with production URLs
- [ ] Set NODE_ENV=production
- [ ] Change JWT_SECRET to secure value
- [ ] Configure MongoDB Atlas connection
- [ ] Set up payment gateway (Stripe/PayPal)
- [ ] Configure email service (SendGrid/Mailgun)
- [ ] Enable HTTPS certificates
- [ ] Set up domain and DNS
- [ ] Configure CORS for production domain
- [ ] Test all features in production

## 🆘 Common File Locations

**Need to understand authentication?**
- Backend: [authController.js](./backend/src/controllers/authController.js)
- Frontend: [AuthContext.js](./frontend/src/context/AuthContext.js)
- Frontend: [Login.js](./frontend/src/pages/Login.js)

**Need to modify API endpoints?**
- Routes: [backend/src/routes/](./backend/src/routes/)
- Controllers: [backend/src/controllers/](./backend/src/controllers/)

**Need to change UI?**
- Pages: [frontend/src/pages/](./frontend/src/pages/)
- Styling: [frontend/src/index.css](./frontend/src/index.css)
- Config: [frontend/tailwind.config.js](./frontend/tailwind.config.js)

**Need to modify database?**
- Models: [backend/src/models/](./backend/src/models/)

**Need to add API calls?**
- Services: [frontend/src/services/apiService.js](./frontend/src/services/apiService.js)

## 📞 File Dependencies

```
Server.js
├── Routes (all)
│   ├── Controllers
│   │   ├── Models
│   │   └── Utils/Helpers
│   └── Middleware (auth.js)
│
└── Socket.io
    └── Real-time events
```

```
App.js (Frontend)
├── Pages
│   ├── Services (apiService.js)
│   │   └── API client (api.js)
│   ├── Context (AuthContext.js)
│   └── Hooks (useAuth.js)
└── Routes (React Router)
```

## ✅ Verification Checklist

After installation, verify these work:

- [ ] Backend running: `curl http://localhost:5000/api/health`
- [ ] Frontend loads: Open http://localhost:3000
- [ ] Can register passenger
- [ ] Can register driver
- [ ] Can login with credentials
- [ ] Dashboards load correctly
- [ ] Can book a ride (passenger)
- [ ] Can view rides (driver)

## 📖 Recommended Reading Order

1. **First Time**: [INSTALLATION.md](./INSTALLATION.md)
2. **Quick Reference**: [QUICKSTART.md](./QUICKSTART.md)
3. **Understanding Features**: [README.md](./README.md)
4. **API Integration**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
5. **Code Deep Dive**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

**Document Version**: 1.0
**Last Updated**: January 16, 2024
**Total Files Created**: 39
**Status**: ✅ Complete & Ready for Development

**Start with [INSTALLATION.md](./INSTALLATION.md) for setup instructions!**
