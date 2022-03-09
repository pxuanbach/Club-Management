import React from 'react'

const Navbar = () => {
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Logo</a>
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li><a href="#">My Team</a></li>
                    <li><a href="#">Manage</a></li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar