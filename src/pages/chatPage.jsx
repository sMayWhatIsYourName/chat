import React, { useState } from "react";
import { useSelector } from "react-redux";
import getModal from "../components/modals/index.js";
import { Chat } from "../components/Chat.jsx";
import Add from "../components/modals/Add.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatButton } from '../components/ChatButton.jsx';
import { ChatList } from "../components/ChatList.jsx";
import { useModal } from "../hooks/index.js";

const renderModal = ({ modalInfo, channels, hideModal }) => {
  if (!modalInfo.type) {
    // если у модалки нет типа - возвращаем null
    return null;
  }

  if (modalInfo.type === "adding") {
    return <Add modalInfo={modalInfo} onHide={hideModal} />;
  }

  const Component = getModal(modalInfo.type); // получаем нужную нам модалку
  return (
    <Component channels={channels} modalInfo={modalInfo} onHide={hideModal} />
  ); // рендерим её
};

function ChatPage() {
  const { modalInfo, hideModal } = useModal();
  const chats = useSelector((state) => state.chat.chats);

  return (
    <>
      <div className="container vh-75 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>Каналы</span>
              <ButtonAddChat />
            </div>
            <ChatList />
            {/* Отрисовка каналов */}
          </div>
          <Chat />
        </div>
      </div>
      {renderModal({ modalInfo, chats, hideModal })}{" "}
      {/* Отрисовка модального окна */}
    </>
  );
}

export default ChatPage;
