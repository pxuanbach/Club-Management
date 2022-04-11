import React, {useState} from 'react'
import "./Message.css"
import MessagesList from './Message-List';
import MessageOption from './MessageOption'
import $ from 'jquery';
import Input from './Input';
import _map from 'lodash/map';
import io from 'socket.io-client';


export default class Message extends React.Component {

  constructor(props) {
    super(props);
    //Khởi tạo state,
    this.state = {
        messages: [
            {id: 1, userId: 0, message: 'Hello'}
        ],
        user: null,
        
    }
    this.socket = null;
}
  
showhideFunction(){
  var menuList = document.getElementById("extend");    
  if (menuList.className == "extendOff")    
  {    
    menuList.className = "extendOn";    
    document.getElementById("todoicon").style.right = "28%";
  } else    
  {      
    menuList.className = "extendOff";  
    document.getElementById("todoicon").style.right = "1%";  
  } 
}

//Connetct với server nodejs, thông qua socket.io
componentWillMount() {
    this.socket = io('localhost:6969');
    this.socket.on('id', res => this.setState({user: res})) // lắng nghe event có tên 'id'
    this.socket.on('newMessage', (response) => {this.newMessage(response)}); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
}
//Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
newMessage(m) {
    const messages = this.state.messages;
    let ids = _map(messages, 'id');
    let max = Math.max(...ids);
    messages.push({
        id: max+1,
        userId: m.id,
        message: m.data
    });

    let objMessage = $('.messages');
    if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight ) {
        this.setState({messages});
        objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300); //tạo hiệu ứng cuộn khi có tin nhắn mới

    } else {
        this.setState({messages});
        if (m.id === this.state.user) {
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
        }
    }
}
//Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
sendnewMessage(m) {
    if (m.value) {
        this.socket.emit("newMessage", m.value); //gửi event về server
        m.value = ""; 
    }
}

render () {
  
  return (
    <div className='div-message-body'>
      <div className='div-mess'>
        <div className='header-mess'>
          {/* <div className='name-mess'>Tin nhắn chung</div> */}
          <div id="todoicon" className='todo-icon'>
            <i class="fa-solid fa-phone"></i>
            <i class="fa-solid fa-video"></i>
            <i class="fa-solid fa-circle-info" onClick={() => this.showhideFunction() } ></i>
              
          </div>
        </div>
        <div className='body-mess'>
          <MessagesList user={this.state.user} messages={this.state.messages} typing={this.state.typing}/>
        </div>
        <div className='div-chat'>
          <div className='chat-todo'>
            <i class="fa-solid fa-paperclip"></i>
            <i class="fa-solid fa-file-image"></i>
            <i class="fa-solid fa-microphone"></i>
          </div>
          <div className='div-text-chat'>
            <Input sendMessage={this.sendnewMessage.bind(this)}/>
          </div>
          
        </div>
      </div>
      <div id="extend" className="extendOff"> 
        <MessageOption></MessageOption>
      </div>
    </div>
    
  )
}
}




