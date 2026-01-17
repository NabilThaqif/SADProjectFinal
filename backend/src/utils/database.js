const { db, auth } = require('../config/firebase');

// Firestore collection references
const collections = {
  users: 'users',
  drivers: 'drivers',
  passengers: 'passengers',
  rides: 'rides',
  payments: 'payments',
  ratings: 'ratings',
  messages: 'messages',
  notifications: 'notifications',
};

// Helper functions for Firestore operations
const dbHelpers = {
  // Create a new document
  async createDocument(collection, docId, data) {
    try {
      await db.collection(collection).doc(docId).set({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docId, ...data };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  },

  // Get a document by ID
  async getDocument(collection, docId) {
    try {
      const doc = await db.collection(collection).doc(docId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Error getting document: ${error.message}`);
    }
  },

  // Update a document
  async updateDocument(collection, docId, data) {
    try {
      await db.collection(collection).doc(docId).update({
        ...data,
        updatedAt: new Date(),
      });
      return { id: docId, ...data };
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  },

  // Delete a document
  async deleteDocument(collection, docId) {
    try {
      await db.collection(collection).doc(docId).delete();
      return { id: docId };
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  },

  // Query documents
  async queryDocuments(collection, field, operator, value) {
    try {
      const query = db.collection(collection).where(field, operator, value);
      const snapshot = await query.get();
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      throw new Error(`Error querying documents: ${error.message}`);
    }
  },

  // Get all documents from a collection
  async getAllDocuments(collection, limit = 100) {
    try {
      const snapshot = await db.collection(collection).limit(limit).get();
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      throw new Error(`Error getting all documents: ${error.message}`);
    }
  },
};

module.exports = {
  db,
  auth,
  collections,
  dbHelpers,
};
