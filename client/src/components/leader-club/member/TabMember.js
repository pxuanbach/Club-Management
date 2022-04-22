import React, { useState, useEffect } from 'react'
import { Avatar, Box, Button, Tooltip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import './TabMember.css'
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

const TabMember = () => {

  const handleRemoveFromClub = (event, param) => {
    event.stopPropagation();
    //socket.emit('remove-user-from-club', club._id, param._id)
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 70,flex:0.5 },
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
      field: 'name', 
      headerName: 'Họ và tên',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      flex:1
    },
  
    {
      field: 'username',
      headerName: 'Mã sinh viên',
      flex:0.7
    },
    { field: 'email', headerName: 'Email', flex: 1.5},
    {
      field: 'btn-remove',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Xóa khỏi câu lạc bộ" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleRemoveFromClub(event, value.row)
            }}>
              <ClearIcon />
            </Button>
          </Tooltip>
        )
      }
    },
  ];

  return (
    <div className='div-tabmember'>
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
        <div className='header-table-tabmember'>
          <h3 className='name-h4'>Thành viên (x)</h3>
          <div className='div-search-tabmember'>
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
            <Button className='btn-add-tabmember' variant="contained"  style={{ background: '#1B264D',marginTop:'15px', fontWeight:'600' }} >Thêm thành viên</Button>
          </div>
        </div>
        <div style={{ height: 400, width: '95%',marginTop:'10px',marginLeft:'20px'  }}>
          <DataGrid
            rows={null}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>

      </div>
    </div>
  )
}

export default TabMember