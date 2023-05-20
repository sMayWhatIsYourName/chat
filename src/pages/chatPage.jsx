import React, { useState } from "react";
import { Chat } from "../components/Chat.jsx";
import { ButtonAddChat } from "../components/ButtonAddChat.jsx";
import { ChatList } from "../components/ChatList.jsx";
import { Modal } from "../components/modals/Modal.jsx";
import { UserData } from "../components/UserData.jsx";
import cn from 'classnames';
import { useSelector } from "react-redux";

function ChatPage() {
  const { currentChat } = useSelector((state) => state.chat);
  const isMobile = document.documentElement.scrollWidth <= 768;
  const outterClassnames = cn('container chat-page__inner my-4 overflow-hidden', {
    rounded: currentChat
  });

  const innerClassnames = cn('col-4 chat-side border-end px-0 bg-light', {
    rounded: !currentChat
  });

  return (
    <div className="chat-page">
      <div className={outterClassnames}>
        {isMobile ? (
          <div className="row h-100 flex-md-row flex-nowrap">
            {!currentChat ? (
              <div className={innerClassnames}>
                <UserData />
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>Каналы</span>
                  <ButtonAddChat />
                </div>
                <ChatList />
              </div>
            ) : (
              <Chat />
            )}
          </div>
        ) : (
          <div className="row h-100 flex-md-row flex-nowrap">
            <div className={innerClassnames}>
              <UserData />
              <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                <span>Каналы</span>
                <ButtonAddChat />
              </div>
              <ChatList />
            </div>
            <Chat />
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
}

export default ChatPage;
