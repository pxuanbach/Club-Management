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
import SeverityOptions from "../../../helper/SeverityOptions";

const ClubPreview = ({ user, club, showSnackbar }) => {
    const [activities, setActivities] = useState([]);
    const [isShowButton, setIsShowButton] = useState(false);
    const [isAsked, setIsAsked] = useState(false);

    const getActivityInMonth = async () => {
        let res = await axiosInstance.get(`/activity/list/${club._id}`,
            {
                params: {
                    inMonth: true,
                    userId: user._id
                }
            }
        );

        const data = res.data;
        // console.log(data)
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
        if (data === undefined || data.length == 0) {
            setIsAsked(true);
        }
        setIsShowButton(true);
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
            // console.log(response)
            if (response.data != null || response.data != undefined)
                setIsAsked(false);
        }).catch((error) => {
            // console.log(error.response.data.error)
            showSnackbar(error.response.data.error, SeverityOptions.error)
        })
    }

    const requestJoinActivity = async (activity) => {
        try {
            let res = await axiosInstance.post(`/request/activity`,
                JSON.stringify({
                    sender: user._id,
                    activity: activity._id,
                    user: user._id,
                    type: "ask",
                    club: club._id
                }), {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = res.data
            if (data !== null || data !== undefined) {
                // console.log(data)
                const updateActivities = activities.map((elm) => {
                    if (elm._id === data.activity) {
                        // console.log(elm)
                        return {
                            ...elm,
                            requested: true
                        }
                    }
                    return elm;
                });
                setActivities(updateActivities)
            }
        } catch (err) {
            showSnackbar(err.response.data.error, SeverityOptions.error)
        }
    }

const renderButtonJoinClub = () => {
    if (isShowButton) {
        if (isAsked) {
            return (
                <Button
                    sx={{ background: '#1B264D' }}
                    variant="contained"
                    justifyContent="flex-start"
                    disableElevation
                    onClick={requestJoinClub}
                >
                    THAM GIA NGAY
                </Button>
            )
        } else {
            return (
                <Button
                    sx={{ color: '#1B264D' }}
                    variant="outlined"
                    justifyContent="flex-start"
                    disableElevation
                >
                    CHỜ XÁC NHẬN
                </Button>
            )
        }
    }
    return <></>
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
                    {renderButtonJoinClub()}
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
                <h3>Các hoạt động sắp diễn ra</h3>
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
                                {activity.requested ?
                                    <Button
                                        sx={{ color: '#1B264D' }}
                                        variant="outlined"
                                        disableElevation
                                    >
                                        Chờ xác nhận
                                    </Button> : <Button
                                        sx={{ background: '#1B264D' }}
                                        variant="contained"
                                        disableElevation
                                        onClick={() => requestJoinActivity(activity)}
                                    >
                                        Tham gia
                                    </Button>}
                            </div>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
    </div>
);
};

export default ClubPreview;
