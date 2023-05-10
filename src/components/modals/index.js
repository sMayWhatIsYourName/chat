import Add from './Add.jsx';
import { Departments } from './Departments.jsx';
import Remove from './Remove.jsx';
import Update from './Update.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  updating: Update,
  department: Departments
};

export default (modalName) => modals[modalName];
// Функция, которая принимает в себя НАЗВАНИЕ нужного
// модального окна и возвращает само модальное окно
