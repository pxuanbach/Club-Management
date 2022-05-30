import React, {useContext, useState, useEffect} from 'react'
import './SchedulerActivity.css'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { UserContext } from '../../UserContext';

const SchedulerActivity = () => {
  const date = new Date();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
        
    }
}, [user])

  return (
    <div>
      
    </div>
  )
}

export default SchedulerActivity