import { Fragment, useState, useRef, forwardRef, useEffect } from "react";
import { groupDate } from "../utils/groupDate";
import { Message } from "./Message";
import { useSelector } from "react-redux";

export const Messages = forwardRef((props, ref) => {
  const { chat, setShowScrollBtn } = props;
  const user = useSelector((state) => state.user);
  const { messages, id: chatId } = chat;
  const lastReadedMessage = user.chats[chat.id];
  const groupMessages = groupDate(messages);
  const readedCount = user.chats[chatId];
  const [reply, setReply] = useState(null);
  const alreadyScrolled = useRef(false);
  const lastReadedRef = useRef(null);

  // useEffect(() => {
  //   const refObj = lastReadedRef.current;
  //   if (refObj) {
  //     refObj.scrollIntoView();
  //   }

  //   return () => {
  //     ref.current = null;
  //     alreadyScrolled.current = false;
  //   };
  // }, [lastReadedRef.current]);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 h-100">
      {groupMessages.map((group) => {
        const { formattedDate, messages: groupMessages } = group;
        return (
          <Fragment key={formattedDate}>
            <span className="text-center d-block mb-2">{formattedDate}</span>
            <div className="messages-wrapper" ref={ref}>
              {groupMessages.map((message) => {
                const isLastReadedMessage =
                  message.number === (lastReadedMessage - 1);
                if (isLastReadedMessage) {
                  alreadyScrolled.current = true;
                }
                return (
                  <Message
                    ref={isLastReadedMessage && !alreadyScrolled.current ? lastReadedRef : null}
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
