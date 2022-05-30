import React, { useContext, useState, useEffect } from 'react'
import { Paper, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useHistory, Redirect} from 'react-router-dom'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { UserContext } from '../../UserContext';
import axiosInstance from '../../helper/Axios'
import './SchedulerActivity.css';

const Appointment = ({
  children, style, ...restProps
}) => {
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#26A69A',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  )
};


const Header = (({
  children, appointmentData, ...restProps
}) => {
  const history = useHistory();
  const url = `/scheduler/activity/${appointmentData._id}`
  return (
    <AppointmentTooltip.Header
      {...restProps}
      appointmentData={appointmentData}
    >
      <Tooltip title="Đi thẳng đến hoạt động" placement="right-start">
        <IconButton
          /* eslint-disable-next-line no-alert */
          onClick={() => {
            history.push(url)
          }}
          size="large"
        >
          <ArrowForwardIcon />
        </IconButton>
      </Tooltip>
    </AppointmentTooltip.Header>
  )
});

const SchedulerActivity = () => {
  const date = new Date();
  const { user } = useContext(UserContext);
  const [scheduler, setScheduler] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const getScheduler = (userId) => {
    axiosInstance.get(`/scheduler/list/${userId}`)
      .then(response => {
        //response.data
        setScheduler(response.data)
      }).catch(err => {
        //err.response.data.error
        showSnackbar(err.response.data.error)
      })
  }

  useEffect(() => {
    if (user) {
      getScheduler(user._id)

    }
  }, [user])

  if (!user) {
    return <Redirect to='/login'/>
  }
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
      <React.Fragment>
        <Paper className='scheduler-content'>
          <h1>Lịch hoạt động</h1>
          <Scheduler
            data={scheduler}
          >
            <ViewState
              defaultCurrentDate={date}
              currentViewName="Month"
            />
            <MonthView />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <Appointments
              appointmentComponent={Appointment}
            />
            <AppointmentTooltip
              headerComponent={Header}
              showCloseButton
            />
          </Scheduler>
        </Paper>
      </React.Fragment>
    </div>
  )
}

export default SchedulerActivity