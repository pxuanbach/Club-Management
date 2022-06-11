import React, { useState, useEffect } from 'react';
import {
  Box, Button, Modal,
  Snackbar, Alert
} from '@mui/material';
import { useRouteMatch } from 'react-router-dom';
import FileDownload from 'js-file-download';
import axiosInstance from '../../../../helper/Axios';
import ActivityItem from '../ActivityItem';
import AddActivity from '../action/AddActivity';
import UpdateActivity from '../action/UpdateActivity';
import Collaborators from '../action/Collaborators';
import { Buffer } from 'buffer';
import CustomDialog from '../../../dialog/CustomDialog';
import './TabContent.css';

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

const collaboratorStyle = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 3,
};

const TabContent = ({ match, club_id, isLeader }) => {
  const { path } = useRouteMatch();
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
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

  const handleDeleteActivity = async () => {
    axiosInstance.delete(`/activity/delete/${activitySelected._id}`)
      .then(response => {
        //response.data
        activityDeleted(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })

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

  const handleExportActivity = (activity) => {
    axiosInstance.get(`/export/activity/${activity._id}`,
      {
        headers: { "Content-Type": "application/vnd.ms-excel" },
        responseType: 'blob'
      })
      .then(response => {
        //console.log(response)
        FileDownload(response.data, Date.now() + '-hoatdong.xlsx')
      }).catch(err => {
        showSnackbar(err.response.data.error)
      })
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
      <Modal
        open={showCollaborators}
        aria-labelledby="modal-add-title"
        aria-describedby="modal-add-description"
        onClose={() => {
          setShowCollaborators(false);
        }}
      >
        <Box sx={collaboratorStyle}>
          <Collaborators
            setShow={setShowCollaborators}
            activity={activitySelected}
            showSnackbar={showSnackbar}
          />
        </Box>
      </Modal>
      <CustomDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Xóa hoạt động"
        contentText={`Bạn có chắc muốn xóa hoạt động \b${activitySelected ? activitySelected.title : ''}\b không?
        \nChúng tôi sẽ xóa toàn bộ các bản ghi liên quan đến hoạt động này!`}
        handleAgree={handleDeleteActivity}
      />
      <div className='div-header'>
        <div className='div-search'>
          <input
            value={search}
            type="text"
            placeholder="Tìm kiếm hoạt động"
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={event => event.key === 'Enter' ? handleSearchActivities(event) : null}
          />
          <i onClick={handleSearchActivities} class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <div id='formcontent' className='div-tabcontent'>
        <div className='header-tabcontent'>
          <h2 className='name-content'>Bảng hoạt động</h2>
          <div className='div-search-tabmember'>

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
                setShowCollaborators={setShowCollaborators}
                setActivitySelected={setActivitySelected}
                handleExportActivity={handleExportActivity}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export default TabContent