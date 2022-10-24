import React from 'react'
import './Invite.css'
import SendInvite from './Send-Invite'
import NavTabs from './Tab-Invite'
const Invite = () => {
    return(
        <div className='div-send-invite'>
            <div className='container-send-invite'>
                <h2 className='title-noti'>Quản lý lời mời</h2>
                <NavTabs/>
            </div>
        </div>
    )

}

export default Invite