import React from 'react'
import './Card-Notify.css'
import Avatar from '@mui/material/Avatar';

const CardNotify = () =>{
    return(
        <div className='card-notify-container'>
            <div className='notify-avatar'>
                <Avatar className='avatar-noti'/>
            </div>
            <div className='notify-content'>
                <p>Hãy thông báo gì đó đi nào</p>
                <p className='time-noti'>15 phút trước</p>
            </div>
        </div>
    )
}

export default CardNotify