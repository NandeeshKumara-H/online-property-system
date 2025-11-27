# Walkthrough - Online Property Management System

## Setup Instructions

1.  **Install Dependencies**:
    Open a terminal in the project root (`e:\Basu`) and run:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    Run the following command to start the backend server:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.

3.  **Database**:
    Ensure you have MongoDB running locally on `mongodb://localhost:27017`. If you don't have it installed, please install MongoDB Community Server.

## User Flow Verification

### 1. User Registration & Login
1.  Open `http://localhost:3000` in your browser.
2.  Click **Sign Up** in the navbar.
3.  Fill in your details (Name, Email, Phone, Password) and submit.
4.  You will be redirected to the **User Dashboard**.

### 2. Post a Property
1.  In the Dashboard, click **Post Property** in the sidebar.
2.  Fill in the property details (Title, Price, City, etc.).
3.  Upload images (optional).
4.  Click **Submit Property**.
5.  Go to **My Listings**. You will see your property with a "pending" status.
6.  Go to the **Home Page**. You will **NOT** see your property yet (since it's pending).

### 3. Admin Approval
1.  Open a new incognito window or logout.
2.  Go to `http://localhost:3000/admin-login.html`.
3.  Login with default admin credentials:
    -   **Username**: `admin`
    -   **Password**: `admin`
    (Note: The system automatically creates this admin account if it doesn't exist).
4.  In the **Admin Dashboard**, you will see the "Pending Properties".
5.  Click **Approve** on the property you just posted.

### 4. Verify Public Listing
1.  Go back to the **Home Page** (`http://localhost:3000`).
2.  Scroll down to "Featured Properties". You should now see your approved property.
3.  Click on the property card to view the **Property Details** page.
4.  Verify that all details (images, map, owner info) are displayed correctly.

## Features Implemented
-   **Pure HTML/CSS/JS Frontend**: No frameworks used.
-   **Node.js/Express Backend**: RESTful API.
-   **MongoDB**: Data persistence.
-   **JWT Authentication**: Secure login for Users and Admins.
-   **Multer**: Image upload support.
-   **Admin System**: Approval workflow for properties.
-   **Responsive Design**: Works on mobile and desktop.
