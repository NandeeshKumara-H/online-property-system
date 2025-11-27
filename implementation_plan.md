# Implementation Plan - Online Property Management System

## Goal Description
Revert **Login** to use **Email & Password**.
Keep **Signup** using **OTP Verification**.

## Proposed Changes

### Backend

#### [MODIFY] Controllers
- `authController.js`:
    - Add `loginWithPassword`: Authenticates using email and bcrypt password check.

#### [MODIFY] Routes
- `authRoutes.js`:
    - Add `POST /login-password` mapped to `authController.loginWithPassword`.

### Frontend

#### [MODIFY] Pages
- `login.html`: Revert to a single form with Email and Password inputs.

#### [MODIFY] Scripts
- `login.js`: Update login form handler to send JSON `{ email, password }` to `/api/login-password`.

## Verification Plan

### Manual Verification
1.  Go to Login Page.
2.  Enter Email and Password (created during signup).
3.  Click Login.
4.  Verify access to Dashboard.
