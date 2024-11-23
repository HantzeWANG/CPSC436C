import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// TODO: not use uuid
import { v4 as uuidv4 } from 'uuid';

const DragDrop = () => {
    const [image, setImage] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    // TODO: env
    const REGION = 'ca-central-1';
    const BUCKET_NAME = 'pictures-profile';
    const ACCESS_KEY = 'ASIA3TD2SDFEUB3KV6Y5'; // Use environment variables for sensitive data
    const SECRET_KEY = 'YrMxh0Q/Okr7Aj7hUTz3G1r5mX0Nmw/HtinQVB/G';

    const s3Client = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_KEY,
        },
    });

    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent the default behavior to allow dropping
        event.dataTransfer.dropEffect = 'copy'; // Indicate a copy operation
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file)); // Preview the image locally
            await uploadToS3(file);
        } else {
            alert('Please drop a valid image file.');
        }
    };

    const uploadToS3 = async (file) => {
        try {
            // Generate a unique key for the image (ID)
            const uniqueID = uuidv4(); // Generate a UUID as the key

            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: `${uniqueID}`, // Use the unique ID as the key for the S3 object
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

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
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