export default {
  translation: {
    loginForm: {
      headling: 'Войти',
      username: 'Имя пользователя',
      password: 'Ваш пароль',
    },
    registrationForm: {
      headling: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      name: 'Имя',
      secondName: 'Фамилия',
      thirdName: 'Отчество',
      confirmPassword: 'Подтвердите пароль',
    },
    chatForm: { // для склонения числительных
      message_zero: '{{count}} сообщений',
      message_one: '{{count}} сообщение',
      message_few: '{{count}} сообщения',
      message_many: '{{count}} сообщений',
    },
    links: {
      register: 'Регистрация',
    },
    buttons: {
      login: 'Войти',
      register: 'Зарегистрироваться',
      send: 'Отправить',
    },
    errors: { // ошибки
      auth: 'Неверное имя пользователя или пароль',
      confirmPassword: 'Пароли должны совпадать',
      password: 'Не менее 6 символов',
      username: 'От 3 до 20 символов',
      required: 'Обязательное поле',
      exist: 'Пользователь с таким именем уже существует',
      network: 'Ошибка соединения',
      unique: 'Должно быть уникальным',
      needActivate: 'Учётная запись пока не активирована',
      createChat: 'Создать канал не удалось',
      renameChat: 'Переименовать канал не удалось',
      removeChat: 'Удалить канал не удалось',
      addDept: 'Создать отдел не удалось',
      removeDept: 'Удалить отдел не удалось',
      activate: 'Чтобы активировать аккаунт необходимо заполнить все поля',
      userInDept: 'Перед удалением отдела необходимо удалить из него всех сотрудников'
    },
    success: {
      create: 'Канал создан',
      rename: 'Канал переименован',
      remove: 'Канал удалён',
      register: 'Вы успешно зарегистрировались, ждите активации аккаунта',
      addDept: 'Отдел успешно создан',
      removeDept: 'Отдел успешно удален'
    },
    data: {
      post: 'Должность',
      department: 'Отдел',
      activate: 'Активировать ли учетную запись?',
      access: 'Доступ'
    }
  },
};
