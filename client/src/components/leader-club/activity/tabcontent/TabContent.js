import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import './TabContent.css'
import ActivityItem from '../ActivityItem';
import FormActivity from '../FormActivity';

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const showHideFunction = () => {
  var formContent = document.getElementById("formcontent");
  var formactivity = document.getElementById("formactivity");
  if (formContent.className === "div-tabcontent") {
    formContent.className = "div-tabcontentOff";
    formactivity.className = "form-activityOn"

  } else {
    formContent.className = "div-tabcontent";
    formactivity.className = "form-activityOff"
  }
}

const TabContent = () => {
  const [showFormActivity, setShowFormActivity] = useState(false);
  return (
    <div>
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
          <div className='item-work' onClick={() => showHideFunction()}>
            <ActivityItem ></ActivityItem>
          </div>
        </div>
      </div>
      <div id='formactivity' className='form-activityOff'>
        <FormActivity showHideFunction={showHideFunction}></FormActivity>
      </div>
    </div>
  )
}
export default TabContent