import React, { useContext, useState, useEffect } from 'react'
import {
  Paper, Snackbar, Alert, Tooltip, styled,
  IconButton, Box, CircularProgress, Grid
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GroupsIcon from '@mui/icons-material/Groups';
import { useHistory, Redirect } from 'react-router-dom'
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
import applyColor from './ApplyColor';
import './SchedulerActivity.css';

const StyledGroupIcon = styled(GroupsIcon)(({ theme: { palette } }) => ({
  [`&.appointment-icon`]: {
    color: palette.action.active,
  },
}));

const Appointment = ({
  children, style, ...restProps
}) => {
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: restProps.data.color,
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

const Content = (({
  children, appointmentData, ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <Grid item xs={2} sx={{textAlign: 'center'}}>
        <StyledGroupIcon className='appointment-icon'/>
      </Grid>
      <Grid item xs={10}>
        <span>{appointmentData.club.name}</span>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
));

const SchedulerActivity = () => {
  const date = new Date();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduler, setScheduler] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showSnackbar = (message) => {
    setAlertMessage(message)
    setOpenSnackbar(true);
  }

  const getScheduler = (userId) => {
    setIsLoading(true)
    axiosInstance.get(`/scheduler/list/${userId}`)
      .then(response => {
        //response.data
        const newData = applyColor(response.data)
        setScheduler(newData)
      }).catch(err => {
        //err.response.data.error
        console.log(err)
        showSnackbar(err.response.data.error)
      })
      setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getScheduler(user._id)
    }
  }, [user])

  if (!user) {
    return <Redirect to='/login' />
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
          {/* <button onClick={() => console.log(scheduler)}>Click</button> */}
          {isLoading ?
            <Box className='loading-temp'>
              <CircularProgress />
            </Box>
            : (<Scheduler
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
                contentComponent={Content}
                showCloseButton
              />
            </Scheduler>)}

        </Paper>
      </React.Fragment>
    </div>
  )
}

export default SchedulerActivity