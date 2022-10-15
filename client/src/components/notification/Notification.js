import React from 'react'
import './Notification.css'
import CardNotify from './Card-Notify'
import CardInvite from './Card-Invite'
const Notification = () => {
    return(
        <div className='div-notification'>
            <div className='container-noti'>
                <h1 className='title-noti'>Thông báo</h1>
                <div className='div-card-noti'>
                    <CardNotify/>
                    <CardNotify/>
                    <CardNotify/>
                    <CardNotify/>
                    <CardInvite/>
                </div>
            </div>
        </div>
    )

}

export default Notification