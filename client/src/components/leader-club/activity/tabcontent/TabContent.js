import React, { useState, useEffect } from 'react';
import { Box, Button, Tooltip, Modal, TextField, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Link, useRouteMatch } from 'react-router-dom';
import axiosInstance from '../../../../helper/Axios';
import ActivityItem from '../ActivityItem';
import AddActivity from '../action/AddActivity';
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

const TabContent = ({ match, club_id }) => {
  const {path} = useRouteMatch();
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [activities, setActivities] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const acitivityCreated = (data) => {
    setActivities([...activities, data]);
  }

  const getActivity = () => {
    axiosInstance.get(`/activity/list/${club_id}`)
      .then(response => {
        //response.data
        console.log(response.data)
        setActivities(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    getActivity()
  }, [])

  return (
    <div>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{alertMessage}</Alert>
      </Snackbar>
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
            club_id={club_id}
            acitivityCreated={acitivityCreated}
            showSnackbar={showSnackbar}
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
          {activities && activities.map(activity => (
            <Link key={activity._id} to={path + '/' + activity.content} className='item-work'>
              <ActivityItem activity={activity}/>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
export default TabContent