import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
import { WebcamCapture } from "./components/recordAttendance";
import DashBoard from "./components/DashBoard";
import WelcomePage from "./components/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import TouchIDRegistration from "./components/TouchIDRegistration";
import Layout from "./components/Layout";
import Analysis from "./components/Analysis";

import AdminRoute from "./components/AdminRoute";

const theme = createTheme();
function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<div className="App">
					<Routes>
						{/* Public routes */}
						{/* TODO: log out to here*/}
						<Route path="/login" element={<Login />} />
						<Route path="/callback" element={<AuthCallback />} />

						{/* Routes protected by Cognito */}
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
						<Route
							path="/register-touchid"
							element={
								<ProtectedRoute>
									<TouchIDRegistration />
								</ProtectedRoute>
							}
						/>

						{/* Routes protected by both Cognito and TouchID */}
						<Route
							path="/dashboard"
							element={
								<AdminRoute>
									<Layout showSideNav={true}>
										<DashBoard />
									</Layout>
								</AdminRoute>
							}
						/>
						<Route
							path="/attendance-detail"
							element={
								<AdminRoute>
									<Layout showSideNav={true}>
										<AttendanceDisplayGrid />
									</Layout>
								</AdminRoute>
							}
						/>
						<Route path="/analysis" element={
						<ProtectedRoute>
							<Layout showSideNav={true}>
								<Analysis/>
							</Layout>
						</ProtectedRoute>}
						/>

						<Route path="/" element={<Navigate to="/login" replace />} />
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
