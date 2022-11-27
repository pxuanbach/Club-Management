import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../UserContext'
import './Navbar-Club.css'
import { Tooltip, Box, CircularProgress } from '@mui/material'
import { useParams, Link, useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

const NavbarClub = ({ club }) => {
    const history = useHistory();
    const { user } = useContext(UserContext);
    let { club_id, club_name } = useParams();
    const [pathName, setPathName] = useState('message')

    useEffect(() => {
        return history.listen((location) => {
            setPathName(location.pathname.split('/')[4])
            console.log(location.pathname.split('/')[4])
        })
    }, [history, user])

    return (
        <nav className='div-left-nav'>
            {user ? (<div className="nav-club">
                <div className='div-back'>
                    <Link to='/clubs' className="btn-back">
                        <i class="fa-solid fa-angle-left"></i>
                        Tất cả câu lạc bộ</Link>
                </div>
                <div className='div-clb'>
                    <Avatar className='logo-team' sx={{ width: 120, height: 120 }} src={club?.img_url}></Avatar>
                    <div className='name-team'>
                        {club_name}
                    </div>
                    <div className='line'></div>
                </div>

                <div className='list-btn-navclub'>
                    <Tooltip title="Hoạt động" placement="right-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/activity`}
                            className={pathName === 'activity' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-list-check"></i>
                            Hoạt động
                        </Link>
                    </Tooltip>
                    <Tooltip title="Thành viên" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/member`}
                            className={pathName === 'member' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-user-group"></i>
                            Thành viên
                        </Link>
                    </Tooltip>
                    <Tooltip title="Lịch hoạt động" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/calendar`}
                            className={pathName === 'calendar' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-calendar-days"></i>
                            Lịch hoạt động
                        </Link>
                    </Tooltip>
                    <Tooltip title="Tin nhắn" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/message`}
                            className={pathName === 'message' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-comment-dots"></i>
                            Tin nhắn
                        </Link>
                    </Tooltip>
                    <Tooltip title="Quỹ câu lạc bộ" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/fund`}
                            className={pathName === 'fund' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                            Qũy CLB
                        </Link>
                    </Tooltip>
                    {club.leader._id === user._id ? <Tooltip title="Quản lý lời mời" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/invite`}
                            className={pathName === 'invite' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-envelope-open"></i>
                            Lời mời
                        </Link>
                    </Tooltip> : <></>}
                    <Tooltip title="Nhật ký câu lạc bộ" placement="left-start">
                        <Link
                            to={`/club/${club_id}/${club_name}/log`}
                            className={pathName === 'log' ? 'navclub-selected' : ''}>
                            <i class="fa-solid fa-book"></i>
                            Nhật ký
                        </Link>
                    </Tooltip>

                </div>
            </div>) : (<></>)}
        </nav>
    )
}

export default NavbarClub