import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { uploadAttedancePhoto } from '../services/api';
import TextField from '@mui/material/TextField';
export const WebcamCapture = () => {
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);
  const [userName, setUserName] = useState("");

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  const handleDeviceChange = (event) => {
    setDeviceId(event.target.value);
  };

  const handleNameChange = (event) => {
    setUserName(event.target.value);
  };

  React.useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

  return (
    <>
      <div>
        <p>Please enter your name:</p>
        <TextField
          required
          id="outlined-required"
          label="Required"
          value={userName}
          onChange={handleNameChange}
        />
        <select onChange={handleDeviceChange}>
          {devices.map((device, key) => (
            <option key={key} value={device.deviceId}>{device.label || `Device ${key + 1}`}</option>
          ))}
        </select>
        <div>
          <Webcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
              deviceId: deviceId
            }}
          >{({ getScreenshot }) => (
            <button
              onClick={async () => {
                const imageBase64 = getScreenshot()
                console.log(imageBase64)
                await uploadAttedancePhoto(imageBase64, userName)
                alert("Photo uploaded")
              }}
            >
              Capture photo
            </button>
          )}</Webcam>
        </div>
      </div>
    </>
  );
};
