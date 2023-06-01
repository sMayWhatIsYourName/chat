import { useSelector } from "react-redux";
import { Messages } from "./Messages";
import { useEffect, useRef, useState } from "react";
import arrowDown from "/arrowDown.svg";
import { ChatHeader } from "./ChatHeader";
import { MessageFieldWrapper } from "./MessageFieldWrapper.jsx";

export const Chat = () => {
  const { currentChat, chats } = useSelector((state) => state.chat);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const lastReadedRef = useRef(null);
  const handleClickScroll = () => {
    const refObj = lastReadedRef.current;
    if (refObj) {
      refObj.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const refObj = lastReadedRef.current;
    if (refObj) {
      refObj.scrollIntoView();
    }
  }, [lastReadedRef.current]);

  const currentChatObj = chats.find((chat) => chat.id === currentChat);
  if (!currentChat || !currentChatObj) {
    return (
      <div className="choose-channel-wrapper">
        <div className="bg-white rounded choose-channel">
          <p className="m-0">Выберите канал</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col p-0 h-100 bg-white position-relative">
      <div className="d-flex flex-column h-100">
        <ChatHeader chat={currentChatObj} />
        <Messages
          chat={currentChatObj}
          lastReadedRef={lastReadedRef}
          setShowScrollBtn={setShowScrollBtn}
        />
        <MessageFieldWrapper handleClickScroll={handleClickScroll} currentChat={currentChat} />
      </div>
      {showScrollBtn && (
        <div onClick={handleClickScroll} className="circle">
          <img src={arrowDown} />
        </div>
      )}
    </div>
  );
};
