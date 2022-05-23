import React, { useState, useEffect } from 'react'
import { Avatar, TextField, Button, Tooltip, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Buffer } from 'buffer';
import axiosInstance from '../../../helper/Axios';
import './AddGroup.css'

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#1B264D',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#1B264D',
    },
});

const AddGroup = ({ club_id, setShow, groups, setGroups }) => {
    const [search, setSearch] = useState();
    const [name, setName] = useState();
    const [nameErr, setNameErr] = useState('');
    const [members, setMembers] = useState([]);
    const [membersSelected, setMembersSelected] = useState([])

    const handleClose = () => {
        setShow(false)
    }

    const handleSearchMembersLeaderTreasurer = async (e) => {
        e.preventDefault();
        if (search) {
            const encodedSearch = new Buffer(search).toString('base64');
            const res = await axiosInstance.get(`/group/searchallmembers/${club_id}/${encodedSearch}`)

            const data = res.data;
            if (data) {
                setMembers(data)
            }
        } else {
            getMemberLeaderTreasurer()
        }
    }

    const handleSave = async (event) => {
        event.preventDefault();
        //console.log(members)
        setNameErr('')
        if (name) {
            //console.log(club_id, name, membersSelected)
            const res = await axiosInstance.post('group/create',
                JSON.stringify({
                    "clubId": club_id,
                    "name": name,
                    "members": membersSelected
                }), {
                headers: { 'Content-Type': 'application/json' }
            })

            const data = res.data
            if (data) {
                setGroups([...groups, data])
                handleClose();
            }
        } else {
            setNameErr('Tên nhóm trống')
        }
    }

    const getMemberLeaderTreasurer = async () => {
        const res = await axiosInstance.get(`/group/allmembers/${club_id}`)

        const data = res.data
        if (data) {
            setMembers(data)
        }
    }

    useEffect(() => {
        getMemberLeaderTreasurer();
    }, [])

    const columns = [
        {
            field: 'img_url',
            headerName: 'Hình đại diện',
            disableColumnMenu: true,
            sortable: false,
            align: 'center',
            flex: 0.6,
            renderCell: (value) => {
                return (
                    <Avatar src={value.row.img_url} />
                )
            }
        },
        {
            field: 'name',
            headerName: 'Họ và tên',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,
            flex: 1
        },

        {
            field: 'username',
            headerName: 'Mã sinh viên',
            flex: 0.7
        },
        { field: 'email', headerName: 'Email', flex: 1.5 },
    ];

    return (
        <div>
            <h2 id="modal-modal-title">
                Thêm nhóm mới
            </h2>
            <div id="modal-modal-description">
                <div className='addgroup-modal'>
                    <TextField
                        value={name}
                        size="small"
                        label="Tên nhóm"
                        variant='outlined'
                        sx={{ width: '100%' }}
                        onChange={(event) => {
                            setNameErr('')
                            setName(event.target.value)
                        }}
                        helperText={nameErr}
                        error={nameErr}
                    />
                    <div className='stack-left'>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { width: '30ch' },
                            }}>
                            <CustomTextField
                                value={search}
                                id="search-field-tabmember"
                                label="Tìm kiếm thành viên"
                                variant="standard"
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                                onKeyPress={event =>
                                    event.key === 'Enter'
                                        ? handleSearchMembersLeaderTreasurer(event)
                                        : null
                                }
                            />
                        </Box>
                        <Tooltip title='Tìm kiếm' placement='right-start'>
                            <Button
                                className='btn-search3'
                                variant="text"
                                disableElevation
                                onClick={handleSearchMembersLeaderTreasurer}
                            >
                                <SearchIcon sx={{ color: '#1B264D' }} />
                            </Button>
                        </Tooltip>
                    </div>
                    <div style={{ height: 52 * 3 + 56 + 55 }}>
                        <DataGrid
                            getRowId={(r) => r._id}
                            checkboxSelection
                            rows={members}
                            columns={columns}
                            pageSize={3}
                            onSelectionModelChange={setMembersSelected}
                            selectionModel={membersSelected}
                        />
                    </div>
                    <div className='stack-right'>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            disableElevation
                            onClick={handleClose}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGroup