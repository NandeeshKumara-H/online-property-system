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
    The server will start on `https://online-property-system-1.onrender.com`.

3.  **Database**:
    Ensure you have MongoDB running locally on `mongodb://localhost:27017`. If you don't have it installed, please install MongoDB Community Server.

## User Flow Verification

### 1. User Registration & Login
1.  Open `https://online-property-system-1.onrender.com` in your browser.
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
2.  Go to `https://online-property-system-1.onrender.com/admin-login.html`.
3.  Login with default admin credentials:
    -   **Username**: `admin`
    -   **Password**: `admin`
    (Note: The system automatically creates this admin account if it doesn't exist).
4.  In the **Admin Dashboard**, you will see the "Pending Properties".
5.  Click **Approve** on the property you just posted.

### 4. Verify Public Listing
1.  Go back to the **Home Page** (`https://online-property-system-1.onrender.com`).
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

## Debugging Mobile OTP

### 1. Improved Error Handling
**File:** `public/js/login.js` & `public/js/api.js`
- Added detailed error reporting to the frontend.
- If the server returns an error (like a 500 crash or a 404 page), the alert will now tell you exactly what happened instead of just saying "Error sending OTP".

## Verification Steps

### Manual Verification (User Required)
1.  **Deploy to Render**: The changes have been pushed. Wait for the deployment to finish.
2.  **Test Signup Again**:
    -   Go to the Signup page on your live site.
    -   Try to send the OTP again.
    -   **Read the Alert**: If it fails, the alert will now show a specific error message (e.g., "Server returned non-JSON response: 500 Internal Server Error").
    -   **Report the Error**: Please tell me exactly what the new alert says. This will help me pinpoint the issue.
