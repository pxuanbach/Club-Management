import React, { useState, useEffect } from 'react'
import { Avatar, TextField, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import io from 'socket.io-client'
import { ENDPT } from '../../../helper/Helper';

let socket

const UpdateGroup = ({ club_id, group, setShow }) => {
    const [name, setName] = useState(group?.name);
    const [nameErr, setNameErr] = useState('');
    const [members, setMembers] = useState([]);
    const [membersSelected, setMembersSelected] = useState([])

    const handleClose = () => {
        setShow(false)
    }

    const handleSave = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        socket = io(ENDPT);
        socket.emit('get-members-not-in-group', club_id, group.members)
        return () => {
            setMembersSelected([])
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('output-members-not-in-group', users => {
            setMembers(users)
        })
    }, [members])

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
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids)
                            const selectedRows = members.filter((row) =>
                                selectedIDs.has(row._id),
                            );
                            setMembersSelected(selectedRows)
                        }}
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

export default UpdateGroup