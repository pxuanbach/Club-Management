import React, { useState, useEffect } from 'react'
import { Avatar, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../../../helper/Axios'

const UpdateGroupInfo = ({group, groups, setGroups, setShow }) => {
    const [name, setName] = useState('');
    const [nameErr, setNameErr] = useState('');
    const [members, setMembers] = useState([]);
    const [membersSelected, setMembersSelected] = useState([])

    const handleClose = () => {
        setShow(false)
    }

    const handleConfirm = async (e) => {
        e.preventDefault();
        setNameErr('')
        if (name) {
            const res = await axiosInstance.patch(`/group/update/${group._id}`,
                JSON.stringify({
                    'newName': name,
                    'membersRemove': membersSelected,
                }), {
                headers: { 'Content-Type': 'application/json' }
            })

            const data = res.data
            if (data) {
                setMembersSelected([])
                setMembers(data.members)
                const updateGroups = groups.map((elm) => {
                    if (elm._id === data._id) {
                        return {
                            ...elm,
                            name: data.name,
                            members: data.members
                        }
                    }
                    return elm;
                });
                setGroups(updateGroups)
            }
        } else {
            setNameErr('Tên nhóm trống')
        }
    }

    const getGroup = async () => {
        const res = await axiosInstance.get(`/group/one/${group._id}`)

        const data = res.data
        if (data) {
            setName(data.name)
            setMembers(data.members)
        }
    }

    useEffect(() => {
        getGroup()
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
                    <span>Chọn thành viên để xóa khỏi nhóm</span>
                    <div style={{ height: 52 * 4 + 111 }}>
                        <DataGrid
                            getRowId={(r) => r._id}
                            checkboxSelection
                            rows={members}
                            columns={columns}
                            pageSize={4}
                            rowsPerPageOptions={[4]}
                            onSelectionModelChange={setMembersSelected}
                            selectionModel={membersSelected}
                        />
                    </div>
                    <div className='stack-right'>
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleConfirm}>
                            Xác nhận
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

export default UpdateGroupInfo