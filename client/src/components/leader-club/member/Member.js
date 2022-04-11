// import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
// import React, { useState, useEffect } from "react";
// import TabGroup from './TabGroup';
// import TabMember from './TabMember';
// import NavbarMember from './Navbar-Member';
// import "./Member.css"
// const Member = () => {
//   const { path } = useRouteMatch();
//   //const { type } = useParams();
//   useEffect(() => {
//     console.log(path)
//   }, [])
//   return (
//     <div className='div_member'>
//       <div className='navheader'>
//         <NavbarMember/>
//       </div>
//       <div className="div-body-member">
//         <Switch >
//           <Route path={`${path}/tabmember`}>
//             <TabMember />
//           </Route>
//           <Route path={`${path}/tabgroup`}>
//             <TabGroup />
//           </Route>
//         </Switch>
//       </div>
//     </div>
//   )
// }

// export default Member
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./Member.css"
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
    <Box sx={{ width: '100%' , height:'100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs  value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab  label="Quản lý thành viên" {...a11yProps(0)} />
          <Tab  label="Quản lý nhóm" {...a11yProps(1)} />
          
        </Tabs>
      </Box>
      <TabPanel  value={value} index={0}>
          <div className="abc">
             bc
          </div>

      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>

    </Box>
  );
}