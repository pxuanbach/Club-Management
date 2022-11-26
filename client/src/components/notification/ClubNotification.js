import React, { useState, useEffect } from 'react'
import CardNotifyClub from './CardNotifyClub';
import axiosInstance from '../../helper/Axios';

const ClubNotification = ({ user, showSnackbar }) => {
    const [notificates, setNotificates] = useState([]);

    const getAllNotification = async () => {
        const res = await axiosInstance.get(`/request/club`, {
            params: {
                user: user._id,
            },
        });
        const data = res.data;
        console.log(data);
        setNotificates(data);
    };

    useEffect(() => {
        getAllNotification();
    }, [user]);

    return (
        <div>
            {notificates &&
                notificates.map((noti) => (
                    <CardNotifyClub
                        data={noti}
                        notificates={notificates}
                        setNotificates={setNotificates}
                        showSnackbar={showSnackbar}
                    />
                ))}
        </div>
    )

}

export default ClubNotification