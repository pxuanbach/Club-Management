import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Box, Button, Tooltip, TextField, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { UserContext } from '../../../UserContext'
import { Buffer } from 'buffer';
import AddMembers from './AddMembers'
import axiosInstance from '../../../helper/Axios';
import './TabMember.css'


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
  width: 750,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};

const TabMember = ({ club }) => {
  let isLeader = false;
  const { user, setUser } = useContext(UserContext);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [search, setSearch] = useState()
  const [members, setMembers] = useState([])
  const [membersSelected, setMembersSelected] = useState([])
  let haveSelected = membersSelected.length <= 0;

  const handleRemoveMembersFromClub = async (event) => {
    event.preventDefault();

    const res = await axiosInstance.patch(`/club/removemembers/${club._id}`,
      JSON.stringify({
        'members': membersSelected,
      }), {
      headers: { 'Content-Type': 'application/json' }
    }
    )

    const data = res.data
    if (data) {
      getMembers();
    }
  }

  const handleChangeSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchMembers = async (event) => {
    event.preventDefault();
    setMembersSelected([])

    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      const res = await axiosInstance.get(`/club/searchmembers/${club._id}/${encodedSearch}`)

      const data = res.data
      if (data) {
        setMembers(data)
      }
    } else {
      getMembers();
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
      field: 'img_url',
      headerName: 'H??nh ?????i di???n',
      headerAlign: 'center',
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
      headerName: 'H??? v?? t??n',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      flex: 1
    },

    {
      field: 'username',
      headerName: 'M?? sinh vi??n',
      flex: 0.7
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
  ];

  if (user) {
    isLeader = user._id === club.leader._id;
  }
  return (
    <div className='div-tabmember'>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddMembers
            club_id={club._id}
            setShowFormAdd={setShowFormAdd}
            getMembers={getMembers}
          />
        </Box>
      </Modal>
      <div className='members__head'>
        <div className='members__card'>
          <h3>Tr?????ng c??u l???c b???</h3>
          <div className='member-selected'>
            <Avatar src={club.leader.img_url} />
            <div className='selected-info'>
              <span>{club.leader.name}</span>
              <span>{club.leader.email}</span>
            </div>
          </div>
        </div>
        <div className='members__card'>
          <h3>Th??? qu???</h3>
          <div className='member-selected'>
            <Avatar src={club.treasurer.img_url} />
            <div className='selected-info'>
              <span>{club.treasurer.name}</span>
              <span>{club.treasurer.email}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='div-table-tabmember'>
        <div className='header-table-tabmember'>
          <h3 className='name-h4'>Th??nh vi??n (x)</h3>
          <div className='div-search-tabmember'>
            <Box
              sx={{
                '& > :not(style)': { width: '30ch' },
              }}
            >
              <CustomTextField
                value={search}
                onChange={handleChangeSearch}
                id="search-field-tabmember"
                label="T??m ki???m th??nh vi??n "
                variant="standard"
                onKeyPress={event => event.key === 'Enter' ? handleSearchMembers(event) : null}
              />

            </Box>
            <Tooltip title='T??m ki???m' placement='right-start'>
              <Button
                variant="text"
                disableElevation
                onClick={handleSearchMembers}
              >
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            {isLeader
              ? (<div className='stack-right'>
                <Button
                  onClick={() => {
                    setShowFormAdd(true)
                  }}
                  className='btn-add-tabmember'
                  variant="contained"
                  disableElevation
                  style={{ background: '#1B264D' }}>
                  Th??m th??nh vi??n
                </Button>
                <Button disabled={haveSelected}
                  onClick={handleRemoveMembersFromClub}
                  variant="contained"
                  disableElevation
                  style={{
                    background: haveSelected ? 'transparent' : '#1B264D',
                    border: haveSelected ? ' 1px solid #1B264D' : ''
                  }}>
                  ??u???i th??nh vi??n
                </Button>
              </div>) : <></>}
          </div>
        </div>
        <div style={{ height: 52 * 6 + 56 + 55, width: '95%', marginTop: '10px', marginLeft: '20px' }}>
          <DataGrid
            checkboxSelection={isLeader}
            getRowId={(r) => r._id}
            rows={members}
            columns={columns}
            pageSize={6}
            rowsPerPageOptions={[6]}
            onSelectionModelChange={setMembersSelected}
            selectionModel={membersSelected}
          />
        </div>

      </div>
    </div>
  )
}

export default TabMember