import store from "../slices/index.js";
import { db } from "./init.js";
import { actions } from "../slices/chatSlice.js";
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import i18next from "i18next";
import sound from '../../assets/sound.wav'; // звук уведомления при получения сообщения

const chatCollection = collection(db, "chat");

export const fetchChats = async (ctx) => { // запрос всех чатов для юзера
  const { access, department } = ctx;
  let queryChats;
  if (access !== "employee") { // если уровень доступа не сотрудник - запрашиваются все чаты
    queryChats = query(chatCollection);
  } else { // иначе запрашиваются только те чаты, к которым имеет доступ юзер исходя из его отдела
    queryChats = query(
      chatCollection,
      where("haveAccess", "array-contains", department)
    );
  }

  onSnapshot(queryChats, async (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      if (change.type === "modified") {
        const { chats, currentChat } = store.getState().chat; // берем информацию о чатах из хранилища
        const currentChatObj = chats.find((chat) => chat.id === change.doc.id); // находим чат, в котором произошло изменение (по id), среди своих чатов
        const modifiedChat = change.doc.data(); // получаем дату измененного чата
        if (
          modifiedChat.messages.length > currentChatObj.messages.length && // проверка на то, что инициатор изменения = новое сообщение
          currentChat !== change.doc.id // уведомлять пользователя если сообщение пришло в другом канале
        ) {
          const audio = new Audio(sound); // взаимодействие со звуком
          audio.volume = 0.3; // уменьшаем громкость до 30%
          audio.play(); // включаем звук
          const { name, messages } = modifiedChat; // берем сообщения и название из чата
          const { content, author } = messages.at(-1); // берем последнее сообщение
          const authorDoc = doc(db, "users", author.id); // получаем документ автора сообщения
          const authorRef = await getDoc(authorDoc); // получаем документ автора сообщения
          const { name: firstName, secondName, thirdName } = authorRef.data(); // получаем ФИО отправителя
          const fullName = `${secondName} ${firstName.at(0)}. ${thirdName.at(0)}.`; // генерируем ФИО отправителя
          const newMessageNotification = `${name} ${fullName}: ${content}`;  // генерируем уведомление
          toast.info(newMessageNotification);
        }
      }
    });
  });

  onSnapshot(queryChats, async (data) => { // обновляем наше redux хранилище с чатами
    const chatsArr = data.docs.map(async (docItem) => {
      const { name: chatName, messages, haveAccess } = docItem.data(); // берем название чата, сообщения и массив отделов
      const newMessages = messages.map(async (msg) => { // генерируем новый массив сообщений для удобной обработки
        const authorDoc = doc(db, "users", msg.author.id); // получаем автора конкретного сообщения
        const authorRef = await getDoc(authorDoc); // получаем автора конкретного сообщения
        const { name, secondName, thirdName, post } = authorRef.data(); // получаем данные из автора

        return {
          ...msg,
          author: {
            id: authorRef.id,
            name,
            secondName,
            thirdName,
            post,
          },
        };
      });
      return {
        id: docItem.id, // id чата
        name: chatName, // name chat
        haveAccess, // отделы с доступом
        messages: await Promise.all(newMessages), // дожидаемся выполнения всех асинхронных функций
      };
    });

    const result = await Promise.all(chatsArr); // дожидаемся выполнения всех асинхронных функций
    store.dispatch(actions.setChats(result)); // обновляем redux хранилище
  });
};

export const createChat = async (data) => {
  const { name } = data; // берем будущее название чата
  const newChat = {
    name,
    messages: [],
    haveAccess: store.getState().department.depts,
  }; // генерируем объект чата
  try {
    await addDoc(chatCollection, newChat); // добавляем чат
    toast.success(i18next.t("success.create")); // уведомляем об успешном добавлении чата
  } catch (e) {
    toast.error(i18next.t("errors.createChat")); // уведомляем о неудачном добавлении чата
  }
};

export const updateChat = async (data, id) => {
  try {
    const chatRef = doc(db, "chat", id); // получаем ссылку на нужный нам чат
    await setDoc(chatRef, data); // обновляем его
    toast.success(i18next.t("success.rename"));
  } catch (e) {
    toast.error(i18next.t("errors.renameChat"));
  }
};

export const removeChat = async (id) => { // удаление чата по id
  try {
    const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
    await deleteDoc(chatRef); // удаление документа по ссылке
    toast.success(i18next.t("success.remove"));
  } catch (e) {
    toast.error(i18next.t("errors.removeChat"));
  }
};

export const addMessage = async (data, id) => {
  const chatRef = doc(db, "chat", id); // получение ссылки на документ (чат)
  const newMessage = {
    ...data,
    date: Date.now(), // числовое представление даты (timestamp)
  };
  await updateDoc(chatRef, { // обновляем документ добавляя в массив сообщений новое с помощью arrayUnion
    messages: arrayUnion(newMessage),
  });
};
