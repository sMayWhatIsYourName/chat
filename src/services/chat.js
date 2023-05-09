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
import sound from '../../assets/sound.wav';

const chatCollection = collection(db, "chat");

export const fetchChats = async (ctx) => {
  const { access, department } = ctx;
  let queryChats;
  if (access !== "employee") {
    queryChats = query(chatCollection);
  } else {
    queryChats = query(
      chatCollection,
      where("haveAccess", "array-contains", department)
    );
  }

  onSnapshot(queryChats, async (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      if (change.type === "modified") {
        const { chats, currentChat } = store.getState().chat;
        const currentChatObj = chats.find((chat) => chat.id === change.doc.id);
        const modifiedChat = change.doc.data();
        if (
          modifiedChat.messages.length > currentChatObj.messages.length &&
          currentChat !== change.doc.id
        ) {
          const audio = new Audio(sound);
          audio.volume = 0.3;
          audio.play();
          const { name, messages } = modifiedChat;
          const { content, author } = messages.at(-1);
          const authorDoc = doc(db, "users", author.id);
          const authorRef = await getDoc(authorDoc);
          const { name: firstName, secondName, thirdName } = authorRef.data();
          const fullName = `${secondName} ${firstName.at(0)}. ${thirdName.at(0)}.`;
          const newMessageNotification = `${name} ${fullName}: ${content}`;
          toast.info(newMessageNotification);
        }
      }
    });
  });

  onSnapshot(queryChats, async (data) => {
    const chatsArr = data.docs.map(async (docItem) => {
      const { name: chatName, messages, haveAccess } = docItem.data();
      const newMessages = messages.map(async (msg) => {
        const authorDoc = doc(db, "users", msg.author.id);
        const authorRef = await getDoc(authorDoc);
        // console.log(authorRef.data(), chatName);
        const { name, secondName, thirdName, post } = authorRef.data();

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
        id: docItem.id,
        name: chatName,
        haveAccess,
        messages: await Promise.all(newMessages),
      };
    });

    const result = await Promise.all(chatsArr);
    store.dispatch(actions.setChats(result));
  });
};

export const createChat = async (data) => {
  const { name } = data;
  const newChat = {
    name,
    messages: [],
    haveAccess: store.getState().department.depts,
  };
  try {
    await addDoc(chatCollection, newChat);
    toast.success(i18next.t("success.create"));
  } catch (e) {
    toast.error(i18next.t("errors.createChat"));
  }
};

export const updateChat = async (data, id) => {
  try {
    const chatRef = doc(db, "chat", id);
    await setDoc(chatRef, data);
    toast.success(i18next.t("success.rename"));
  } catch (e) {
    toast.error(i18next.t("errors.renameChat"));
  }
};

export const removeChat = async (id) => {
  try {
    const chatRef = doc(db, "chat", id);
    await deleteDoc(chatRef);
  } catch (e) {
    toast.error(i18next.t("errors.removeChat"));
  }
};

export const addMessage = async (data, id) => {
  const chatRef = doc(db, "chat", id);
  const newMessage = {
    ...data,
    date: Date.now(),
  };
  await updateDoc(chatRef, {
    messages: arrayUnion(newMessage),
  });
};

export const addChatAccess = async (data) => {
  const chatRef = doc(db, "chat", id);
  const { name } = data;
  await updateDoc(chatRef, {
    haveAccess: arrayUnion(name),
  });
};

export const removeChatAccess = async (data) => {
  const chatRef = doc(db, "chat", id);
  const { name } = data;
  await updateDoc(chatRef, {
    haveAccess: arrayRemove(name),
  });
};
