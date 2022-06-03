import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'

const SignedOutMenu = ({pathName}) => {
    return (
        <div className='nav-menu'>
            <div className='list-btn'>
                <Tooltip title="Câu lạc bộ của tôi" placement="right-start">
                    <Link className={pathName === 'login' ? 'selected' : ''} to="/login">
                        <i class="fa-solid fa-right-to-bracket"></i>
                    </Link>
                </Tooltip>
            </div>
        </div>
    )
}

export default SignedOutMenu