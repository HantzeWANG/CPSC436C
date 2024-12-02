import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from '@mui/material/Typography';
import './css/SideNav.css';
import AttendanceIcon from '@mui/icons-material/DateRange';
import { touchIDAuth } from '../services/touchIDAuth';

const SideNav = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleDashboardAccess = async () => {
        try {
            await touchIDAuth.checkSupport();
            if (!touchIDAuth.isRegistered()) {
                navigate("/register-touchid");
                return;
            }

            try {
                await touchIDAuth.verify();
                navigate("/dashboard");
            } catch (verifyError) {
                touchIDAuth.clearRegistration();
                navigate("/register-touchid");
            }
        } catch (err) {
            console.error("Access failed:", err);
            setError(err.message);

            if (err.message === "TouchID registration expired") {
                navigate("/register-touchid");
            }
        }
    };

    const handleAttendanceHistoryAccess = async () => {
        try {
            await touchIDAuth.checkSupport();
            if (!touchIDAuth.isRegistered()) {
                navigate("/register-touchid");
                return;
            }

            try {
                await touchIDAuth.verify();
                navigate("/attendance-detail");
            } catch (verifyError) {
                touchIDAuth.clearRegistration();
                navigate("/register-touchid");
            }
        } catch (err) {
            console.error("Access failed:", err);
            setError(err.message);

            if (err.message === "TouchID registration expired") {
                navigate("/register-touchid");
            }
        }
    };

    return (
        <div className="sidenav">
            <ul className="sidenav-list">
                <Link to="/welcome">
                    <li className="sidenav-item">
                        <HomeIcon style={{ marginRight: '8px' }} />
                        Home
                    </li>
                </Link>
                <li className="sidenav-item" onClick={handleDashboardAccess}>
                    <DashboardIcon style={{ marginRight: '8px' }} />
                    Admin Dashboard
                </li>
                <Link to="/checkin">
                    <li className="sidenav-item">
                        <CheckCircleIcon style={{ marginRight: '8px' }} />
                        Sign Attendance
                    </li>
                </Link>
                <Link to="/attendance-detail" onClick={handleAttendanceHistoryAccess}>
                    <li className="sidenav-item">
                        <AttendanceIcon style={{ marginRight: '8px' }} />
                        Attendance History
                    </li>
                </Link>
            </ul>
            {error && (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            )}
        </div>
    );
};

export default SideNav;