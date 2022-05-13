import React, {useContext} from 'react'
import { UserContext } from '../../UserContext'
import './Navbar.css'
import SignedInMenu from './SignedInMenu'
import SignedOutMenu from './SignedOutMenu'
import logo_web from "../../assets/logoweb.png";
import axiosInstance from '../../helper/Axios'

const Navbar = () => {
    const {user, setUser} = useContext(UserContext);

    const logout = async () => {
        try {
            const res = await axiosInstance.get('/logout', { withCredentials: true });
            const data = res.data;
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
                <a href="#" className="brand-logo">
                    <img src={logo_web} className="logo-web" />
                </a>
                {menu}
            </div>
        </nav>
    )
}

export default Navbar 