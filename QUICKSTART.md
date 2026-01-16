# Quick Start Guide - UPM Student Cab

This guide will help you get the UPM Student Cab application running locally.

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://docs.mongodb.com/manual/installation/) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** (optional)

## Step 1: Clone/Download Project

If you have the project files, navigate to the project root directory.

## Step 2: Setup Backend

### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 2.2 Create Environment File

```bash
cp .env.example .env
```

### 2.3 Edit .env File

Update the following values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upm-student-cab
JWT_SECRET=your_secure_secret_key_123
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas users:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/upm-student-cab?retryWrites=true&w=majority
```

### 2.4 Start MongoDB (if using local)

**macOS/Linux:**
```bash
mongod
```

**Windows:**
```bash
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### 2.5 Start Backend Server

```bash
npm run dev
```

You should see:
```
MongoDB connected: localhost
Server running on port 5000
```

## Step 3: Setup Frontend

### 3.1 In a New Terminal, Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3.2 Create Environment File

```bash
cp .env.example .env
```

### 3.3 Edit .env File

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3.4 Start Frontend Development Server

```bash
npm start
```

The application should automatically open at `http://localhost:3000`

## Step 4: Test the Application

### Create Test Accounts

**Passenger Account:**
1. Click "Register"
2. Select "Passenger"
3. Fill in details:
   - Username: `passenger1`
   - Password: `password123`
   - First Name: `John`
   - Last Name: `Doe`
   - Phone: `+60123456789`
4. Click Register

**Driver Account:**
1. Click "Register"
2. Select "Driver"
3. Fill in details:
   - Username: `driver1`
   - Password: `password123`
   - First Name: `Jane`
   - Last Name: `Smith`
   - Phone: `+60187654321`
   - Car Model: `Toyota Vios`
   - Car Color: `Blue`
   - Registration: `WQW1234`
4. Click Register

### Test Booking Flow

1. **Login as Passenger**
   - Search for ride from one location to another
   - Click "Search Rides"
   - View fare estimate
   - Click "Confirm Booking"

2. **Login as Driver** (in another browser/incognito tab)
   - Toggle "Active" status
   - View available rides
   - Click "Accept Ride"
   - Update status during ride
   - Complete ride

## Stopping the Application

Press `Ctrl+C` in each terminal to stop the servers.

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas, whitelist your IP address

### Issue: Port Already in Use

**Solution:**
```bash
# Kill process using port 5000 (macOS/Linux)
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Issue: CORS Errors

**Solution:**
- Check FRONTEND_URL in backend .env
- Ensure backend is running before frontend
- Clear browser cache

### Issue: Cannot find modules

**Solution:**
```bash
# Reinstall dependencies
rm package-lock.json
npm install
```

## Next Steps

1. **Explore the Dashboards**
   - Test ride booking feature
   - Try messaging between driver and passenger
   - Test rating system

2. **Customize the Application**
   - Update brand colors in `tailwind.config.js`
   - Modify API endpoints as needed
   - Add additional features

3. **Deploy to Production**
   - Use services like Heroku, AWS, or DigitalOcean
   - Configure proper environment variables
   - Set up SSL certificates
   - Implement payment gateways

## Useful Commands

### Backend
```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

### Frontend
```bash
# Development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Support

If you encounter any issues, please check:
1. The README.md in the project root
2. Ensure all prerequisites are installed
3. Check that all environment variables are set correctly
4. Verify both backend and frontend are running

---

**Congratulations!** Your UPM Student Cab application is now ready for development and testing.
