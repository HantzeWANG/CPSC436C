import { Link } from 'react-router-dom';
import './css/SideNav.css';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttendanceIcon from '@mui/icons-material/DateRange';

const SideNav = () => {
    return (
        <div className="sidenav">
            <ul className="sidenav-list">
                <Link to="/welcome">
                    <li className="sidenav-item">
                        <HomeIcon style={{ marginRight: '8px' }} />
                        Home
                    </li>
                </Link>
                <Link to="/dashboard">
                    <li className="sidenav-item">
                        <DashboardIcon style={{ marginRight: '8px' }} />
                        Dashboard
                    </li>
                </Link>
                <Link to="/checkin">
                    <li className="sidenav-item">
                        <CheckCircleIcon style={{ marginRight: '8px' }} />
                        Check In
                    </li>
                </Link>
                <Link to="/attendance-detail">
                    <li className="sidenav-item">
                        <AttendanceIcon style={{ marginRight: '8px' }} />
                        Attendance
                    </li>
                </Link>
                {/*TODO: sign out*/}
                {/*<li></li>*/}
            </ul>
        </div>
    );
};

export default SideNav;