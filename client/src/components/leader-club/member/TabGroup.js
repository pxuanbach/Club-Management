import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Group from './Group'
import './TabGroup.css'

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#1B264D',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#1B264D',
  },
});

const TabGroup = () => {
  return (
    <div className='div-tabgroup'>
      <div className='div-header-tabgroup'>
        <div className='div-search-tabgroup'>
          <CustomTextField id="search-field-tabmember" label="Tìm kiếm nhóm" variant="standard" />
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
          <Button
            className='btn-add-tabmember'
            variant="contained"
            style={{ background: '#1B264D' }}>
            Thêm nhóm
          </Button>
        </div>

      </div>
      <div>
        <Group />
      </div>
    </div>
  )
}

export default TabGroup