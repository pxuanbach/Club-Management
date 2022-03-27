import React, {useContext, useEffect} from 'react'
import { UserContext } from '../../UserContext'
import './Navbar-Club.css'
import Tooltip from '@mui/material/Tooltip'
import { useParams, Link } from 'react-router-dom';

const NavbarClub = () => {
    let {club_id, club_name} = useParams();
    const {user, setUser} = useContext(UserContext);
    
    useEffect(() => {
        console.log(club_id)
    }, [])

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
                        <Link to={`/club/${club_id}/activity`} className='btn-activity'>
                            <i class="fa-solid fa-list-check"></i>
                            Hoạt động
                        </Link>
                    </Tooltip>
                    <Tooltip title="Thành viên" placement="left-start">
                        <Link to={`/club/${club_id}/member`}>
                            <i class="fa-solid fa-user-group"></i>
                            Thành viên
                        </Link>
                    </Tooltip>
                    <Tooltip title="Lịch hoạt động" placement="left-start">
                        <Link to={`/club/${club_id}/calendar`}>
                            <i class="fa-solid fa-calendar-days"></i>
                            Lịch hoạt động
                        </Link>
                    </Tooltip>
                    <Tooltip title="Tin nhắn" placement="left-start">
                        <Link to={`/club/${club_id}/message`}>
                            <i class="fa-solid fa-comment-dots"></i>
                            Tin nhắn
                        </Link>
                    </Tooltip>
                    <Tooltip title="Quỹ câu lạc bộ" placement="left-start">
                        <Link to={`/club/${club_id}/fund`}>
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                            Qũy CLB
                        </Link>
                    </Tooltip>
                </div>
                
                
            </div>
        </nav>
    )
}

export default NavbarClub