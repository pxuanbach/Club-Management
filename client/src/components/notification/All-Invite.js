import React from 'react'
import './Notification.css'
import CardNotify from './Card-Notify'
import CardInvite from './Card-Invite'
import NavTabs from './Tab-Notification'
const AllInvite = () => {
    return(
        <div className='div-card-noti'>
            <CardInvite/>
            <CardInvite/>
            <CardInvite/>
        </div>
    )

}

export default AllInvite