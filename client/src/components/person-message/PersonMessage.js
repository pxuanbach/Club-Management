import React, { useState, useEffect, useContext } from 'react'
import {
    Avatar, Divider, Box, CircularProgress,
    Tooltip, List, ListItem, ListItemText,
    ListItemAvatar,
    ListItemButton
} from '@mui/material';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import './PersonMessage.css'
import ItemMessage from './ItemMessage'
import MessagesList from '../leader-club/message/Message-List';
import Input from '../leader-club/message/Input';
import { ENDPT } from '../../helper/Helper';
import { UserContext } from '../../UserContext';

let socket;

const PersonMessage = () => {
    const { user } = useContext(UserContext);
    const [isFindUser, setIsFindUser] = useState(false);
    const [search, setSearch] = useState();
    const [message, setMessage] = useState();
    const [userSelected, setUserSelected] = useState();
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState();
    const [messages, setMessages] = useState([]);

    const handleToggleFindUser = (e) => {
        e.preventDefault();
        setIsFindUser(!isFindUser);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (isFindUser) {
            if (search) {
                socket.emit('search-user', search)
            } else {
                setUsers([])
            }
        } else {

        }
    }

    const handleSelectUser = (e, userSelected) => {
        const data = {
            room_id: user._id + "_" + userSelected._id,
            imgUrl: userSelected.img_url,
            name: userSelected.name,
            lastMessage: "",
            createdAt: ""
        }
        setRooms([...rooms, data])
        setIsFindUser(false);
    }

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            console.log(message, currentRoom)
            socket.emit('sendMessage', user._id, 'text', message, currentRoom.room_id, () => setMessage(''))
        }
    }

    useEffect(() => {
        socket = io(ENDPT);
        socket.on('user-searched', userList => {
            setUsers(userList)
        })
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    useEffect(() => {
        console.log(currentRoom)
        socket.emit('join', { user_id: user?._id, room_id: currentRoom?.room_id })
        socket.emit('get-messages-history', currentRoom?.room_id)
        socket.on('output-messages', messages => {
            //console.log(messages)
            setMessages(messages)
        })
    }, [currentRoom])

    useEffect(() => {
        socket.on('message', message => {
            // console.log('message sended', message)
            // console.log("message", message.room_id)
            // console.log("current room", currentRoom)
            // console.log("user id", message.author._id === user._id)
            const checkUserId = message.author._id === user._id;
            const checkRoomId = (message.room_id === currentRoom?.room_id);
            if (checkRoomId || checkUserId) {
                setMessages([...messages, message])
            }
            const isRoomExist = rooms.find(room => room.room_id === message.room_id)
            if (isRoomExist) {
                socket.emit('get-list-room', user._id)
            }
        })
    }, [messages]);

    useEffect(() => {
        if (user) {
            socket.emit('get-list-room', user._id)
            socket.on('output-list-room', roomList => {
                //console.log("current room", currentRoom, roomList[0])
                setRooms(roomList)
                if (currentRoom === undefined) {
                    setCurrentRoom(JSON.parse(JSON.stringify(roomList[0])))
                }
                //console.log("current room 2", currentRoom)
            })
        }
    }, [user])

    if (!user) {
        return <Redirect to='/login' />
    }
    return (
        <div className='container-private-message'>
            <div className='container-left'>
                <div className='header-left'>
                    <h2>Message</h2>
                    <Tooltip title="Tạo cuộc trò chuyện mới">
                        <div className='btn-icon-create'
                            onClick={handleToggleFindUser}>
                            <i class="fa-solid fa-square-pen"></i>
                        </div>
                    </Tooltip>
                </div>
                <div className='container-search-mess'>
                    <div className='div-search-mess'>
                        <input
                            value={search}
                            type="text"
                            placeholder="Tìm kiếm"
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={event => event.key === 'Enter' ? handleSearch(event) : null}
                        />
                        <i onClick={handleSearch} class="fa-solid fa-magnifying-glass"></i>
                        {isFindUser ? <List sx={{
                            position: 'absolute',
                            top: '37px',
                            borderRadius: '5px',
                            backgroundColor: '#fff',
                            width: '100%',
                            zIndex: 99,
                        }}>
                            {users.map((user, index) => (
                                <ListItem key={index}
                                    alignItems="flex-start"
                                    sx={{ padding: "0px 10px" }}>
                                    <ListItemButton onClick={(e) => handleSelectUser(e, user)}>
                                        <ListItemAvatar>
                                            <Avatar src={user.img_url} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.email}
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
                        {currentRoom && <div className='header-mess'>
                            <Avatar src={currentRoom.imgUrl} sx={{ width: 43, height: 43 }} />
                            <div className='name-mess'>{currentRoom.name}</div>
                            <div id="todoicon" className='todo-icon'>
                                <i class="fa-solid fa-phone"></i>
                                <i class="fa-solid fa-video"></i>
                            </div>
                        </div>}
                        <div className='body-mess'>
                            <MessagesList
                                user={user}
                                messages={messages}
                            />
                        </div>
                        <div className='div-chat'>
                            <div className='chat-todo'>
                                <i class="fa-solid fa-paperclip"></i>
                                <i class="fa-solid fa-file-image"></i>
                                <i class="fa-solid fa-microphone"></i>
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