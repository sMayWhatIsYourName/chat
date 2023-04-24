import { db } from './init.js';
import { query, collection, addDoc, getDoc, where, getDocs } from 'firebase/firestore';
import { error } from '../utils/error.js';

const usersCollection = collection(db, "users");

export const register = async (data) => {
  const isUserUniqueQuery = query(usersCollection, where('username', '==', data.username));
  const isUserUnique = await getDocs(isUserUniqueQuery);

  if (isUserUnique.size > 0) {
    throw error('409');
  }

  const userRef = await addDoc(usersCollection, data);
  const userSnapshot = await getDoc(userRef);
  return userSnapshot.data();
};

export const login = async (data) => {
  const userQuery = query(usersCollection, where('username', '==', data.username), where('password', '==', data.password));
  const userSnapshot = await getDocs(userQuery);
  if (!(userSnapshot.size === 1)) {
    throw error('404');
  }
  const newUserObj = {
    ...userSnapshot.docs[0].data(),
    id: userSnapshot.docs[0].id
  }
  if (!newUserObj.isActive) {
    throw error('403');
  }

  return newUserObj;
};