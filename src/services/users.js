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

export const fetchUsers = async (access) => { // запрос всех пользователей
  if (access !== "admin") { // если уровень доступа не админ, то не запрашиваем всех пользователей
    return;
  }
  const queryUsers = query(usersCollection);

  onSnapshot(queryUsers, async (querySnapshot) => {
    const users = querySnapshot.docs.map((user) => { // нормализируем объект пользователей для дальнейшей работы
      return {
        ...user.data(),
        id: user.id,
      };
    });
    store.dispatch(actions.setUsers(users)); // сохраняем пришедших пользователей в redux хранилище
  });
};

export const updateUser = async (data, id) => { // обновить пользователя
  try {
    const userRef = doc(db, "users", id); // получаем ссылку на объект необходимого нам пользователя 
    await setDoc(userRef, data); // изменяем полностью документ
    toast.success("Пользователь был успешно изменен");
  } catch (e) {
    toast.error("Изменить пользователя не удалось");
  }
};

export const removeUser = async (id) => { // удаление пользователя
  try {
    const userRef = doc(db, "users", id);
    const chatsCollection = collection(db, "chat");
    const chats = await getDocs(chatsCollection); // запрашиваем все чаты
    chats.forEach((chat) => { // проходимся по чатам
      const { messages } = chat.data();
      const newMessages = messages.filter(msg => msg.author.id !== id); // оставляем сообщения только те, в которых автор не тот, кого мы пытаемся удаилть

      if (newMessages.length < messages.length) { // если количество сообщений в чате больше или равно отфильтрованным сообщениям, то мы в целях оптимизации НЕ обновляем документ
        updateDoc(chat.ref, {
          messages: newMessages
        });
      }

    });
    await deleteDoc(userRef); // удаляем документ пользователя
    toast.success("Пользователь был успешно удален");
  } catch (e) {
    toast.error(i18next.t("Удалить пользователя не удалось"));
  }
};
