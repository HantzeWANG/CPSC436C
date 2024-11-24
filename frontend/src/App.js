import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import PeopleList from "./components/PeopleList";
import { WebcamCapture } from "./components/recordAttendance";
import DashBoard from "./components/DashBoard";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/callback" element={<AuthCallback />} />
					<Route path="/dashboard" element={<DashBoard />} />
					<Route
						path="/checkin"
						element={
							<div>
								<h1>Take a picture of yourself to check in</h1>							
								{/* <PeopleList /> */}
								<WebcamCapture />
							</div>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
