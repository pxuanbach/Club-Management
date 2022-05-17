import React, { useState, useEffect } from 'react';
import { Box, Button, Tooltip, Modal, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import ActivityItem from '../ActivityItem';
import AddActivity from '../action/AddActivity';
import { ENDPT } from '../../../../helper/Helper'
import './TabContent.css';

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
  width: 550,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 3,
};

let socket

const TabContent = ({ match, club_id }) => {
  const [showFormAdd, setShowFormAdd] = useState(false);

  useEffect(() => {
    socket = io(ENDPT);
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])

  return (
    <div>
      <Modal
        open={showFormAdd}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormAdd(false);
        }}
      >
        <Box sx={style}>
          <AddActivity
            setShow={setShowFormAdd}
            socket={socket}
            club_id={club_id}
          />
        </Box>
      </Modal>
      <div id='formcontent' className='div-tabcontent'>
        <div className='header-tabcontent'>
          <h2 className='name-content'>Bảng hoạt động</h2>
          <div className='div-search-tabmember'>
            <Box
              sx={{
                '& > :not(style)': { width: '30ch' },
              }}
            >
              <CustomTextField
                id="search-field-tabcontent"
                label="Tìm kiếm thành viên"
                variant="standard"
              />

            </Box>
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                variant="text"
                disableElevation
                onClick={() => { }}
              >
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            <Button
              onClick={() => {
                setShowFormAdd(true)
              }}
              className='btn-add-tabcontent'
              variant="contained"
              disableElevation
              style={{ background: '#1B264D' }}>
              Thêm hoạt động
            </Button>
          </div>
        </div>
        <div className='div-body-content' >
          <div className='item-work' onClick={() => { }}>
            <Link to={match + '/chaongaymoi'}>
              <ActivityItem></ActivityItem>
            </Link>

          </div>
        </div>
      </div>

    </div>
  )
}
export default TabContent