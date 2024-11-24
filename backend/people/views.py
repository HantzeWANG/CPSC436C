import base64
import datetime
import time
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PeopleSerializer
from .models import People
import boto3
import re
import os
import logging
from django.conf import settings
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import uuid

class PeopleView(viewsets.ModelViewSet):
    serializer_class = PeopleSerializer
    queryset = People.objects.all()


# load variables from .env file
load_dotenv()

def upload_file(file_name, bucket, object_name=None, client=None):
    """
    Upload a file to an S3 bucket.

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name, including folder path. If not specified, file_name is used.
    :return: URL of the uploaded file if successful, else False
    """

    # Set object_name to file name if not specified
    if object_name is None:
        object_name = os.path.basename(file_name)

    # Initialize S3 client
    # s3_client = boto3.client(
    #     's3',
    #     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    #     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    #     aws_session_token=os.getenv("AWS_SESSION_TOKEN")
    # )

    try:
        # Upload the file to S3
        print(f"Uploading file {file_name} to bucket {bucket} with object name {object_name}")
        client.upload_file(file_name, bucket, object_name)
        file_url = f"https://{bucket}.s3.amazonaws.com/{object_name}"
        print(f"File uploaded successfully to {file_url}")
        return file_url
    except ClientError as e:
        logging.error(e)
        return False

def get_user_id(id_token):
    """
    Extracts the 'sub' field (Cognito user ID) from a JWT ID token.

    :param id_token: The ID token as a string.
    :return: The 'sub' (user ID) field from the token payload.
    """
    # Split the JWT token to get the payload part
    payload_part = id_token.split(".")[1]

    # Decode the base64 payload (ensure proper padding for base64)
    payload_decoded = base64.b64decode(payload_part + "===")
    
    # Parse the JSON payload and extract 'sub'
    payload = json.loads(payload_decoded)
    return payload.get("sub")

@api_view(['POST'])
def upload_test(request):
    """
    API view to test file upload to S3.
    """
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file provided"}, status=400)

    # Use 'attendance/' as the folder for testing, you can change this path as needed
    object_name = f"attendance/{file.name}"

    # Call the upload_file function
    file_url = upload_file(file_name=object_name, bucket=os.getenv("ATTENDANCE_PICTURE_BUCKET_NAME"), object_name=object_name)

    if file_url:
        return Response({"file_url": file_url}, status=200)
    else:
        return Response({"error": "Failed to upload file"}, status=500)

# store and upload the attendance picture to s3, then delete the file 
@api_view(['POST'])
def upload_attendance_picture(request):
    body = json.loads(request.body)
    # transform the base64 image to a file
    image_recovered = base64.b64decode(re.sub('^data:image/.+;base64,', '', body['image']))
    # get the current timestamp
    current_timestamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d_%H-%M-%S')
    # generate a uuid for the image
    myuuid = uuid.uuid4()
    username = body['userName']

    client = boto3.client("cognito-identity", region_name=body['region'])
    identity_response = client.get_id(
        IdentityPoolId=body['identityPoolId'],
        Logins={
            'cognito-idp.' + body['region'] + '.amazonaws.com/' + body['userPoolId']: body['idToken']
        }
    )
    identity_id = identity_response['IdentityId']
    response = client.get_credentials_for_identity(
        IdentityId=identity_id,
        Logins={
            'cognito-idp.' + body['region'] + '.amazonaws.com/' + body['userPoolId']: body['idToken']
        }
    )

    s3_client = boto3.client(
        's3',
        aws_access_key_id=response['Credentials']['AccessKeyId'],
        aws_secret_access_key=response['Credentials']['SecretKey'],
        aws_session_token=response['Credentials']['SessionToken']
    )
    
    cognitoID = get_user_id(body['idToken'])
    attendance_picture_s3_path = cognitoID + "/attendance_" + username + "_" + current_timestamp + ".jpg"
    attendance_picture_local_path = "./attendance/attendance_" + current_timestamp + "_" + str(myuuid) + ".jpg"

    with open(attendance_picture_local_path, "wb") as attendance_picture_file:
        attendance_picture_file.write(image_recovered)

    # upload the attendance picture to s3
    attendance_picture_url = upload_file(file_name=attendance_picture_local_path, bucket=os.getenv("ATTENDANCE_PICTURE_BUCKET_NAME"), object_name=attendance_picture_s3_path, client=s3_client)

    # delete the attendance picture file
    os.remove(attendance_picture_local_path)

    return Response({"message": "Success"}, status=200)
