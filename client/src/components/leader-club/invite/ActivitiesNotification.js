import React, { useState, useEffect } from "react";
import CardActivity from "./CardNotifyActivity";
import axiosInstance from "../../../helper/Axios";

const ActivitiesNotification = ({ club }) => {
  const [notificates, setNotificates] = useState([]);

  const getAllNotification = async () => {
    const res = await axiosInstance.get(`/request/activity`, {
      params: {
        club: club._id,
      },
    });
    const data = res.data;
    console.log(data);
    setNotificates(data);
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  return (
    <div>
      {notificates &&
        notificates.map((noti) => (
          <CardActivity
            data={noti}
            notificates={notificates}
            setNotificates={setNotificates}
          />
        ))}
    </div>
  );
};

export default ActivitiesNotification;
