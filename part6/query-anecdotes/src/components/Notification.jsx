import React, { useContext } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return <div style={style}>{notification}</div>;
};

export default Notification;
