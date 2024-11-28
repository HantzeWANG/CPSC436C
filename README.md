# CPSC436C
# Project Name

This project is a full-stack web application built with Django (backend) and React (frontend). The backend uses Django REST Framework to serve data to the frontend.

## Project Setup

### 1. Backend Setup (Django)

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2. **Install mysql and mysqlclient**:
    ```
   brew install mysql@8.4 
   ```
   ```
   echo 'export PATH="/usr/local/opt/mysql@8.4/bin:$PATH"' >> ~/.zshrc
   source  ~/.zshrc
   ```

   Download mysql client through: 
   https://pypi.org/project/mysqlclient/

   Test connection (2 approaches)
   ```
   mysql -u admin -p -h cpsc436c.cry40y2ummvx.ca-central-1.rds.amazonaws.com 
   ```

   ```
    source env/bin/activate
   
    from django.db import connections
    from django.db.utils import OperationalError
    try:
      connection = connections['default']
      connection.ensure_connection()  
      print("Database connection successful!")
    except OperationalError as e:
      print(f"Database connection failed: {e}")
   ```
3. **Create and activate a virtual environment**:
    ```bash
    python -m venv env
    source env/bin/activate  # Mac
    ```
4. 
5. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

6. **Apply database migrations**:
    ```bash
    python manage.py migrate
    ```

7. **Create a superuser for Django admin**:
    ```bash
    python manage.py createsuperuser
    ```
   Follow the prompts to set up an admin username, password, and email.

8. **Add .env file for AWS token under backend/people**:
    ```bash
    export AWS_ACCESS_KEY_ID=""
    export AWS_SECRET_ACCESS_KEY=""
    export AWS_SESSION_TOKEN=""

    ATTENDANCE_PICTURE_BUCKET_NAME="attendance-picture"
    ```


7. **Run the backend server**:
    ```bash
    python manage.py runserver
    ```

   The backend should now be running at `http://127.0.0.1:8000`.



### 2. Frontend Setup (React)

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install frontend dependencies**:
    ```bash
    npm install
    ```

3. **Start the frontend development server**:
    ```bash
    npm start
    ```

   The frontend should now be running at `http://localhost:3000`.

## Environment Variables

To configure the API URL for the frontend, create a `.env` file in the `frontend` directory with the following content:

```bash
REACT_APP_API_URL=http://127.0.0.1:8000/api
```
