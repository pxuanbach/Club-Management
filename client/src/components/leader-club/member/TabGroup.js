import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Box, Button, Tooltip, TextField, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Buffer } from 'buffer';
import Group from './Group'
import AddGroup from './AddGroup'
import UpdateGroupTabbar from './UpdateGroupTabbar';
import DeleteGroup from './DeleteGroup';
import { UserContext } from '../../../UserContext'
import axiosInstance from '../../../helper/Axios'
import './TabGroup.css'

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
  p: 2,
};

const TabGroup = ({ club }) => {
  let isLeader = false;
  const { user, setUser } = useContext(UserContext);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupSelected, setGroupSelected] = useState();
  const [search, setSearch] = useState();

  const handleUpdateGroup = (event, group) => {
    event.preventDefault();
    setGroupSelected(group)
    setShowFormUpdate(true)
  }

  const handleDeleteGroup = (event, group) => {
    event.preventDefault();
    setGroupSelected(group)
    setShowDialog(true)
  }

  const handleSearchGroups = async (event) => {
    event.preventDefault();
    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      const res = await axiosInstance.get(`/group/search/${club._id}/${encodedSearch}`)

      const data = res.data
      if (data) {
        setGroups(data)
      }
    } else {
      getGroups();
    }
  }

  const getGroups = async () => {
    const res = await axiosInstance.get(`/group/list/${club._id}`)

    const data = res.data
    if (data) {
      setGroups(data)
    }
  }

  useEffect(() => {
    getGroups();
  }, [])

  if (user) {
    isLeader = user._id === club.leader._id;
  }
  return (
    <div className='div-tabgroup'>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddGroup
            club_id={club._id}
            setShow={setShowFormAdd}
            groups={groups}
            setGroups={setGroups}
          />
        </Box>
      </Modal>
      <Modal
        open={showFormUpdate}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormUpdate(false);
        }}
      >
        <Box sx={style}>
          <UpdateGroupTabbar
            group={groupSelected}
            groups={groups}
            setGroups={setGroups}
            setShow={setShowFormUpdate}
          />
        </Box>
      </Modal>
      <DeleteGroup
        open={showDialog}
        setOpen={setShowDialog}
        group={groupSelected}
        groups={groups}
        setGroups={setGroups}
      />
      <div className='div-header-tabgroup'>
        <div className='div-search-tabgroup'>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { width: '30ch' },
            }}>
            <CustomTextField
              value={search}
              id="search-field-tabmember"
              label="Tìm kiếm nhóm"
              variant="standard"
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              onKeyPress={event =>
                event.key === 'Enter' ? handleSearchGroups(event) : null
              }
            />
          </Box>
          <Tooltip title='Tìm kiếm' placement='right-start'>
            <Button
              className='btn-search3'
              variant="text"
              disableElevation
              onClick={handleSearchGroups}
            >
              <SearchIcon sx={{ color: '#1B264D' }} />
            </Button>
          </Tooltip>
        </div>
        <div className='div-action-tabgroup'>
          {isLeader
            ? (<Button
              onClick={() => {
                setShowFormAdd(true)
              }}
              variant="contained"
              style={{ background: '#1B264D' }}>
              Thêm nhóm
            </Button>) : <></>}
        </div>

      </div>
      <div className='div-list-tabgroup'>
        {groups.length > 0 ?
          groups.map(group => (
            <Group key={group._id}
              data={group}
              isLeader={isLeader}
              handleDeleteGroup={(event) => {
                handleDeleteGroup(event, group)
              }}
              handleUpdateGroup={(event) => {
                handleUpdateGroup(event, group)
              }}
            />
          )) :
          (<div style={{ textAlign: 'center', marginTop: 100 }}>
            <span>Không có nhóm nào...</span>
          </div>)}
      </div>
    </div>
  )
}

export default TabGroup