import React, { useState, useEffect } from 'react'
import { Avatar, Divider, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import './TabContent.css'
import ActivityItem from '../ActivityItem';
import FormActivity from '../FormActivity';
import Activity from '../Activity'
const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#1B264D',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#1B264D',
    },
  });
  const showhideFunction = () => {
    var formContent = document.getElementById("formcontent");    
    var formactivity = document.getElementById("formactivity");  
    if (formContent.className == "div-tabcontent")    
    {    
      formContent.className = "div-tabcontentOff";
      formactivity.className = "form-activityOn"    
      
    } else    
    {      
      formContent.className = "div-tabcontent";  
      
    } 
  }
const TabContent = () => {
    const [showFormActivity, setShowFormActivity] = useState(false);
    return (
        
        <div id='formcontent' className='div-tabcontent'>

            <div className='header-tabcontent'>
                <h3 className='name-content'>Bảng công việc</h3>
                <div className='div-search-tabcontent'>
                <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '30ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <CustomTextField id="search-field-tabcontent" label="Tìm kiếm công việc " variant="standard"  />
                </Box>
                <Tooltip title='Tìm kiếm' placement='right-start'>
                <Button
                    className='btn-search3'
                    variant="text"
                    disableElevation
                >
                    <i class="fa-solid fa-magnifying-glass"></i>
                </Button>
                </Tooltip>
                <Button className='btn-add-tabcontent' variant="contained"  style={{ background: '#1B264D',marginTop:'15px', fontWeight:'600' }} >Thêm hoạt động</Button>
                </div>
            </div>
            <div className='div-body-content' >
                <div className='item-work' onClick={() => showhideFunction()}>
                <ActivityItem></ActivityItem>
                </div>
                <div className='item-work' onClick={() => showhideFunction()}>
                <ActivityItem></ActivityItem>
                </div>
            </div>
        </div>
    )
}
export default TabContent