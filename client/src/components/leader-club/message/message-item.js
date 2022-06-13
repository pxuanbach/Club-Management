import React from 'react';
import { Avatar } from '@mui/material';
import moment from 'moment';
import FilePresentIcon from '@mui/icons-material/FilePresent';

const styleContainer = {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '300px',
    maxHeight: '300px',
    margin: '0px auto 5px',
    overflow: 'hidden',
}

const styleImg = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    objectPosition: "center",
}

const MessageItem = ({ user, message }) => {
    let isAppearch = user._id === message.author._id 
    return (
        <div className={isAppearch ? "message right appeared" : "message left appeared"}>
            <div className="avatar">
                {user._id === message.author._id ? <></> : <Avatar src={message.author.img_url} />}
            </div>
            <div className='content'>
                <div className='name-people'>{message.author.name}</div>
                <div className="text_wrapper">
                    {message.type === "image" &&
                        <div style={styleContainer}>
                            <img style={styleImg} src={message.content}></img>
                        </div>}
                    {message.type === "text" &&
                        <span className="message_text">
                            {message.content}
                        </span>}
                    {message.type === 'file' &&
                        <div className='message_file'>
                            <FilePresentIcon sx={{ color: isAppearch ? "#fff" : '#388E3C' }}/>
                            <a href={message.content} target="_blank">
                                {message.original_filename}
                            </a>
                        </div>}
                </div>
                <div className='create-time'>{moment(message.createdAt).fromNow()}</div>
            </div>
        </div >
    )
}
export default MessageItem