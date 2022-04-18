import React, { useState, useEffect, useContext } from 'react'
import "./Message.css"
import MessagesList from './Message-List';
import MessageOption from './MessageOption'
import Input from './Input';
import _map from 'lodash/map';
import io from 'socket.io-client';
import {ENDPT} from '../../../helper/Helper'
import {UserContext} from '../../../UserContext'
import {useParams} from 'react-router-dom'

let socket

const Message = () => {
  const { club_id, club_name } = useParams();
  const [messages, setMessages] = useState([]);
  const {user, setUser} = useContext(UserContext);

  const showhideFunction = () => {
    var menuList = document.getElementById("extend");
    if (menuList.className == "extendOff") {
      menuList.className = "extendOn";
      document.getElementById("todoicon").style.right = "28%";
    } else {
      menuList.className = "extendOff";
      document.getElementById("todoicon").style.right = "1%";
    }
  }

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('join', { name: user.name, user_id: user._id, club_id })
  }, [ENDPT])

  return (
    <div className='div-message-body'>
      <div className='div-mess'>
        <div className='header-mess'>
          {/* <div className='name-mess'>Tin nhắn chung</div> */}
          <div id="todoicon" className='todo-icon'>
            <i class="fa-solid fa-phone"></i>
            <i class="fa-solid fa-video"></i>
            <i class="fa-solid fa-circle-info" onClick={() => showhideFunction()} ></i>
          </div>
        </div>
        <div className='body-mess'>
          <MessagesList user={user} messages={messages} />
        </div>
        <div className='div-chat'>
          <div className='chat-todo'>
            <i class="fa-solid fa-paperclip"></i>
            <i class="fa-solid fa-file-image"></i>
            <i class="fa-solid fa-microphone"></i>
          </div>
          <div className='div-text-chat'>
            <Input sendMessage={() => {}} />
          </div>

        </div>
      </div>
      <div id="extend" className="extendOff">
        <MessageOption></MessageOption>
      </div>
    </div>
  )
}
export default Message




