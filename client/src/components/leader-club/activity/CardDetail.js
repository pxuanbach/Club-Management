import React, { useState, useEffect, useRef, useContext } from 'react'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    Button, TextareaAutosize, IconButton, Avatar,
    Tooltip, AvatarGroup, Snackbar, Alert, Popover,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import './CardDetail.css'
import axiosInstance from '../../../helper/Axios';
import UserCard from '../../card/UserCard';
import MemberAssgin from './MemberAssign';
import { UserContext } from '../../../UserContext';

const columnTitles = [
    "Cần làm",
    "Đang làm",
    "Đã xong",
    "Ghi chú",
]

const CardDetail = ({ setShowForm, card, isLeader, columnTitle }) => {
    const {activityId} = useParams()
    const { user } = useContext(UserContext);
    const newCardTextareaRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const [userSelected, setUserSelected] = useState()
    const [show, setShow] = useState(false);
    const [userJoin, setUserJoin] = useState([]);
    const [groupJoin, setGroupJoin] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const options = columnTitles.filter(col => col !== columnTitle)
    const openPopover = Boolean(anchorEl)

    const showSnackbar = (message, isErr) => {
        setIsError(isErr)
        setAlertMessage(message)
        setOpenSnackbar(true)
    }

    const onExitClick = () => {
        setShowForm(false);
    };

    const handleShowPopover = (event, user) => {
        setAnchorEl(event.currentTarget);
        setUserSelected(user)
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const showhideFunction = () => {
        var actionList = document.getElementById("actionOfText");
        if (actionList.className === "not-display") {
            actionList.className = "display";
        } else {
            actionList.className = "not-display";
        }
    }

    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    const handleJoinCard = (e) => {
        e.preventDefault();
        if (user) {
            axiosInstance.post(`/activity/userjoin`,
                JSON.stringify({
                    "userId": user._id,
                    "cardId": card._id
                }), {
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                //response.data
                if (response.data.message) {
                    showSnackbar(response.data.message, false)
                } else {
                    console.log("success", response.data)
                    const newUserJoin = [...userJoin, user]
                    console.log(newUserJoin)
                    setUserJoin([...newUserJoin])
                }
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, true)
            })
        } else {
            showSnackbar("Đang tải dữ liệu...", false)
        }
    }

    const handleSendToColumn = (toColumn) => {
        const fromColumn = columnTitle;

    }

    const getJoin = () => {
        axiosInstance.get(`/activity/usergroupjoin/${card._id}`)
            .then(response => {
                //response.data
                //console.log(response.data)
                setUserJoin(response.data.userJoin)
                setGroupJoin(response.data.groupJoin)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, true)
            })
    }

    useEffect(() => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus()
            newCardTextareaRef.current.select()
        }
    }, [openNewCardForm])

    useEffect(() => {
        console.log("activityId", activityId)
        getJoin()
    }, [])

    return (
        <div>
            <Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity={isError ? "error" : "warning"}>{alertMessage}</Alert>
            </Snackbar>
            <div className='button-close' onClick={() => onExitClick()}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className='title-card'>
                <i class="fa-solid fa-window-maximize"></i>
                <h3>{card.title}</h3>
            </div>
            <div className='body-card-detail'>
                <div className='div-left-card-detail'>
                    <div className='display-member-attend'>
                        <div>
                            <h5 style={{ color: '#1B264D', fontSize: '16px', marginBottom: 5 }}>Thành viên tham gia</h5>
                            <div className="avatar-display">
                                <AvatarGroup total={userJoin.length}>
                                    {userJoin.map((user) => (
                                        <Avatar key={user._id}
                                            sx={{ cursor: 'pointer', fontSize: '16px' }}
                                            alt={user.name}
                                            src={user.img_url}
                                            onClick={(e) => handleShowPopover(e, user)}
                                        />
                                    ))}
                                </AvatarGroup>
                                <Popover
                                    open={openPopover}
                                    anchorEl={anchorEl}
                                    onClose={handleClosePopover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <UserCard user={userSelected} />
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <h5 style={{ color: 's', fontSize: '16px', marginBottom: 5 }}>Nhóm tham gia</h5>
                            <div className="avatar-display">
                                <AvatarGroup total={groupJoin.length}>
                                    {groupJoin.map((group, index) => (
                                        <Tooltip key={index} title={group.name} arrow>
                                            <Avatar
                                                sx={{ cursor: 'pointer', fontSize: '16px' }}
                                                alt={group.name}
                                                src="">
                                                {group.name.charAt(0)}
                                            </Avatar>
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', width: '100%', marginTop: 20 }}>
                        <i style={{ marginTop: '10px', fontSize: '20px', paddingRight: '15px', color: '#1B264D' }}
                            class="fa-solid fa-bars"></i>
                        <div className='description'>
                            <h4>Mô tả</h4>
                            {openNewCardForm &&
                                <div className='text-area'>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={4}
                                        placeholder="Thêm mô tả chi tiết hơn..."
                                        className='textarea-enter-description'
                                        ref={newCardTextareaRef}
                                    />
                                </div>
                            }
                            {openNewCardForm &&
                                <div className='add-new-description-action'>
                                    <Button variant="contained" >Lưu</Button>
                                    <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
                                        <i className="fa fa-trash icon" />
                                    </span>
                                </div>
                            }
                            {!openNewCardForm &&
                                <div className='add-description-area' onClick={toggleOpenNewCardForm}>
                                    <h5 className>Thêm mô tả chi tiết hơn</h5>
                                </div>
                            }
                        </div>
                    </div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <i style={{ marginTop: '35px', fontSize: '20px', paddingRight: '15px', color: '#1B264D' }} class="fa-solid fa-list-check"></i>
                        <div className='description-activity'>
                            <h4>Hoạt động</h4>
                            <div className='comment-area' >
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={1}
                                    placeholder="Viết bình luận..."
                                    className='textarea-enter-comment'
                                    onClick={() => showhideFunction()}
                                // ref={newCardTextareaRef}
                                />
                                <div id="actionOfText" className="not-display">
                                    <div className='btn-save-text'>Lưu</div>
                                    <div className='list-action-for-text'>
                                        <Tooltip title="Đính kèm">
                                            <IconButton className='icon-button-text'>
                                                <i class="fa-solid fa-paperclip"></i>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Đề cập thành viên">
                                            <IconButton className='icon-button-text'>
                                                <AlternateEmailIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: "#1B264D",
                                                    }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Thêm biểu tượng cảm xúc">
                                            <IconButton className='icon-button-text'>
                                                <SentimentSatisfiedAltIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: "#1B264D",

                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='div-right-card-detail'>
                    <div className='action-1'>
                        <h4 className='title-action'>Gợi ý</h4>
                        <button className='btn-action' onClick={handleJoinCard}>
                            <i class="fa-solid fa-user"></i>
                            Tham gia
                        </button>
                    </div>
                    <div className='action-2'>
                        <h4 className='title-action'>Tùy chọn thẻ</h4>
                        <button className='btn-action' onClick={() => setShow(true)}>
                            <i class="fa-solid fa-user-plus"></i>
                            Thêm nhóm
                        </button>
                        {
                            show ? <MemberAssgin setShow={setShow} /> : null
                        }
                        {isLeader && options.map((option, index) => (
                            <button key={index} className='btn-action' onClick={handleSendToColumn(option)}>
                                <ArrowForwardIcon fontSize='small' />
                                {option}
                            </button>
                        ))}

                    </div>
                </div>



            </div>
        </div>
    )
}

export default CardDetail