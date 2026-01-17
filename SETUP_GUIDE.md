# UPM Student Cab - Installation & Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Firebase Account with Firestore enabled
- VS Code
- Vercel Account (for deployment)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Firebase
Create a `.env` file in the `backend` folder:

```
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_cert_url
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development
```

### 3. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file and copy the values to `.env`

### 4. Initialize Database with Dummy Data
```bash
# Run this once to seed the database
node src/seeds/dummyData.js
```

### 5. Start Backend Server
```bash
npm run dev
```
Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Firebase & API
Create a `.env.local` file in the `frontend` folder:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Start Frontend Server
```bash
npm start
```
Application will open at `http://localhost:3000`

## Test Accounts

### Passenger Account
- Email: `ahmad@example.com`
- Password: `password123`

### Driver Account
- Email: `mohammad@example.com`
- Password: `password123`

## Deployment to Vercel

### Backend Deployment
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import project from GitHub
4. Add environment variables
5. Deploy

### Frontend Deployment
1. Update API URL in `.env.local` to production backend
2. Deploy same way as backend

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/verify-phone` - Verify phone number

### Passenger Routes
- `GET /api/passengers/profile` - Get passenger profile
- `PUT /api/passengers/profile` - Update passenger profile
- `POST /api/passengers/search-rides` - Search available rides
- `POST /api/passengers/book-ride` - Book a ride
- `POST /api/passengers/cancel-ride` - Cancel ride
- `GET /api/passengers/rides` - Get passenger rides
- `POST /api/passengers/rate-driver` - Rate driver

### Driver Routes
- `GET /api/drivers/profile` - Get driver profile
- `PUT /api/drivers/profile` - Update driver profile
- `PUT /api/drivers/status` - Toggle driver status
- `GET /api/drivers/available` - Get available drivers
- `POST /api/drivers/accept-ride` - Accept ride offer
- `POST /api/drivers/reject-ride` - Reject ride offer
- `POST /api/drivers/update-pickup-status` - Update pickup status
- `GET /api/drivers/rides` - Get driver rides
- `POST /api/drivers/rate-passenger` - Rate passenger
- `POST /api/drivers/complete-ride` - Complete ride

## Dummy Data Included

### Test Users
- 2 Passenger accounts
- 2 Driver accounts

### Sample Data
- 3 Completed rides
- 3 Payments (card and cash)
- 3 Ratings
- Messages and notifications

## Features Implemented

### Passenger Features
✅ User registration and login
✅ Profile management
✅ Search and book rides
✅ View ride history
✅ Rate drivers
✅ Real-time messaging
✅ Payment methods management

### Driver Features
✅ User registration and login
✅ Profile management  
✅ Online/offline status toggle
✅ Accept/reject ride offers
✅ Real-time location tracking
✅ Pickup status management
✅ Payment confirmation
✅ Rate passengers
✅ Earnings tracking

## Technical Stack

**Backend:**
- Node.js/Express
- Firebase (Authentication & Firestore)
- JWT for token management
- Socket.io for real-time features

**Frontend:**
- React
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Toastify for notifications

## Troubleshooting

### Firebase Connection Issues
- Verify .env variables are correct
- Check Firebase project is active
- Ensure Firestore database is created

### API Not Connecting
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in frontend .env
- Check CORS settings in backend

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

## Support
For issues or questions, please refer to documentation files or create an issue.
