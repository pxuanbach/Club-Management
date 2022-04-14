import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import io from 'socket.io-client'
import { ENDPT } from '../../../../helper/Helper'

let socket;

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const AddMember = ({ club }) => {
  const [search, setSearch] = useState();
  const [users, setUsers] = useState([]);

  const handleChangeSearch = event => {
    setSearch(event.target.value)
  }

  const handleSearch = event => {
    event.preventDefault();

  }

  const handleAddMember = (event, param) => {
    event.stopPropagation();
    //console.log(param)
    socket.emit('add-member', club._id, param._id)
    setUsers(users.filter(user => user._id !== param._id))
  }

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPT])

  useEffect(() => {
    socket.emit('get-users-not-members', club._id)
    socket.on('output-users-not-members', users => {
      setUsers(users)
    })
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
    {
      field: 'btn-add',
      headerName: '',
      align: 'center',
      flex: 0.4,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="Thêm vào câu lạc bộ" placement="right-start">
            <Button style={{ color: '#1B264D' }} disableElevation onClick={(event) => {
              handleAddMember(event, value.row)
              //console.log('block?', value.row.isblocked)
            }}>
              <AddIcon/>
            </Button>
          </Tooltip>
        )
      }
    },
  ];

  return (
    <div>
      <div className='stack-left'>
        <CustomTextField
          id="search-field"
          label="Tìm kiếm thành viên (Tài khoản)"
          variant="standard"
          value={search}
          onChange={handleChangeSearch}
          size='small'
        />
        <Tooltip title='Tìm kiếm' placement='right-start'>
          <Button
            variant="text"
            disableElevation
            onClick={handleSearch}>
            <SearchIcon sx={{ color: '#1B264D' }} />
          </Button>
        </Tooltip>
      </div>
      <div className='members__body' style={{marginTop: 20}}>
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

export default AddMember