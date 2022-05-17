import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import './TabContent.css'
import ActivityItem from '../ActivityItem';
import FormActivity from '../FormActivity';
import { Link, Route, Switch } from 'react-router-dom'

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const TabContent = ({ match }) => {
  const [showFormActivity, setShowFormActivity] = useState(false);

  useEffect(() => {
    console.log(match)
  }, [])

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