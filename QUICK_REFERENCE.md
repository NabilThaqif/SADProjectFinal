# UPM Student Cab - Quick Reference Guide

## 🚀 5-Minute Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with Firebase credentials (see SETUP_GUIDE.md)
npm run dev
```
**Backend runs at**: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env.local with Firebase config (see SETUP_GUIDE.md)
npm start
```
**Frontend runs at**: `http://localhost:3000`

### 3. Test Login
- **Passenger**: ahmad@example.com / password123
- **Driver**: mohammad@example.com / password123

---

## 📱 Application Overview

### For Passengers
1. Login or Register
2. View "Book Ride" tab
3. Enter pickup and dropoff locations
4. Click "Search Rides"
5. View estimated fare (RM 18.50 for example route)
6. Click "Confirm & Book"
7. View live driver location
8. Rate driver after ride completion

### For Drivers
1. Login or Register (add vehicle info)
2. Toggle "Online" status at top
3. View ride offers in "Ride Offers" tab
4. Accept or reject each offer
5. View passenger details
6. Confirm pickup when arrived
7. Complete ride and confirm payment
8. Rate passenger

---

## 🗂️ Project Structure Quick View

```
Backend:
├── controllers/ → Handle API logic
├── routes/ → Define API endpoints
├── middleware/ → Auth & validation
├── utils/ → Firebase helpers
└── seeds/ → Dummy test data

Frontend:
├── pages/ → Full page components
├── services/ → API call functions
├── config/ → Firebase setup
└── App.js → Routing & main component
```

---

## 🔑 Test Accounts

| User | Email | Password |
|------|-------|----------|
| Passenger 1 | ahmad@example.com | password123 |
| Passenger 2 | nur@example.com | password123 |
| Driver 1 | mohammad@example.com | password123 |
| Driver 2 | fatimah@example.com | password123 |

### Their Details:
- **Ahmad Hassan**: 15 completed rides, 4.5 ⭐
- **Mohammad Ali**: 45 completed rides, 4.7 ⭐, Toyota Vios
- **Fatimah Ibrahim**: 38 completed rides, 4.6 ⭐, Perodua Myvi

---

## 💻 Core Features Implemented

### Authentication ✅
- Registration with validation
- Email/password login
- JWT token system
- Phone verification
- Account type selection

### Passenger Features ✅
- Search rides
- Book rides with fare calculation
- View ride history
- Real-time driver tracking
- In-app messaging
- Rate drivers
- Profile management
- Payment history

### Driver Features ✅
- Online/offline status toggle
- Receive ride offers
- Accept/reject rides
- Pickup status management
- View passenger details
- Rate passengers
- Earnings tracking
- Profile management
- Vehicle information

### Payment ✅
- Card and cash payment options
- Automatic wallet transfers
- Payment history
- Transaction records

---

## 🎨 Design System

### Colors
- **Blue**: Primary actions, links
- **Green**: Success, active status
- **Red**: Errors, cancel, reject
- **Yellow**: Warnings, ratings
- **Gray**: Secondary text, borders

### Typography
- Headers: Bold, 24px-48px
- Body: Regular, 14px-16px
- Buttons: Semibold, 14px-16px

### Spacing
- Padding: 4px, 8px, 16px, 24px, 32px
- Gaps: 8px, 16px, 24px, 32px

---

## 📡 API Endpoints Summary

### Auth
- `POST /api/auth/register` → Create account
- `POST /api/auth/login` → Login
- `GET /api/auth/profile` → Get user profile

### Passenger
- `POST /api/passengers/search-rides` → Find rides
- `POST /api/passengers/book-ride` → Book ride
- `GET /api/passengers/rides` → Get ride history
- `POST /api/passengers/rate-driver` → Rate driver

### Driver
- `PUT /api/drivers/status` → Toggle online
- `POST /api/drivers/accept-ride` → Accept offer
- `POST /api/drivers/update-pickup-status` → Confirm pickup
- `GET /api/drivers/rides` → Get ride history

---

## 🚗 Fare Calculation

```
Base Fare: RM 3.00
Per KM: RM 1.50

Examples:
- 5 km: RM 3.00 + (5 × 1.50) = RM 10.50
- 10 km: RM 3.00 + (10 × 1.50) = RM 18.50
- 15 km: RM 3.00 + (15 × 1.50) = RM 25.50
```

---

## 📦 Database Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| users | Core user data | uid, email, accountType |
| drivers | Driver-specific | carModel, isActive, rating |
| passengers | Passenger-specific | cardDetails, emergencyContact |
| rides | Ride bookings | pickupLocation, status, fare |
| payments | Transactions | amount, paymentMethod, status |
| ratings | Reviews | rating, comment, ratedBy |
| messages | Chat | rideId, senderId, message |
| notifications | Alerts | userId, type, message |

---

## 🔧 Environment Variables Needed

### Backend (.env)
```
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
JWT_SECRET=your_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Firebase Connection Error
- Verify .env variables are correct
- Check Firebase project is active
- Ensure Firestore database exists

### API Not Found (404)
- Check backend is running
- Verify API URL in frontend .env
- Check endpoint names match

### Can't Login
- Use test account: ahmad@example.com
- Password: password123
- Check database has users collection

---

## 📱 Responsive Breakpoints

| Device | Width | Behavior |
|--------|-------|----------|
| Mobile | < 768px | 1 column, stacked |
| Tablet | 768-1024px | 2 columns |
| Desktop | > 1024px | 3-4 columns |

---

## ✨ Key Technologies

**Backend**
- Node.js + Express
- Firebase + Firestore
- JWT + bcryptjs
- Socket.io

**Frontend**
- React 18
- React Router
- Tailwind CSS
- Axios

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Complete installation instructions
2. **IMPLEMENTATION_GUIDE.md** - Database and technical details
3. **CSS_STYLING_GUIDE.md** - Tailwind CSS reference
4. **PROJECT_COMPLETION_SUMMARY.md** - Full project summary

---

## 🎯 Next Steps for Deployment

1. Get Firebase credentials from Google Cloud Console
2. Set up environment variables on Vercel
3. Connect GitHub repository to Vercel
4. Deploy backend and frontend
5. Update frontend API URL to production backend
6. Test all features on live site

---

## 📞 Common Actions

### How to Boot the App
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

### How to Seed Test Data
```bash
cd backend
node src/seeds/dummyData.js
```

### How to Get Firebase Credentials
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate Private Key
4. Copy JSON values to .env

### How to Add New Features
1. Create controller in backend
2. Add routes
3. Create service in frontend
4. Add component/page
5. Import and use in App.js

---

## ⚡ Performance Tips

- Use `md:` and `lg:` prefixes for responsive design
- Keep components small and reusable
- Use Firestore indexes for frequently queried fields
- Implement pagination for large datasets
- Cache user data in localStorage

---

## 🔒 Security Features

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Firebase Auth
✅ Environment variable protection
✅ CORS enabled
✅ Input validation
✅ Protected API routes

---

## 📊 Database Sample Size

**Included Test Data:**
- 4 user accounts
- 2 driver profiles
- 2 passenger profiles
- 3 completed rides
- 3 payment records
- 3 ratings
- 3+ messages
- 2+ notifications

---

## 🎓 Learning Resources

**For Tailwind CSS:**
- tailwindcss.com/docs

**For Firebase:**
- firebase.google.com/docs

**For React:**
- react.dev

**For Express:**
- expressjs.com

---

## ✅ Feature Checklist

- [x] User registration and login
- [x] Passenger ride booking
- [x] Driver ride management
- [x] Fare calculation
- [x] Payment tracking
- [x] Rating system
- [x] Messaging
- [x] Real-time updates
- [x] Profile management
- [x] Responsive design
- [x] Test data included
- [x] Full documentation

---

## 🚀 You're All Set!

This complete implementation includes:
- ✅ Full backend with Firebase
- ✅ Complete frontend with Tailwind CSS
- ✅ All required features
- ✅ Test accounts and dummy data
- ✅ Comprehensive documentation
- ✅ Production-ready code

**Start with SETUP_GUIDE.md to get running in 5 minutes!**

---

*For detailed information, refer to the comprehensive guides in the project documentation.*
