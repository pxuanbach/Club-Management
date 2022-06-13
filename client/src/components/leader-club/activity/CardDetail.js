import React, { useState, useEffect, useRef, useContext } from 'react'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    Button, TextareaAutosize, Avatar, Box,
    Tooltip, AvatarGroup, Snackbar, Alert,
    Popover,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import './CardDetail.css'
import axiosInstance from '../../../helper/Axios';
import UserCard from '../../card/UserCard';
import FindGroupCard from '../../card/FindGroupCard';
import SelectedFiles from './file-item/SelectedFiles';
import CustomDialog from '../../dialog/CustomDialog';
import Comments from './comment/Comments'
import { UserContext } from '../../../UserContext';
import SeverityOptions from '../../../helper/SeverityOptions'

const CardDetail = ({ setShowForm, card, isLeader, getColumnsActivity }) => {
    const { activityId } = useParams()
    const { user } = useContext(UserContext);
    const inputFile = useRef(null);
    const newCardTextareaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorUser, setAnchorUser] = useState(null);
    const [anchorFindGroup, setAnchorFindGroup] = useState(null);
    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userSelected, setUserSelected] = useState()
    const [userJoin, setUserJoin] = useState([]);
    const [groupJoin, setGroupJoin] = useState([]);
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState();
    const [comment, setComment] = useState();
    const [comments, setComments] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [options, setOptions] = useState();
    const openUserCard = Boolean(anchorUser);
    const openFindGroup = Boolean(anchorFindGroup);

    const showSnackbar = (message, options) => {
        setOptions(options)
        setAlertMessage(message)
        setOpenSnackbar(true)
    }

    const onExitClick = () => {
        setShowForm(false);
    };

    function isFileImage(file) {
        const fileType = file.type;
        return fileType.includes('spreadsheetml.sheet')
            || fileType.includes('ms-excel')
            || fileType.includes('image');
    }

    const handleFileChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setIsLoading(true)
            //event.target.files[0]
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("cardId", card._id)
            axiosInstance.post('/activity/card/upload',
                formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then(response => {
                //response.data
                setFiles(response.data.files);
                showSnackbar('Tệp tải lên thành công.', SeverityOptions.success)
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, SeverityOptions.error)
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            showSnackbar('Tệp tải lên nên có định dạng excel, image.', SeverityOptions.warning)
        }
    };

    const handleShowPopover = (event, user, setAnchorEl) => {
        setAnchorEl(event.currentTarget);
        setUserSelected(user)
    };

    const handleClosePopover = (setAnchorEl) => {
        setAnchorEl(null);
    };

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
                if (response.data.success) {
                    getCardInfo()
                } else {
                    showSnackbar(response.data.message, SeverityOptions.warning)
                }
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, SeverityOptions.error)
            })
        } else {
            showSnackbar("Đang tải dữ liệu...", false)
        }
    }

    const handleSaveDescription = (e) => {
        e.preventDefault();
        //console.log(description)

        axiosInstance.patch(`/activity/card/description/${card._id}`,
            JSON.stringify({
                "description": description
            }), {
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            //response.data
            getCardInfo()
            toggleOpenNewCardForm();
        }).catch(err => {
            //err.response.data.error
            showSnackbar(err.response.data.error, SeverityOptions.error)
        })

    }

    const handleSaveComment = (e) => {
        e.preventDefault();
        if (comment.trim() !== '') {
            setIsLoading(true)
            axiosInstance.post(`/activity/card/addcomment`,
                JSON.stringify({
                    "cardId": card._id,
                    "content": comment,
                    "author": user._id
                }), {
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                //response.data
                getCardInfo()
                setComment('')
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, SeverityOptions.error)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const handleDeleteComment = (commentId) => {
        setIsLoading(true)
        axiosInstance.patch(`/activity/card/deletecomment/${card._id}`,
            JSON.stringify({
                "commentId": commentId,
            }), {
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            //response.data
            getCardInfo()
        }).catch(err => {
            //err.response.data.error
            showSnackbar(err.response.data.error, SeverityOptions.error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const deleteCard = () => {
        axiosInstance.delete(`/activity/card/${card._id}`)
            .then(response => {
                //response.data
                getColumnsActivity(activityId)
                onExitClick();
            }).catch(err => {
                //err.response.data.error
                showSnackbar(err.response.data.error, SeverityOptions.error)
            })
    }

    const getCardInfo = () => {
        axiosInstance.get(`/activity/card/${card._id}`)
            .then(response => {
                //response.data
                setUserJoin(response.data.userJoin)
                setGroupJoin(response.data.groupJoin)
                setFiles(response.data.files)
                setDescription(response.data.description)
                setComments(response.data.comments)
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
        //console.log("activityId", activityId)
        getCardInfo()
    }, [])

    return (
        <BlockUi tag="div" blocking={isLoading}>
            <CustomDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title="Xóa thẻ"
                contentText={`Bạn có chắc muốn xóa thẻ này?`}
                handleAgree={deleteCard}
            />
            <Snackbar
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity={options}>{alertMessage}</Alert>
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
                                            onClick={(e) => handleShowPopover(e, user, setAnchorUser)}
                                        />
                                    ))}
                                </AvatarGroup>
                                <Popover
                                    open={openUserCard}
                                    anchorEl={anchorUser}
                                    onClose={() => handleClosePopover(setAnchorUser)}
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
                            <h5 style={{ color: '#1B264D', fontSize: '16px', marginBottom: 5 }}>Nhóm tham gia</h5>
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
                    <Box className="display-member-attend" sx={{ paddingTop: 2 }}>
                        <SelectedFiles
                            cardId={card._id}
                            files={files}
                            setFiles={setFiles}
                            isLeader={isLeader}
                            showSnackbar={showSnackbar}
                            setIsLoading={setIsLoading}
                        />
                    </Box>
                    <div style={{ display: 'flex', width: '100%', marginTop: 20 }}>
                        <i style={{ marginTop: '10px', fontSize: '20px', paddingRight: '15px', color: '#1B264D' }}
                            class="fa-solid fa-bars"></i>
                        <div className='description'>
                            <h4>Mô tả</h4>
                            {openNewCardForm &&
                                <div className='text-area'>
                                    <TextareaAutosize
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        aria-label="minimum height"
                                        minRows={4}
                                        placeholder={"Thêm mô tả chi tiết hơn..."}
                                        className='textarea-enter-description'
                                        ref={newCardTextareaRef}
                                    />
                                </div>
                            }
                            {openNewCardForm &&
                                <div className='add-new-description-action'>
                                    <Button variant="contained" onClick={handleSaveDescription}>Lưu</Button>
                                    <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
                                        <i className="fa fa-trash icon" />
                                    </span>
                                </div>
                            }
                            {!openNewCardForm &&
                                <div className='add-description-area' onClick={toggleOpenNewCardForm}>
                                    <h5 className>
                                        {description ? description : "Thêm mô tả chi tiết hơn..."}
                                    </h5>
                                </div>
                            }
                        </div>
                    </div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <i style={{ marginTop: '35px', fontSize: '20px', paddingRight: '8px', color: '#1B264D' }}
                            class="fa-solid fa-comments"></i>

                        <div className='description-activity'>
                            <h4>Bình luận</h4>
                            <div className='comment-area' >
                                <TextareaAutosize
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    minRows={1}
                                    maxRows={3}
                                    placeholder="Viết bình luận..."
                                    className='textarea-enter-comment'
                                />
                                <div id="actionOfText">
                                    <div onClick={handleSaveComment}
                                        className='btn-save-text'>
                                        Lưu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {user && <Comments
                        comments={comments}
                        user={user}
                        handleDeleteComment={handleDeleteComment}
                    />}
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
                        {isLeader && <>
                            <button className='btn-action'
                                onClick={(e) => handleShowPopover(e, null, setAnchorFindGroup)}>
                                <i class="fa-solid fa-user-plus"></i>
                                Thêm nhóm
                            </button>
                            <button className='btn-action'
                                onClick={(e) => setOpenDialog(true)}>
                                <i class="fa-solid fa-trash-can"></i>
                                Xóa thẻ
                            </button>
                        </>}
                        <Popover
                            open={openFindGroup}
                            anchorEl={anchorFindGroup}
                            onClose={() => handleClosePopover(setAnchorFindGroup)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <FindGroupCard
                                activityId={activityId}
                                card={card}
                                getJoin={getCardInfo}
                                showSnackbar={showSnackbar}
                            />
                        </Popover>
                        <input style={{ display: 'none' }} type="file" ref={inputFile} onChange={handleFileChange} />
                        <button className='btn-action'
                            onClick={(e) => inputFile.current.click()}>
                            <AttachFileIcon fontSize='small' />
                            Đính kèm
                        </button>
                    </div>
                </div>



            </div>
        </BlockUi>
    )
}

export default CardDetail