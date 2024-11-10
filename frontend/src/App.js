import './App.css';
import PeopleList from './components/PeopleList';
import {WebcamCapture} from './components/recordAttendance';

function App() {
  return (
    <div className="App">
        <h1>Attendance App</h1>
        <PeopleList />
        <WebcamCapture/>
    </div>
);
}

export default App;
