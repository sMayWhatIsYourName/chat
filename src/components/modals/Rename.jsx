import React, { useEffect, useMemo, useRef } from "react";
import { Formik } from "formik";
import {
  Modal,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
  Badge,
  Card,
  Dropdown,
  CloseButton,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../slices/chatSlice.js";
import { updateChat } from "../../services/chat.js";

function Rename(props) {
  const { t } = useTranslation();
  const {
    onHide,
    modalInfo: {
      item: { id, name: prevName },
    },
  } = props;
  // берем из пропсов функцию для закрытия модалки, каналы для проверки на уникальность
  // И информацию о модалке (предыдущее имя и id)
  const inputRef = useRef();
  const buttonRef = useRef();
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);
  const { depts } = useSelector((state) => state.department);
  const currentChatObj = chats.find((chat) => chat.id === id);
  const haventAccessDept = depts.filter(
    (dept) => !currentChatObj.haveAccess.includes(dept)
  );

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const feedbackStyle = {
    display: "block",
  };

  const addDeptAccess = (dept) => () => {
    dispatch(actions.addDept({ id, dept }));
  };

  const removeDeptAccess = (dept) => () => {
    dispatch(actions.removeDept({ id, dept }));
  };

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Изменить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          onSubmit={({ name }, actions) => {
            if (name === "") {
              actions.setFieldError("name", t("errors.required"));
              return;
            }
            buttonRef.current.setAttribute("disabled", "");
            const chatObj = {
              messages: currentChatObj.messages,
              haveAccess: currentChatObj.haveAccess,
              name,
            };

            updateChat(chatObj, id);
            onHide();
          }}
          initialValues={{
            name: prevName,
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <form onSubmit={handleSubmit}>
              <Card.Title className="mb-2">Переименовать канал</Card.Title>
              <FormGroup>
                <FormControl
                  ref={inputRef}
                  onChange={handleChange}
                  value={values.name}
                  data-testid="input-body"
                  name="name"
                  id="name"
                  className="mb-2"
                  isInvalid={!!errors.name}
                />
                <FormLabel htmlFor="name" visuallyHidden>
                  Имя канала
                </FormLabel>
              </FormGroup>
              <div className="invalid-feedback" style={feedbackStyle}>
                {errors.name}
              </div>
              <div className="mt-3">
                <Card.Title className="mb-2">
                  Доступ к чату есть у следующих отделов:{" "}
                </Card.Title>
                {currentChatObj.haveAccess.length > 0 ? (
                  <div className="d-flex gap-2 flex-wrap py-2">
                    {currentChatObj.haveAccess.map((dept) => (
                      <Badge key={dept} className="p-2">
                        <div className="d-flex align-items-center">
                          <span>{dept}</span>
                          <CloseButton
                            variant="white"
                            className="ms-2"
                            onClick={removeDeptAccess(dept)}
                          />
                        </div>
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {haventAccessDept.length > 0 ? (
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                      Добавить отдел
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {haventAccessDept.map((dept) => (
                        <Dropdown.Item onClick={addDeptAccess(dept)} key={dept}>
                          {dept}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  className="me-2"
                  onClick={onHide}
                  variant="secondary"
                >
                  Отменить
                </Button>
                <Button type="submit" ref={buttonRef} variant="primary">
                  Отправить
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
