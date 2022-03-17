import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import './Mng.css'
import AddAccount from './AddAccount';

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
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const handleEdit = (event, param) => {
  event.stopPropagation();
  console.log('click edit', param);
}

const handleBlock = (event, param) => {
  event.stopPropagation();
  //param.isblock = !param.isblock
}

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
    headerAlign: 'center',
    align: 'center',
    flex: 0.3,
    disableColumnMenu: true,
  },
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
  { field: 'username', headerName: 'Tài khoản', flex: 0.7 },
  { field: 'name', headerName: 'Tên người dùng', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'description', headerName: 'Mô tả', flex: 1.5 , sortable: false},
  {
    field: 'btn-edit',
    headerName: '',
    align: 'center',
    flex: 0.4,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (value) => {
      return (
        <Tooltip title="Chỉnh sửa" placement="right-start">
          <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
            handleEdit(event, value.row)
          }}><i class="fa-solid fa-pen-to-square" style={{ fontSize: 20 }}></i></Button>
        </Tooltip>
      )
    }
  },
  {
    field: 'btn-block',
    headerName: '',
    align: 'center',
    flex: 0.4,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (value) => {
      return (
        <Tooltip title={value.row.isblock ? "Gỡ chặn" : "Chặn"} placement="right-start">
          <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
            handleBlock(event, value.row)
          }}>
            <i class={value.row.isblock ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
              style={{ fontSize: 20 }}></i>
          </Button>
        </Tooltip>
      )
    }
  },
];

const rows = [
  {
    id: "1",
    img_url: "https://i.pinimg.com/564x/26/0e/13/260e13ad0a24c196d2bc97c8ac0249ca.jpg",
    username: "19521233",
    name: "Phạm Xuân Bách",
    description: "Facebook: http://...",
    email: "pxuanbach1412@gmail.com",
    isblock: false
  },
  {
    id: "2",
    img_url: "https://i.pinimg.com/236x/f8/e8/70/f8e87017fd7a250adddbfb0077e52088.jpg",
    username: "19521345",
    name: "Nguyễn Tiến Đạt",
    description: "Facebook: http://... Instagram:...",
    email: "datdovlog@gmail.com",
    isblock: false
  },
  {
    id: "3",
    img_url: "https://i.pinimg.com/236x/fb/cd/57/fbcd576b47cd78afcade6c8d28144cca.jpg",
    username: "19521344",
    name: "Nguyễn Đức Chí Đạt",
    description: "Facebook: http://...",
    email: "ducdat@gmail.com",
    isblock: false
  },
  {
    id: "4",
    img_url: "https://i.pinimg.com/236x/a6/3f/85/a63f851d50c42fd640ab222d63669397.jpg",
    username: "19521750",
    name: "Hồ Quang Linh",
    description: "Facebook: http://...",
    email: "linkhoquang@gmail.com",
    isblock: false
  },
  {
    id: "5",
    img_url: "https://i.pinimg.com/236x/8a/09/fb/8a09fb018a275a35aa588a7b93752207.jpg",
    username: "19522283",
    name: "Nguyễn Ngọc Thịnh",
    description: "Facebook: http://... Tôi là Thịnh",
    email: "thinhnn@gmail.com",
    isblock: false
  },

];


const ManageAccount = () => {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState()

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    console.log(search)
  }

  const handleOpen = () => setOpenModal(true);

  const handleClose = () => setOpenModal(false);

  return (
    <div className='container'>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddAccount handleClose={handleClose}/>
        </Box>
      </Modal>
      <div className='mng__header'>
        <h2>Quản lý tài khoản</h2>
        <div className='header__stack'>
          <div className='stack-left'>
              <CustomTextField
                id="search-field"
                label="Tìm kiếm (Tài khoản, tên, email)"
                variant="standard"
                value={search}
                onChange={handleChangeSearchField}
                size='small'
              />

            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                variant="text"
                disableElevation
                onClick={handleSearch}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </Button>
            </Tooltip>
          </div>

          <div className='stack-right'>
          <Button
              style={{ background: '#1B264D' }}
              variant="contained"
              disableElevation
              startIcon={<i class="fa-solid fa-plus"></i>}
              onClick={handleOpen}>
              Thêm tài khoản mới
            </Button>
            <Button
              style={{ background: '#1B264D' }}
              variant="contained"
              disableElevation
              startIcon={<i class="fa-solid fa-file-import"></i>}>
              <span>Nhập file</span>
            </Button>
            <Button
              style={{ background: '#1B264D' }}
              variant="contained"
              disableElevation
              startIcon={<i class="fa-solid fa-file-export"></i>}>
              <span>Xuất file</span>
            </Button>
            
          </div>
        </div>
      </div>
      <div className='mng__body'>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={8}
        />
      </div>

    </div>
  )
}

export default ManageAccount