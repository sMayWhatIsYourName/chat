import { db } from './init.js';
import { query, collection, addDoc, getDoc, where, getDocs } from 'firebase/firestore';
import { error } from '../utils/error.js';

const usersCollection = collection(db, "users");

export const register = async (data) => {
  const isUserUniqueQuery = query(usersCollection, where('username', '==', data.username)); // проверяем ник на уникальность
  const isUserUnique = await getDocs(isUserUniqueQuery); // проверяем ник на уникальность

  if (isUserUnique.size > 0) { // если есть хотя бы 1 пользователь в массиве - дропаем ошибку
    throw error('409');
  }

  const userRef = await addDoc(usersCollection, data); // добавляем документ с инфой о нашем пользователе
  const userSnapshot = await getDoc(userRef); // получаем этот документ для уведолмения юзера и сохранения инфы в хранилище
  return userSnapshot.data();
};

export const login = async (data) => { // авторизация (вход в учетку)
  const userQuery = query(usersCollection, where('username', '==', data.username), where('password', '==', data.password)); // ищем пользователя с переданным логином и паролем
  const userSnapshot = await getDocs(userQuery); // ищем пользователя с переданным логином и паролем
  if (userSnapshot.size !== 1) {
    throw error('404'); // говоим пользователю о том, что он ввел неверные данные
  }
  const newUserObj = { // создаем удобный объект пользователя и в дальнейшем его передадим в хранилище
    ...userSnapshot.docs[0].data(),
    id: userSnapshot.docs[0].id
  }
  if (!newUserObj.isActive) { // проверяем активирован ли польхователь
    throw error('403');
  }

  return newUserObj;
};