import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserList } from "../components/UserList";
import { UserInfo } from "../components/UserInfo";
import { Modal } from "../components/modals/Modal";

export const UsersPage = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users.users);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(users.at(-1)?.id);
  useEffect(() => {
    if (user.access !== "admin") {
      navigate("/");
    }
  }, [user.access]);

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser(users.at(-1));
    }
  }, [users]);

  return (
    <>
      <div className="users-page">
        <div className="container">
          <div className="users-wrapper">
            <div className="users-inner rounded shadow">
              <UserList setUser={setCurrentUser} />
              {currentUser ? (
                <UserInfo setUser={setCurrentUser} user={currentUser} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};
