import {
	S3Client,
	ListObjectsV2Command,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getTokens } from "./auth";
import { cognitoConfig } from "../config/cognito";

let s3Client = null;
let bucketName = process.env.REACT_APP_S3_BUCKET_NAME;

const getS3Client = async () => {
	console.log("Getting S3 client");
	const { idToken } = getTokens();

	if (!idToken) {
		throw new Error("No ID token available");
	}

	console.log("ID Token exists:", !!idToken);
	console.log("Configuration:", {
		identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
		region: cognitoConfig.region,
		userPoolId: cognitoConfig.userPoolId,
	});

	const loginKey = `cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`;

	if (!s3Client) {
		s3Client = new S3Client({
			region: cognitoConfig.region,
			credentials: fromCognitoIdentityPool({
				clientConfig: { region: cognitoConfig.region },
				identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
				logins: {
					[loginKey]: idToken,
				},
			}),
		});
	}

	try {
		// Force credentials refresh to verify they're working
		const credentials = await s3Client.config.credentials();
		console.log("Credentials received:", {
			hasAccessKeyId: !!credentials.accessKeyId,
			hasSecretAccessKey: !!credentials.secretAccessKey,
			hasSessionToken: !!credentials.sessionToken,
		});
	} catch (error) {
		console.error("Error getting credentials:", error);
		throw error;
	}

	return s3Client;
};

export const createUserFolder = async () => {
	try {
		const client = await getS3Client();
		const userId = await getUserId();

		console.log("User ID:", userId);

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: `${userId}/`, // The trailing slash makes it a folder
			Body: "", // Empty content
		});

		await client.send(command);
		console.log(`Created folder for user: ${userId}`);
	} catch (error) {
		console.error("Error creating user folder:", error);
		throw error;
	}
};

export const listUserFiles = async () => {
	try {
		const client = await getS3Client();
		const userId = await getUserId();

		const command = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: `${userId}/`,
		});
		console.log("Command:", command);

		const response = await client.send(command);

		console.log("Response:", response);

		// If no Contents array or it's empty, create the folder
		if (!response.Contents || response.Contents.length === 0) {
			console.log("No files found, creating user folder");
			await createUserFolder();
			return []; // Return empty array as there are no files yet
		}

		return response.Contents;
	} catch (error) {
		console.error("Error listing files:", error);
		throw error;
	}
};

const getUserId = async () => {
	const { idToken } = getTokens();
	const payload = JSON.parse(atob(idToken.split(".")[1]));
	return payload.sub; // Cognito user ID
};
