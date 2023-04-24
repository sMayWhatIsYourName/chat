import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserList } from "../components/UserList";
import { UserInfo } from "../components/UserInfo";

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
    <div className="container">
      <div className="users-inner">
        <UserList setUser={setCurrentUser} />
        {currentUser ? <UserInfo setUser={setCurrentUser} user={currentUser} /> : null}
      </div>
    </div>
  );
};
