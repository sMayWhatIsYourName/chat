import { useContext } from 'react';

import { authContext, ModalContext } from '../contexts/index.js';

export const useAuth = () => useContext(authContext); // Создадим кастомный хук для
// обработки контекста авторизации
export const useModal = () => useContext(ModalContext); // Создадим хук для просмотра инфы о модалках