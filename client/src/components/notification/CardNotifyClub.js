import React from "react";
import { Avatar, Stack, Button } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import moment from 'moment'

const CardNotifyClub = ({ data, notificates, setNotificates }) => {
    const cancelNotification = async (e) => {
        e.preventDefault();
        let res = await axiosInstance.patch(
            `request/club/${data._id}`,
            JSON.stringify({ status: 2 }),
            { headers: { "Content-Type": "application/json" } }
        );
        const updateNotificates = notificates.map((elm) => {
            if (elm._id === res.data._id) {
                return {
                    ...elm,
                    status: res.data.status,
                };
            }
            return elm;
        });
        setNotificates(updateNotificates);
    };

    const acceptNotification = async (e) => {
        e.preventDefault();
        let res = await axiosInstance.patch(
            `request/club/${data._id}`,
            JSON.stringify({ status: 1 }),
            { headers: { "Content-Type": "application/json" } }
        );
        const updateNotificates = notificates.map((elm) => {
            if (elm._id === res.data._id) {
                return {
                    ...elm,
                    status: res.data.status,
                };
            }
            return elm;
        });
        setNotificates(updateNotificates);
    }

    const renderTypeAskButtonByStatus = () => {
        if (data?.status === 0) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={cancelNotification}
                    >
                        Hủy
                    </Button>
                </Stack>
            );
        } else if (data?.status === 1) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" disableElevation>
                        Đã tham gia
                    </Button>
                </Stack>
            );
        } else if (data?.status === 2) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" disableElevation sx={{ color: 'red' }}>
                        Đã hủy
                    </Button>
                </Stack>
            );
        }
    };

    const renderTypeInviteButtonByStatus = () => {
        if (data?.status === 0) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={acceptNotification}
                    >
                        Chấp nhận
                    </Button>
                    <Button
                        variant="outlined"
                        disableElevation
                        onClick={cancelNotification}
                    >
                        Hủy
                    </Button>
                </Stack>
            );
        } else if (data?.status === 1) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" disableElevation >
                        Đã tham gia
                    </Button>
                </Stack>
            );
        } else if (data?.status === 2) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" disableElevation sx={{ color: 'red' }}>
                        Đã hủy
                    </Button>
                </Stack>
            );
        }
    }

    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                backgroundColor: "#E3E3E3",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "2px",
            }}
        >
            <Avatar src={data?.club?.img_url} sx={{ width: 60, height: 60 }} />
            <Stack direction="column" spacing={2} alignItems="flex-start">
                {data?.type == "ask" ? (
                    <Stack direction="column" spacing={0.6}>
                        <span>
                            Bạn yêu cầu tham gia câu lạc bộ <b>{data?.club?.name}</b>
                        </span>
                        <p style={{fontSize: '13px', opacity: '80%'}}>{moment(data?.createdAt).fromNow()}</p>
                        {renderTypeAskButtonByStatus()}
                    </Stack>
                ) : (
                    <Stack direction="column" spacing={0.6}>
                        <span>
                            Câu lạc bộ <b>{data?.club?.name}</b> mời bạn tham gia
                        </span>
                        <p style={{fontSize: '13px', opacity: '80%'}}>{moment(data?.createdAt).fromNow()}</p>
                        {renderTypeInviteButtonByStatus()}
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default CardNotifyClub;
