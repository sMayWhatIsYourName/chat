import React, { useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/userSlice.js";
import registerPhoto from "/registerPhoto.jpg";

function RegisterPage() {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    // объект валидации
    username: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")) // задаем то, что поле username должно быть строчным, удаляем пробелы с конца и начала, в случае чего покажет то, что поле обязательно, а также если будет менее 3 символом покажет ошибку
      .max(20, t("errors.username")),
    password: yup
      .string()
      .required(t("errors.required"))
      .min(6, t("errors.password")), // тоже самое, что и username, но если меньше 6 символов покажет ошибку
    confirmPassword: yup
      .string()
      .required(t("errors.required")) // строчное, обязательное и должно быть таким же как password
      .oneOf([yup.ref("password"), null], t("errors.confirmPassword")),
    name: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    secondName: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    thirdName: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
  });
  const dispatch = useDispatch();

  const inputEl = useRef();
  useEffect(() => {
    inputEl.current.focus();
  }, []);
  return (
    <div className="register-page container-fluid">
      <div className="row justify-content-center align-content-center h-100">
        <div className="register-card__wrapper">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5 register-card">
              <div>
                <img
                  className="rounded-circle"
                  alt="Регистрация"
                  src={registerPhoto}
                  width="350"
                />
              </div>
              <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                  const { username, password, name, thirdName, secondName } =
                    values;
                  const newUser = {
                    username,
                    password,
                    name,
                    thirdName,
                    secondName,
                    access: "employee",
                    department: "",
                    isActive: false,
                    post: "",
                  };
                  dispatch(registerUser(newUser));
                }}
                initialValues={{
                  username: "",
                  password: "",
                  confirmPassword: "",
                  name: "",
                  secondName: "",
                  thirdName: "",
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors, // объект, в котором лежат невалидные поля и строковое представление ошибок
                }) => (
                  <Form
                    className="col-12 col-md-6 mt-3 mt-mb-0"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    {" "}
                    {/* отправка формы */}
                    <h1 className="text-center mb-4">
                      {t("registrationForm.headling")}
                    </h1>
                    <Form.Floating className="mb-3">
                      <Form.Control
                        id="username"
                        name="username"
                        placeholder={t("errors.username")}
                        required
                        autoComplete="username"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.username}
                        ref={inputEl}
                        isInvalid={!!errors.username}
                      />
                      <label className="form-label" htmlFor="username">
                        {t("registrationForm.username")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-4">
                      <Form.Control
                        id="name"
                        name="name"
                        placeholder={t("errors.username")}
                        required
                        autoComplete="name"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.name}
                        isInvalid={!!errors.name}
                      />
                      <label className="form-label" htmlFor="name">
                        {t("registrationForm.name")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-4">
                      <Form.Control
                        id="secondName"
                        name="secondName"
                        placeholder={t("errors.secondName")}
                        required
                        autoComplete="secondName"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.secondName}
                        isInvalid={!!errors.secondName}
                      />
                      <label className="form-label" htmlFor="secondName">
                        {t("registrationForm.secondName")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.secondName}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-4">
                      <Form.Control
                        id="thirdName"
                        name="thirdName"
                        placeholder={t("errors.thirdName")}
                        required
                        autoComplete="thirdName"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.thirdName}
                        isInvalid={!!errors.thirdName}
                      />
                      <label className="form-label" htmlFor="thirdName">
                        {t("registrationForm.thirdName")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.thirdName}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                      <Form.Control
                        id="password"
                        name="password"
                        placeholder={t("errors.password")}
                        required
                        type="password"
                        aria-describedby="passwordHelpBlock"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.password}
                        isInvalid={!!errors.password}
                      />
                      <label className="form-label" htmlFor="password">
                        {t("registrationForm.password")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Form.Floating className="mb-4">
                      <Form.Control
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder={t("errors.confirmPassword")}
                        required
                        type="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur} // вызывается когда наше поле было тронуто хотя бы 1 раз
                        value={values.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <label className="form-label" htmlFor="confirmPassword">
                        {t("registrationForm.confirmPassword")}
                      </label>
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Floating>
                    <Button
                      className="w-100"
                      variant="outline-primary"
                      type="submit"
                    >
                      {t("buttons.register")}
                    </Button>{" "}
                    {/* регистрация */}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
