import './App.css';
import PeopleList from './components/PeopleList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DragDrop from "./components/drag&drop/DragDrop";
import AttendanceDisplayGrid from "./components/AttendanceDisplayGrid";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import PeopleList from "./components/PeopleList";
import { WebcamCapture } from "./components/recordAttendance";
import DashBoard from "./components/DashBoard";

const theme = createTheme();
function App() {
    return (
        <ThemeProvider theme={theme}>
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/callback" element={<AuthCallback />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route
                        path="/"
                        element={
                            <div>
                                <h1>Attendance App</h1>
                                <PeopleList />
                                <WebcamCapture />
                            </div>
                        }
                    />
                    <DragDrop> </DragDrop>
                    <AttendanceDisplayGrid></AttendanceDisplayGrid>
                </Routes>
            </div>
        </Router>
        </ThemeProvider>
    );
}

export default App;
