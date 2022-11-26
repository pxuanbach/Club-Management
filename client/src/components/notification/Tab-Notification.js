import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Snackbar, Alert, Box, Typography } from '@mui/material';
import ActivitiesNotification from './ActivitiesNotification';
import ClubNotification from './ClubNotification';
import { UserContext } from '../../UserContext'

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function NotificationTab() {
  const { user } = useContext(UserContext);
  const [value, setValue] = React.useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [options, setOptions] = useState();

  const showSnackbar = (message, options) => {
    setOptions(options);
    setAlertMessage(message);
    setOpenSnackbar(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={options}>{alertMessage}</Alert>
      </Snackbar>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Câu lạc bộ" {...a11yProps(0)} />
          <Tab label="Hoạt động" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box sx={{ overflowY: "scroll" }}>
        <TabPanel value={value} index={0}>
          <ClubNotification user={user} showSnackbar={showSnackbar} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ActivitiesNotification user={user} showSnackbar={showSnackbar} />
        </TabPanel>
      </Box>

    </Box>
  );
}
