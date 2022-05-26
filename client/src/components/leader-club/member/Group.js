import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Button, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './Group.css'

const Group = ({ data, isLeader, handleDeleteGroup, handleUpdateGroup }) => {
    
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
            headerAlign: 'center',
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
    ];

    return (
        <div>
            <div className='header-group'>
                <h3 className='title-group'>{data.name}</h3>
                {isLeader ? 
                (<div className='control-group'>
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
                </div>) : <></>}
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