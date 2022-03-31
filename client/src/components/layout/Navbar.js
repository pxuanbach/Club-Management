import React, {useContext} from 'react'
import { UserContext } from '../../UserContext'
import './Navbar.css'
import SignedInMenu from './SignedInMenu'
import SignedOutMenu from './SignedOutMenu'
import { my_API } from '../../helper/Helper'

const Navbar = () => {
    const {user, setUser} = useContext(UserContext);

    const logout = async () => {
        try {
            const res = await fetch(my_API + 'logout', {
                credentials: 'include',
            });
            const data = res.json();
            console.log('logout data', data);
            setUser(null);
        } catch (error) {
            console.log(error)
        }
    }

    const menu = user ? <SignedInMenu logout={logout}/> : <SignedOutMenu/>
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="/" className="brand-logo">Logo</a>
                {menu}
            </div>
        </nav>
    )
}

export default Navbar 