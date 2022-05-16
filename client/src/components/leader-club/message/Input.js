import React from 'react';

const Input = ({ message, setMessage, sendMessage }) => {

    return (
        <div className="bottom_wrapper clearfix">
            <div className="message_input_wrapper">
                <input
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    className="message_input"
                    placeholder="Type your message here..."
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                />
            </div>
            <div className="send_message" onClick={sendMessage}>
                <div className="icon"></div>
                <div className="text">Send</div>
            </div>
        </div>
    )
}

export default Input