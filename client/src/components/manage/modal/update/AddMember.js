import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../../helper/Axios'
import './AddMember.css'

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const AddMember = ({ club_id, clubs, setClubs }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  const [users, setUsers] = useState([]);
  const [usersSelected, setUsersSelected] = useState([])

  const handleChangeSearch = event => {
    setSearch(event.target.value)
  }

  const handleSearch = async (event) => {
    event.preventDefault();
    if (search) {
      const res = await axiosInstance.get(`/club/searchusersnotmembers/${club_id}/${search}`)

      const data = res.data

      if (data) {
        setUsers(data)
      }
    } else {
      getUsersNotMembers()
    }
  }

  const handleAddMembers = async (e) => {
    e.preventDefault();
    if (usersSelected.length > 0) {
      setIsLoading(true)
      const res = await axiosInstance.post('/club/addmembers', JSON.stringify({
        'clubId': club_id,
        'users': usersSelected,
      }), {
        headers: { 'Content-Type': 'application/json' }
      })

      const data = res.data

      if (data) {
        //setUsers(users.filter(user => user._id !== data._id))
        const updateClubs = clubs.map((elm) => {
          if (elm._id === data._id) {
            return {
              ...elm,
              members_num: data.members_num,
            }
          }
          return elm;
        });
        setClubs(updateClubs)
        getUsersNotMembers()
        setIsLoading(false)
      }
    }
  }

  const getUsersNotMembers = async () => {
    const res = await axiosInstance.get(`/club/usersnotmembers/${club_id}`)

    const data = res.data

    if (data) {
      setUsers(data)
    }
  }

  useEffect(() => {
    getUsersNotMembers()
  }, [])

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 70,
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
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
    { field: 'username', headerName: 'Tài khoản', flex: 1 },
    { field: 'name', headerName: 'Tên', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
  ];

  return (
    <div className='addmember-modal'>
      <div className='stack-left'>
        <CustomTextField
          id="search-field"
          label="Tìm kiếm thành viên (Tài khoản)"
          variant="standard"
          value={search}
          onChange={handleChangeSearch}
          size='small'
          onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
        />
        <Tooltip title='Tìm kiếm' placement='right-start'>
          <Button
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
            onClick={getUsersNotMembers}>
            <RefreshIcon sx={{ color: '#1B264D' }} />
          </Button>
        </Tooltip>
      </div>
      <div className='members__body'>
        <DataGrid sx={{ height: 52 * 4 + 56 + 55 }}
          checkboxSelection
          getRowId={(r) => r._id}
          rows={users}
          columns={columns}
          pageSize={4}
          onSelectionModelChange={setUsersSelected}
          selectionModel={usersSelected}
        />
      </div>
      <div className="stack-right">
        <Button disabled={isLoading}
          onClick={handleAddMembers}
          variant="contained"
          disableElevation>
          Lưu
        </Button>
      </div>
    </div>
  )
}

export default AddMember