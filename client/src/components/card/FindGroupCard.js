import React, { useState, useEffect } from 'react'
import {
    Card, CardHeader, CardContent,
    Box, Avatar, Divider, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Buffer } from 'buffer';
import axiosInstance from '../../helper/Axios'
import './FindGroupCard.css'

const FindGroupCard = ({ activityId, card, getJoin, showSnackbar }) => {
    const [search, setSearch] = useState();
    const [club, setClub] = useState()
    const [groups, setGroups] = useState([]);

    const getClubFromActivity = () => {
        axiosInstance.get(`/activity/one/${activityId}`)
            .then(response => {
                //response.data
                setClub(response.data.club)
                getGroups(response.data.club._id)
            }).catch(err => {
                //err.response.data.error
                console.log(err.response.data.error)
            })
    }

    const getGroups = (clubId) => {
        axiosInstance.get(`/group/list/${clubId}`)
            .then(response => {
                //response.data
                console.log(response.data)
                setGroups(response.data)
            }).catch(err => {
                //err.response.data.error
                console.log(err.response.data.error)
            })
    }

    const handleSearchGroups = async (event) => {
        event.preventDefault();
        if (search) {
            const encodedSearch = new Buffer(search).toString('base64');
            const res = await axiosInstance.get(`/group/search/${club._id}/${encodedSearch}`)

            const data = res.data
            if (data) {
                setGroups(data)
            }
        } else {
            getGroups(club._id);
        }
    }

    const handleJoinCard = (e, group) => {
        e.preventDefault();
        axiosInstance.post(`/activity/groupjoin`,
            JSON.stringify({
                "groupId": group._id,
                "cardId": card._id
            }), {
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            //response.data
            if (response.data.success) {
                getJoin()
            } else {
                showSnackbar(response.data.message, false)
            }
        }).catch(err => {
            //err.response.data.error
            showSnackbar(err.response.data.error, true)
        })
    }

    useEffect(() => {
        getClubFromActivity()
    }, [])

    return (
        <Box>
            <Card>
                <CardHeader
                    className='find-group__header'
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
                            onKeyPress={event =>
                                event.key === 'Enter' ? handleSearchGroups(event) : null
                            }
                        />
                        <i class="fa-solid fa-magnifying-glass" onClick={handleSearchGroups}></i>
                    </div>
                    <Box className='find-group__items'>
                        {groups.map((group, index) => (
                            <div className='find-group__item' key={index}>
                                <div className='find-group__item-info'>
                                    <Avatar>{group.name.charAt(0)}</Avatar>
                                    <span>{group.name}</span>
                                </div>
                                <IconButton onClick={(e) => handleJoinCard(e, group)}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FindGroupCard