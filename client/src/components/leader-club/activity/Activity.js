import React, { useState, useEffect, useContext } from 'react'
import { Box, CircularProgress } from '@mui/material';
import { Switch, Route, Redirect } from 'react-router-dom'
import FormActivity from './FormActivity'
import TabContent from './tabcontent/TabContent'
import axiosInstance from '../../../helper/Axios'
import { UserContext } from '../../../UserContext'

const Activity = ({ match, club_id }) => {
    let isLeader = false;
    const { user } = useContext(UserContext);
    const [club, setClub] = useState()

    const getClub = (club_id) => {
        axiosInstance.get(`/club/one/${club_id}`)
            .then(response => {
                //response.data
                setClub(response.data)
            }).catch(err => {
                //err.response.data.error

            })
    }

    useEffect(() => {
        getClub(club_id);
    }, [])

    if (user && club) {
        isLeader = user._id === club.leader._id
    }
    return (
        <>
            {user ? <Switch>
                <Route path={`${match}/:activityId`}>
                    <FormActivity
                        match={match}
                        isLeader={isLeader}
                    />
                </Route>
                <Route path={match}>
                    {(user && club) ?
                        <TabContent
                            match={match}
                            club_id={club_id}
                            isLeader={isLeader}
                            user={user}
                        />
                        : <Box className='loading-temp'>
                            <CircularProgress />
                        </Box>}
                </Route>
                
            </Switch> : (<></>)}
        </>

    )
}

export default Activity