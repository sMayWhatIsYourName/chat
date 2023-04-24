import {
  FormControl,
  FormGroup,
  Button,
  FormLabel,
  Dropdown,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { updateUser, removeUser } from "../services/users";

export const UserInfo = (props) => {
  const { t } = useTranslation();
  const { user, setUser } = props;
  const users = useSelector((state) => state.users.users);
  const currentUser = users.find((u) => u.id === user);
  const schema = yup.object().shape({
    // объект валидации
    username: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username"))
      .max(20, t("errors.username")),
    password: yup
      .string()
      .required(t("errors.required"))
      .min(6, t("errors.password")),
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
    post: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
    department: yup
      .string()
      .trim()
      .required(t("errors.required"))
      .min(3, t("errors.username")),
  });
  const buttonRef = useRef(null);
  const departments = useSelector((state) => state.department.depts);
  const formik = useFormik({
    validationSchema: schema,
    onSubmit: (formValues) => {
      updateUser(formValues, currentUser?.id);
    },
    initialValues: {
      name: currentUser?.name,
      username: currentUser?.username,
      secondName: currentUser?.secondName,
      thirdName: currentUser?.thirdName,
      post: currentUser?.post,
      password: currentUser?.password,
      isActive: currentUser?.isActive,
      department: currentUser?.department,
    },
  });
  const { values, errors, handleChange, handleSubmit, setFieldValue, setFieldError } = formik;
  useEffect(() => {
    formik.setValues({
      name: currentUser?.name,
      username: currentUser?.username,
      secondName: currentUser?.secondName,
      thirdName: currentUser?.thirdName,
      post: currentUser?.post,
      password: currentUser?.password,
      isActive: currentUser?.isActive,
      department: currentUser?.department,
    });
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const {
    id,
    username,
    secondName,
    name,
    thirdName,
    post,
    department,
    password,
    isActive,
  } = currentUser;

  const removeCurrentUser = () => {
    setUser(users.at(-2).id);
    removeUser(currentUser?.id);
  };

  return (
    <div className="user">
      <form onSubmit={handleSubmit}>
        <div className="user-login-data-wrapper">
          <FormGroup>
            <FormLabel>{t("registrationForm.username")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.username}
              data-testid="input-body"
              name="username"
              id="username"
              className="mb-2"
              isInvalid={!!errors.username}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.username}
            </div>
          </FormGroup>
          <FormGroup>
            <FormLabel>{t("registrationForm.password")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.password}
              data-testid="input-body"
              name="password"
              id="password"
              className="mb-2"
              isInvalid={!!errors.password}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.password}
            </div>
          </FormGroup>
        </div>
        <div className="user-personal-data-wrapper">
          <FormGroup>
            <FormLabel>{t("registrationForm.secondName")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.secondName}
              data-testid="input-body"
              name="secondName"
              id="secondName"
              isInvalid={!!errors.name}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.secondName}
            </div>
          </FormGroup>
          <FormGroup>
            <FormLabel>{t("registrationForm.name")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.name}
              data-testid="input-body"
              name="name"
              id="name"
              isInvalid={!!errors.name}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.name}
            </div>
          </FormGroup>
          <FormGroup>
            <FormLabel>{t("registrationForm.thirdName")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.thirdName}
              data-testid="input-body"
              name="thirdName"
              id="thirdName"
              isInvalid={!!errors.thirdName}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.thirdName}
            </div>
          </FormGroup>
        </div>
        <div className="user-personal-data-empoyee">
          <FormGroup>
            <FormLabel>{t("data.post")}</FormLabel>
            <FormControl
              onChange={handleChange}
              value={values.post}
              data-testid="input-body"
              name="post"
              id="post"
              isInvalid={!!errors.post}
            />
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.post}
            </div>
          </FormGroup>
          <FormGroup>
            <FormLabel>{t("data.department")}</FormLabel>
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                {values.department ? values.department : "Отдел"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {departments.map((dept) => (
                  <Dropdown.Item
                    onClick={() => {
                      setFieldValue("department", dept);
                    }}
                    key={dept}
                  >
                    {dept}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.department}
            </div>
          </FormGroup>
          <FormGroup>
            <FormLabel>{t("data.activate")}</FormLabel>
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                {values.isActive ? "Да" : "Нет"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    if (Object.keys(errors).length > 0) {
                      setFieldError("isActive", t("errors.activate"));
                    } else {
                      setFieldValue("isActive", true);
                    }
                  }}
                >
                  Да
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFieldValue("isActive", false);
                  }}
                >
                  Нет
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.isActive}
            </div>
          </FormGroup>
        </div>
        <div className="d-flex justify-content-end user-footer">
          <Button onClick={removeCurrentUser} ref={buttonRef} variant="secondary">
            Удалить
          </Button>
          <Button type="submit" ref={buttonRef} variant="primary">
            Изменить
          </Button>
        </div>
      </form>
    </div>
  );
};
