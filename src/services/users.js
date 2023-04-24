import { db } from "./init.js";
import store from "../slices/index.js";
import {
  query,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { actions } from "../slices/usersSlice.js";
import { toast } from "react-toastify";

const usersCollection = collection(db, "users");

export const fetchUsers = async (access) => {
  if (access !== "admin") {
    return;
  }
  const queryUsers = query(usersCollection);

  onSnapshot(queryUsers, async (querySnapshot) => {
    const users = querySnapshot.docs.map((user) => {
      return {
        ...user.data(),
        id: user.id,
      };
    });
    store.dispatch(actions.setUsers(users));
  });
};

export const updateUser = async (data, id) => {
  try {
    const userRef = doc(db, "users", id);
    await setDoc(userRef, data);
    toast.success("Пользователь был успешно изменен");
  } catch (e) {
    console.log(e);
    toast.error("Изменить пользователя не удалось");
  }
};

export const removeUser = async (id) => {
  try {
    const userRef = doc(db, "users", id);
    const chatsCollection = collection(db, "chat");
    const chats = await getDocs(chatsCollection);
    chats.forEach(async (chat) => {
      const { messages } = chat.data();
      const newMessages = messages.filter(msg => msg.author.id !== id);

      if (newMessages.length < messages.length) {
        await updateDoc(chat.ref, {
          messages: newMessages
        });
      }

    });
    await deleteDoc(userRef);
    toast.success("Пользователь был успешно удален");
  } catch (e) {
    toast.error(i18next.t("Удалить пользователя не удалось"));
  }
};
