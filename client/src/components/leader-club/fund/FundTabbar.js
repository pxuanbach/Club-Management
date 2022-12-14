import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, CircularProgress, Box } from '@mui/material';
import { useRouteMatch } from 'react-router-dom';
import { UserContext } from '../../../UserContext';
import GeneralFundTab from './GeneralFundTab';
import MonthlyFundtab from './MonthlyFundTab';

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

const FundTabbar = ({ club }) => {
  const { path } = useRouteMatch();
  const { user } = useContext(UserContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {user && (
        <Box sx={{ width: '100%', height: '100%', }}>
          <Box className='header-member' sx={{ borderBottom: 'none', borderColor: 'divider' }} >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
              <Tab label="Tổng quan" />
              <Tab label="Quỹ hàng tháng" />
            </Tabs>
          </Box>
          <TabPanel className='body-fund' value={value} index={0}>
            <GeneralFundTab club_id={club._id} user={user}/>
          </TabPanel>
          <TabPanel className='body-fund' value={value} index={1}>
            <MonthlyFundtab club_id={club._id} user={user}/>
          </TabPanel>
        </Box>
      )}
    </div>
  )
}

export default FundTabbar