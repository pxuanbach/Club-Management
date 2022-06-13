import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    Avatar, Divider, Box, CircularProgress,
    Tooltip, List, ListItem, ListItemText,
    ListItemAvatar, Snackbar, Alert,
    ListItemButton
} from '@mui/material';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import './PersonMessage.css'
import ItemMessage from './ItemMessage'
import MessagesList from '../leader-club/message/Message-List';
import Input from '../leader-club/message/Input';
import { ENDPT } from '../../helper/Helper';
import { UploadImageMessage } from '../../helper/UploadImage'
import { UserContext } from '../../UserContext';
import PreviewFileDialog from '../dialog/PreviewFileDialog'
import SeverityOptions from '../../helper/SeverityOptions';
import axiosInstance from '../../helper/Axios'

let socket;

const PersonMessage = () => {
    const inputFile = useRef(null);
    const [file, setFile] = useState();
    const { user } = useContext(UserContext);
    const [search, setSearch] = useState();
    const [message, setMessage] = useState();
    const [roomsFinded, setRoomsFinded] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState();
    const [messages, setMessages] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [options, setOptions] = useState();
    const [openDialog, setOpenDialog] = useState(false);

    const showSnackbar = (message, options) => {
        setOptions(options)
        setAlertMessage(message)
        setOpenSnackbar(true)
    }

    const handleRefresh = (e) => {
        e.preventDefault();
        socket.emit('get-list-room', user._id)
    }

    function isFileImage(file) {
        const fileType = file.type;
        return fileType.includes('spreadsheetml.sheet')
            || fileType.includes('ms-excel')
            || fileType.includes('image');
    }

    const handleFileChange = (event) => {
        if (isFileImage(event.target.files[0])) {
            setFile(event.target.files[0]);
            setOpenDialog(true)
        } else {
            showSnackbar('Tệp tải lên nên có định dạng excel, image.', SeverityOptions.warning)
        }
    };

    const handleChangeSearch = (e) => {
        e.preventDefault();
        if (e.target.value === '') {
            setRoomsFinded([])
        }
        setSearch(e.target.value)
        socket.emit('search-user', e.target.value, user._id)
    }

    const handleSearch = (e) => {
        e.preventDefault();

        if (search) {
            socket.emit('search-user', search)
        } else {
            setRoomsFinded([])
        }
    }

    const handleSelectChatRoom = (e, roomSelected) => {
        e.preventDefault();
        let isRoomExist = null;
        const currentRooms = JSON.parse(JSON.stringify(rooms))
        if (roomSelected.email === '') {
            isRoomExist = currentRooms.find(room => room.room_id === roomSelected._id)
        } else {
            const roomIdArr = [
                user._id + "_" + roomSelected._id,
                roomSelected._id + "_" + user._id
            ]
            isRoomExist = currentRooms.find(room =>
                room.room_id === roomIdArr[0]
                || room.room_id === roomIdArr[1]
            )
        }
        if (isRoomExist) {
            setCurrentRoom(isRoomExist)
        } else {
            const data = {
                room_id: user._id + "_" + roomSelected._id,
                imgUrl: roomSelected.img_url,
                name: roomSelected.name,
                lastMessage: "",
                createdAt: ""
            }
            setRooms([...rooms, data])
            setCurrentRoom(data)
        }
        setSearch('')
        setRoomsFinded([])
    }

    const handleSendFile = async () => {
        if (!currentRoom) {
            showSnackbar("Bạn chưa chọn phòng trò chuyện", SeverityOptions.error)
            return;
        }
        var formData = new FormData();
        formData.append("file", file);

        axiosInstance.post('/upload',
            formData, {
            headers: { "Content-Type": "multipart/form-data", }
        }).then(response => {
            socket.emit('sendMessage',
                user._id,
                file.type.includes('image') ? 'image' : 'file',
                response.data.original_filename,
                response.data.url,
                currentRoom.room_id,
                () => { }
            )
        }).catch(err => {
            showSnackbar(err.response.data.error, SeverityOptions.error)
        }).finally(() => {
            setFile(null)
        })
    }

    const sendMessage = (event) => {
        event.preventDefault();
        if (!currentRoom) {
            showSnackbar("Bạn chưa chọn phòng trò chuyện", SeverityOptions.error)
            setMessage('')
            return;
        }
        if (message) {
            //console.log(message, currentRoom)
            socket.emit('sendMessage',
                user._id,
                'text',
                '',
                message,
                currentRoom.room_id,
                () => setMessage('')
            )
        }
    }

    useEffect(() => {
        socket = io(ENDPT);
        socket.on('user-searched', roomList => {
            setRoomsFinded(roomList)
        })
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('output-list-room', roomList => {
            //console.log("current room", currentRoom)
            setRooms(roomList)
            //console.log("current room 2", currentRoom)
        })
        socket.on('reload-list-room', (message) => {
            //console.log(rooms)
            const currentRooms = JSON.parse(JSON.stringify(rooms))
            const isRoomExist = currentRooms.find(room => room.room_id === message.room_id)
            const isRoomClub = user.clubs.find(club => club === message.room_id)
            //console.log(rooms, message.room_id)
            if (isRoomExist || isRoomClub) {
                socket.emit('get-list-room', user._id)
            }
        })
    }, [rooms])

    useEffect(() => {
        socket.emit('join', { user_id: user?._id, room_id: currentRoom?.room_id })
        socket.emit('get-messages-history', currentRoom?.room_id)
        socket.on('output-messages', messages => {
            //console.log(messages)
            setMessages(messages)
        })
    }, [currentRoom])

    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message])
        })
    }, [messages]);

    useEffect(() => {
        if (user) {
            socket.emit('get-list-room', user._id)
            socket.on('chat-room-created', roomId => {
                const splitRoomId = roomId.split('_');
                if (splitRoomId.length > 1) {
                    if (splitRoomId[0] === user._id || splitRoomId[1] === user._id) {
                        socket.emit('get-list-room', user._id)
                    }
                }
            })
        }
    }, [user])

    if (!user) {
        return <Redirect to='/login' />
    }
    return (
        <div className='container-private-message'>
            <Snackbar
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity={options}>{alertMessage}</Alert>
            </Snackbar>
            <PreviewFileDialog
                open={openDialog}
                setOpen={setOpenDialog}
                title="Xác nhận nội dung"
                file={file}
                resetFile={() => inputFile.current.value = ""}
                contentText={`Bạn có chắc muốn gửi tệp \b${file?.name}\b?`}
                handleAgree={handleSendFile}
            />
            <div className='container-left'>
                <div className='header-left'>
                    <h2>Message</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Tooltip title="Làm mới">
                            <div className='btn-icon-refresh'
                                onClick={handleRefresh}>
                                <i class="fa-solid fa-arrow-rotate-right"></i>
                            </div>
                        </Tooltip>
                    </div>

                </div>
                <div className='container-search-mess'>
                    <div className='div-search-mess'>
                        <input
                            value={search}
                            type="text"
                            placeholder="Tìm kiếm"
                            onChange={handleChangeSearch}
                            onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
                        />
                        <i onClick={handleSearch} class="fa-solid fa-magnifying-glass"></i>
                        {search ? <List sx={{
                            position: 'absolute',
                            top: '37px',
                            borderRadius: '5px',
                            backgroundColor: '#fff',
                            width: '100%',
                            minHeight: '300px',
                            zIndex: 99,
                        }}>
                            {roomsFinded.map((room, index) => (
                                <ListItem key={index}
                                    alignItems="flex-start"
                                    sx={{
                                        padding: "0px 10px",
                                        overflow: 'hidden',
                                        width: '100%',
                                    }}>
                                    <ListItemButton onClick={(e) => handleSelectChatRoom(e, room)}>
                                        <ListItemAvatar>
                                            <Avatar src={room.img_url} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={room.name}
                                            secondary={room.email}
                                        />
                                    </ListItemButton>

                                </ListItem>
                            ))}
                        </List> : <></>}
                    </div>

                    <Divider />
                </div>
                <div className='container-item-message'>
                    {user ?
                        rooms.map(room => (
                            <ItemMessage
                                key={room.room_id}
                                room={room}
                                setCurrentRoom={setCurrentRoom}
                            />
                        ))
                        : <Box className='loading-temp'>
                            <CircularProgress />
                        </Box>}

                </div>
            </div>
            <div className='container-right'>
                <div className='div-message-body'>
                    <div className='div-mess'>
                        {currentRoom ? <div className='header-mess'>
                            <Avatar src={currentRoom.imgUrl} sx={{ width: 43, height: 43 }} />
                            <div className='name-mess'>{currentRoom.name}</div>
                        </div> : <></>}
                        <div className='body-mess'>
                            <MessagesList
                                user={user}
                                messages={messages}
                            />
                        </div>
                        <div className='div-chat'>
                            <div className='chat-todo'>
                                <i onClick={() => inputFile.current.click()} class="fa-solid fa-file-image"></i>
                                <input style={{ display: 'none' }}
                                    type="file"
                                    ref={inputFile}
                                    onChange={handleFileChange} />
                            </div>
                            <div className='div-text-chat'>
                                <Input
                                    message={message}
                                    setMessage={setMessage}
                                    sendMessage={sendMessage}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default PersonMessage