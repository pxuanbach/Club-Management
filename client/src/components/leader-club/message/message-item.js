import React from 'react';

const MessageItem = (props) => {
        return (
            <li className={props.user? "message right appeared": "message left appeared"}>
                <div className="avatar"></div>
                <div className='name-people'>Đạt</div>
                <div className="text_wrapper">
                    <div className="text">{props.message}</div>
                </div>
                
            </li>
        )
}
export default MessageItem