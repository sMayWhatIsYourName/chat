import filter from "leo-profanity";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Messages } from "./Messages";
import { useTranslation } from "react-i18next";
import { addMessage } from "../services/chat";
import { useRef } from "react";

filter.add(filter.getDictionary("ru")); // Добавляем русский в библиотеку-цензор матов

export const Chat = () => {
  const { currentChat, chats } = useSelector((state) => state.chat);
  const user = useSelector(
    (state) => state.user
  );
  const formRef = useRef(null);
  const handleSubmit = ({ body }) => {
    formik.values.body = ""; // очистим поле ввода сообщения после отправки
    if (body.trim().length < 1) {
      return;
    }
    const saveFormattingMsg = JSON.stringify(body);
    const newMessage = {
      content: filter.clean(saveFormattingMsg),
      author: {
        id: user.id
      },
    };
    addMessage(newMessage, currentChat);
  };
  const formik = useFormik({
    initialValues: {
      // исходные значения
      body: "",
    },
    onSubmit: handleSubmit,
  });
  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(formik.values);
    }
  };

  const currentChatObj = chats.find((chat) => chat.id === currentChat);
  const { t } = useTranslation();
  if (!currentChat) {
    return null;
  }

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChatObj.name}</b>
          </p>
          <span className="text-muted">
            {t("chatForm.message", { count: currentChatObj.messages.length })}
          </span>{" "}
          {/* Отрисовка количества сообщений */}
        </div>
        <Messages messages={currentChatObj.messages} id={user.id} />
        <div className="mt-auto px-5 py-3">
          <form
            className="py-1 border rounded-2"
            noValidate=""
            onSubmit={formik.handleSubmit}
            ref={formRef}
          >
            {" "}
            {/* При отправке формы будет вызвана функция-обработчик */}
            <div className="input-group has-validation">
              <textarea
                className="border-0 p-0 ps-2 form-control chat-input"
                onChange={formik.handleChange}
                value={formik.values.body}
                name="body"
                aria-label="Новое сообщение"
                placeholder="Введите сообщение..."
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-group-vertical"
                type="submit"
                disabled={formik.values.body === ""}
              >
                {" "}
                {/* Заблокировать кнопку если поле пустое */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{t("buttons.send")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
