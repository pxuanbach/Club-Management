import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'

const SignedOutMenu = () => {
    return (
        <div className='nav-menu'>
            <div className='list-btn'>
                <Tooltip title="Câu lạc bộ của tôi" placement="right-start">
                    <Link href="/login">
                        <i class="fa-solid fa-right-to-bracket"></i>
                    </Link>
                </Tooltip>
                
            </div>
        </div>
    )
}

export default SignedOutMenu