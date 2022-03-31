import React, {useContext} from 'react'
import { UserContext } from '../../UserContext'
import './Navbar.css'
import SignedInMenu from './SignedInMenu'
import SignedOutMenu from './SignedOutMenu'
import logo_web from "../../assets/logoweb.png";
const Navbar = () => {
    const {user, setUser} = useContext(UserContext);

    const logout = () => {

    }

    const menu = user ? <SignedInMenu logout={logout}/> : <SignedOutMenu/>
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">
                    <img src={logo_web} className="logo-web" />
                </a>
                <SignedInMenu logout={logout}/>
            </div>
        </nav>
    )
}

export default Navbar 