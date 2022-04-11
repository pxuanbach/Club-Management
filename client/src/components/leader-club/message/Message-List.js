import React from 'react';
import MessageItem from './message-item';


export default class App extends React.Component {
    render () {
        return (
            <ul className="messages">
                {this.props.messages.map(item =>
                    <MessageItem key={item.id} user={item.userId === this.props.user? true: false} message={item.message}/>
                )}
            </ul>
        )
    }
}