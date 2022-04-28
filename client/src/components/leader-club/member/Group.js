import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Divider, Button, Tooltip } from '@mui/material';

const Group = ({group}) => {

    const columns = [
        { field: '_id', headerName: 'ID', width: 70, flex: 0.5 },
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

    const rows = [
        { _id: 1, fullName: 'Nguyễn Văn A', avata: '', MSSV: '19521345', phoneNumber: '0123456789', email: '19521234@gm.uit.edu.vn' },
        { _id: 2, fullName: 'Nguyễn Văn A', MSSV: '19521345', phoneNumber: '0123456789', email: '19521234@gm.uit.edu.vn' },
        { _id: 3, fullName: 'Nguyễn Văn A', MSSV: '19521345', phoneNumber: '0123456789', email: '19521234@gm.uit.edu.vn' },

    ];

    return (
        <div>
            <h3 className='title-tabgroup'>Ban nội dung</h3>
            <div style={{ height: 267, width: '95%', marginTop: '10px', marginLeft: '20px' }}>
                <DataGrid
                    getRowId={(r) => r._id}
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
        </div>
    )
}

export default Group