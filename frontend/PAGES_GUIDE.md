# UTE Phone Hub - Frontend Pages Guide

## Overview

This document describes all the pages created for the UTE Phone Hub frontend application.

## Pages Created

### 1. **Homepage** (`/`)
- **File**: `app/page.tsx`
- **Description**: Landing page showcasing the UTE Phone Hub platform
- **Features**:
  - Navigation bar with Login/Register links
  - Hero section with call-to-action
  - Features section highlighting key benefits
  - Featured products showcase
  - CTA section for new users
  - Footer with links and contact info
- **Wireframe**: Clean, modern design with gradient backgrounds
- **Data**: Mock product data with ratings

### 2. **Login Page** (`/login`)
- **File**: `app/login/page.tsx`
- **Description**: User authentication page with real API integration
- **Features**:
  - Email and password input fields
  - Show/hide password toggle
  - Remember me checkbox
  - Forgot password link
  - Social login buttons (UI only)
  - Error message display
  - Loading state with spinner
  - Demo credentials display
- **API Integration**: 
  - Calls `POST /api/v1/auth/login`
  - Stores access and refresh tokens in localStorage
  - Stores user data in localStorage
  - Redirects to `/admin` for admin users or `/dashboard` for regular users
- **Validation**: Email and password required
- **Error Handling**: Displays API error messages

### 3. **Registration Page** (`/register`)
- **File**: `app/register/page.tsx`
- **Description**: User account creation page
- **Features**:
  - Username field (min 3 characters)
  - Full name field
  - Email field with validation
  - Password field with strength requirements
  - Confirm password field
  - Show/hide password toggles
  - Terms & Conditions checkbox
  - Success/error message display
  - Loading state
- **API Integration**:
  - Calls `POST /api/v1/auth/register`
  - Validates all fields before submission
  - Redirects to login on success
- **Validation**:
  - Username: minimum 3 characters
  - Email: valid email format
  - Password: minimum 8 characters, must contain uppercase, lowercase, and numbers
  - Passwords must match
- **Error Handling**: Displays validation and API errors

### 4. **Forgot Password Page** (`/forgot-password`)
- **File**: `app/forgot-password/page.tsx`
- **Description**: Multi-step password reset flow
- **Features**:
  - Step 1: Email entry
  - Step 2: OTP verification
  - Step 3: New password entry
  - Progress indicator showing current step
  - Back button to return to previous step
  - Error and success messages
  - Loading states
- **API Integration**:
  - Step 1: `POST /api/v1/auth/forgot-password/request`
  - Step 3: `POST /api/v1/auth/forgot-password/verify`
- **Validation**:
  - Email validation
  - OTP required
  - Password strength requirements
  - Password confirmation match

### 5. **Admin Dashboard** (`/admin`)
- **File**: `app/admin/page.tsx`
- **Description**: Comprehensive admin control panel
- **Features**:
  - Collapsible sidebar navigation
  - Dashboard overview with stats cards
  - Revenue trend chart placeholder
  - Sales by category breakdown
  - Recent orders table
  - Products management tab
  - Orders management tab
  - Users management tab
  - Responsive design
- **Tabs**:
  - **Dashboard**: Overview with statistics and recent activity
  - **Products**: Product inventory management with edit/delete actions
  - **Orders**: Order management with status tracking
  - **Users**: User management with role assignment
- **Data**: Mock data for all sections
- **Access Control**: Only accessible to users with ADMIN role
- **Redirect**: Non-admin users are redirected to login

### 6. **User Dashboard** (`/dashboard`)
- **File**: `app/dashboard/page.tsx`
- **Description**: User account management and shopping history
- **Features**:
  - Collapsible sidebar with user menu
  - Welcome card with personalized greeting
  - Statistics cards (total orders, spent, wishlist items)
  - Recent orders section
  - Search and notification bell
- **Tabs**:
  - **Overview**: Dashboard summary with recent activity
  - **My Orders**: Complete order history with status tracking
  - **Wishlist**: Saved items with add to cart option
  - **Addresses**: Delivery address management
  - **Payment Methods**: Saved payment cards
  - **Settings**: Account settings and password change
- **Data**: Mock data for all sections
- **Access Control**: Only accessible to logged-in users

## API Integration

### Authentication API Endpoints Used

1. **Login**
   - Endpoint: `POST /api/v1/auth/login`
   - Request: `{ email, password }`
   - Response: `{ accessToken, refreshToken, tokenType, expiresIn, user }`

2. **Register**
   - Endpoint: `POST /api/v1/auth/register`
   - Request: `{ username, fullName, email, password, confirmPassword }`
   - Response: `{ user data }`

3. **Forgot Password Request**
   - Endpoint: `POST /api/v1/auth/forgot-password/request`
   - Request: `{ email }`
   - Response: `{ message }`

4. **Forgot Password Verify**
   - Endpoint: `POST /api/v1/auth/forgot-password/verify`
   - Request: `{ email, otp, newPassword, confirmPassword }`
   - Response: `{ message }`

### Token Management

- Access tokens are stored in `localStorage` as `accessToken`
- Refresh tokens are stored in `localStorage` as `refreshToken`
- User data is stored in `localStorage` as `user` (JSON stringified)
- Tokens are automatically included in API requests via the `Authorization` header

## Utility Files

### `lib/api.ts`
- Contains all API configuration and endpoints
- Provides helper functions for token management
- Includes TypeScript interfaces for API responses
- Generic fetch wrapper with error handling

### `lib/auth-context.tsx`
- React Context for authentication state management
- Provides `useAuth()` hook for accessing auth state
- Manages user data and logout functionality

### `lib/utils.ts`
- Utility functions for className merging (cn function)

## Styling

- **Framework**: Tailwind CSS
- **UI Components**: Custom components using Tailwind
- **Dark Mode**: Full dark mode support with `dark:` prefix
- **Colors**: 
  - Primary: Blue (#2563eb)
  - Secondary: Green/Purple/Pink (varies by page)
  - Neutral: Slate colors
- **Responsive**: Mobile-first design with md: breakpoints

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:3000`

## Demo Credentials

For testing the login page:
- **Email**: hung@example.com
- **Password**: Password123

## Features Summary

| Page | Real API | Mock Data | Authentication | Responsive |
|------|----------|-----------|-----------------|------------|
| Homepage | ❌ | ✅ | ❌ | ✅ |
| Login | ✅ | ❌ | ✅ | ✅ |
| Register | ✅ | ❌ | ✅ | ✅ |
| Forgot Password | ✅ | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ✅ | ✅ | ✅ |
| User Dashboard | ❌ | ✅ | ✅ | ✅ |

## Notes

- All pages use modern React patterns (hooks, functional components)
- Error handling is implemented for API calls
- Loading states are shown during async operations
- Responsive design works on mobile, tablet, and desktop
- Dark mode is fully supported
- Accessibility features included (labels, semantic HTML)
- Form validation is performed before API calls
- User data is persisted in localStorage for session management

