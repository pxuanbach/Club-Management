import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./Member.css"
import TabMember from './TabMember';
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
    <Box sx={{ width: '100%' , height:'100%', marginTop:'15px'}}>
      <Box sx={{ borderBottom: 1 , borderColor: 'divider',color:'#1B264D'}} >
        <Tabs  value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab className='name-tab' label="Quản lý thành viên" {...a11yProps(0)} />
          <Tab  label="Quản lý nhóm" {...a11yProps(1)} />
          
        </Tabs>
      </Box>
      <TabPanel   value={value} index={0}>
        <TabMember></TabMember>

      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>

    </Box>
    </div>
  );
}