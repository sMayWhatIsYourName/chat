import { useSelector } from "react-redux";
import { useModal } from "../../hooks";
import getModal from './index';
import Add from './Add';

export const Modal = (props) => {
  const { modalInfo, hideModal } = useModal();
  const chats = useSelector((state) => state.chat.chats);
  if (!modalInfo.type) {
    // если у модалки нет типа - возвращаем children
    return props.children;
  }

  if (modalInfo.type === "adding") {
    return (
      <>
        {props.children}
        <Add modalInfo={modalInfo} onHide={hideModal} />
      </>
    );
  }

  const Component = getModal(modalInfo.type); // получаем нужную нам модалку
  return (
    <>
      {props.children}
      <Component channels={chats} modalInfo={modalInfo} onHide={hideModal} />
    </>
  ); // рендерим её
};
