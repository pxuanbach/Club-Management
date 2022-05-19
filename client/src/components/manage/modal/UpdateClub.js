import React, { useState, useEffect } from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import io from 'socket.io-client'
import PropTypes from 'prop-types';
import General from './update/General'
import Members from './update/Members'
import AddMember from './update/AddMember'
import { ENDPT } from '../../../helper/Helper'

let socket;

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
                <Box sx={{ p: 2 }}>
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

const UpdateClub = ({ setShowFormUpdate, club, clubs, setClubs }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPT])

    return (
        <div>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
            >
                <Tab value={0} label="Thông tin chung" />
                <Tab value={1} label="Thành viên" />
                <Tab value={2} label="Thêm thành viên" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <General
                    setShowFormUpdate={setShowFormUpdate}
                    club={club}
                    clubs={clubs}
                    setClubs={setClubs}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Members
                    club={club}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <AddMember
                    club_id={club._id}
                />
            </TabPanel>
        </div>
    )
}

export default UpdateClub