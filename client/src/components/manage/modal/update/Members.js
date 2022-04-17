import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import io from 'socket.io-client'
import './Members.css'
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { ENDPT } from '../../../../helper/Helper';

let socket

const Members = ({ club }) => {
  const [leader, setLeader] = useState()
  const [treasurer, setTreasurer] = useState()
  const [users, setUsers] = useState([])

  const handlePromotedToLeader = (event, param) => {
    event.stopPropagation();
    //console.log('leader')
    socket.emit('promote-to-leader', club._id, leader._id, param._id)
  }

  const handlePromotedToTreasurer = (event, param) => {
    event.stopPropagation();
    //console.log('treasurer')
    socket.emit('promote-to-treasurer', club._id, treasurer._id, param._id)
  }

  const handleRemoveFromClub = (event, param) => {
    event.stopPropagation();
    socket.emit('remove-user-from-club', club._id, param._id)
  }

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    //console.log('leader', club.leader._id)
    socket.emit('get-user', club.leader._id, 'leader')
    socket.emit('get-user', club.treasurer._id, 'treasurer')
    socket.on('output-leader', res => {
      setLeader(res)
    })
    socket.on('output-treasurer', res => {
      setTreasurer(res)
    })
    socket.on('promoted-to-leader', new_leader => {
      setLeader(new_leader)
      socket.emit('get-members', club._id)
    })
    socket.on('promoted-to-treasurer', new_treasurer => {
      setTreasurer(new_treasurer)
      socket.emit('get-members', club._id)
    })
  }, [])

  useEffect(() => {
    socket.emit('get-members', club._id)
    socket.on('output-members', users => {
      setUsers(users)
    })
    socket.on('removed-user-from-club', user => {
      setUsers(users.filter(u => u._id !== user._id))
    })
  }, [users])

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
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      align: 'center',
      flex: 0.5,
      renderCell: (value) => {
        return (
          <Avatar src={value.row.img_url} />
        )
      }
    },
    { field: 'name', headerName: 'Tên', flex: 1.2 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'btn-club-leader',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Làm trưởng câu lạc bộ" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handlePromotedToLeader(event, value.row)
            }}>
              <KeyboardDoubleArrowUpIcon />
            </Button>
          </Tooltip>
        )
      }
    },
    {
      field: 'btn-club-treasurer',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Làm thủ quỹ" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handlePromotedToTreasurer(event, value.row)
            }}>
              <CurrencyExchangeIcon />
            </Button>
          </Tooltip>
        )
      }
    },
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
    <div>
      <div className='members__head'>
        <div className='members__card'>
          <h3>Trưởng câu lạc bộ</h3>
          <div className='member-selected'>
            <Avatar alt={leader?.name} src={leader?.img_url} />
            <div className='selected-info'>
              <span>{leader?.name}</span>
              <span>{leader?.email}</span>
            </div>
          </div>
        </div>
        <div className='members__card'>
          <h3>Thủ quỹ</h3>
          <div className='member-selected'>
            <Avatar alt={treasurer?.name} src={treasurer?.img_url} />
            <div className='selected-info'>
              <span>{treasurer?.name}</span>
              <span>{treasurer?.email}</span>
            </div>
          </div>
        </div>
      </div>
      <Divider sx={{ marginBottom: 2 }} />
      <div className='members__body'>
        <h2>Thành viên</h2>
        <DataGrid
          getRowId={(r) => r._id}
          rows={users}
          columns={columns}
          autoHeight
          pageSize={4}
        />
      </div>
    </div>
  )
}

export default Members