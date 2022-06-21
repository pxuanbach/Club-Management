import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../UserContext'
import { Link, useHistory } from 'react-router-dom'
import './Navbar.css'
import SignedInMenu from './SignedInMenu'
import SignedOutMenu from './SignedOutMenu'
import logo_web from "../../assets/logoweb.png";
import axiosInstance from '../../helper/Axios'
import { SocketContext } from '../../SocketContext'

const Navbar = () => {
    const history = useHistory();
    const socket = useContext(SocketContext)
    const { user, setUser } = useContext(UserContext);
    const [pathName, setPathName] = useState()

    const logout = async () => {
        try {
            const res = await axiosInstance.get('/logout', { withCredentials: true });
            const data = res.data;
            console.log('logout data', data);
            setUser(null);
            socket.emit('logout')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return history.listen((location) => {
            setPathName(location.pathname.split('/')[1])
            //console.log(location.pathname.split('/')[1])
        })
    }, [history])

    const menu = user
        ? <SignedInMenu logout={logout} pathName={pathName} />
        : <SignedOutMenu pathName={pathName} />

    return (
        <nav>
            <div className="nav-wrapper">
                <Link to="/scheduler" className="brand-logo">
                    <img src={logo_web} className="logo-web" />
                </Link>
                {menu}
            </div>
        </nav>
    )
}

export default Navbar 