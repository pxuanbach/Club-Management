import React, { useState, useEffect, useContext } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Snackbar, Alert, Modal, Stack, Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import 'react-block-ui/style.css';
import Column from '../leader-club/activity/Column'
import 'font-awesome/css/font-awesome.min.css'
import { useParams, useHistory, Link } from 'react-router-dom';
import axiosInstance from '../../helper/Axios';
import { UserContext } from '../../UserContext';
import moment from 'moment';
import './ActivityDetail.css'
import ActivityConfig from '../leader-club/activity/ActivityConfig';
import CollaboratorsInActivity from '../leader-club/activity/action/CollaboratorsInActivity';

function isElementInArray(key, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === key) {
            return true;
        }
    }
    return false;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

const styleCollaborator = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: '100%',
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll'
};

const ActivityDetail = () => {
    const { activityId } = useParams();
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [activity, setActivity] = useState();
    const [columns, setColumns] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [isSumaried, setIsSumaried] = useState(false);
    const [showFormConfig, setShowFormConfig] = useState(false);
    const [showFormCollaborator, setShowFormCollaborator] = useState(false);

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
                setIsFinished(moment() > moment(response.data.endDate));
                setIsSumaried(response.data.sumary !== "")
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
            <Modal
                open={showFormConfig}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={() => {
                    setShowFormConfig(false);
                }}
            >
                <Box sx={style}>
                    <ActivityConfig
                        show={showFormConfig}
                        setShow={setShowFormConfig}
                        activityId={activityId}
                        showSnackbar={showSnackbar}
                        isFinished={isFinished}
                        isLeader={false}
                    />
                </Box>
            </Modal>
            <Modal
                open={showFormCollaborator}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={() => {
                    setShowFormCollaborator(false);
                }}
            >
                <Box sx={styleCollaborator}>
                    <CollaboratorsInActivity
                        setShow={setShowFormCollaborator}
                        activityId={activityId}
                        showSnackbar={showSnackbar}
                        isFinished={isFinished}
                        isLeader={false}
                        isSumaried={isSumaried}
                    />
                </Box>
            </Modal>
            <Stack className='div-back' direction="row" justifyContent="space-between">
                <Link className="btn-back"
                    style={{ color: 'white' }}
                    to="/scheduler"
                >
                    <i class="fa-solid fa-angle-left"></i>
                    Trở về
                </Link>
                <Stack direction="row" spacing={1}>
                    <div
                        onClick={() => setShowFormCollaborator(true)}
                        className="btn-back"
                        style={{ color: 'white', marginRight: '15px' }}>
                        <i class="fas fa-user-friends"></i>
                        Cộng tác viên
                    </div>
                    <div
                        onClick={() => setShowFormConfig(true)}
                        className="btn-back"
                        style={{ color: 'white', marginRight: '15px' }}>
                        <i class="fa-solid fa-gear"></i>
                        Cài đặt
                    </div>
                </Stack>
            </Stack>
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
                                isFinished={isFinished}
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