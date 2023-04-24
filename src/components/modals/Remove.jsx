import React, { useRef } from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import successCheck from '../../utils/successCheck.js';
import { removeChat } from '../../services/chat.js';

const generateOnSubmit = ({ modalInfo: { item }, onHide }, buttonRef) => (e) => {
  e.preventDefault();
  buttonRef.current.setAttribute('disabled', '');
  removeChat(item)
  onHide();
  successCheck(buttonRef)
};

function Remove(props) {
  const { onHide } = props;
  const buttonRef = useRef();
  const onSubmit = generateOnSubmit(props, buttonRef);
  // вызываем функцию и замыкаем в ней props, socket и buttonRef
  // в ответ получаем другую функцию, которую мы передаем на submit формы

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <p className="lead">Уверены?</p>
            <div className="d-flex justify-content-end">
              <button className="me-2 btn btn-secondary" onClick={onHide} type="button">Отменить</button>
              <button type="submit" ref={buttonRef} className="btn btn-danger">Удалить</button>
            </div>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
