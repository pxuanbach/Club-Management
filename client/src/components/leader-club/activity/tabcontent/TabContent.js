import React, { useState, useEffect } from 'react';
import { Box, Button, Tooltip, Modal, TextField, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { useRouteMatch } from 'react-router-dom';
import axiosInstance from '../../../../helper/Axios';
import ActivityItem from '../ActivityItem';
import AddActivity from '../action/AddActivity';
import UpdateActivity from '../action/UpdateActivity';
import DeleteActivity from '../action/DeleteActivity';
import { Buffer } from 'buffer';

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

const TabContent = ({ match, club_id, isLeader }) => {
  const { path } = useRouteMatch();
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState()
  const [activitySelected, setActivitySelected] = useState()
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const acitivityCreated = (data) => {
    setActivities([...activities, data]);
  }

  const activityUpdated = (data) => {
    const activitiesUpdated = activities.map((elm) => {
      if (elm._id === data._id) {
        return {
          ...elm,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate
        }
      }
      return elm;
    });
    setActivities(activitiesUpdated)
  }

  const activityDeleted = (data) => {
    var activitiesDeleted = activities.filter(function (value, index, arr) {
      return value._id !== data._id;
    })
    setActivities(activitiesDeleted)
  }

  const handleSearchActivities = (e) => {
    e.preventDefault();
    if (search) {
      const encodedSearch = new Buffer(search).toString('base64');
      axiosInstance.get(`/activity/search/${club_id}/${encodedSearch}`)
        .then(response => {
          //response.data
          setActivities(response.data)
        }).catch(err => {
          //err.response.data.error
          showSnackbar(err.response.data.error)
        })
    } else {
      getActivities()
    }
  }

  const getActivities = () => {
    axiosInstance.get(`/activity/list/${club_id}`)
      .then(response => {
        //response.data
        setActivities(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    getActivities()
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
      <Modal
        open={showFormUpdate}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowFormUpdate(false);
        }}
      >
        <Box sx={style}>
          <UpdateActivity
            setShow={setShowFormUpdate}
            activity={activitySelected}
            activityUpdated={activityUpdated}
            showSnackbar={showSnackbar}
          />
        </Box>
      </Modal>
      <DeleteActivity
        open={openDialog}
        setOpen={setOpenDialog}
        activity={activitySelected}
        activityDeleted={activityDeleted}
        showSnackbar={showSnackbar}
      />
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="search-field-tabcontent"
                label="Tìm kiếm hoạt động"
                variant="standard"
                onKeyPress={event => event.key === 'Enter' ? handleSearchActivities(event) : null}
              />

            </Box>
            <Tooltip title='Tìm kiếm' placement='right-start'>
              <Button
                variant="text"
                disableElevation
                onClick={handleSearchActivities}
              >
                <SearchIcon sx={{ color: '#1B264D' }} />
              </Button>
            </Tooltip>
            {isLeader ? 
            (<Button
              onClick={() => {
                setShowFormAdd(true)
              }}
              className='btn-add-tabcontent'
              variant="contained"
              disableElevation
              style={{ background: '#1B264D' }}>
              Thêm hoạt động
            </Button>) : <></>}
            
          </div>
        </div>
        <div className='div-body-content' >
          {activities && activities.map(activity => (
            <div key={activity._id} className='item-work'>
              <ActivityItem
                activity={activity}
                link={path + '/' + activity._id}
                setShowFormUpdate={setShowFormUpdate}
                setOpenDialog={setOpenDialog}
                setActivitySelected={setActivitySelected}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export default TabContent