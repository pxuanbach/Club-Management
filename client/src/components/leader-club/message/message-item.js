import React from 'react';
import { Avatar } from '@mui/material';

const MessageItem = ({user, message}) => {
    let isAppearch = user._id === message.author._id ? "message right appeared" : "message left appeared"
    return (
        <div className={isAppearch}>
            <div className="avatar">
                {user._id === message.author._id ? <></> : <Avatar src={message.author.img_url} />}
            </div>
            <div className='name-people'>{message.author.name}</div>
            <div className="text_wrapper">
                <span className="message_text">
                    {message.content}
                </span>
            </div>
        </div>
    )
}
export default MessageItem