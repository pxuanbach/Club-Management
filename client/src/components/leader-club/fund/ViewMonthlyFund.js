import React, { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    TextField,
    Button, Box,
    Checkbox,
    Avatar, styled,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axiosInstance from "../../../helper/Axios";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import FileDownload from 'js-file-download';

const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#1B264D",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#1B264D",
    },
});

const ViewMonthlyFund = ({
    show, setShow, fund, user
}) => {
    const isReadOnly = true
    const [currentMonthlyFund, setCurrentMonthlyFund] = useState()
    const [submittedList, setSubmittedList] = useState([]);
    const [submittedCount, setSubmittedCount] = useState(0);
    const [search, setSearch] = useState('')

    let euroGerman = Intl.NumberFormat("en-DE");

    const getCurrentMonthlyFund = async () => {
        const res = await axiosInstance.get(`/fund/${fund._id}`)
        const data = res.data
        console.log(data)
        let count = 0
        data.submitted.map((obj) => {
            if (obj.total > 0) {
                count++;
            }
        })
        setSubmittedCount(count)
        setSubmittedList(data.submitted)
        setCurrentMonthlyFund(data)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (search !== "") {
            const res = await axiosInstance.get(`/fund/${fund._id}`)
            const data = res.data
            // console.log(data)
            let count = 0
            const updatedSubmitted = data.submitted.filter((obj) => {
                if (obj.member_id.name.includes(search)
                    || obj.member_id.username.includes(search)
                    || obj.member_id.email.includes(search)) {
                    if (obj.total > 0) {
                        count++;
                    }
                    return obj
                }
            })
            setSubmittedCount(count)
            setSubmittedList(updatedSubmitted)
            setCurrentMonthlyFund(data)

        } else {
            getCurrentMonthlyFund()
        }
    }

    const exportMonthlyFundFile = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.get(
                `/export/monthlyfund/${currentMonthlyFund._id}/${user._id}`, {
                headers: { "Content-Type": "application/vnd.ms-excel" },
                responseType: 'blob'
            });
            const data = res.data;
            if (data) {
                FileDownload(data, Date.now() + `${fund.content}.xlsx`)
            }
        } catch (err) {
            console.log(err)
            // showSnackbar(err.response.data.error)
        }
    }

    const columns = [
        {
            field: "img_url",
            headerName: "",
            headerAlign: "center",
            disableColumnMenu: true,
            sortable: false,
            align: "center",
            flex: 0.5,
            renderCell: (value) => {
                return <Avatar src={value.row.member_id.img_url} />;
            },
        },
        {
            field: "name",
            headerName: "Họ và tên",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 200,
            flex: 1,
            valueGetter: (value) => value.row.member_id.name
        },
        {
            field: "username",
            headerName: "Mã sinh viên",
            flex: 0.7,
            valueGetter: (value) => value.row.member_id.username
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
            valueGetter: (value) => value.row.member_id.email
        },
        {
            field: "submittedAt",
            headerName: "Ngày nộp",
            flex: 1,
            valueGetter: (value) => moment(value.row.submittedAt).format("DD/MM/YYYY HH:mm")
        },
        {
            field: "submitted",
            flex: 0.4,
            sortable: false,
            filterable: false,
            hideable: false,
            renderHeader: () => (
                <Checkbox
                    disabled={isReadOnly}
                />
            ),
            renderCell: (value) => {
                return <Checkbox
                    disabled={isReadOnly}
                    checked={value.row.total > 0}
                />;
            },
        }
    ];

    useEffect(() => {
        getCurrentMonthlyFund()
    }, [])

    return (
        <div>
            <Stack direction="column" spacing={4}>
                <Stack direction="row" justifyContent="space-between">
                    <h2>Quỹ tháng {moment(currentMonthlyFund?.createdAt).format("MM/YYYY")}</h2>
                    <Button
                        // disabled={isLoading}
                        onClick={() => setShow(false)}
                        variant="text"
                        disableElevation
                    >
                        <CloseIcon sx={{ color: "#1B264D" }} />
                    </Button>
                </Stack>
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    <Stack
                        direction="column"
                        spacing={1.5}
                        justifyContent="stretch"
                    >
                        <Typography sx={{ minWidth: 250 }}>Tổng thu {" "}
                            {euroGerman.format(currentMonthlyFund?.total)} đ.</Typography>
                        <Typography>{submittedCount}/{submittedList.length} đã nộp.</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                            <Stack direction="row" spacing={1} alignItems="flex-end">
                                <CustomTextField
                                    id="search-field"
                                    label="Tìm kiếm người dùng"
                                    variant="standard"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    size="small"
                                    onKeyPress={(event) =>
                                        event.key === "Enter" ? handleSearch(event) : null
                                    }
                                />
                                <Tooltip title="Tìm kiếm" placement="right-start">
                                    <Button variant="text" disableElevation
                                        onClick={handleSearch}
                                    >
                                        <SearchIcon sx={{ color: "#1B264D" }} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Làm mới" placement="right-start">
                                    <Button
                                        sx={{ borderColor: "#1B264D" }}
                                        className="btn-refresh"
                                        variant="outlined"
                                        disableElevation
                                        onClick={getCurrentMonthlyFund}
                                    >
                                        <RefreshIcon sx={{ color: "#1B264D" }} />
                                    </Button>
                                </Tooltip>
                            </Stack>
                            <Button
                                onClick={exportMonthlyFundFile}
                                style={{ background: "#1B264D", minWidth: '140px' }}
                                variant="contained"
                                disableElevation
                                startIcon={<i class="fa-solid fa-file-export"></i>}
                            >
                                Xuất file
                            </Button>
                        </Stack>
                    </Stack>
                    <div
                        style={{
                            height: 52 * 7 + 56 + 55,
                            width: "100%",
                            marginTop: "10px",
                        }}
                    >
                        <DataGrid
                            // checkboxSelection
                            getRowId={(r) => r._id}
                            rows={submittedList}
                            columns={columns}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                        />
                    </div>
                </Stack>
            </Stack>
        </div>
    )
}

export default ViewMonthlyFund;