import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import './TabGroup.css'
const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});
const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-30%, -45%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

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

];

const TabGroup = () => {
  return (
    <div className='div-tabgroup'>
      <div className='div-search-tabgroup'>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '30ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <CustomTextField id="search-field-tabmember" label="Tìm kiếm thành viên " variant="standard"  />
        </Box>
        <Tooltip title='Tìm kiếm' placement='right-start'>
          <Button
            className='btn-search3'
            variant="text"
            disableElevation
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </Button>
        </Tooltip>
        <Button className='btn-add-tabmember' variant="contained"  style={{ background: '#1B264D',marginTop:'15px', fontWeight:'600', width:'160px',height:'50px', fontSize:'13px' }} >Thêm thành viên</Button>
        <Button className='btn-add-tabmember' variant="contained"  style={{ background: '#1B264D',marginTop:'15px', fontWeight:'600', width:'160px',height:'50px', fontSize:'13px', marginLeft:'10px' }} >Thêm nhóm</Button>
      </div>
      <div>
        <h3 className='title-tabgroup'>Ban nội dung</h3>
        <div style={{ height: 267, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
        </div>

        <h3 className='title-tabgroup'>Ban truyền thông</h3>
        <div style={{ height: 267, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
        </div>

        <h3 className='title-tabgroup'>Ban hậu cần</h3>
        <div style={{ height: 267, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
        </div>

        <h3 className='title-tabgroup'>Ban đối ngoại</h3>
        <div style={{ height: 267, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
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

export default TabGroup