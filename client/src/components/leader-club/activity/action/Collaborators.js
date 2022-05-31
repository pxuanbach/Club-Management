import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import AddCollaborators from './AddCollaborators';
import CollaboratorsList from './CollaboratorsList';

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

const Collaborators = ({ setShow, activity, showSnackbar }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%', height: '100%', }}>
                <Box sx={{ borderBottom: 'none', borderColor: 'divider' }} >
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Cộng tác viên" />
                        <Tab label="Thêm cộng tác viên" />
                    </Tabs>
                </Box>
            </Box>
            <div>
                <TabPanel className='body-member' value={value} index={0}>
                    <CollaboratorsList
                        setShow={setShow}
                        activity={activity}
                        showSnackbar={showSnackbar}
                    />
                </TabPanel>
                <TabPanel className='body-member' value={value} index={1}>
                    <AddCollaborators
                        setShow={setShow}
                        activity={activity}
                        showSnackbar={showSnackbar}
                    />
                </TabPanel>
            </div>
        </div>
    )
}

export default Collaborators