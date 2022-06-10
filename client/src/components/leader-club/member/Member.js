import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, CircularProgress, Box } from '@mui/material';
import "./Member.css"
import TabMember from './TabMember';
import TabGroup from './TabGroup';
import axiosInstance from '../../../helper/Axios';
import { useRouteMatch } from 'react-router-dom';
import { UserContext } from '../../../UserContext'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function BasicTabs() {
  const { path } = useRouteMatch();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [club, setClub] = useState();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getClub = async (club_id) => {
    const res = await axiosInstance.get(`/club/one/${club_id}`)

    const data = res.data;
    if (data) {
      setClub(data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getClub(path.split('/')[2])
  }, [])

  return (
    <div >
      {user && (
        <Box sx={{ width: '100%', height: '100%', }}>
          <Box className='header-member' sx={{ borderBottom: 'none', borderColor: 'divider' }} >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
              <Tab label="Thành viên" />
              <Tab label="Nhóm" />
            </Tabs>
          </Box>
          {isLoading ?
            <Box className='loading-temp'>
              <CircularProgress />
            </Box>
            : <div>
              <TabPanel className='body-member' value={value} index={0}>
                <TabMember club={club}></TabMember>
              </TabPanel>
              <TabPanel className='body-member' value={value} index={1}>
                <TabGroup club={club}></TabGroup>
              </TabPanel>
            </div>}
        </Box>
      )}

    </div>
  );
}