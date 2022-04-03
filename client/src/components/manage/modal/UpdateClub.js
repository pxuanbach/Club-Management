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

const UpdateClub = ({ setShowFormUpdate }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
            >
                <Tab value={0} label="Thông tin chung"/>
                <Tab value={1} label="Thành viên" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <General/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Members/>
            </TabPanel>
        </div>
    )
}

export default UpdateClub