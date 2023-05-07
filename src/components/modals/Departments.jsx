import {
  Modal,
  FormControl,
  Badge,
  CloseButton,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { addDepartment, removeDepartment } from "../../services/department";
import { useState } from "react";

export const Departments = (props) => {
  const { onHide } = props;
  const depts = useSelector((state) => state.department.depts);
  const [newDept, setNewDept] = useState("");
  const removeDept = (dept) => () => {
    removeDepartment({ dept });
  };

  const addDept = (e) => {
    e.preventDefault();
    if (depts.includes(newDept)) {
      return;
    }
    if (newDept.length > 0) {
      addDepartment({ dept: newDept });
      setNewDept("");
    }
  };
  return (
    <Modal show onHide={onHide}>
      {/* Компонент модалки, сразу ставим проп show = true чтоб показывать */}
      <Modal.Header closeButton onHide={onHide}>
        {/* Обертка, которой добавляем кнопку и добавляем обработчик на закрытие */}
        <Modal.Title>Отделы</Modal.Title>
        {/* заголовок модалки */}
      </Modal.Header>

      <Modal.Body>
        <div className="depts-wrapper">
          {depts.map((dept) => (
            <Badge key={dept} className="p-2 dept">
              <div className="d-flex align-items-center">
                <span>{dept}</span>
                <CloseButton
                  variant="white"
                  className="ms-2"
                  onClick={removeDept(dept)}
                />
              </div>
            </Badge>
          ))}
        </div>
        <form className="dept-add" onSubmit={addDept}>
          <FormControl
            value={newDept}
            onChange={(e) => setNewDept(e.target.value.trim())}
          />
          <Button disabled={newDept.length === 0} type="submit" className="dept-add-btn">Добавить отдел</Button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          variant="secondary"
        >
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
