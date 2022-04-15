import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import AddClub from './modal/AddClub'
import UpdateClub from './modal/UpdateClub'
import DeleteClub from './modal/DeleteClub';
import io from 'socket.io-client'
import './Mng.css';
import { ENDPT } from '../../helper/Helper';
import { UserContext } from '../../UserContext'
import { Redirect } from 'react-router-dom'

let socket;

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
  p: 3,
};

const ManageClub = () => {
  const { user, setUser } = useContext(UserContext);
  const [clubSelected, setClubSelected] = useState()
  const [openDialog, setOpenDialog] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [search, setSearch] = useState()
  const [clubs, setClubs] = useState([])

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    console.log(search)
  }

  useEffect(() => {
    socket = io(ENDPT);
    //socket.emit('join', { username: values.username, password: values.password})
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    socket.emit('get-clubs', '', true)
    socket.on('output-clubs', clbs => {
      setClubs(clbs)
      console.log('clubs', clubs)
    })
  }, [])

  useEffect(() => {
    socket.on('club-created', clb => {
      setClubs([...clubs, clb])
    })
    socket.on('club-updated', clb => {
      const updateClubs = clubs.map((elm) => {
        if (elm._id === clb._id) {
          return {
            ...elm,
            name: clb.name,
            description: clb.description,
            img_url: clb.img_url,
            cloudinary_id: clb.cloudinary_id,
          }
        }
        return elm;
      });

      setClubs(updateClubs)
    })
    socket.on('club-deleted', clb => {
      var deleteClubs = clubs.filter(function(value, index, arr) {
        return value._id !== clb._id;
      })

      setClubs(deleteClubs)
    })
  }, [clubs])

  const handleUpdate = (event, param) => {
    event.stopPropagation();
    setClubSelected(param);
    setShowFormUpdate(true)
  }

  const handleBlockOrUnblock = (event, param) => {
    event.stopPropagation();
    socket.emit('block-unblock-club', param._id)
    const updateClubs = clubs.map((elm) => {
      if (elm._id === param._id) {
        return {
          ...elm,
          isblocked: !param.isblocked
        }
      }
      return elm;
    });

    setClubs(updateClubs)
  }

  const handleDelte = (event, param) => {
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
    { field: 'name', headerName: 'Tên câu lạc bộ', flex: 1.5 },
    { field: 'leader', headerName: "Trưởng CLB", flex: 1, valueGetter: (value) =>  value.row.leader.name},
    { field: 'treasurer', headerName: "Thủ quỹ", flex: 1, valueGetter: (value) =>  value.row.treasurer.name },
    { field: 'members_num', headerName: "Thành viên", type: 'number', flex: 0.5 },
    { field: 'fund', headerName: 'Quỹ', type: 'number', flex: 0.5 },
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
              handleDelte(event, value.row)
            }}>
              <i class="fa-solid fa-trash-can"
                style={{ fontSize: 20 }}></i>
            </Button>
          </Tooltip>
        )
      }
    }
  ];

  if (!user) {
    return <Redirect to='/login' />
  }
  return (
    <div className='container'>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddClub setShowFormAdd={setShowFormAdd} />
        </Box>
      </Modal>
      <Modal
        open={showFormUpdate}
        aria-labelledby="modal-update-title"
        aria-describedby="modal-update-description"
        onClose={() => {
          setShowFormUpdate(false);
        }}
      >
        <Box sx={style}>
          <UpdateClub
            club={clubSelected}
            setShowFormUpdate={setShowFormUpdate}
          />
        </Box>
      </Modal>
      <DeleteClub 
        open={openDialog}
        setOpen={setOpenDialog}
        club={clubSelected}
        socket={socket}
      />
      <div className='mng__header'>
        <h2>Quản lý các câu lạc bộ</h2>
        <div className='header__stack'>
          <div className='stack-left'>
            <CustomTextField
              id="search-field"
              label="Tìm kiếm (Tên CLB, tên trưởng CLB)"
              variant="standard"
              value={search}
              onChange={handleChangeSearchField}
              size='small'
            />

            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                className='btn-search'
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
              onClick={() => { setShowFormAdd(true) }}>
              Tạo Câu lạc bộ mới
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