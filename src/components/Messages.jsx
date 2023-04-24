import { memo, useEffect, useRef, Fragment } from "react";
import { formatDate } from "../utils/formatDate";
import { groupDate } from "../utils/groupDate";
import cn from "classnames";

export const Messages = memo((props) => {
  const { messages, id } = props;
  const lastMessage = useRef(null);

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  }, [lastMessage.current]);

  const groupMessages = groupDate(messages);
  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 h-100">
      {groupMessages.map((group) => {
        const { formattedDate, messages: groupMessages } = group;
        return (
          <div key={formattedDate}>
            <span className="text-center d-block mb-2">{formattedDate}</span>
            <div className="messages-wrapper">
              {groupMessages.map(({ item }) => {
                const { author, date, content } = item;
                const dateObj = new Date(date);
                const hour = formatDate(dateObj.getHours());
                const minutes = formatDate(dateObj.getMinutes());
                const formattedDate = `${hour}:${minutes}`;
                const messageLines = JSON.parse(content).split("\n");
                const isMyMessage = author.id === id;
                const msgClassnames = cn("message", {
                  "message-my": isMyMessage,
                });
                return (
                  <div key={date} className="message-outter">
                    <div className={msgClassnames} ref={lastMessage}>
                      <div className="message-inner">
                        {!isMyMessage ? (
                          <span className="post">{author.post}</span>
                        ) : null}
                        <span className="time">{formattedDate}</span>
                      </div>
                      {!isMyMessage ? (
                        <span className="author">
                          {author.secondName} {author.name} {author.thirdName}
                        </span>
                      ) : null}
                      <div className="content">
                        {messageLines.map((message, i) => (
                          <Fragment key={message + i}>
                            {message ? (
                              message
                            ) : (
                              <>
                                <br />
                                <br />
                              </>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
