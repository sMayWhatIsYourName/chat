import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import { Button, Dropdown } from "react-bootstrap";
import { actions } from "../slices/chatSlice.js";
import { useModal } from "../hooks/index.js";

export const ChatButton = (props) => {
  const user = useSelector((state) => state.user);
  const { showModal } = useModal();
  const dispatch = useDispatch();

  const changeChat = (id) => () => {
    // функция для смены канала
    dispatch(actions.changeChat(id)); // изменяем текущий канал
  };

  const { id, name, currentChat } = props;
  const isCurrent = id === currentChat;
  const classes = cn("w-100", "rounded-0", "text-start", "btn", {
    "btn-secondary": isCurrent, // если канал текущий, то выделим его определенным цветом
  });
  const variant = isCurrent ? "secondary" : null; // если канал текущий, то выделим его определенным цветом
  const newClasses = cn(classes, "text-truncate");
  return (
    <Dropdown
      align="start"
      className="d-flex btn-group"
      role="group"
      navbar={false}
    >
      <Button
        type="button"
        onClick={changeChat(id)}
        variant={variant}
        className={newClasses}
      >
        {" "}
        {/* При нажатии на кнопку меняем канал */}
        <span className="me-1">#</span>
        {name}
      </Button>
      {user.access !== "employee" ? (
        <>
          <Dropdown.Toggle
            className="flex-grow-0"
            split="true"
            variant={variant}
          >
            <span className="visually-hidden">Управление каналом</span>{" "}
            {/* Это для скрин-ридеров */}
          </Dropdown.Toggle>
          <Dropdown.Menu flip>
            <Dropdown.Item
              data-rr-ui-dropdown-item
              href="#"
              onClick={() => showModal("removing", id)}
            >
              {" "}
              {/* При нажатии открываем модалку удаления */}
              Удалить
            </Dropdown.Item>
            <Dropdown.Item
              data-rr-ui-dropdown-item
              href="#"
              onClick={() => showModal("renaming", { id, name })}
            >
              {" "}
              {/* При нажатии открываем модалку изменения канала */}
              Изменить
            </Dropdown.Item>
          </Dropdown.Menu>
        </>
      ) : null}
    </Dropdown>
  );
};
