import './App.css';
import PeopleList from './components/PeopleList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AttendanceDisplayGrid from "./components/AttendanceDisplayGrid";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import PeopleList from "./components/PeopleList";
import { WebcamCapture } from "./components/recordAttendance";
import DashBoard from "./components/DashBoard";
import DragDrop from "./components/DragDrop";
import WelcomePage from "./components/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import TouchIDVerification from "./components/TouchIDVerification";
import { ThemeProvider, createTheme } from "@mui/material/styles";


const theme = createTheme();
function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<div className="App">
					<Routes>
						{/* Public routes */}
						<Route path="/login" element={<Login />} />
						<Route path="/callback" element={<AuthCallback />} />

						{/* Protected routes - require authentication */}
						<Route
							path="/welcome"
							element={
								<ProtectedRoute>
									<WelcomePage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/checkin"
							element={
								<ProtectedRoute>
									<WebcamCapture />
								</ProtectedRoute>
							}
						/>

						{/* Only used for initial Touch ID registration */}
						<Route
							path="/verify-dashboard"
							element={
								<ProtectedRoute>
									<TouchIDVerification />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashBoard />
								</ProtectedRoute>
							}
						/>
						<Route path="/profilepic" element={
							<ProtectedRoute>
							<DragDrop />
							</ProtectedRoute>}
						/>

						<Route PATH="/detailedAttendance" element={
							<ProtectedRoute>
							<AttendanceDisplayGrid />
							</ProtectedRoute>
						}
						/>

						{/* Redirect root to login */}
						<Route path="/" element={<Navigate to="/login" replace />} />

						{/* Catch all - redirect to login */}
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
