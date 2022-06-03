import React, { useState, useEffect, useContext } from 'react'
import { Avatar, Divider, Box, CircularProgress } from '@mui/material';
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
    const [message, setMessage] = useState();
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState();
    const [messages, setMessages] = useState([]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            console.log(message)
            socket.emit('sendMessage', user._id, 'text', message, currentRoom.room_id, () => setMessage(''))
        }
    }

    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

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
            socket.on('output-list-room', roomList => {
                //console.log(roomList)
                setRooms(roomList)
                setCurrentRoom(roomList[0])
            })
        }
        //socket.emit('join', { user_id: user?._id, room_id: club_id })
    }, [user])

    if (!user) {
        return <Redirect to='/login' />
    }
    return (
        <div className='container-private-message'>
            <div className='container-left'>
                <div className='header-left'>
                    <h2>Message</h2>
                    <div className='btn-icon-create'>
                        <i class="fa-solid fa-square-pen"></i>
                    </div>
                </div>
                <div className='container-search-mess'>
                    <div className='div-search-mess'>
                        <input
                            type="text"
                            placeholder="Tìm kiếm trên Message"
                        />
                        <i class="fa-solid fa-magnifying-glass"></i>
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
                        <div className='header-mess'>
                            <Avatar src={currentRoom?.imgUrl} sx={{ width: 43, height: 43 }} />
                            <div className='name-mess'>{currentRoom?.name}</div>
                            <div id="todoicon" className='todo-icon'>
                                <i class="fa-solid fa-phone"></i>
                                <i class="fa-solid fa-video"></i>
                            </div>
                        </div>
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