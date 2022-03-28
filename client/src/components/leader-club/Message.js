import React from 'react'
import "./Message.css"

const Message = () => {
  return (
    <div className='div-mess'>
      <div className='header-mess'>
        {/* <div className='name-mess'>Tin nhắn chung</div> */}
        <div className='todo-icon'>
          <i class="fa-solid fa-phone"></i>
          <i class="fa-solid fa-video"></i>
          <i class="fa-solid fa-circle-info"></i>
          
        </div>
      </div>
      <div className='body-mess'>

      </div>
      <div className='div-chat'>
        <div className='chat-todo'>
          <i class="fa-solid fa-paperclip"></i>
          <i class="fa-solid fa-file-image"></i>
          <i class="fa-solid fa-microphone"></i>
          
        </div>
        <div className='div-text-chat'>
          <input className='text-chat'
              type="text"
              placeholder="Aa"
              
            />
            <i class="fa-solid fa-face-smile"></i>
        </div>
        <i class="fa-solid fa-thumbs-up"></i>
      </div>

      
    </div>
  )
}

export default Message