import { memo, Fragment, useRef, useEffect, useState } from "react";
import { groupDate } from "../utils/groupDate";
import { Message } from "./Message";
import { useSelector } from "react-redux";

export const Messages = memo((props) => {
  const { chat, setShowScrollBtn, lastReadedRef } = props;
  const user = useSelector((state) => state.user);
  const { messages, id: chatId } = chat;
  const lastReadedMessage = user.chats[chat.id];
  const groupMessages = groupDate(messages);
  const readedCount = user.chats[chatId];
  const [reply, setReply] = useState(null);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 h-100">
      {groupMessages.map((group) => {
        const { formattedDate, messages: groupMessages } = group;
        return (
          <Fragment key={formattedDate}>
            <span className="text-center d-block mb-2">{formattedDate}</span>
            <div className="messages-wrapper">
              {groupMessages.map((message) => {
                const isLastReadedMessage =
                  message.number === lastReadedMessage;
                return (
                  <Message
                    ref={isLastReadedMessage ? lastReadedRef : null}
                    key={message.item.id}
                    readedCount={readedCount}
                    chatId={chatId}
                    userId={user.id}
                    message={message}
                    isLast={message.number === messages.length}
                    setShowScrollBtn={setShowScrollBtn}
                    setReply={setReply}
                    scrollReply={reply}
                  />
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
});
