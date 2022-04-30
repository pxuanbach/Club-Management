import React, {useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import './Group.css'

const Group = ({ data }) => {

    const handleUpdateGroup = (e) => {

    }

    const handleDeleteGroup = (e) => {

    }

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
                            <ClearIcon sx={{ color: '#1B264D' }} />
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
                    checkboxSelection
                />
            </div>
        </div>
    )
}

export default Group