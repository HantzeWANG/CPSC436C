import { Link } from 'react-router-dom';
import './css/SideNav.css';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttendanceIcon from '@mui/icons-material/DateRange';
import AssessmentIcon from '@mui/icons-material/Assessment';


const SideNav = () => {
    return (
        <div className="sidenav">
            <ul className="sidenav-list">
                <li className="sidenav-item">
                    <HomeIcon style={{ marginRight: '8px' }} />
                    <Link to="/welcome">Home</Link>
                </li>
                <li className="sidenav-item">
                    <DashboardIcon style={{ marginRight: '8px' }} />
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="sidenav-item">
                    <CheckCircleIcon style={{ marginRight: '8px' }} />
                    <Link to="/checkin">Check In</Link>
                </li>
                <li className="sidenav-item">
                    <AttendanceIcon style={{ marginRight: '8px' }} />
                    <Link to="/attendance-detail">Attendance</Link>
                </li>
                <li className="sidenav-item">
                    <AssessmentIcon style={{ marginRight: '8px' }} />
                    <Link to="/analysis">Analysis</Link>
                </li>
                {/*TODO: sign out*/}
                {/*<li></li>*/}
            </ul>
        </div>
    );
};

export default SideNav;