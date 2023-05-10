import React, { useState } from "react";
import { Chat } from "../components/Chat.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatList } from "../components/ChatList.jsx";
import { Modal } from "../components/modals/Modal.jsx";
import { UserData } from "../components/UserData.jsx";

function ChatPage() {
  return (
    <div className="chat-page">
      <div className="container chat-page__inner my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row flex-nowrap">
          <div className="col-4 col-md-2 chat-side border-end px-0 bg-light">
            <UserData />
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
      <Modal />
    </div>
  );
}

export default ChatPage;
