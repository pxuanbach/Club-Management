import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, CircularProgress, Box } from '@mui/material';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { UserContext } from '../../UserContext'
import Home from './Home'
import OtherClubs from './OtherClubs'

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

export default function HomeTab() {
    const { path } = useRouteMatch();
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!user) {
        return <Redirect to="/login" />;
    }
    return (
        <div >
            {user && (
                <Box sx={{ width: '100%', height: '100%', }}>
                    <Box className='header-member' sx={{ borderBottom: 'none', borderColor: 'divider' }} >
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                            <Tab label="Câu lạc bộ của tôi" />
                            <Tab label="Câu lạc bộ khác" />
                        </Tabs>
                    </Box>
                    <div style={{ paddingTop: '55px' }}>
                        <TabPanel className='body-home' value={value} index={0}>
                            <Home user={user}></Home>
                        </TabPanel>
                        <TabPanel className='body-member' value={value} index={1}>
                            <OtherClubs user={user}></OtherClubs>
                        </TabPanel>
                    </div>
                </Box>
            )}

        </div>
    );
}