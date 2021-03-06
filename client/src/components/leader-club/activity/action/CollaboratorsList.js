import React, { useState, useEffect } from 'react';
import { Avatar, TextField, styled, Button, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../../../helper/Axios';
import { Buffer } from 'buffer';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#1B264D',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#1B264D',
    },
});

const CollaboratorsList = ({ setShow, activity, showSnackbar }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState();
    const [collaborators, setCollaborators] = useState([]);
    const [collaboratorsSelected, setCollaboratorsSelected] = useState([])

    const handleChangeSearch = event => {
        setSearch(event.target.value)
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleRemoveCollaborators = (event) => {
        event.preventDefault();
        setIsLoading(true)
        axiosInstance.patch(`/activity/updatecollaborators/${activity._id}`,
            JSON.stringify({
                "collaborators": collaboratorsSelected,
            }), {
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            //response.data
            getCollaborators()
            setIsLoading(false)
        }).catch(err => {
            //err.response.data.error
            showSnackbar(err.response.data.error)
        })
    }

    const handleSearch = (event) => {
        event.preventDefault();
        if (search) {
            const encodedSearch = new Buffer(search).toString('base64');
            axiosInstance.get(`/activity/searchcollaborators/${activity._id}/${encodedSearch}`)
                .then(response => {
                    //response.data
                    setCollaborators(response.data)
                }).catch(err => {
                    //err.response.data.error
                    showSnackbar(err.response.data.error)
                })
        } else {
            getCollaborators()
        }
    }

    const getCollaborators = () => {
        axiosInstance.get(`/activity/collaborators/${activity._id}`)
            .then(response => {
                //response.data
                setCollaborators(response.data)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error)
            })
    }

    useEffect(() => {
        getCollaborators()
    }, [])

    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            width: 70,
            headerAlign: 'center',
            align: 'center',
            flex: 0.6,
            disableColumnMenu: true,
        },
        {
            field: 'img_url',
            headerName: '',
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            flex: 0.5,
            renderCell: (value) => {
                return (
                    <Avatar src={value.row.img_url} />
                )
            }
        },
        { field: 'username', headerName: 'T??i kho???n', flex: 1 },
        { field: 'name', headerName: 'T??n', flex: 1.5 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
    ];

    return (
        <div className='addmember-modal'>
            <div className='stack-left'>
                <CustomTextField
                    id="search-field"
                    label="T??m ki???m c???ng t??c vi??n"
                    variant="standard"
                    value={search}
                    onChange={handleChangeSearch}
                    size='small'
                    onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
                />
                <Tooltip title='T??m ki???m' placement='right-start'>
                    <Button
                        variant="text"
                        disableElevation
                        onClick={handleSearch}
                    >
                        <SearchIcon sx={{ color: '#1B264D' }} />
                    </Button>
                </Tooltip>
                <Tooltip title='L??m m???i' placement='right-start'>
                    <Button sx={{ borderColor: '#1B264D' }}
                        className='btn-refresh'
                        variant="outlined"
                        disableElevation
                        onClick={getCollaborators}
                    >
                        <RefreshIcon sx={{ color: '#1B264D' }} />
                    </Button>
                </Tooltip>
            </div>
            <div className='members__body'>
                <DataGrid sx={{ height: 52 * 4 + 56 + 55 }}
                    checkboxSelection
                    getRowId={(r) => r._id}
                    rows={collaborators}
                    columns={columns}
                    pageSize={4}
                    onSelectionModelChange={setCollaboratorsSelected}
                    selectionModel={collaboratorsSelected}
                />
            </div>
            <div className="stack-right">
                <Button disabled={isLoading}
                    onClick={handleRemoveCollaborators}
                    variant="contained"
                    disableElevation>
                    X??a
                </Button>
                <Button disabled={isLoading}
                    onClick={handleClose}
                    variant="outlined"
                    disableElevation>
                    H???y
                </Button>
            </div>
        </div>
    )
}

export default CollaboratorsList