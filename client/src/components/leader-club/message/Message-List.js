import React from 'react';
import MessageItem from './Message-Item';
import STB from 'react-scroll-to-bottom'

const MessageList = ({user, messages}) => {
    return (
        <STB className="messages">
            {messages && messages.map((message, index) => (
                <MessageItem key={index} user={user} message={message} />
            ))}
        </STB>
    )
}
export default MessageList;