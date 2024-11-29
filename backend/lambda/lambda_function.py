import json
import boto3
import pymysql
import os
import datetime

def lambda_handler(event, context):
    # Assuming payload key is path
    path = event.get("path")

    # TODO: set bucket names as env var
    # Get attendance picture bucket name and key
    attend_bucket = os.environ["BUCKET1_NAME"]
    attend_key = path.split(".com/")[-1]

    # Get default profile picture bucket name
    pfp_name = os.environ["BUCKET2_NAME"]

    # Get S3 object url from RDS for default profile picture and extract key
    file_name = attend_key.split("/")[-1]
    file_name_stripped = file_name.split(".")[0]
    components = file_name_stripped.split("_")
    rds_key = components[1]
    pfp_path = get_path_from_db(rds_key)
    pfp_key = pfp_path.split(".com/")[-1]

    # Use rekognition to do facial comparison
    comparison_response, err_msg = handle_rekognition(attend_bucket, attend_key, pfp_name, pfp_key)
    if err_msg:
        error_code = e.response['Error']['Code']
        if error_code == 'InvalidS3ObjectException':
            return {
                "statusCode": 404,
                "body": f"One or both of the S3 objects could not be found: {e.response['Error']['Message']}"
            }
        elif error_code == 'AccessDeniedException':
            return {
                "statusCode": 403,
                "body": "Access denied. Check your S3 bucket permissions."
            }
        else:
            return {
                "statusCode": 500,
                "body": f"An error occurred: {e.response['Error']['Message']}"
            }
    
    # Case 1: Face detected and facial comparison passed
    if len(comparison_response['FaceMatches']) == 1:
        timestamp_str = components[2] + '_' + components[3]
        timestamp = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d_%H-%M-%S")
        insertion_err = insert_data_into_db(rds_key, path, timestamp)
        if insertion_err:
            return {
                "statusCode": 404,
                "body": f"Error inserting data: {insertion_err}"
            }
        else: 
            return {
                "statusCode": 200,
                "body": f"Check In Completed"
            }
    # Case 2: Face not detected or failed facial comparison
    else:
        return {
            "statusCode": 400,
            "body": f"Check In Failed"
        }

# Pass the two S3 objects to rekognition for facial comparison
def handle_rekognition(bucket1_name, img1_key, bucket2_name, img2_key):
    client = boto3.client('rekognition', region_name='ca-central-1')
    try:
        comparison_response = client.compare_faces(
            SimilarityThreshold=80,
            SourceImage={'S3Object': {'Bucket': bucket1_name, 'Name': img1_key}},
            TargetImage={'S3Object': {'Bucket': bucket2_name, 'Name': img2_key}}
        )
        return comparison_response, None

    except ClientError as e:
        return None, e

# Get S3 url for default profile image from RDS
def get_path_from_db(profile_id):
    connection = None
    try:
        # Fetch database credentials from environment variables
        db_host = os.environ["DB_HOST"]
        db_user = os.environ["DB_USER"]
        db_password = os.environ["DB_PASSWORD"]
        db_name = os.environ["DB_NAME"]

        # Connect to the database
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        cursor = connection.cursor()

        # Fetch data
        cursor.execute("SELECT profile_image FROM people_profile WHERE profile_id = %s", (profile_id))
        result_tuple = cursor.fetchall()
        # result_tuple is in the format (('string',),), extract and return the string
        result = result_tuple[0][0]
        return result 

    except Exception as e:
        return str(e)

    finally:
        if connection:
            connection.close()
    
# Insert attendance picture url into RDS
def insert_data_into_db(profile_id, photo_url, timestamp):
    connection = None  
    try:
        # Fetch database credentials from environment variables
        db_host = os.environ["DB_HOST"]
        db_user = os.environ["DB_USER"]
        db_password = os.environ["DB_PASSWORD"]
        db_name = os.environ["DB_NAME"]
        
        # Connect to the database
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        cursor = connection.cursor()
        
        # Execute the query
        cursor.execute("INSERT INTO people_attendance (profile_id, photo_url, timestamp) VALUES (%s, %s, %s)", 
                       (profile_id, photo_url, timestamp))
        connection.commit()
        return None 
    
    except Exception as e:
        return str(e)  

    finally:
        if connection:
            connection.close()
