import { useSelector, useDispatch } from "react-redux";
import { ChatButton } from "../components/ChatButton.jsx";

export const ChatList = (props) => {
  const { chats, currentChat } = useSelector((state) => state.chat);

  const list = chats.map(
    (
      { id, name } // для каждого канала отрисовываем компонент кнопки
    ) => (
      <li className="nav-item w-100" key={id}>
        <ChatButton
          id={id}
          name={name}
          currentChat={currentChat}
        />
      </li>
    )
  );

  return list;
};
