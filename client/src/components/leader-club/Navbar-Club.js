import React, {useContext} from 'react'
import { UserContext } from '../../UserContext'
import './Navbar-Club.css'
import Tooltip from '@mui/material/Tooltip'

const NavbarClub = () => {
    const {user, setUser} = useContext(UserContext);

    const logout = () => {

    }

    // const menu = user ? <SignedInMenuClub logout={logout}/> : <SignedOutMenu/>
    return (
        
        <nav>
            <div className="nav-club">
                <div className='div-back'>
                    <a href="/" className="btn-back">
                    <i class="fa-solid fa-angle-left"></i>
                        All team</a>
                </div>
                <div className='div-clb'>
                    <div className='logo-team'></div>
                    <div className='name-team'>
                        CLB Chạy bộ
                    </div>
                    <div className='line'></div>
                </div>
                
                <div className='list-btn-navclub'>
                    <Tooltip title="Hoạt động" placement="right-start">
                        <a href="/club/activity" className='btn-activity'>
                            <i class="fa-solid fa-list-check"></i>
                            Hoạt động
                        </a>
                    </Tooltip>
                    <Tooltip title="Thành viên" placement="left-start">
                        <a href="/club/member">
                            <i class="fa-solid fa-user-group"></i>
                            Thành viên
                        </a>
                    </Tooltip>
                    <Tooltip title="Lịch hoạt động" placement="left-start">
                        <a href='/club/calendar'>
                            <i class="fa-solid fa-calendar-days"></i>
                            Lịch hoạt động
                        </a>
                    </Tooltip>
                    <Tooltip title="Tin nhắn" placement="left-start">
                        <a href='/club/message'>
                            <i class="fa-solid fa-comment-dots"></i>
                            Tin nhắn
                        </a>
                    </Tooltip>
                    <Tooltip title="Quỹ câu lạc bộ" placement="left-start">
                        <a href='/club/fund'>
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                            Qũy CLB
                        </a>
                    </Tooltip>
                </div>
                
                
            </div>
        </nav>
    )
}

export default NavbarClub