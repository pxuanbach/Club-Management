import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    Button,
    ButtonGroup,
    Stack,
    Avatar,
    Tooltip,
    Box,
} from "@mui/material";
import moment from "moment";
import axiosInstance from "../../../helper/Axios";

const ClubPreview = ({ user, club }) => {
    const [activities, setActivities] = useState([]);
    const [isAsked, setIsAsked] = useState(false);

    const getActivityInMonth = async () => {
        let res = await axiosInstance.get(`/activity/list/${club._id}?inMonth=1`);

        const data = res.data;
        setActivities(data);
    };

    const isAskJoinClub = async () => {
        let res = await axiosInstance.get(`/request/club`, {
            params: {
                user: user._id,
                club: club._id,
                sender: user._id,
                type: "ask",
                status: 0
            }
        });

        const data = res.data;
        if (data === undefined || data.length == 0)
            setIsAsked(true);
    }

    const requestJoinClub = () => {
        axiosInstance.post('/request/club',
            JSON.stringify({
                sender: user._id,
                club: club._id,
                user: user._id,
                type: "ask"
            }), {
                headers: { 
                    'Content-Type': 'application/json'
                  },
            }
        ).then((response) => {
            console.log(response)
            if (response.data !== null || response.data !== undefined)
                setIsAsked(true);
        })
    }

    const requestJoinActivity = async () => {
        let res = await axiosInstance.post(`/request/activity`);

        const data = res.data;
    }

    useEffect(() => {
        isAskJoinClub();
        getActivityInMonth();
    }, []);

    return (
        <div>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2} alignContent="center" justifyContent="space-between" >
                    <Stack direction="row" spacing={2}>
                        <Avatar
                            src={club.img_url}
                            sx={{ height: "120px", width: "120px" }}
                        ></Avatar>
                        <Stack direction="column" spacing={1.5}>
                            <h1>{club.name}</h1>
                            <span>{club.description}</span>
                            <span>
                                Số lượng thành viên: <b>{club.members_num}</b>
                            </span>
                        </Stack>
                    </Stack>
                    <Box>
                        {isAsked ? (<Button
                            sx={{ background: '#1B264D' }}
                            variant="contained"
                            justifyContent="flex-start"
                            disableElevation
                            onClick={requestJoinClub}
                        >
                            THAM GIA CÂU LẠC BỘ
                        </Button>) : (<Button
                            sx={{ color: '#1B264D' }}
                            variant="outlined"
                            justifyContent="flex-start"
                            disableElevation
                        >
                            CHỜ XÁC NHẬN
                        </Button>)}
                    </Box>
                </Stack>
                <div className="members__head">
                    <div className="members__card">
                        <h3>Trưởng câu lạc bộ</h3>
                        <div className="member-selected">
                            <Avatar src={club.leader.img_url} />
                            <div className="selected-info">
                                <span>{club.leader.name}</span>
                                <span>{club.leader.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="members__card">
                        <h3>Thủ quỹ</h3>
                        <div className="member-selected">
                            <Avatar src={club.treasurer.img_url} />
                            <div className="selected-info">
                                <span>{club.treasurer.name}</span>
                                <span>{club.treasurer.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Stack direction="column" spacing={1}>
                    <h2>Các hoạt động sắp diễn ra</h2>
                    {activities &&
                        activities.map((activity) => (
                            <Stack
                                key={activity._id}
                                direction="row"
                                sx={{
                                    backgroundColor: "#E3E3E3",
                                    borderRadius: '10px',
                                    padding: '10px',
                                    marginBottom: '2px'
                                }}
                                justifyContent="space-between"
                                spacing={0.5}
                            >
                                <div>
                                    <h3>{activity.title}</h3>
                                    <span>
                                        Thời gian:{" "}
                                        <b>{moment(activity.startDate).format("DD/MM/YYYY HH:mm")}</b> -{" "}
                                        <b>{moment(activity.endDate).format("DD/MM/YYYY HH:mm")}</b>
                                    </span>
                                </div>
                                <div>
                                    <Button
                                        sx={{ background: '#1B264D' }}
                                        variant="contained"
                                        disableElevation
                                    >
                                        Tham gia
                                    </Button>
                                </div>
                            </Stack>
                        ))}
                </Stack>
            </Stack>
        </div>
    );
};

export default ClubPreview;
