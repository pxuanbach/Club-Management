import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import axiosInstance from '../../../../helper/Axios'
import './Members.css'

const Members = ({ club, clubs, setClubs }) => {
  const [leader, setLeader] = useState(club.leader)
  const [treasurer, setTreasurer] = useState(club.treasurer)
  const [members, setMembers] = useState([])

  const handlePromotedToLeader = async (event, param) => {
    event.stopPropagation();
    //console.log('leader')
    const res = await axiosInstance.patch(`/club/promote/${club._id}`,
      JSON.stringify({
        "position": "leader",
        "cur_member_id": leader._id,
        "new_member_id": param._id,
      }), {
      headers: { 'Content-Type': 'application/json' }
    })

    const data = res.data

    if (data) {
      setLeader(data);
      getMembers();
    }
  }

  const handlePromotedToTreasurer = async (event, param) => {
    event.stopPropagation();
    //console.log('treasurer')
    const res = await axiosInstance.patch(`/club/promote/${club._id}`,
      JSON.stringify({
        "position": "treasurer",
        "cur_member_id": treasurer._id,
        "new_member_id": param._id,
      }), {
      headers: { 'Content-Type': 'application/json' }
    })

    const data = res.data

    if (data) {
      setTreasurer(data);
      getMembers();
    }
  }

  const handleRemoveFromClub = async (event, param) => {
    event.stopPropagation();
    //socket.emit('remove-user-from-club', club._id, param._id)
    const res = await axiosInstance.patch(`/club/removemember/${club._id}`,
      JSON.stringify({
        "userId": param._id
      }), {
      headers: { 'Content-Type': 'application/json' }
    })

    const data = res.data

    if (data) {
      setMembers(members.filter(u => u._id !== data._id))
      const updateClubs = clubs.map((elm) => {
        if (elm._id === club._id) {
          return {
            ...elm,
            members_num: club.members_num-1,
          }
        }
        return elm;
      });
      setClubs(updateClubs)
    }
  }

  const getMembers = async () => {
    const res = await axiosInstance.get(`/club/members/${club._id}`)

    const data = res.data;

    if (data) {
      setMembers(data)
    }
  }

  useEffect(() => {
    getMembers()
  }, [])

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
      <div className='update-members__head'>
        <div className='update-members__card'>
          <h3>Trưởng câu lạc bộ</h3>
          <div className='member-selected'>
            <Avatar alt={leader?.name} src={leader?.img_url} />
            <div className='selected-info'>
              <span>{leader?.name}</span>
              <span>{leader?.email}</span>
            </div>
          </div>
        </div>
        <div className='update-members__card'>
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
      <div className='update-members__body'>
        <h2>Thành viên</h2>
        <DataGrid sx={{ height: 52 * 4 + 56 + 55 }}
          getRowId={(r) => r._id}
          rows={members}
          columns={columns}
          pageSize={4}
        />
      </div>
    </div>
  )
}

export default Members