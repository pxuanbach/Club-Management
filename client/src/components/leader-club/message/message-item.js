import React from 'react';
import { Avatar } from '@mui/material';

const MessageItem = ({user, message}) => {

    let isAppearch = user ? "message right appeared" : "message left appeared"

    return (
        <div className={isAppearch}>
            <div className="avatar">
                <Avatar src='' />
            </div>
            <div className='name-people'>Đạt</div>
            <div className="text_wrapper">
                <span className="message_text">
                    Ha ha
                </span>
            </div>

        </div>
    )
}
export default MessageItem