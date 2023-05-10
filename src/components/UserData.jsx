import { useSelector } from "react-redux";
import { Badge } from "react-bootstrap";

export const UserData = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="user-data">
      <div className="user-data-wrapper">
        <span>ФИО:</span>
        <div className="user-data-inner">
          <Badge>{user.secondName}</Badge>
          <Badge>{user.name}</Badge>
          <Badge>{user.thirdName}</Badge>
        </div>
      </div>
      <div className="user-data-wrapper">
        <span>Отдел:</span>
        <Badge>{user.department}</Badge>
      </div>
      <div className="user-data-wrapper">
        <span>Должность:</span>
        <Badge>{user.post}</Badge>
      </div>
    </div>
  );
};
