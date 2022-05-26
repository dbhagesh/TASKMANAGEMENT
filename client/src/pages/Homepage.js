import React from 'react'
import { Outlet, Link } from "react-router-dom";


function Homepage() {
    return (
        <div className='homepage-wrapper'>
            <div className='homepage-wrapper-head'>Welcome to Task Management App</div>
            <div className='homepage-wrapper-subhead'>A task management app for your team</div>
            <div className='homepage-wrapper-content'>

                <Link to="/login">Login</Link>
                <Link to="/signup">SignUp</Link>

            </div>
        </div>

    )
}

export default Homepage;
