import React, { useState, useEffect } from 'react'
import {
    Card, CardHeader, CardContent,
    Box, Avatar, Divider,
} from '@mui/material';
import axiosInstance from '../../helper/Axios'
import './FindGroupCard.css'

const FindGroupCard = ({ activityId }) => {
    const [search, setSearch] = useState();
    const [club, setClub] = useState()

    const getClubFromActivity = () => {
        axiosInstance.get(`/activity/one/${activityId}`)
            .then(response => {
                //response.data
                setClub(response.data.club)
            }).catch(err => {
                //err.response.data.error
                console.log(err.response.data.error)
            })
    }

    useEffect(() => {
        getClubFromActivity()
    }, [])

    return (
        <Box>
            <Card>
                <CardHeader className='find-group__header'
                    title={"Nhóm"}
                />
                <Divider />
                <CardContent className='find-group__content'>
                    <div className='find-group__search'>
                        <input
                            value={search}
                            type="text"
                            placeholder="Tìm nhóm"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <Box className='find-group__items'>

                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FindGroupCard