import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './TabMember.css'
// import ClearIcon from '@mui/icons-material/Clear';
// import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
// import { ENDPT } from '../../../helper/Helper';
// import io from 'socket.io-client'
// let socket
const columns = [
  { field: 'id', headerName: 'STT', width: 70 },
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
    flex:0.5
    
  },
  { field: 'position', headerName: 'Chức vụ', width: 150,flex:0.5 },


  { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150,flex:0.5 },
];

const rows = [
  { id: 1, fullName: 'Nguyễn Tiến Đạt', MSSV: '19521345', position: 'Nhóm trưởng',phoneNumber:'0123456789' },
  { id: 2, fullName: 'Phạm Xuân Bách', MSSV: '19521233', position: 'Thủ quỹ',phoneNumber:'0123456789' },
];

const columns1 = [
  { field: 'id', headerName: 'STT', width: 70 },
  {
    field: 'fullName', 
    headerName: 'Họ và tên',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    flex:0.3
  },
  {
    field: 'MSSV',
    headerName: 'MSSV',
    width: 150,
    flex:0.2
    
  },

  { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150,flex:0.4 },
];

const rows1 = [
  { id: 1, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789' },
  { id: 2, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789' },
  { id: 3, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789' },
  { id: 4, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789' },
  { id: 5, fullName: 'Nguyễn Văn A', MSSV: '19521345',phoneNumber:'0123456789' },
];
const TabMember = ({ club }) => {

  return (
    <div>
      <div className='tabmember__head'>
        <div className='members__card'>
          <h3>Trưởng câu lạc bộ</h3>
          <div className='member-selected'>
            <Avatar  />
            <div className='selected-info'>
              <span>{'ABC'}</span>
              <span>{'abc@gmail.com'}</span>
            </div>
          </div>
        </div>
        <div className='members__card'>
          <h3>Thủ quỹ</h3>
          <div className='member-selected'>
            <Avatar  />
            <div className='selected-info'>
              <span>{'ABC'}</span>
              <span>{'ABC@GMAIL.COM'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='div-table-tabmember'>
        <h4 className='name-h4'>Trưởng CLB (2)</h4>
        <div style={{ height: 215, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </div>
      <div className='div-table-tabmember'>
        <h4 className='name-h4'>Thành viên (x)</h4>
        <div style={{ height: 400, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
          <DataGrid
            rows={rows1}
            columns={columns1}
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