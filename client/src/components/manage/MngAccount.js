import React, { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, TextField, Button, Tooltip, Box, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import './Mng.css'
import AddAccount from './modal/AddAccount';
import io from 'socket.io-client'
import { ENDPT } from '../../helper/Helper';
import { UserContext } from '../../UserContext'
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
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState();
  const [userSelected, setUserSelected] = useState();
  const [users, setUsers] = useState([]);

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault();
    socket.emit('search-user', search)
  }

  const handleRefresh = (e) => {
    e.preventDefault();
    socket.emit('get-users')
  }

  const handleOpenAdd = () => setOpenModalAdd(true);
  const handleCloseAdd = () => setOpenModalAdd(false);

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    socket.emit('get-users')
    socket.on('output-users', users => {
      setUsers(users)
      //console.log('users', users)
    })
  }, [])

  useEffect(() => {
    socket.on('new-user', newUser => {
      setUsers([...users, newUser])
    })
    socket.on('output-search-user', users => {
      setUsers(users)
    })
  }, [users])

  const handleBlockOrUnblock = (event, param) => {
    event.stopPropagation();
    socket.emit('block-unblock-account', param._id)
    const updateUsers = users.map((elm) => {
      if (elm._id === param._id) {
        return {
          ...elm,
          isblocked: !param.isblocked
        }
      }
      return elm;
    });

    setUsers(updateUsers)
  }

  const handleDeleteUser = (event, param) => {
    event.stopPropagation();
    setUserSelected(param)
    setOpenDialog(true)
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
    { field: 'name', headerName: 'Tên người dùng', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'groups_num', headerName: 'Số nhóm tham gia', type: 'number', flex: 0.8, sortable: false },
    {
      field: 'btn-block',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title={value.row.isblocked ? "Gỡ chặn" : "Chặn"} placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleBlockOrUnblock(event, value.row)
              //console.log('block?', value.row.isblocked)
            }}>
              <i class={value.row.isblocked ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
                style={{ fontSize: 20 }}></i>
            </Button>
          </Tooltip>
        )
      }
    },
  ];

  if (!user) {
    return <Redirect to='/login' />
  }
  return (
    <div className='container'>
      <Modal
        open={openModalAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddAccount handleClose={handleCloseAdd} />
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
                <SearchIcon style={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            <Tooltip title='Làm mới' placement='right-start'>
              <Button style={{ borderColor: '#1B264D' }}
                className='btn-refresh'
                variant="outlined"
                disableElevation
                onClick={handleRefresh}>
                <RefreshIcon sx={{ color: '#1B264D' }} />
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