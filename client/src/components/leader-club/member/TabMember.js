import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Box, Button, Tooltip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import io from 'socket.io-client'
import { ENDPT } from '../../../helper/Helper';
import {UserContext} from '../../../UserContext'
import './TabMember.css'

let socket

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

const TabMember = ({club_id}) => {
  const { user, setUser } = useContext(UserContext);
  const [leader, setLeader] = useState()
  const [treasurer, setTreasurer] = useState()
  const [members, setMembers] = useState([])

  const handleRemoveFromClub = (event, param) => {
    event.stopPropagation();
    socket.emit('remove-user-from-club', club_id, param._id)
  } 

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  useEffect(() => {
    //console.log('club id', club_id)
    socket.emit('get-user', club_id, 'leader')
    socket.emit('get-user', club_id, 'treasurer')
    socket.on('output-leader', res => {
      setLeader(res)
    })
    socket.on('output-treasurer', res => {
      setTreasurer(res)
    })
  }, [])

  useEffect(() => {
    socket.emit('get-members', club_id)
    socket.on('output-members', users => {
      setMembers(users)
    })
    
    socket.on('removed-user-from-club', (club_id, user) => {
      setMembers(members.filter(u => u._id !== user._id))
    })
  }, [members])

  const leaderColumns = [
    { field: '_id', headerName: 'ID', width: 70, flex: 0.5 },
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
    {
      field: 'name',
      headerName: 'Họ và tên',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      flex: 1
    },

    {
      field: 'username',
      headerName: 'Mã sinh viên',
      flex: 0.7
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
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

  const memberColumns = [
    { field: '_id', headerName: 'ID', width: 70, flex: 0.5 },
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
    {
      field: 'name',
      headerName: 'Họ và tên',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      flex: 1
    },

    {
      field: 'username',
      headerName: 'Mã sinh viên',
      flex: 0.7
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
  ];

  return (
    <div className='div-tabmember'>
      <div className='members__head'>
        <div className='members__card'>
          <h3>Trưởng câu lạc bộ</h3>
          <div className='member-selected'>
            <Avatar src={leader?.img_url}/>
            <div className='selected-info'>
              <span>{leader?.name}</span>
              <span>{leader?.email}</span>
            </div>
          </div>
        </div>
        <div className='members__card'>
          <h3>Thủ quỹ</h3>
          <div className='member-selected'>
            <Avatar src={treasurer?.img_url}/>
            <div className='selected-info'>
              <span>{treasurer?.name}</span>
              <span>{treasurer?.email}</span>
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
                '& > :not(style)': { width: '30ch' },
              }}
            >
              <CustomTextField id="search-field-tabmember" label="Tìm kiếm thành viên " variant="standard" />
            </Box>
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                className='btn-search3'
                variant="text"
                disableElevation
              >
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            <Button
              className='btn-add-tabmember'
              variant="contained"
              disableElevation
              style={{ background: '#1B264D' }}>
              Thêm thành viên
            </Button>
          </div>
        </div>
        <div style={{ height: 400, width: '95%', marginTop: '10px', marginLeft: '20px' }}>
          <DataGrid
            getRowId={(r) => r._id}
            rows={members}
            columns={user?.username.includes('admin') 
              || user?._id === leader?._id
              ? leaderColumns : memberColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>

      </div>
    </div>
  )
}

export default TabMember