import React, { useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'
import { UserContext } from '../../UserContext'

const SignedInMenu = ({ logout }) => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div className='nav-menu'>
            <div className='list-btn'>
                <Tooltip title="Câu lạc bộ của tôi" placement="right-start">
                    <Link to="/">
                        <i class="fa-solid fa-users"></i>
                    </Link>
                </Tooltip>
                {user.username.includes('admin') ?
                    <>
                        <Tooltip title="Quản lý các câu lạc bộ" placement="right-start">
                            <Link to="/mng-club">
                                <i class="fa-solid fa-users-gear"></i>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Quản lý tài khoản" placement="right-start">
                            <Link to='/mng-account'>
                                <i class="fa-solid fa-user-gear"></i>
                            </Link>
                        </Tooltip>
                    </> : null}
            </div>
            <div className='avatar-logout'>
                <Tooltip title="Thông tin cá nhân" placement="right-start">
                    <Link to="/info">
                        <img src='https://scontent.fdad3-5.fna.fbcdn.net/v/t1.6435-1/121718895_1047521952348781_6922509068478097633_n.jpg?stp=dst-jpg_p320x320&_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_ohc=Hi5lTnlkQEcAX9ciG7O&_nc_ht=scontent.fdad3-5.fna&oh=00_AT84zqtouqFXHyi-J_f37uHemnKitT79Cr3UccpPHBxe3A&oe=624F1F3A'></img>
                    </Link>
                </Tooltip>
                <Tooltip title="Đăng xuất" placement='right-start'>
                    <Link onClick={logout} to="/login">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </Link>
                </Tooltip>
            </div>
        </div>
    )
}

export default SignedInMenu