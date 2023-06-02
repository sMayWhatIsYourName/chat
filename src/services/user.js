import { db } from "./init.js";
import store from "../slices/index.js";
import { actions } from "../slices/userSlice.js";
import {
  query,
  collection,
  addDoc,
  getDoc,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { error } from "../utils/error.js";
import { toast } from "react-toastify";
import i18next from "i18next";

const usersCollection = collection(db, "users");

export const register = async (data) => {
  const isUserUniqueQuery = query(
    usersCollection,
    where("username", "==", data.username)
  ); // проверяем ник на уникальность
  const isUserUnique = await getDocs(isUserUniqueQuery); // проверяем ник на уникальность

  if (isUserUnique.size > 0) {
    // если есть хотя бы 1 пользователь в массиве - дропаем ошибку
    toast.error(i18next.t("errors.exist"));
    throw error("409");
  }

  await addDoc(usersCollection, data); // добавляем документ с инфой о нашем пользователе
  // const userSnapshot = await getDoc(userRef); // получаем этот документ для уведолмения юзера и сохранения инфы в хранилище
  toast.success(i18next.t("success.register"));
};

export const login = async (data) => {
  // авторизация (вход в учетку)
  const userQuery = query(
    usersCollection,
    where("username", "==", data.username),
    where("password", "==", data.password)
  ); // ищем пользователя с переданным логином и паролем
  const userSnapshot = await getDocs(userQuery); // ищем пользователя с переданным логином и паролем
  if (userSnapshot.size !== 1) {
    toast.error(i18next.t("errors.auth"));
    throw error("404"); // говоим пользователю о том, что он ввел неверные данные
  }
  const { isActive } = userSnapshot.docs[0].data();
  if (!isActive) {
    // проверяем активирован ли польхователь
    toast.error(i18next.t("errors.needActivate"));
    throw error("403");
  }

  onSnapshot(userQuery, (userSnap) => {
    const userData = userSnap.docs[0].data();
    const userId = userSnap.docs[0].id;

    const newUserObj = {
      // создаем удобный объект пользователя и в дальнейшем его передадим в хранилище
      ...userData,
      id: userId,
    };

    localStorage.setItem("username", userData.username);
    localStorage.setItem("password", userData.password);

    store.dispatch(actions.setUser(newUserObj));
  });
};

export const readMessage = async (data) => {
  const { user, chat, count } = data;
  const userDoc = doc(db, "users", user);
  const userRef = await getDoc(userDoc);
  const { chats } = userRef.data();
  const newChats = {
    ...chats,
    [chat]: count,
  };
  await updateDoc(userDoc, {
    chats: newChats,
  });
};
