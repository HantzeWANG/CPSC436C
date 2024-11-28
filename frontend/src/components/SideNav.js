import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/SideNav.css';

const SideNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidenav ${isOpen ? 'open' : ''}`}>
            <button className="toggle-btn" onClick={toggleNav}>
                {isOpen ? 'Close' : 'Open'}
            </button>
            <nav>
                <ul>
                    <li>
                        <Link to="/detailedAttendance">Attendance Details</Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default SideNav;
