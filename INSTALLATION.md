# Installation & Setup Instructions

## System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MongoDB**: Local installation or MongoDB Atlas account
- **RAM**: Minimum 2GB
- **Storage**: Minimum 500MB free space

## Step-by-Step Installation

### Phase 1: Project Setup (5 minutes)

1. **Open Terminal/Command Prompt**
   - Navigate to the project folder:
   ```bash
   cd /path/to/"UPM Student Cab"
   ```

2. **Verify Node.js Installation**
   ```bash
   node --version
   npm --version
   ```
   Should show version numbers, not errors.

### Phase 2: Backend Setup (10 minutes)

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will take 2-3 minutes. Wait for it to complete.

3. **Create Environment File**
   ```bash
   # macOS/Linux
   cp .env.example .env
   
   # Windows (Command Prompt)
   copy .env.example .env
   
   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

4. **Edit .env File**
   Open the `.env` file in a text editor and update:
   
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/upm-student-cab
   JWT_SECRET=your_secure_random_key_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # macOS/Linux (if installed from website)
   mongod
   
   # Windows
   net start MongoDB
   # or navigate to C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe
   ```
   
   **Option B: MongoDB Atlas (Cloud)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create cluster
   - Copy connection string
   - Update MONGODB_URI in .env with your connection string

6. **Verify MongoDB Connection**
   ```bash
   # Open new terminal window and test
   mongo  # or mongosh (for newer versions)
   # Should show MongoDB shell prompt
   # Type: exit to quit
   ```

7. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   Expected output:
   ```
   MongoDB connected: localhost
   Server running on port 5000
   ```
   
   ✅ **Backend is running!**

### Phase 3: Frontend Setup (10 minutes)

1. **Open New Terminal Window** (keep backend running in first window)

2. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```
   This may take 3-5 minutes.

4. **Create Environment File**
   ```bash
   # macOS/Linux
   cp .env.example .env
   
   # Windows (Command Prompt)
   copy .env.example .env
   
   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

5. **Edit .env File**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

6. **Start Frontend Development Server**
   ```bash
   npm start
   ```
   
   Expected output:
   - Browser automatically opens at http://localhost:3000
   - Shows "UPM Student Cab" login page
   
   ✅ **Frontend is running!**

## Verify Installation

Open http://localhost:3000 in your browser. You should see:
- "UPM Student Cab" header
- Login form with username/password fields
- "Register here" link

## Test the Application

### Create First Account (Passenger)

1. Click "Register here"
2. Toggle to "Passenger"
3. Fill in form:
   - First Name: `John`
   - Last Name: `Doe`
   - Username: `johndoe`
   - Phone: `+60123456789`
   - Password: `password123`
4. Click Register
5. Should redirect to passenger dashboard

### Create Second Account (Driver)

1. Open a new browser tab or incognito window
2. Go to http://localhost:3000
3. Click "Register here"
4. Toggle to "Driver"
5. Fill in form:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Username: `janesmith`
   - Phone: `+60187654321`
   - Password: `password123`
   - Car Model: `Toyota Vios`
   - Car Color: `Blue`
   - Registration: `ABC1234`
6. Click Register
7. Should redirect to driver dashboard

### Test Ride Booking

**In Passenger Window:**
1. Enter pickup location (any text)
2. Enter dropoff location
3. Click "Search Rides"
4. Should show fare estimate
5. Click "Confirm Booking"

**In Driver Window:**
1. Click the toggle button to set "Active"
2. Should see "Available Rides" section with the booking
3. Click "Accept Ride"

✅ **Ride booked successfully!**

## Troubleshooting

### Issue: MongoDB Connection Error

**Error Message:**
```
MongoDB connection error: connect ECONNREFUSED
```

**Solution:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- For local MongoDB:
  ```bash
  # macOS
  brew services list  # Check if running
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongodb
  
  # Windows
  net start MongoDB
  ```

### Issue: Port Already in Use

**Error Message:**
```
listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill process using port 5000
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Cannot find react module

**Solution:**
```bash
# In frontend directory
rm -rf node_modules
npm install
npm start
```

### Issue: CORS error when booking

**Solution:**
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend .env
- Check REACT_APP_API_URL in frontend .env
- Restart both servers

### Issue: Login not working

**Solution:**
- Verify MongoDB is connected
- Check username and password are correct
- Check console for error messages
- Ensure backend server is running

## Opening Files in Code Editor

If using VS Code:

```bash
# Open backend in VS Code
cd backend
code .

# In another terminal, open frontend
cd frontend
code .
```

## Common Commands Reference

### Backend Commands
```bash
cd backend

npm install        # Install dependencies
npm run dev        # Start development server
npm start          # Start production server
npm test           # Run tests
```

### Frontend Commands
```bash
cd frontend

npm install        # Install dependencies
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

## Environment Variables Explained

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/upm-student-cab |
| JWT_SECRET | Token signing key | your_secret_key |
| JWT_EXPIRE | Token validity period | 7d |
| NODE_ENV | Environment mode | development |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

### Frontend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |
| REACT_APP_SOCKET_URL | WebSocket server | http://localhost:5000 |

## Next Steps After Installation

1. **Explore Dashboard**
   - Login as passenger
   - View ride booking interface
   - Check profile page

2. **Test All Features**
   - Book a ride
   - Message between accounts
   - Complete a ride
   - Rate users

3. **Review Code**
   - Check backend controllers in `backend/src/controllers/`
   - Check frontend pages in `frontend/src/pages/`
   - Read API documentation in `API_DOCUMENTATION.md`

4. **Customize**
   - Change brand colors in `tailwind.config.js`
   - Update API endpoints as needed
   - Modify database models for additional features

## Getting Help

If you encounter issues:

1. **Check Error Messages** - Look at console output carefully
2. **Verify Ports** - Ensure no other apps use 5000, 3000
3. **Check MongoDB** - Verify database is running
4. **Review Logs** - Check backend and browser console
5. **Restart Services** - Stop and restart all servers
6. **Clear Cache** - Delete node_modules and reinstall

## Performance Tips

1. **Use Modern Browser**
   - Chrome, Firefox, Safari, or Edge recommended
   - Older browsers may have compatibility issues

2. **Network Connection**
   - Good internet connection for initial npm install
   - Local network not required for running

3. **System Resources**
   - Close unnecessary applications
   - Use 64-bit operating system
   - Minimum 4GB RAM recommended

## Security Notes for Development

- Never commit .env file to version control
- Change JWT_SECRET for production
- Use environment-specific configurations
- Enable HTTPS for production
- Implement rate limiting
- Add input sanitization

## File Permissions (macOS/Linux)

If you get permission errors:

```bash
chmod +x backend/node_modules/.bin/nodemon
chmod +x frontend/node_modules/.bin/react-scripts
```

## Next: Read Documentation

- **Quick Overview**: See PROJECT_SUMMARY.md
- **Full Guide**: See README.md
- **API Reference**: See API_DOCUMENTATION.md

---

**Installation Complete!** 🎉

Your UPM Student Cab application is now ready for development and testing.

**Running Services:**
- ✅ Backend API: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ MongoDB: Connected and running

**Happy Coding! 🚀**
