import React, { useState, useEffect } from "react";
import { Avatar, Button, Stack, Box, Popover } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../../../helper/Axios";
import RangeDatePicker from "../../activity/utilities/RangeDatePicker";
import UserCard from '../../../card/UserCard';
import moment from 'moment';
import FileDownload from 'js-file-download';

const PointDetail = ({
    user,
    club,
    memberSelected,
    startDate,
    endDate,
    setShowFormDetail,
}) => {
    const [anchorUser, setAnchorUser] = useState(null);
    const openUserCard = Boolean(anchorUser);
    const [userSelected, setUserSelected] = useState()
    const [points, setPoints] = useState([]);
    const [totalPoint, setTotalPoint] = useState();
    const [sDate, setSDate] = useState(startDate);
    const [eDate, setEDate] = useState(endDate);

    const handleShowPopover = (event, data, setDate, setAnchorEl) => {
        setAnchorEl(event.currentTarget);
        setDate(data)
    };

    const handleClosePopover = (setAnchorEl) => {
        setAnchorEl(null);
    };

    const columns = [
        {
            field: "title",
            headerName: "Nội dung",
            flex: 2,
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            flex: 0.6,
            headerAlign: 'center',
            align: "center",
            valueGetter: (value) => moment(value.row.createdAt).format("DD/MM/YYYY HH:mm"),
        },
        {
            field: "author",
            headerName: "Người xác nhận",
            flex: 0.7,
            renderCell: (value) => {
                return (
                    <a href='#' onClick={(e) =>
                        handleShowPopover(e, value.row.author, setUserSelected, setAnchorUser)
                    }>
                        {value.row.author.name}
                    </a>
                )
            }
        },
        {
            field: "value",
            headerName: "Điểm",
            flex: 0.4,
            headerAlign: 'center',
            align: "center",
        },

    ];

    const handleClose = (e) => {
        e.preventDefault();
        setShowFormDetail(false);
    };

    const exportPointDetailFile = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.get(
                `/export/points/${club._id}/${user._id}/user/${memberSelected._id}`,
                {
                    params: {
                        startDate: sDate,
                        endDate: eDate
                    },
                    headers: { "Content-Type": "application/vnd.ms-excel" },
                    responseType: 'blob'
                });
            const data = res.data;
            if (data) {
                FileDownload(data, Date.now() + `-diem_${memberSelected.data.name}.xlsx`)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getPoints = async () => {
        const res = await axiosInstance.get(
            `/point/club/${club._id}/user/${memberSelected._id}`,
            {
                params: {
                    startDate: sDate,
                    endDate: eDate,
                },
            }
        );
        const data = res.data;
        if (data) {
            setTotalPoint(data.totalPoint);
            setPoints(data.points);
        }
    };

    useEffect(() => {
        getPoints();
    }, [sDate, eDate]);

    return (
        <Box>
            <Popover
                open={openUserCard}
                anchorEl={anchorUser}
                onClose={() => handleClosePopover(setAnchorUser)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <UserCard
                    user={userSelected}
                    isLeader={false}
                />
            </Popover>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={1} justifyContent='space-between' alignItems='center'>
                    <h2>Bảng điểm chi tiết</h2>
                    <Stack direction="row" spacing={1} alignItems='center'>
                        <RangeDatePicker
                            startDate={sDate}
                            setStartDate={setSDate}
                            endDate={eDate}
                            setEndDate={setEDate}
                        />
                        <div>
                            <Button
                                onClick={exportPointDetailFile}
                                sx={{ background: "#1B264D", minWidth: '140px', marginTop: 0.5 }}
                                variant="contained"
                                disableElevation
                                startIcon={<i class="fa-solid fa-file-export"></i>}
                            >
                                Xuất file
                            </Button>
                        </div>
                    </Stack>
                </Stack>
                <div
                    className="member-selected"
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={memberSelected.data.img_url} />
                        <Stack direction="column" spacing={0.6}>
                            <h3>
                                {memberSelected.data.name} - {memberSelected.data.username}
                            </h3>
                            <span>{memberSelected.data.email}</span>
                        </Stack>
                    </Stack>

                    <div style={{ display: "flex", justifySelf: "flex-end" }}>
                        <h3>Tổng điểm: {totalPoint ? totalPoint : memberSelected.point}</h3>
                    </div>
                </div>
                <div
                    style={{
                        height: 52 * 6 + 56 + 55,
                        width: "100%",
                        marginTop: "10px",
                    }}
                >
                    <DataGrid
                        getRowId={(r) => r._id}
                        rows={points}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                    />
                </div>
                <div className="stack-right">
                    <Button onClick={handleClose} variant="outlined" disableElevation>
                        Hủy
                    </Button>
                </div>
            </Stack>
        </Box>
    );
};

export default PointDetail;
