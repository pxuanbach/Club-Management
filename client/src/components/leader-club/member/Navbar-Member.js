import React, {useContext} from 'react'
import { UserContext } from '../../../UserContext'
import './Navbar-Member.css'
import Tooltip from '@mui/material/Tooltip'
import { Link, useRouteMatch } from 'react-router-dom'

const NavbarMember = () => {
    const {user, setUser} = useContext(UserContext);
    const {path} = useRouteMatch()
    const logout = () => {

    }

    // const menu = user ? <SignedInMenuClub logout={logout}/> : <SignedOutMenu/>
    return (
        
        <nav>
            <div className="nav-member">
                <div className='list-btn-navmember'>
                    <Tooltip title="" placement="">
                        <Link to={`${path}/tabmember`} className='btn-memberclub'>
                            {/* <i class="fa-solid fa-list-check"></i> */}
                            Thành viên
                        </Link>
                    </Tooltip>
                    <Tooltip title="" placement="">
                        <Link to={`${path}/tabgroup`} className='btn-group'>
                            {/*???? <i class="fa-solid fa-user-group"></i> */}
                            Nhóm hoạt động
                        </Link>
                    </Tooltip>


                </div>
                
                
            </div>
        </nav>
    )
}

export default NavbarMember