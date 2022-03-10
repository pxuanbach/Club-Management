import React from 'react'
import Tooltip from '@mui/material/Tooltip'

const SignedInMenu = ({ logout }) => {
    return (
        <div className='nav-menu'>
            <div className='list-btn'>
                <Tooltip title="My Team" placement="left-start">
                    <a href="/">
                        <i class="fa-solid fa-users"></i>
                    </a>
                </Tooltip>
                <Tooltip title="Manage Club" placement="left-start">
                    <a href="/mng-club">
                        <i class="fa-solid fa-users-gear"></i>
                    </a>
                </Tooltip>
                <Tooltip title="Manage Account" placement="left-start">
                    <a href='/mng-account'>
                        <i class="fa-solid fa-user-gear"></i>
                    </a>
                </Tooltip>
            </div>
            <div className='avatar-logout'>
            <Tooltip title="Information" placement="left-start">
                <a href="/info">
                    <img src='https://scontent.fdad3-5.fna.fbcdn.net/v/t1.6435-1/121718895_1047521952348781_6922509068478097633_n.jpg?stp=dst-jpg_p320x320&_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_ohc=Hi5lTnlkQEcAX9ciG7O&_nc_ht=scontent.fdad3-5.fna&oh=00_AT84zqtouqFXHyi-J_f37uHemnKitT79Cr3UccpPHBxe3A&oe=624F1F3A'></img>
                </a>
                </Tooltip>
                <Tooltip title="Logout" placement='left-start'>
                <a onClick={logout} href="">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </a>
                </Tooltip>
            </div>
        </div>
    )
}

export default SignedInMenu