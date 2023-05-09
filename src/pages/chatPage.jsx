import React, { useState } from "react";
import { Chat } from "../components/Chat.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatList } from "../components/ChatList.jsx";
import { Modal } from "../components/modals/Modal.jsx";

function ChatPage() {
  return (
    <div className="chat-page">
      <div className="container chat-page__inner my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row flex-nowrap">
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
      <Modal />
    </div>
  );
}

export default ChatPage;
