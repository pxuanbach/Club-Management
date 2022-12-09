import React, { useState, useEffect } from "react";
import { Avatar, TextField, styled, Button, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../../../helper/Axios";
import { Buffer } from "buffer";

const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#1B264D",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#1B264D",
    },
});

const CollaboratorsList = ({ setShow, activityId, showSnackbar, isFinished }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState();
    const [collaborators, setCollaborators] = useState([]);
    const [collaboratorsSelected, setCollaboratorsSelected] = useState([]);

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleRemoveCollaborators = (event) => {
        event.preventDefault();
        setIsLoading(true);
        axiosInstance
            .patch(
                `/activity/updatecollaborators/${activityId}`,
                JSON.stringify({
                    collaborators: collaboratorsSelected,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .then((response) => {
                //response.data
                getCollaborators();
                setIsLoading(false);
            })
            .catch((err) => {
                //err.response.data.error
                showSnackbar(err.response.data.error);
            });
    };

    const getCollaborators = () => {
        axiosInstance
            .get(`/point/activity/${activityId}`, {
                params: {
                    search: search,
                },
            })
            .then((response) => {
                //response.data
                setCollaborators(response.data);
            })
            .catch((err) => {
                //err.response.data.error
                showSnackbar(err.response.data.error);
            });
    };

    useEffect(() => {
        getCollaborators();
    }, []);

    const columns = [
        {
            field: "img_url",
            headerName: "",
            disableColumnMenu: true,
            sortable: false,
            align: "center",
            flex: 0.5,
            renderCell: (value) => {
                return <Avatar src={value.row.img_url} />;
            },
        },
        {
            field: "username",
            headerName: "Tài khoản",
            flex: 1,
            valueGetter: (value) => value.row.username,
        },
        {
            field: "name",
            headerName: "Tên",
            flex: 1.5,
            valueGetter: (value) => value.row.name,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
            valueGetter: (value) => value.row.email,
        },
        {
            field: "point",
            headerName: "Điểm",
            flex: 0.5,
        },
    ];

    return (
        <div className="addmember-modal">
            <div className="stack-left">
                <CustomTextField
                    id="search-field"
                    label="Tìm kiếm cộng tác viên"
                    variant="standard"
                    value={search}
                    onChange={handleChangeSearch}
                    size="small"
                    onKeyPress={(event) =>
                        event.key === "Enter" ? getCollaborators() : null
                    }
                />
                <Tooltip title="Tìm kiếm" placement="right-start">
                    <Button variant="text" disableElevation onClick={getCollaborators}>
                        <SearchIcon sx={{ color: "#1B264D" }} />
                    </Button>
                </Tooltip>
                <Tooltip title="Làm mới" placement="right-start">
                    <Button
                        sx={{ borderColor: "#1B264D" }}
                        className="btn-refresh"
                        variant="outlined"
                        disableElevation
                        onClick={getCollaborators}
                    >
                        <RefreshIcon sx={{ color: "#1B264D" }} />
                    </Button>
                </Tooltip>
            </div>
            <div className="members__body">
                <DataGrid
                    sx={{ height: 52 * 5 + 56 + 55 }}
                    checkboxSelection
                    getRowId={(r) => r._id}
                    rows={collaborators}
                    columns={columns}
                    pageSize={5}
                    onSelectionModelChange={setCollaboratorsSelected}
                    selectionModel={collaboratorsSelected}
                />
            </div>
            <div className="stack-right">
                <Button
                    disabled={isLoading || isFinished}
                    onClick={handleRemoveCollaborators}
                    variant="contained"
                    disableElevation
                >
                    Xóa
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={handleClose}
                    variant="outlined"
                    disableElevation
                >
                    Hủy
                </Button>
            </div>
        </div>
    );
};

export default CollaboratorsList;
