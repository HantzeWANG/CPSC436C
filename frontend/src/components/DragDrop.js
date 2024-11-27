import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {cognitoConfig} from "../config/cognito";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";
import {getTokens} from "../services/auth";
import {TextField} from "@mui/material";

// TODO: maxlength, show icon/message for upload status
const DragDrop = () => {
    const [userId, setUserId] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [helperText, setHelperText] = useState('');

    // const REGION = 'ca-central-1';
    const BUCKET_NAME = 'pictures-profile';

    const { idToken } = getTokens();
    const loginKey = `cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`;
    const s3Client = new S3Client({
        region: cognitoConfig.region,
        credentials: fromCognitoIdentityPool({
            clientConfig: { region: cognitoConfig.region },
            identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
            logins: {
                [loginKey]: idToken,
            },
        }),
    });


    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent the default behavior to allow dropping
        event.dataTransfer.dropEffect = 'copy'; // Indicate a copy operation
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
            if (userId != null && userId.length > 0) {
                await uploadToS3(file);
            }
        } else {
            alert('Please drop a valid image file.');
        }
    };

    const uploadToS3 = async (file) => {
        try {
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: `${userId}`, // Use the unique ID as the key for the S3 object
                Body: file,
                ContentType: file.type,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            setUploadStatus('Upload successful!');
        } catch (error) {
            console.error('Error uploading to S3:', error);
            setUploadStatus('Upload failed.');
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result); // Set the image preview
            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            alert('Please select an image file.');
        }
    };

    const handleUserIdChange = (event) => {
        const inputValue = event.target.value;
        setUserId(inputValue)
        validateInput(inputValue);
    };

    const validateInput = (input) => {
        const regex = /^[a-zA-Z0-9]*$/;

        if (!regex.test(input)) {
            setError(true);
            setHelperText('Only alphabets and numbers are allowed');
        } else {
            setError(false);
            setHelperText('');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <TextField
                label="Enter Text"
                variant="outlined"
                value={userId}
                onChange={handleUserIdChange}
                error={error}
                helperText={helperText}
                fullWidth
            />
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    width: '300px',
                    height: '200px',
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                }}
            >
                {image ? (
                    <img
                        src={image}
                        alt="Uploaded Preview"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    <p>Drag and drop an image here or click to select.</p>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="fileInput"
            />
            <button
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Select an Image
            </button>
        </div>
    );
};

export default DragDrop;