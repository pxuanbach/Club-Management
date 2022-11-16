import { divide } from 'lodash'
import React from 'react'
import Avatar from '@mui/material/Avatar';
import './Send-Invite.css'
const SendInvite = () => {
    return(
        <div className='card-notify-container'>
            <div className='notify-avatar'>
                <Avatar className='avatar-noti'/>
            </div>
            <div className='notify-content'>
                <div className='div-name-title'>
                    <p className='club-name-invite'>Pear Paws</p>
                    <p>Mời bạn tham gia câu lạc bộ</p>
                </div>
                <div className='div-action-invite'>
                    <div className='button-cancel'>Đã gửi yêu cầu</div>
                    <div className='button-cancel'>Hủy</div>
                </div>
            </div>
        </div>
    )

}

export default SendInvite