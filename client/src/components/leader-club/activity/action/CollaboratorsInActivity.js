import React, { useState, useEffect, FC, useMemo } from "react";
import { Avatar, TextField, styled, Button, Tooltip, Stack, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from "@mui/icons-material/Refresh";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axiosInstance from "../../../../helper/Axios";
import './OverrideExpandableTable.css'
import MaterialReactTable from 'material-react-table';

const CustomTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#1B264D",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#1B264D",
    },
});

const CollaboratorsInActivity = ({ setShow, activityId, showSnackbar, isFinished }) => {
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

    const handleRemoveCollaborators = (data) => {
        setIsLoading(true);
        axiosInstance
            .patch(
                `/activity/card/userexit/${data.cardId}`,
                JSON.stringify({
                    userId: data.collabId,
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
                const data = response.data
                setCollaborators(data);
            })
            .catch((err) => {
                //err.response.data.error
                console.log(err)
                showSnackbar(err.response.data.error);
            });
    };

    useEffect(() => {
        getCollaborators();
    }, []);

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'username',
                header: 'Tài khoản',
                // columnDefType: 'display',
                size: 30
            },
            {
                accessorKey: 'name',
                header: 'Tên',
                size: 150
            },

            {
                accessorKey: 'email',
                header: 'Email',
                size: 1
            },
            {
                accessorKey: 'point',
                header: 'Điểm',
                size: 0.3
            },
            {
                accessorKey: 'quantityCard',
                // enableColumnOrdering: false,
                header: 'Số thẻ tham gia',
                size: 0.3
            },
        ],
        [],
        //end
    );

    return (
        <div className="addmember-modal">
            <Stack direction="row"
                justifyContent="space-between"
                alignItems="center">
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
                <Button
                    disabled={isLoading}
                    onClick={handleClose}
                    variant="text"
                    disableElevation
                >
                    <CloseIcon sx={{ color: "#1B264D" }} />
                </Button>
            </Stack>
            <div className="members__body">
                <MaterialReactTable
                    columns={columns}
                    data={collaborators}
                    enableExpanding
                    enableExpandAll //default
                    enableRowActions
                    initialState={{ density: 'compact' }}
                    enableDensityToggle={false}
                    enableFullScreenToggle={false}
                    paginateExpandedRows={false}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderRowActions={({row}) => {
                        return (
                            <>
                                {
                                    (row.original.subRows === undefined
                                        && row.original.username !== "Tên thẻ tham gia") ? <Tooltip title="Đuổi khỏi thẻ">
                                        <IconButton onClick={() => handleRemoveCollaborators(row.original)}>
                                            <HighlightOffIcon sx={{ color: '#1B264D' }} />
                                        </IconButton>
                                    </Tooltip> : <></>
                                }
                            </>
                        )
                    }}
                    positionActionsColumn="last"
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [10, 20],
                        showFirstLastPageButtons: false,
                    }}
                />
            </div>
            {/* <div className="stack-right">
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
            </div> */}
        </div>
    );
};

export default CollaboratorsInActivity;
