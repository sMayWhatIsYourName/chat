import { useSelector } from "react-redux";
import { ChatButton } from "../components/ChatButton.jsx";
import { useState } from "react";
import { FormControl } from "react-bootstrap";

export const ChatList = () => {
  const { chats, currentChat } = useSelector((state) => state.chat);
  const [findChat, setFindChat] = useState("");
  const findedChats = chats.filter(({ name }) => name.toLowerCase().includes(findChat));
  const list = findedChats.map(
    (
      { id, name } // для каждого канала отрисовываем компонент кнопки
    ) => (
      <li className="nav-item w-100" key={id}>
        <ChatButton id={id} name={name} currentChat={currentChat} />
      </li>
    )
  );

  if (chats.length === 0) {
    return <p className="no-chats">Список каналов пуст</p>
  }

  return (
    <>
      <div className="chat-find">
        <FormControl
          placeholder="Поиск"
          value={findChat}
          onChange={(e) => setFindChat(e.target.value.toLowerCase())}
        />
      </div>
      {list}
    </>
  );
};
