import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './TabMember.css'


const columns = [
  { field: 'id', headerName: 'ID', width: 70,flex:0.5 },
  { field: 'img_url',
  headerName: 'Hình đại diện',
  disableColumnMenu: true,
  sortable: false,
  align: 'center',
  flex: 0.6,
  renderCell: (value) => {
    return (
      <Avatar src={value.row.img_url} />
    )
  } },
  {
    field: 'fullName', 
    headerName: 'Họ và tên',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    flex:1
  },

  {
    field: 'MSSV',
    headerName: 'MSSV',
    width: 150,
    flex:0.7
    
  },

  { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150,flex:1 },
  { field: 'email', headerName: 'Email', width: 150,flex:1.5}
];

const rows = [
  { id: 1, fullName: 'Nguyễn Văn A',avata:'', MSSV: '19521345',phoneNumber:'0123456789',email:'19521234@gm.uit.edu.vn' },
  { id: 2, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789',email:'19521234@gm.uit.edu.vn' },
  { id: 3, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789',email:'19521234@gm.uit.edu.vn' },
  { id: 4, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789',email:'19521234@gm.uit.edu.vn' },
  { id: 5, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789',email:'19521234@gm.uit.edu.vn' },
];
const TabMember = () => {

  return (
    <div>
      <div className='members__head'>
        <div className='members__card'>
          <h3>Trưởng câu lạc bộ</h3>
          <div className='member-selected'>
            <Avatar  />
            <div className='selected-info'>
              <span>{'Nguyễn Tiến Đạt'}</span>
              <span>{'19521345@gm.uit.edu.vn'}</span>
            </div>
          </div>
        </div>
        <div className='members__card'>
          <h3>Thủ quỹ</h3>
          <div className='member-selected'>
            <Avatar  />
            <div className='selected-info'>
              <span>{'Phạm Xuân Bách'}</span>
              <span>{'19521233@gm.uit.edu.vn'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='div-table-tabmember'>
        <h4 className='name-h4'>Thành viên (x)</h4>
        <div style={{ height: 400, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  )
}

export default TabMember