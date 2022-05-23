import React, { useState, useEffect } from 'react'
import { Avatar, TextField, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../../helper/Axios';
import './AddGroup.css'

const AddGroup = ({ club_id, setShow, groups, setGroups }) => {
    const [name, setName] = useState();
    const [nameErr, setNameErr] = useState('');
    const [members, setMembers] = useState([]);
    const [membersSelected, setMembersSelected] = useState([])

    const handleClose = () => {
        setShow(false)
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
        const res = await axiosInstance.get(`/group/membersleadertreasurer/${club_id}`)

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
                    <DataGrid
                        getRowId={(r) => r._id}
                        checkboxSelection
                        autoHeight
                        rows={members}
                        columns={columns}
                        pageSize={4}
                        rowsPerPageOptions={[4]}
                        onSelectionModelChange={setMembersSelected}
                        selectionModel={membersSelected}
                    />
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