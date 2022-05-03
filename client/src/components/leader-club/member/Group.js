import React, { useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './Group.css'

const Group = ({ data, socket, handleDeleteGroup, handleUpdateGroup }) => {
    
    const handleDeleteMember = (e, param) => {
        e.stopPropagation();
        socket.emit('delete-member-from-group', data._id, param._id) //group_id, member_id
    }

    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            disableColumnMenu: true,
        },
        {
            field: 'img_url',
            headerName: 'Hình đại diện',
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
        {
            field: 'name',
            headerName: 'Họ và tên',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 1
        },
        {
            field: 'username',
            headerName: 'Mã sinh viên',
            flex: 0.7
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 1.5 
        },
        {
            field: 'btn-delete',
            headerName: '',
            align: 'center',
            flex: 0.4,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (value) => {
              return (
                <Tooltip title="Xóa khỏi nhóm" placement="right-start">
                  <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
                    handleDeleteMember(event, value.row)
                  }}>
                    <ClearIcon/>
                  </Button>
                </Tooltip>
              )
            }
          }
    ];

    return (
        <div>
            <div className='header-group'>
                <h3 className='title-group'>{data.name}</h3>
                <div className='control-group'>
                    <Tooltip title='Chỉnh sửa' placement='right-start'>
                        <Button
                            onClick={handleUpdateGroup}
                            variant="outlined"
                            disableElevation
                        >
                            <EditIcon sx={{ color: '#1B264D' }} />
                        </Button>
                    </Tooltip>
                    <Tooltip title='Xóa nhóm' placement='right-start'>
                        <Button
                            onClick={handleDeleteGroup}
                            variant="outlined"
                            disableElevation
                        >
                            <DeleteOutlineIcon sx={{ color: '#1B264D' }} />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div style={{ marginTop: '10px', marginLeft: '20px' }}>
                <DataGrid
                    getRowId={(r) => r._id}
                    rows={data.members}
                    columns={columns}
                    pageSize={3}
                    rowsPerPageOptions={[3]}
                    autoHeight
                />
            </div>
        </div>
    )
}

export default Group