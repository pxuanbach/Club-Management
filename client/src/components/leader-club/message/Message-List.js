import React from 'react';
import MessageItem from './message-item';


const MessageList = (props) => {  
        return (
            <ul className="messages">
                {props.messages.map(item =>
                    <MessageItem key={item.id} user={item.userId === props.user? true: false} message={item.message}/>
                )}
            </ul>
        )
}
export default MessageList;