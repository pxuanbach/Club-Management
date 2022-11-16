import React from 'react'
import './Card-Invite.css'
import Avatar from '@mui/material/Avatar';


const CardInvite = () =>{
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
                    <div className='button-accept'>Xác nhận</div>
                    <div className='button-cancel'>Hủy</div>
                </div>
            </div>
        </div>
    )
}

export default CardInvite