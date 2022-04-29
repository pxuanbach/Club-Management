import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Box, Button, Tooltip, TextField, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Group from './Group'
import AddGroup from './AddGroup'
import { UserContext } from '../../../UserContext'
import io from 'socket.io-client'
import { ENDPT } from '../../../helper/Helper';
import './TabGroup.css'

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

const TabGroup = ({ club_id }) => {
  const { user, setUser } = useContext(UserContext);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [leader, setLeader] = useState()

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  useEffect(() => {
    socket.emit('get-user', club_id, 'leader')
    socket.on('output-leader', res => {
      setLeader(res)
    })
  }, [])

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
          <AddGroup club_id={club_id} setShowFormAdd={setShowFormAdd} />
        </Box>
      </Modal>
      <div className='div-header-tabgroup'>
        <div className='div-search-tabgroup'>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { width: '30ch' },
            }}>
            <CustomTextField id="search-field-tabmember" label="Tìm kiếm nhóm" variant="standard" />
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
        </div>
        <div className='div-action-tabgroup'>
          {user?.username.includes('admin')
            || user?._id === leader?._id
            ? (<Button
              onClick={() => {
                setShowFormAdd(true)
              }}
              className='btn-add-tabmember'
              variant="contained"
              style={{ background: '#1B264D' }}>
              Thêm nhóm
            </Button>) : <></>}
        </div>

      </div>
      <div>
        <Group />
      </div>
    </div>
  )
}

export default TabGroup