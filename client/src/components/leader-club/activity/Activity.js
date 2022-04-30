import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./Activity.css"
import TabContent from './tabcontent/TabContent'
import FormActivity from './FormActivity';
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
    <div >
    <Box sx={{ width: '100%' , height:'100%',}}>
      <Box  className='header-activity' sx={{ borderBottom: 'none' , borderColor: 'divider'}} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab className='name-tab' label="Ban Nội Dung" {...a11yProps(0)} />
          <Tab  label="Ban truyền thông" {...a11yProps(1)} />
          <Tab  label="Ban đối ngoại" {...a11yProps(2)} />
          <Tab  label="Ban hậu cần" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <div>
      <TabPanel className='body-activity' value={value} index={0}>
        <TabContent></TabContent>
        <div id='formactivity'className='form-activity'>
          <FormActivity ></FormActivity>
        </div>
      </TabPanel>
      <TabPanel className='body-activity' value={value} index={1}>
  
      </TabPanel>
      <TabPanel className='body-activity' value={value} index={2}>
   
      </TabPanel>
      <TabPanel className='body-activity' value={value} index={3}>
      
      </TabPanel>
      </div>
    </Box>
    </div>
  );
}