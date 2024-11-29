import './App.css';
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
import { WebcamCapture } from "./components/recordAttendance";
import DashBoard from "./components/DashBoard";
import DragDrop from "./components/DragDrop";
import WelcomePage from "./components/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import TouchIDVerification from "./components/TouchIDVerification";
import Layout from "./components/Layout";


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
                                    <Layout showSideNav={true}>
                                        <DashBoard/>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/attendance-detail" element={
                            <ProtectedRoute>
                                <Layout showSideNav={true}>
                                    <AttendanceDisplayGrid/>
                                </Layout>
                            </ProtectedRoute>}
                        />

						<Route PATH="/detailedAttendance" element={
							<AttendanceDisplayGrid />
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
