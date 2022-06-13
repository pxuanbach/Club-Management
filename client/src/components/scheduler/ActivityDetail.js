import React, { useState, useEffect, useContext } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Snackbar, Alert } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import 'react-block-ui/style.css';
import Column from '../leader-club/activity/Column'
import 'font-awesome/css/font-awesome.min.css'
import { useParams, useHistory, Link } from 'react-router-dom';
import axiosInstance from '../../helper/Axios';
import { UserContext } from '../../UserContext';
import './ActivityDetail.css'

function isElementInArray(key, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === key) {
            return true;
        }
    }
    return false;
}

const ActivityDetail = () => {
    const { activityId } = useParams();
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [activity, setActivity] = useState();
    const [columns, setColumns] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const showSnackbar = (message) => {
        setAlertMessage(message)
        setOpenSnackbar(true);
    }

    const getColumnsActivity = (activityId) => {
        axiosInstance.get(`/activity/one/${activityId}`)
            .then(response => {
                //response.data
                const club = response.data.club;
                if (user._id === club.leader || user._id === club.treasurer
                    || isElementInArray(user._id, club.members)) {
                    history.push(`/club/${club._id}/${club.name}/activity/${response.data._id}`);
                }
                setActivity(response.data)
                setColumns(response.data.boards)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error)
            })
    }

    useEffect(() => {
        if (user) {
            getColumnsActivity(activityId)
        }
    }, [user])

    return (
        <div className='div-detail-activity'>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">{alertMessage}</Alert>
            </Snackbar>
            <div className='div-back'>
                <Link className="btn-back"
                    style={{ color: 'white' }}
                    to="/scheduler"
                >
                    <i class="fa-solid fa-angle-left"></i>
                    Trở về
                </Link>
            </div>
            <div className='activity-detail-title'>
                <span>{activity?.club?.name}</span>
                <ChevronRightIcon fontSize='large' />
                <span>{activity?.title}</span>
            </div>
            <div className='board-columns'>
                <Container
                    orientation='horizontal'
                    getChildPayload={index => columns[index]}
                    dragHandleSelector=".column-drag-handle"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'column-drop-preview'
                    }}

                >
                    {columns.map((column, index) => (
                        <Draggable key={index}>
                            <Column
                                isLeader={false}
                                column={column}
                            />
                        </Draggable>
                    ))}
                </Container>

            </div>
        </div>
    )
}

export default ActivityDetail