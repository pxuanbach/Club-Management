import React from "react";
import { Avatar, Stack, Button } from "@mui/material";
import axiosInstance from "../../helper/Axios";

const CardActivity = ({ data, notificates, setNotificates }) => {
    const cancelNotification = async (e) => {
        e.preventDefault();
        let res = await axiosInstance.patch(
            `request/activity/${data._id}`,
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

    const renderButtonByStatus = () => {
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
                    <Button variant="text" disableElevation>
                        Đã hủy
                    </Button>
                </Stack>
            );
        }
    };

    return (
        <div>
            <Stack
                direction="column"
                spacing={2}
                alignItems="flex-start"
                sx={{
                    backgroundColor: "#E3E3E3",
                    borderRadius: "10px",
                    padding: "10px",
                    marginBottom: "2px",
                }}
            >
                {data?.type == "ask" ? (
                    <Stack direction="column" spacing={1.5} alignSelf="flex-start">
                        <Stack direction="row" spacing={0.6}>
                            <span>
                                Bạn yêu cầu tham gia hoạt động <b>{data?.activity?.title}</b>{" "}
                                của câu lạc bộ <b>{data?.club?.name}</b>
                            </span>
                        </Stack>
                        {renderButtonByStatus()}
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={1}>
                        <h4>{data?.club?.name} </h4>
                        <span>mời bạn tham gia</span>
                        <h4>{data?.activity?.title} </h4>
                    </Stack>
                )}
            </Stack>
        </div>
    );
};

export default CardActivity;
