import React, { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import './Mng.css'
import AddAccount from './modal/AddAccount';
import UpdateAccount from './modal/UpdateAccount';
import io from 'socket.io-client'
import { ENDPT } from '../../helper/Helper';
import {UserContext} from '../../UserContext'
import { Redirect } from 'react-router-dom'

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
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

let socket;

const ManageAccount = () => {
  const { user, setUser } = useContext(UserContext);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [search, setSearch] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [users, setUsers] = useState([]);

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    console.log(search)
  }

  const handleOpenAdd = () => setOpenModalAdd(true);
  const handleCloseAdd = () => setOpenModalAdd(false);
  const handleOpenUpdate = () => setOpenModalUpdate(true);
  const handleCloseUpdate = () => setOpenModalUpdate(false);

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    socket.on('output-users', users => {
      setUsers(users)
      //console.log('users', users)
    })
  }, [])

  const handleUpdate = (event, param) => {
    event.stopPropagation();
    //console.log(param)
    setSelectedAccount(param)
    handleOpenUpdate();
  }
  
  const handleBlock = (event, param) => {
    event.stopPropagation();
    //param.isblock = !param.isblock
  }
  
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 70,
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
    { field: 'groups_num', headerName: 'Số nhóm tham gia', flex: 1 , sortable: false},
    {
      field: 'btn-update',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Chỉnh sửa" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleUpdate(event, value.row)
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

  if (!user) {
    return <Redirect to='/login'/>
  }
  return (
    <div className='container'>
      <Modal
        open={openModalUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateAccount handleClose={handleCloseUpdate} account={selectedAccount}/>
        </Box>
      </Modal>
      <Modal
        open={openModalAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddAccount handleClose={handleCloseAdd}/>
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
              onClick={handleOpenAdd}>
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
          getRowId={(r) => r._id}
          rows={users}
          columns={columns}
          autoHeight
          pageSize={7}
        />
      </div>

    </div>
  )
}

export default ManageAccount