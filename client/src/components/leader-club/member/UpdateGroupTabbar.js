import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import UpdateGroupInfo from './update/UpdateGroupInfo';
import AddMembers from './update/AddMembers'

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

const UpdateGroup = ({ group, groups, setGroups, setShow }) => {
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
                <Tab value={0} label="Cập nhật thông tin nhóm" />
                <Tab value={1} label="Thêm thành viên" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <UpdateGroupInfo
                    group={group}
                    groups={groups}
                    setGroups={setGroups}
                    setShow={setShow}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <AddMembers
                    group={group}
                    groups={groups}
                    setGroups={setGroups}
                />
            </TabPanel>
        </div>
    )
}

export default UpdateGroup