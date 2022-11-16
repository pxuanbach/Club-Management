import React from 'react'
import './Notification.css'
import CardNotify from './Card-Notify'
import CardInvite from './Card-Invite'
import NavTabs from './Tab-Notification'
const AllNotification = () => {
    return(
        <div className='div-card-noti'>
            <CardNotify/>
            <CardNotify/>
            <CardNotify/>
            <CardNotify/>
            <CardInvite/>
        </div>
    )

}

export default AllNotification