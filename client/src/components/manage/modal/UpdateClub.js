import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import General from './update/General'
import Members from './update/Members'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2}}>
                    {children}
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

const UpdateClub = ({ setShowFormUpdate, club }) => {
    const [tabValue, setTabValue] = useState(0);
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
            >
                <Tab value={0} label="Thông tin chung"/>
                <Tab value={1} label="Thành viên" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <General 
                    setShowFormUpdate={setShowFormUpdate}
                    club={club}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Members 
                    club={club}
                />
            </TabPanel>
        </div>
    )
}

export default UpdateClub