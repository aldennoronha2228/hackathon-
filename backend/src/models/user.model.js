import { getDB } from "../lib/db.js";

const COLLECTION = "users";

const usersRef = () => getDB().collection(COLLECTION);

/**
 * Find a user by email.
 */
export const findUserByEmail = async (email) => {
  const snapshot = await usersRef().where("email", "==", email).limit(1).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { _id: doc.id, ...doc.data() };
};

/**
 * Find a user by their Firestore document ID.
 */
export const findUserById = async (userId) => {
  const doc = await usersRef().doc(userId).get();
  if (!doc.exists) return null;

  return { _id: doc.id, ...doc.data() };
};

/**
 * Create a new user and return the created document (with _id).
 */
export const createUser = async ({ fullName, email, password }) => {
  const docRef = await usersRef().add({
    fullName,
    email,
    password,
    profilePic: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    _id: docRef.id,
    fullName,
    email,
    profilePic: "",
  };
};

export default {
  findUserByEmail,
  findUserById,
  createUser,
};