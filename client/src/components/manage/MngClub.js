import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { styled } from '@mui/material/styles';
import AddClub from '../home/AddClub'
import io from 'socket.io-client'
import './Mng.css';
import {ENDPT} from '../../helper/Helper';
import {UserContext} from '../../UserContext'
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

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const handleEdit = (event, param) => {
  event.stopPropagation();
  console.log('click edit', param);
}

const handleBlock = (event, param) => {
  event.stopPropagation();
  //param.isblock = !param.isblock
}

const handleDelte = (event, param) => {
  event.stopPropagation();

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
  { field: 'description', headerName: 'Mô tả', flex: 1.5 },
  { field: 'leader', headerName: "Trưởng CLB", flex: 1 },
  { field: 'members_num', headerName: "Thành viên", type: 'number', flex: 0.5 },
  { field: 'fund', headerName: 'Quỹ', type: 'number', flex: 0.5 },
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
        <Tooltip title={value.row.isblocked ? "Gỡ chặn" : "Chặn"} placement="right-start">
          <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
            handleBlock(event, value.row)
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

const ManageClub = () => {
  const { user, setUser } = useContext(UserContext);
  const [showFormAddClub, setShowFormAddClub] = useState(false);
  const [search, setSearch] = useState()
  const [clubs, setClubs] = useState([])

  const handleChangeSearchField = (e) => {
    setSearch(e.target.value)
  }

  const handleSearch = (e) => {
    console.log(search)
  }

  const handleGetRowId = (e) => {
    return e.uniId
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
    socket.on('output-clubs', clbs => {
      setClubs(clbs)
      console.log('clubs', clubs)
    })
  }, [])

  useEffect(() => {
    socket.on('club-created', clb => {
      setClubs([...clubs, clb])
    })
  }, [clubs])

  if (!user) {
    return <Redirect to='/login'/>
  }
  return (
    <div className='container'>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormAddClub}
        onClose={() => {
          setShowFormAddClub(false);
        }}
        BackdropComponent={Backdrop}
      >
        <AddClub setShowFormAddClub={setShowFormAddClub} />
      </StyledModal>
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
              onClick={() => { setShowFormAddClub(true) }}>
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