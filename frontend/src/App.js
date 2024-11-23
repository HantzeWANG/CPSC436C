import './App.css';
import PeopleList from './components/PeopleList';
import {WebcamCapture} from './components/recordAttendance';
import DragDrop from "./components/drag&drop/DragDrop";
import AttendanceDisplayGrid from "./components/AttendanceDisplayGrid";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
      <ThemeProvider theme={theme}>
        <h1>Attendance App</h1>
        <PeopleList />
        <WebcamCapture/>
        <DragDrop> </DragDrop>
        <AttendanceDisplayGrid></AttendanceDisplayGrid>
      </ThemeProvider>
);
}

export default App;
