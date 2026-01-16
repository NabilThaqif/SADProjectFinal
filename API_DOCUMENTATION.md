# API Documentation - UPM Student Cab

Complete API reference for the UPM Student Cab backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response (2xx)

```json
{
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error Response (4xx, 5xx)

```json
{
  "message": "Error description",
  "status": 400
}
```

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+60123456789",
  "accountType": "passenger",
  "carModel": "Toyota Vios",      // Required for drivers
  "carColor": "Blue",             // Required for drivers
  "carRegistrationNumber": "WQW1234" // Required for drivers
}
```

**Response:**
```json
{
  "message": "Passenger registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "accountType": "passenger"
  }
}
```

**Status Code:** 201 Created

---

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "accountType": "passenger"
  }
}
```

**Status Code:** 200 OK

---

### Get Current User Profile

**Endpoint:** `GET /auth/me`

**Description:** Get authenticated user's profile information

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+60123456789",
    "accountType": "passenger",
    "rating": 4.5,
    "totalRatings": 12,
    "profilePicture": "url_to_picture"
  }
}
```

**Status Code:** 200 OK

---

### Verify Phone Number

**Endpoint:** `POST /auth/verify-phone`

**Description:** Verify phone number with OTP

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "message": "Phone verified successfully",
  "user": { /* user object */ }
}
```

**Status Code:** 200 OK

---

## Passenger Endpoints

All passenger endpoints require `Authorization` header and `accountType: passenger`

### Update Profile

**Endpoint:** `PUT /passengers/profile`

**Description:** Update passenger profile information

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phoneNumber": "+60123456789",
  "profilePicture": "base64_image_data",
  "debitCreditCard": {
    "cardNumber": "4111111111111111",
    "cardholderName": "John Smith",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "passenger": { /* updated passenger data */ }
}
```

**Status Code:** 200 OK

---

### Search Ride

**Endpoint:** `POST /passengers/search-ride`

**Description:** Search for available rides

**Request Body:**
```json
{
  "pickupLocation": "Kuala Lumpur City Centre",
  "pickupCoordinates": [101.6964, 3.1390],
  "dropoffLocation": "Petronas Twin Towers",
  "dropoffCoordinates": [101.5901, 3.1478]
}
```

**Response:**
```json
{
  "distance": 12.5,
  "fare": 14.50,
  "estimatedDuration": 18,
  "nearbyDrivers": 5
}
```

**Status Code:** 200 OK

---

### Book Ride

**Endpoint:** `POST /passengers/book-ride`

**Description:** Book a ride

**Request Body:**
```json
{
  "pickupLocation": "Kuala Lumpur City Centre",
  "pickupCoordinates": [101.6964, 3.1390],
  "dropoffLocation": "Petronas Twin Towers",
  "dropoffCoordinates": [101.5901, 3.1478],
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "message": "Ride booking created",
  "ride": {
    "_id": "507f1f77bcf86cd799439012",
    "passenger": { /* passenger details */ },
    "fare": 14.50,
    "distance": 12.5,
    "status": "pending",
    "paymentMethod": "card"
  }
}
```

**Status Code:** 201 Created

---

### Get Ride History

**Endpoint:** `GET /passengers/ride-history`

**Description:** Get passenger's ride history

**Response:**
```json
{
  "rides": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "driver": { /* driver details */ },
      "pickupLocation": { "address": "KL City", "coordinates": [...] },
      "dropoffLocation": { "address": "Petronas", "coordinates": [...] },
      "fare": 14.50,
      "status": "completed",
      "requestedAt": "2024-01-16T10:30:00Z"
    }
  ]
}
```

**Status Code:** 200 OK

---

### Rate Driver

**Endpoint:** `POST /passengers/rate-driver/:rideId`

**Description:** Rate a driver after ride completion

**Request Body:**
```json
{
  "drivingSkills": 5,
  "friendliness": 4,
  "carCleanliness": 5,
  "punctuality": 4,
  "comment": "Great ride, very professional driver"
}
```

**Response:**
```json
{
  "message": "Driver rated successfully",
  "rating": {
    "_id": "507f1f77bcf86cd799439013",
    "overallRating": 4.5,
    "comment": "Great ride, very professional driver"
  }
}
```

**Status Code:** 201 Created

---

## Driver Endpoints

All driver endpoints require `Authorization` header and `accountType: driver`

### Update Profile

**Endpoint:** `PUT /drivers/profile`

**Description:** Update driver profile and vehicle information

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phoneNumber": "+60187654321",
  "carModel": "Honda Civic",
  "carColor": "Red",
  "carRegistrationNumber": "WQW1235",
  "bankAccountNumber": "1234567890",
  "bankAccountHolder": "Jane Smith",
  "bankName": "Maybank"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "driver": { /* updated driver data */ }
}
```

**Status Code:** 200 OK

---

### Set Availability

**Endpoint:** `PUT /drivers/status`

**Description:** Set driver availability status

**Request Body:**
```json
{
  "isAvailable": true
}
```

**Response:**
```json
{
  "message": "Driver status updated to active",
  "driver": { /* driver data */ }
}
```

**Status Code:** 200 OK

---

### Update Location

**Endpoint:** `PUT /drivers/location`

**Description:** Update driver's current location

**Request Body:**
```json
{
  "latitude": 3.1390,
  "longitude": 101.6964
}
```

**Response:**
```json
{
  "message": "Location updated",
  "driver": { /* driver data */ }
}
```

**Status Code:** 200 OK

---

### Get Available Rides

**Endpoint:** `GET /drivers/available-rides`

**Description:** Get list of available ride requests nearby

**Response:**
```json
{
  "availableRides": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "passenger": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "rating": 4.5
      },
      "pickupLocation": { "address": "KL City", "coordinates": [...] },
      "dropoffLocation": { "address": "Petronas", "coordinates": [...] },
      "fare": 14.50,
      "distance": 12.5,
      "estimatedDuration": 18
    }
  ]
}
```

**Status Code:** 200 OK

---

### Accept Ride

**Endpoint:** `POST /drivers/accept-ride/:rideId`

**Description:** Accept a ride request

**Response:**
```json
{
  "message": "Ride accepted successfully",
  "ride": { /* ride details */ }
}
```

**Status Code:** 200 OK

---

### Reject Ride

**Endpoint:** `POST /drivers/reject-ride/:rideId`

**Description:** Reject a ride request

**Response:**
```json
{
  "message": "Ride rejected",
  "ride": { /* ride details */ }
}
```

**Status Code:** 200 OK

---

### Update Pickup Status

**Endpoint:** `PUT /drivers/pickup-status/:rideId`

**Description:** Update pickup status

**Request Body:**
```json
{
  "pickupStatus": "successful"
}
```

**Response:**
```json
{
  "message": "Pickup status updated",
  "ride": { /* ride details */ }
}
```

**Status Code:** 200 OK

---

### Complete Ride

**Endpoint:** `POST /drivers/complete-ride/:rideId`

**Description:** Mark ride as completed and process payment

**Request Body:**
```json
{
  "paymentReceivedMethod": "cash"
}
```

**Response:**
```json
{
  "message": "Ride completed",
  "ride": { /* ride details */ },
  "payment": { /* payment record */ }
}
```

**Status Code:** 200 OK

---

### Rate Passenger

**Endpoint:** `POST /drivers/rate-passenger/:rideId`

**Description:** Rate a passenger after ride completion

**Request Body:**
```json
{
  "punctuality": 5,
  "cleanliness": 4,
  "manners": 5,
  "comment": "Excellent passenger, very polite"
}
```

**Response:**
```json
{
  "message": "Passenger rated successfully",
  "rating": { /* rating details */ }
}
```

**Status Code:** 201 Created

---

### Get Ride History

**Endpoint:** `GET /drivers/ride-history`

**Description:** Get driver's completed rides

**Response:**
```json
{
  "rides": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "passenger": { /* passenger details */ },
      "fare": 14.50,
      "status": "completed",
      "completedAt": "2024-01-16T10:45:00Z"
    }
  ]
}
```

**Status Code:** 200 OK

---

### Get Wallet

**Endpoint:** `GET /drivers/wallet`

**Description:** Get driver's wallet information

**Response:**
```json
{
  "walletBalance": 250.50,
  "totalEarnings": 1500.00
}
```

**Status Code:** 200 OK

---

## Message Endpoints

### Send Message

**Endpoint:** `POST /messages`

**Description:** Send a message during a ride

**Request Body:**
```json
{
  "ride": "507f1f77bcf86cd799439012",
  "receiver": "507f1f77bcf86cd799439011",
  "message": "I'm on my way"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "data": { /* message details */ }
}
```

**Status Code:** 201 Created

---

### Get Messages

**Endpoint:** `GET /messages/:rideId`

**Description:** Get all messages for a specific ride

**Response:**
```json
{
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "sender": { /* user details */ },
      "message": "I'm on my way",
      "createdAt": "2024-01-16T10:30:00Z"
    }
  ]
}
```

**Status Code:** 200 OK

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

Endpoints returning lists support pagination:

```
GET /passengers/ride-history?page=1&limit=10
```

---

## Best Practices

1. Always include `Content-Type: application/json` header
2. Store JWT tokens securely (httpOnly cookies recommended)
3. Validate all user inputs before sending
4. Handle errors gracefully
5. Implement retry logic for failed requests
6. Cache responses where appropriate

---

**Last Updated:** January 2024
