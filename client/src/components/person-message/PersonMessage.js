import React from 'react'
import './PersonMessage.css'
import ItemMessage from './ItemMessage'
import Divider from '@mui/material/Divider';
import MessagesList from '../leader-club/message/Message-List';
import Input from '../leader-club/message/Input';
import { Avatar } from '@mui/material';
const PersonMessage = () => {

  return (
    <div className='container-private-message'>
        <div className='container-left'>
            <div className='header-left'>
                <h2>Message</h2>
                <div className='btn-icon-create'>
                    <i class="fa-solid fa-square-pen"></i>
                </div>
            </div>
            <div className='container-search-mess'>
            <div className='div-search-mess'>
                <input 
                    type="text"
                    placeholder="Tìm kiếm trên Message"
                />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <Divider />
        </div>
        <div className='container-item-message'>
            <ItemMessage/>
            <ItemMessage/>

        </div>
        </div>
        <div className='container-right'>
            <div className='div-message-body'>
                <div className='div-mess'>
                    <div className='header-mess'>
                    <Avatar sx={{width: 43, height: 43}}/>
                    <div className='name-mess'>Nguyễn Tiến Đạt</div>
                    <div id="todoicon" className='todo-icon'>
                        <i class="fa-solid fa-phone"></i>
                        <i class="fa-solid fa-video"></i>
                    </div>
                    </div>
                    <div className='body-mess'>
                    {/* <MessagesList/> */}
                    </div>
                    <div className='div-chat'>
                    <div className='chat-todo'>
                        <i class="fa-solid fa-paperclip"></i>
                        <i class="fa-solid fa-file-image"></i>
                        <i class="fa-solid fa-microphone"></i>
                    </div>
                    <div className='div-text-chat'>
                        <Input/>
                    </div>

                    </div>
                </div>

            </div>
        </div>
    </div>

  )
}

export default PersonMessage