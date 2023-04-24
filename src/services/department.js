import store from "../slices/index.js";
import { db } from "./init.js";
import { actions } from "../slices/departmentSlice.js";
import {
  query,
  collection,
  onSnapshot,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import i18next from "i18next";

const departmentsCollection = doc(db, "utils", "departments");

export const fetchDepartments = async () => {
  onSnapshot(departmentsCollection, async (doc) => {
    const result = doc.data().arr;
    store.dispatch(actions.setDepartments(result));
  });
};

export const addDepartment = async (data) => {
  const { dept } = data;
  try {
    await updateDoc(departmentsCollection, {
      arr: arrayUnion(dept),
    });
    toast.success(i18next.t("success.addDept"));
  } catch (e) {
    toast.error(i18next.t("errors.addDept"));
  }
};

export const removeDepartment = async (data) => {
  const { dept } = data;
  try {
    await updateDoc(departmentsCollection, {
      arr: arrayRemove(dept),
    });
    toast.success(i18next.t("success.removeDept"));
  } catch (e) {
    toast.error(i18next.t("errors.removeDept"));
  }
};
