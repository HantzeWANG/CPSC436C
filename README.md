# CPSC436C
# Project Name

This project is a full-stack web application built with Django (backend) and React (frontend). The backend uses Django REST Framework to serve data to the frontend.

## Project Setup

### 1. Backend Setup (Django)

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **Create and activate a virtual environment**:
    ```bash
    python -m venv env
    source env/bin/activate  # Mac
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Apply database migrations**:
    ```bash
    python manage.py migrate
    ```

5. **Create a superuser for Django admin**:
    ```bash
    python manage.py createsuperuser
    ```
   Follow the prompts to set up an admin username, password, and email.

6. **Add .env file for AWS token under backend/people**:
    ```bashexport AWS_ACCESS_KEY_ID=""
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

```plaintext
REACT_APP_API_URL=http://127.0.0.1:8000/api
