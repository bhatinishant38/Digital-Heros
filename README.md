# Digital Heroes - Golf Charity Platform

Digital Heroes is a full-stack Next.js platform that combines golf score tracking with charity fundraising. Users can create an account, submit golf scores, subscribe to a membership plan, donate to supported charities, and track their impact. Administrators can manage users, charities, donations, draws, subscriptions, and winners.

## Features

### Public website
- Charity-focused landing page
- Featured charities and fundraising information
- Membership/subscription plans
- Responsive navigation and public impact information

### User portal
- Credential-based login and signup
- Personal dashboard with score, draw-entry, and donation statistics
- Add, edit, and delete golf scores
- User profile and profile image management
- Charity discovery and donation flow
- Subscription selection and payment
- Draw results and winnings pages

### Admin portal
- Role-protected admin dashboard
- User overview
- Charity creation, editing, deletion, and donation updates
- Subscription and draw management
- Winner management
- Cloudinary-powered charity and profile images

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind CSS 4 |
| Authentication | Auth.js / NextAuth v5 with credentials |
| Database | MongoDB and Mongoose |
| Payments | Razorpay |
| Media | Cloudinary |
| HTTP Client | Axios |
| Validation | Zod |
| Notifications | React Toastify |
| Icons | Lucide React and React Icons |
| Security | bcryptjs password hashing |

## Project Structure

```text
app/
  api/                    Server route handlers
  admin/                  Admin login and dashboard pages
  dashboard/              Authenticated user pages
  login/                  User login
  signup/                 User registration
  page.js                 Public landing page
components/
  ForAdmin/               Admin dashboard components
  ForAll/                 Public website components
  ForUser/                User dashboard components
context/
  AppContext.js           User and charity client state
  AdminContext.js         Admin client state
lib/
  dbConnect.js            Cached Mongoose connection
  charityDonations.js     Donation-related helpers
  normalizeCharityIds.js  Charity ID normalization
  scoreValidation.js      Golf score validation
models/
  userModel.js
  charityModel.js
  scoreModel.js
  donationModel.js
public/                   Static assets
```

## Requirements

- Node.js 20 or newer
- npm
- A MongoDB database
- A Cloudinary account
- A Razorpay account for payment testing

## Local Setup

### 1. Install dependencies

```powershell
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=mongodb://username:password@host/database
AUTH_SECRET=replace-with-a-long-random-secret

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Start the development server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | Signs and encrypts Auth.js sessions |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API authentication |
| `CLOUDINARY_SECRET_KEY` | Yes | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Yes | Razorpay server and checkout key |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay server-side signature secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Razorpay browser checkout key |

Never commit real environment values. The `.env*` files are ignored by Git.

> Security: if credentials have previously been stored or shared in an `.env` file or committed to Git history, rotate the MongoDB, Auth.js, Cloudinary, and Razorpay secrets before deploying.

## Application Routes

### Public routes

| Route | Description |
| --- | --- |
| `/` | Public landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/admin/login` | Separate administrator login |

### User routes

| Route | Description |
| --- | --- |
| `/dashboard` | User overview |
| `/dashboard/MyScores` | Golf score management |
| `/dashboard/profile` | Profile management |
| `/dashboard/charity` | Supported and available charities |
| `/dashboard/charity/donate/[id]` | Charity donation checkout |
| `/dashboard/subscription` | Membership subscription |
| `/dashboard/DrawsRewards` | Draw and reward information |
| `/dashboard/winnings` | User winnings |

### Admin routes

| Route | Description |
| --- | --- |
| `/admin/adminDashboard` | Admin overview |
| `/admin/adminDashboard/Charities` | Manage charities |
| `/admin/adminDashboard/Users` | View users |
| `/admin/adminDashboard/Subscriptions` | Manage subscriptions |
| `/admin/adminDashboard/Draws` | Manage draws |
| `/admin/adminDashboard/Winners` | Manage winners |

Admin pages are protected by the session role. A user must have `role: "admin"` in MongoDB to access these routes.

## API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Register a user |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Auth.js authentication |
| `/api/profile/getProfile` | `GET` | Fetch the authenticated profile |
| `/api/profile/editProfile` | `PUT` | Update profile details or image |
| `/api/score/getScore` | `GET` | Fetch authenticated user's scores |
| `/api/score/addScore` | `POST` | Add a golf score |
| `/api/score/updateScore` | `PUT` | Update a golf score |
| `/api/score/deleteScore/[id]` | `DELETE` | Delete a golf score |
| `/api/charity/getCharity` | `GET` | Fetch public charities |
| `/api/charity/donate/create-order` | `POST` | Create a charity donation order |
| `/api/charity/donate/verify-order` | `POST` | Verify and record a charity donation |
| `/api/payment/create-order` | `POST` | Create a subscription/payment order |
| `/api/payment/verify-order` | `POST` | Verify a subscription/payment |
| `/api/adminApi/fetchAllUsers` | `GET` | Fetch all users for the admin |
| `/api/adminApi/Charity/getCharities` | `GET` | Fetch charities for the admin |
| `/api/adminApi/Charity/addCharity` | `POST` | Add a charity |
| `/api/adminApi/Charity/editCharity/[id]` | `PUT` | Edit a charity |
| `/api/adminApi/Charity/deleteCharity/[id]` | `DELETE` | Delete a charity |

## Data Models

### User
- Username, email, hashed password, role, and profile image
- Subscription plan, end date, and active status
- Supported charity IDs
- Profile fields such as gender, date of birth, and phone

### Charity
- Name, category, description, image
- Total raised and member count

### Score
- User reference
- Date, numeric score, and position
- One score per user per date is enforced by a unique database index

### Donation
- User and charity references
- Amount and Razorpay order/payment IDs
- Flags for charity totals and applied statistics

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Production Build

```powershell
npm run build
npm run start
```

The application can also be deployed on Vercel. Configure the same environment variables in the deployment provider and ensure the MongoDB network rules allow connections from the production environment.
