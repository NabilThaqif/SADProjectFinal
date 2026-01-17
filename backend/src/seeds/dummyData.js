const { db, dbHelpers, collections } = require('../utils/database');
const bcrypt = require('bcryptjs');

// Dummy data for testing
const dummyData = {
  users: [
    {
      uid: 'passenger1',
      firstName: 'Ahmad',
      lastName: 'Hassan',
      email: 'ahmad@example.com',
      phoneNumber: '+60123456789',
      accountType: 'passenger',
      password: 'password123',
      profilePicture: null,
      rating: 4.5,
      totalRatings: 10,
    },
    {
      uid: 'passenger2',
      firstName: 'Nur',
      lastName: 'Azahra',
      email: 'nur@example.com',
      phoneNumber: '+60187654321',
      accountType: 'passenger',
      password: 'password123',
      profilePicture: null,
      rating: 4.8,
      totalRatings: 15,
    },
    {
      uid: 'driver1',
      firstName: 'Mohammad',
      lastName: 'Ali',
      email: 'mohammad@example.com',
      phoneNumber: '+60111111111',
      accountType: 'driver',
      password: 'password123',
      profilePicture: null,
      rating: 4.7,
      totalRatings: 25,
    },
    {
      uid: 'driver2',
      firstName: 'Fatimah',
      lastName: 'Ibrahim',
      email: 'fatimah@example.com',
      phoneNumber: '+60122222222',
      accountType: 'driver',
      password: 'password123',
      profilePicture: null,
      rating: 4.6,
      totalRatings: 20,
    },
  ],

  drivers: [
    {
      uid: 'driver1',
      firstName: 'Mohammad',
      lastName: 'Ali',
      email: 'mohammad@example.com',
      phoneNumber: '+60111111111',
      carModel: 'Toyota Vios',
      carColor: 'Silver',
      carRegistration: 'WXY1234',
      licenseNumber: 'D-1234567',
      isActive: true,
      bankAccountNumber: '1234567890',
      bankAccountName: 'Mohammad Ali',
      bankName: 'Maybank',
      carPicture: null,
      walletBalance: 250.50,
      completedRides: 45,
      rating: 4.7,
      totalRatings: 25,
      currentLocation: {
        latitude: 3.1219,
        longitude: 101.6869,
      },
    },
    {
      uid: 'driver2',
      firstName: 'Fatimah',
      lastName: 'Ibrahim',
      email: 'fatimah@example.com',
      phoneNumber: '+60122222222',
      carModel: 'Perodua Myvi',
      carColor: 'Red',
      carRegistration: 'ABC5678',
      licenseNumber: 'D-9876543',
      isActive: true,
      bankAccountNumber: '0987654321',
      bankAccountName: 'Fatimah Ibrahim',
      bankName: 'CIMB',
      carPicture: null,
      walletBalance: 180.75,
      completedRides: 38,
      rating: 4.6,
      totalRatings: 20,
      currentLocation: {
        latitude: 3.1289,
        longitude: 101.6964,
      },
    },
  ],

  passengers: [
    {
      uid: 'passenger1',
      firstName: 'Ahmad',
      lastName: 'Hassan',
      email: 'ahmad@example.com',
      phoneNumber: '+60123456789',
      cardDetails: {
        cardNumber: '****1234',
        cardHolder: 'Ahmad Hassan',
        expiryDate: '12/25',
        cvv: '***',
      },
      emergencyContact: {
        name: 'Hassan Ali',
        phone: '+60133333333',
      },
      completedRides: 15,
      rating: 4.5,
      totalRatings: 10,
    },
    {
      uid: 'passenger2',
      firstName: 'Nur',
      lastName: 'Azahra',
      email: 'nur@example.com',
      phoneNumber: '+60187654321',
      cardDetails: {
        cardNumber: '****5678',
        cardHolder: 'Nur Azahra',
        expiryDate: '06/26',
        cvv: '***',
      },
      emergencyContact: {
        name: 'Aminah Mahmud',
        phone: '+60144444444',
      },
      completedRides: 22,
      rating: 4.8,
      totalRatings: 15,
    },
  ],

  rides: [
    {
      rideId: 'ride1',
      passengerId: 'passenger1',
      driverId: 'driver1',
      pickupLocation: {
        address: 'UPM Main Gate',
        latitude: 3.1219,
        longitude: 101.6869,
      },
      dropoffLocation: {
        address: 'Pavilion KL',
        latitude: 3.1575,
        longitude: 101.6804,
      },
      pickupTime: new Date(Date.now() - 3600000),
      estimatedFare: 18.5,
      actualFare: 18.5,
      rideStatus: 'completed',
      pickupStatus: 'successful',
      paymentMethod: 'card',
      paymentStatus: 'completed',
      pickedUpAt: new Date(Date.now() - 3500000),
      completedAt: new Date(Date.now() - 2000000),
      rating: {
        drivingSkills: 5,
        friendliness: 4,
        carCleanliness: 5,
        punctuality: 5,
      },
    },
    {
      rideId: 'ride2',
      passengerId: 'passenger2',
      driverId: 'driver2',
      pickupLocation: {
        address: 'Sungai Long LRT Station',
        latitude: 3.1289,
        longitude: 101.6964,
      },
      dropoffLocation: {
        address: 'Mid Valley Megamall',
        latitude: 3.1158,
        longitude: 101.6788,
      },
      pickupTime: new Date(Date.now() - 7200000),
      estimatedFare: 12.0,
      actualFare: 12.0,
      rideStatus: 'completed',
      pickupStatus: 'successful',
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      pickedUpAt: new Date(Date.now() - 7100000),
      completedAt: new Date(Date.now() - 6000000),
      rating: {
        drivingSkills: 4,
        friendliness: 5,
        carCleanliness: 4,
        punctuality: 4,
      },
    },
    {
      rideId: 'ride3',
      passengerId: 'passenger1',
      driverId: 'driver2',
      pickupLocation: {
        address: 'One Utama',
        latitude: 3.1654,
        longitude: 101.5864,
      },
      dropoffLocation: {
        address: 'Kota Damansara',
        latitude: 3.1975,
        longitude: 101.5757,
      },
      pickupTime: new Date(Date.now() - 10800000),
      estimatedFare: 15.5,
      actualFare: 15.5,
      rideStatus: 'completed',
      pickupStatus: 'successful',
      paymentMethod: 'card',
      paymentStatus: 'completed',
      pickedUpAt: new Date(Date.now() - 10700000),
      completedAt: new Date(Date.now() - 9300000),
      rating: {
        drivingSkills: 5,
        friendliness: 4,
        carCleanliness: 5,
        punctuality: 5,
      },
    },
  ],

  payments: [
    {
      paymentId: 'payment1',
      rideId: 'ride1',
      passengerId: 'passenger1',
      driverId: 'driver1',
      amount: 18.5,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      cardLastFour: '1234',
      transactionDate: new Date(Date.now() - 2000000),
      description: 'UPM Main Gate to Pavilion KL',
    },
    {
      paymentId: 'payment2',
      rideId: 'ride2',
      passengerId: 'passenger2',
      driverId: 'driver2',
      amount: 12.0,
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      transactionDate: new Date(Date.now() - 6000000),
      description: 'Sungai Long LRT Station to Mid Valley Megamall',
    },
    {
      paymentId: 'payment3',
      rideId: 'ride3',
      passengerId: 'passenger1',
      driverId: 'driver2',
      amount: 15.5,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      cardLastFour: '1234',
      transactionDate: new Date(Date.now() - 9300000),
      description: 'One Utama to Kota Damansara',
    },
  ],

  ratings: [
    {
      ratingId: 'rating1',
      rideId: 'ride1',
      ratedBy: 'passenger1',
      ratedUser: 'driver1',
      ratingType: 'passenger_to_driver',
      rating: 4.75,
      drivingSkills: 5,
      friendliness: 4,
      carCleanliness: 5,
      punctuality: 5,
      comment: 'Great driver, safe and friendly',
      ratedAt: new Date(Date.now() - 1900000),
    },
    {
      ratingId: 'rating2',
      rideId: 'ride1',
      ratedBy: 'driver1',
      ratedUser: 'passenger1',
      ratingType: 'driver_to_passenger',
      rating: 5.0,
      punctuality: 5,
      cleanliness: 5,
      manners: 5,
      comment: 'Excellent passenger, very courteous',
      ratedAt: new Date(Date.now() - 1850000),
    },
    {
      ratingId: 'rating3',
      rideId: 'ride2',
      ratedBy: 'passenger2',
      ratedUser: 'driver2',
      ratingType: 'passenger_to_driver',
      rating: 4.33,
      drivingSkills: 4,
      friendliness: 5,
      carCleanliness: 4,
      punctuality: 4,
      comment: 'Friendly driver, good conversation',
      ratedAt: new Date(Date.now() - 5900000),
    },
  ],

  messages: [
    {
      messageId: 'msg1',
      rideId: 'ride1',
      senderId: 'passenger1',
      recipientId: 'driver1',
      message: 'Hi, I will be at the pickup location in 5 minutes',
      timestamp: new Date(Date.now() - 3400000),
      isRead: true,
    },
    {
      messageId: 'msg2',
      rideId: 'ride1',
      senderId: 'driver1',
      recipientId: 'passenger1',
      message: 'Okay, I am on my way. Will be there in 3 minutes.',
      timestamp: new Date(Date.now() - 3350000),
      isRead: true,
    },
    {
      messageId: 'msg3',
      rideId: 'ride1',
      senderId: 'driver1',
      recipientId: 'passenger1',
      message: 'I have arrived at the location',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
    },
  ],

  notifications: [
    {
      notificationId: 'notif1',
      userId: 'passenger1',
      type: 'driver_arrived',
      title: 'Driver Arrived',
      message: 'Your driver Mohammad has arrived at the pickup location',
      rideId: 'ride1',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
    },
    {
      notificationId: 'notif2',
      userId: 'driver1',
      type: 'ride_accepted',
      title: 'Ride Accepted',
      message: 'Your ride booking has been accepted by driver Mohammad',
      rideId: 'ride1',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
  ],
};

// Seed function to populate Firestore with dummy data
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Hash passwords for users
    for (let user of dummyData.users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Add users
    for (let user of dummyData.users) {
      await dbHelpers.createDocument(collections.users, user.uid, user);
      console.log(`Created user: ${user.email}`);
    }

    // Add drivers
    for (let driver of dummyData.drivers) {
      await dbHelpers.createDocument(collections.drivers, driver.uid, driver);
      console.log(`Created driver: ${driver.email}`);
    }

    // Add passengers
    for (let passenger of dummyData.passengers) {
      await dbHelpers.createDocument(collections.passengers, passenger.uid, passenger);
      console.log(`Created passenger: ${passenger.email}`);
    }

    // Add rides
    for (let ride of dummyData.rides) {
      await dbHelpers.createDocument(collections.rides, ride.rideId, ride);
      console.log(`Created ride: ${ride.rideId}`);
    }

    // Add payments
    for (let payment of dummyData.payments) {
      await dbHelpers.createDocument(collections.payments, payment.paymentId, payment);
      console.log(`Created payment: ${payment.paymentId}`);
    }

    // Add ratings
    for (let rating of dummyData.ratings) {
      await dbHelpers.createDocument(collections.ratings, rating.ratingId, rating);
      console.log(`Created rating: ${rating.ratingId}`);
    }

    // Add messages
    for (let message of dummyData.messages) {
      await dbHelpers.createDocument(collections.messages, message.messageId, message);
      console.log(`Created message: ${message.messageId}`);
    }

    // Add notifications
    for (let notification of dummyData.notifications) {
      await dbHelpers.createDocument(
        collections.notifications,
        notification.notificationId,
        notification
      );
      console.log(`Created notification: ${notification.notificationId}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase, dummyData };
