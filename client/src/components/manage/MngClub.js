import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar, TextField, Button, Tooltip, Box,
  Modal, Alert, Snackbar, Popover
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import AddClub from './modal/AddClub'
import UpdateClub from './modal/UpdateClub'
import DeleteClub from './modal/DeleteClub';
import './Mng.css';
import axiosInstance from '../../helper/Axios';
import { UserContext } from '../../UserContext'
import { Redirect } from 'react-router-dom'
import { Buffer } from 'buffer';
import FileDownload from 'js-file-download'
import UserCard from '../card/UserCard';
import SeverityOptions from '../../helper/SeverityOptions';

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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 3,
};

const ManageClub = () => {
  const { user } = useContext(UserContext);
  const [anchorUser, setAnchorUser] = useState(null);
  const [userSelected, setUserSelected] = useState()
  const [clubSelected, setClubSelected] = useState()
  const [openDialog, setOpenDialog] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [search, setSearch] = useState();
  const [clubs, setClubs] = useState([]);
  const openUserCard = Boolean(anchorUser);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [options, setOptions] = useState();

  const showSnackbar = (message, options) => {
    setOptions(options)
    setAlertMessage(message)
    setOpenSnackbar(true)
  }

  const handleShowPopover = (event, data, setDate, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
    setDate(data)
  };

  const handleClosePopover = (setAnchorEl) => {
    setAnchorEl(null);
  };

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    //console.log(search)
    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      const res = await axiosInstance.get(`/club/search/${encodedSearch}`)

      const data = res.data;
      //console.log(data)
      if (data) {
        setClubs(data)
      }
    } else {
      getListClub()
    }
  }

  const handleUpdate = (event, param) => {
    event.stopPropagation();
    setClubSelected(param);
    setShowFormUpdate(true)
  }

  const handleBlockOrUnblock = async (event, param) => {
    event.stopPropagation();
    //socket.emit('block-unblock-club', param._id)
    const res = await axiosInstance.patch(`/club/block/${param._id}`)
      .then(response => {
        const updateClubs = clubs.map((elm) => {
          if (elm._id === response.data._id) {
            return {
              ...elm,
              isblocked: response.data.isblocked
            }
          }
          return elm;
        });

        setClubs(updateClubs)
      }).catch(err => {
        //console.log(err.response.data)
        showSnackbar(err.response.data.error, SeverityOptions.error)
      })

    const data = res.data;

    if (data) {
      const updateClubs = clubs.map((elm) => {
        if (elm._id === data._id) {
          return {
            ...elm,
            isblocked: data.isblocked
          }
        }
        return elm;
      });

      setClubs(updateClubs)
    }
  }

  const handleDelete = (event, param) => {
    event.stopPropagation();
    setClubSelected(param);
    setOpenDialog(true)
  }

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
    { field: 'name', headerName: 'Tên câu lạc bộ', flex: 1.3 },
    {
      field: 'leader',
      headerName: "Trưởng câu lạc bộ",
      flex: 1,
      renderCell: (value) => {
        return (
          <a href='#' onClick={(e) =>
            handleShowPopover(e, value.row.leader, setUserSelected, setAnchorUser)
          }>
            {value.row.leader.name}
          </a>
        )
      }
    },
    {
      field: 'treasurer',
      headerName: "Thủ quỹ",
      flex: 1,
      renderCell: (value) => {
        return (
          <a href='#' onClick={(e) =>
            handleShowPopover(e, value.row.treasurer, setUserSelected, setAnchorUser)
          }>
            {value.row.treasurer.name}
          </a>
        )
      }
    },
    { field: 'members_num', headerName: "Thành viên", type: 'number', flex: 0.5 },
    { field: 'fund', headerName: 'Quỹ (VND)', type: 'number', flex: 0.8 },
    {
      field: 'btn-update',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Cập nhật" placement="right-start">
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
          <Tooltip title={value.row.isblocked ? "Gỡ chặn" : "Chặn"} placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleBlockOrUnblock(event, value.row)
            }}>
              <i class={value.row.isblocked ? "fa-solid fa-lock" : "fa-solid fa-lock-open"}
                style={{ fontSize: 20 }}></i>
            </Button>
          </Tooltip>
        )
      }
    },
    {
      field: 'btn-delete',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Xóa" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleDelete(event, value.row)
            }}>
              <ClearIcon />
            </Button>
          </Tooltip>
        )
      }
    }
  ];

  const handleExportClubs = (e) => {
    e.preventDefault()
    axiosInstance.get('/export/clubs', {
      headers: { "Content-Type": "application/vnd.ms-excel" },
      responseType: 'blob'
    })
      .then(response => {
        //console.log(response)
        FileDownload(response.data, Date.now() + '-caulacbo.xlsx')
      }).catch(err => {
        //console.log(err)
        showSnackbar(err.response.data.error, SeverityOptions.error)
      })
  }

  const getListClub = async () => {
    // let isAdmin = user?.username.includes('admin');
    let res = await axiosInstance.get(`/club/listnotjoin/${user._id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    let data = res.data
    if (data) {
      setClubs(data)
    }
  }

  useEffect(() => {
    getListClub()
  }, [])

  if (!user) {
    return <Redirect to='/login' />
  }
  return (
    <div className='container'>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={options}>{alertMessage}</Alert>
      </Snackbar>
      <Popover
        open={openUserCard}
        anchorEl={anchorUser}
        onClose={() => handleClosePopover(setAnchorUser)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <UserCard
          user={userSelected}
          isLeader={false}
        />
      </Popover>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddClub
            setShowFormAdd={setShowFormAdd}
            clubs={clubs}
            setClubs={setClubs}
            showSnackbar={showSnackbar}
          />
        </Box>
      </Modal>
      <Modal
        open={showFormUpdate}
        aria-labelledby="modal-update-title"
        aria-describedby="modal-update-description"
        onClose={(e) => {
          setShowFormUpdate(false);
        }}
      >
        <Box sx={style}>
          <UpdateClub
            club={clubSelected}
            clubs={clubs}
            setClubs={setClubs}
            setShowFormUpdate={setShowFormUpdate}
          />
        </Box>
      </Modal>
      <DeleteClub
        open={openDialog}
        setOpen={setOpenDialog}
        club={clubSelected}
        clubs={clubs}
        setClubs={setClubs}
      />
      <div className='mng__header'>
        <h2>Quản lý các câu lạc bộ</h2>
        <div className='header__stack'>
          <div className='stack-left'>
            <CustomTextField
              id="search-field"
              label="Tìm kiếm (Tên Câu lạc bộ)"
              variant="standard"
              value={search}
              onChange={handleChangeSearchField}
              size='small'
              onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
            />

            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                className='btn-search'
                variant="text"
                disableElevation
                onClick={handleSearch}>
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            <Tooltip title='Làm mới' placement='right-start'>
              <Button sx={{ borderColor: '#1B264D' }}
                className='btn-refresh'
                variant="outlined"
                disableElevation
                onClick={getListClub}>
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
              onClick={() => { setShowFormAdd(true) }}>
              Tạo Câu lạc bộ mới
            </Button>
            {/* <Button
              style={{ background: '#1B264D' }}
              variant="contained"
              disableElevation
              startIcon={<i class="fa-solid fa-file-import"></i>}>
              <span>Nhập file</span>
            </Button> */}
            <Button
              onClick={handleExportClubs}
              style={{ background: '#1B264D' }}
              variant="contained"
              disableElevation
              startIcon={<i class="fa-solid fa-file-export"></i>}
            >
              Xuất file
            </Button>
          </div>
        </div>
      </div>
      <div className='mng__body'>
        <DataGrid
          getRowId={(r) => r._id}
          rows={clubs}
          columns={columns}
          autoHeight
          pageSize={7}
        />
      </div>
    </div>
  )
}

export default ManageClub