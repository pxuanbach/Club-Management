import React, { useState, useEffect, useContext } from "react";
import { Box, Stack, Button } from "@mui/material";
import axiosInstance from "../../helper/Axios";
import STB from "react-scroll-to-bottom";
import moment from "moment";
import FileDownload from 'js-file-download';
import { UserContext } from "../../UserContext";

const ClubLog = ({ club }) => {
    const { user } = useContext(UserContext)
    const [logs, setLogs] = useState([]);
    const space = 1.5

    const exportLogsFile = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.get(`/export/log/${club._id}/${user._id}`, {
                headers: { "Content-Type": "application/vnd.ms-excel" },
                responseType: 'blob'
            });
            const data = res.data;
            if (data) {
                FileDownload(data, Date.now() + `-nhatky_${club.name}.xlsx`)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getLogs = async () => {
        try {
            const res = await axiosInstance.get(`/log/${club._id}`, {
                headers: { "Content-Type": "application/json" },
            });
            const data = res.data;
            if (data) {
                setLogs(data);
                // console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getLogs();
    }, []);

    const renderLogByType = (log) => {
        switch (log.type) {
            case "club_created":
            case "club_blocked":
            case "club_unblock":
                return (
                    <Stack direction="row" spacing={space}>
                        <span>{moment(log.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                        <span>|</span>
                        <span>{log.mean}.</span>
                    </Stack>
                );
            case "promote_leader":
            case "promote_treasurer":
                return (
                    <Stack direction="row" spacing={space}>
                        <span>{moment(log.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                        <span>|</span>
                        <span>
                            <b>
                                {log.content.username} - {log.content.name}
                            </b>{" "}
                            được {log.mean.toLowerCase()}.
                        </span>
                    </Stack>
                );
            case "member_join":
            case "member_out":
                return (
                    <Stack direction="row" spacing={space}>
                        <span>{moment(log.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                        <span>|</span>
                        <span>
                            <b>
                                {log.content.username} - {log.content.name}
                            </b>{" "}
                            {log.mean.toLowerCase()}.
                        </span>
                    </Stack>
                );
            default:
                break;
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ padding: '6px 12px 6px 12px' }}
            >
                <h2>Nhật ký câu lạc bộ</h2>
                {user._id === club.leader._id && <Button
                    onClick={exportLogsFile}
                    style={{ background: "#1B264D" }}
                    variant="contained"
                    disableElevation
                    startIcon={<i class="fa-solid fa-file-export"></i>}
                >
                    Xuất file
                </Button>}
            </Stack>
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    overflow: "hidden",
                    borderTop: "1px solid #000000",
                    borderBottom: "1px solid #000000",
                    backgroundColor: "#E3E3E3",
                    justifyContent: 'center',
                    minWidth: "700px",
                }}
            >
                <STB>
                    {logs &&
                        logs.map((log) => (
                            <Box
                                sx={{ padding: 2 }}
                            >
                                {renderLogByType(log)}
                            </Box>
                        ))}
                </STB>
            </Box>
            <Box sx={{ height: '50px' }}></Box>
        </Box>
    );
};

export default ClubLog;
