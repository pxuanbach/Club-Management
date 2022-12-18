import React, { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    TextField,
    Button, Box,
    InputAdornment,
    Avatar, styled,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axiosInstance from "../../../helper/Axios";
import moment from "moment";
import NumberFormat from "react-number-format";

const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#1B264D",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#1B264D",
    },
});

const AddMonthlyFund = ({
    show, setShow, club, showSnackbar,
}) => {
    const current = moment();
    const [members, setMembers] = useState([]);

    let euroGerman = Intl.NumberFormat("en-DE");

    const getCurrentMonthlyFund = async () => {
        try {
            const res = await axiosInstance.get()
        } catch (err) {
            showSnackbar(err.response.data.error)
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
            flex: 0.6,
            renderCell: (value) => {
                return <Avatar src={value.row.img_url} />;
            },
        },
        {
            field: "name",
            headerName: "Họ và tên",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 200,
            flex: 1,
        },
        {
            field: "username",
            headerName: "Mã sinh viên",
            flex: 0.7,
        },
        { field: "email", headerName: "Email", flex: 1.5 },
    ];

    return (
        <div>
            <Stack direction="column" spacing={4}>
                <h2>Quỹ tháng {current.format("MM/YYYY")}</h2>
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    <Stack
                        direction="column"
                        spacing={1.5}
                        justifyContent="stretch"
                    >
                        <Typography sx={{ minWidth: 250 }}>Mức thu hàng tháng {" "}
                            {euroGerman.format(club.monthlyFund)}</Typography>
                        <Stack direction="row" spacing={1} alignItems="flex-end">
                            <CustomTextField
                                id="search-field"
                                label="Tìm kiếm người dùng"
                                variant="standard"
                                // value={search}
                                // onChange={handleChangeSearch}
                                size="small"
                            // onKeyPress={(event) =>
                            //     event.key === "Enter" ? handleSearch(event) : null
                            // }
                            />
                            <Tooltip title="Tìm kiếm" placement="right-start">
                                <Button variant="text" disableElevation
                                // onClick={handleSearch}
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
                                // onClick={getUsersNotMembers}
                                >
                                    <RefreshIcon sx={{ color: "#1B264D" }} />
                                </Button>
                            </Tooltip>
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
                            checkboxSelection
                            getRowId={(r) => r._id}
                            rows={members}
                            columns={columns}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                        // onSelectionModelChange={setMembersSelected}
                        // selectionModel={membersSelected}
                        />
                    </div>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                            // onClick={handleSaveConfig}
                            variant="contained"
                            disableElevation
                        >
                            Lưu
                        </Button>
                        <Button
                            onClick={() => setShow(false)}
                            variant="outlined"
                            disableElevation
                        >
                            Hủy
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    )
}

export default AddMonthlyFund;