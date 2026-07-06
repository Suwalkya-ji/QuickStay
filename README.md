# QuickStay

A full-stack hotel booking platform where users can search rooms, book stays, pay online, and leave reviews — and hotel owners get their own dashboard to list rooms and manage bookings.

Built with the MERN stack (MongoDB, Express, React, Node.js), Clerk for authentication, and both Stripe and Razorpay for payments.

## Features

**For guests**
- Browse and filter available rooms across hotels
- View room details, amenities, and pricing
- Check real-time room availability by date
- Book a room and pay via Stripe (checkout session) or Razorpay (order + signature verification)
- View booking history under "My Bookings"
- Submit a rating and review after a stay
- Recently searched cities saved to the user's profile

**For hotel owners (admin role)**
- Register a hotel under their account
- Add rooms with images (uploaded to Cloudinary), pricing, and amenities
- Toggle room availability on/off
- View all bookings and revenue for their hotel(s) on a dashboard
- Approve, view, or delete guest feedback before it goes public
- Delete a hotel listing

**Platform**
- Clerk-based authentication with webhook sync to keep the local user database in sync
- Role-based access control (`user` vs `admin`) enforced via middleware
- Automated booking confirmation emails via Nodemailer

## Tech Stack

**Frontend:** React 19, Vite, React Router v7, Tailwind CSS v4, Axios, Framer Motion, React Hot Toast

**Backend:** Node.js, Express 5, MongoDB with Mongoose

**Third-party services:**
- [Clerk](https://clerk.com) — authentication and user management
- [Razorpay](https://razorpay.com) — payment processing
- [Cloudinary](https://cloudinary.com) — image storage for room photos
- [Nodemailer](https://nodemailer.com) — transactional emails
- [Svix](https://www.svix.com) — Clerk webhook verification

## Project Structure

```
QuickStay-main/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components (+ hotelOwner/ subfolder)
│       ├── context/        # Global app state (AppContext)
│       ├── pages/          # Route-level pages (+ hotelOwner/ subfolder)
│       └── assets/         # Images and icons
└── server/                  # Express backend
    ├── configs/             # DB, Cloudinary, Nodemailer setup
    ├── controllers/         # Route logic (bookings, hotels, rooms, users, feedback, webhooks)
    ├── middleware/          # Auth (protect/isAdmin) and file upload (Multer)
    ├── models/              # Mongoose schemas: User, Hotel, Room, Booking, Feedback
    └── routes/              # API route definitions
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- Accounts/API keys for Clerk, Cloudinary, Stripe, Razorpay, and an SMTP provider

### 1. Clone the repo
```bash
git clone https://github.com/Suwalkya-ji/QuickStay.git
cd QuickStay
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
CURRENCY=$
```

Run the server:
```bash
npm run server   # dev mode with nodemon
# or
npm start        # production
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/` with:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
VITE_CURRENCY=$
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port), connecting to the API at the URL set in `VITE_BACKEND_URL`.

## Key API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/user` | Get current logged-in user data |
| POST | `/api/user/register-as-admin` | Register current user as hotel owner (admin) |
| POST | `/api/hotels` | Register a new hotel (admin only) |
| GET | `/api/hotels/my-hotels` | Get hotels owned by current admin |
| POST | `/api/rooms` | Add a new room with images (admin only) |
| GET | `/api/rooms` | Get all available rooms |
| POST | `/api/bookings/check-availability` | Check room availability for given dates |
| POST | `/api/bookings/book` | Create a booking (pay-at-hotel default) |
| POST | `/api/bookings/stripe-payment` | Create a Stripe checkout session |
| POST | `/api/bookings/razorpay-order` | Create a Razorpay order for a new booking |
| POST | `/api/bookings/verify-razorpay-payment` | Verify Razorpay payment signature |
| GET | `/api/bookings/user` | Get bookings for the current user |
| GET | `/api/bookings/hotel` | Get bookings/revenue dashboard for admin's hotel |
| POST | `/api/feedback/submit` | Submit a review |
| GET | `/api/feedback/approved` | Get publicly approved reviews |
| GET/PUT/DELETE | `/api/feedback/...` | Admin feedback moderation |

## Notes

- Authentication is fully handled by Clerk; the local `User` model mirrors Clerk users (synced via webhook, with a fallback that creates the user on first authenticated request if the webhook hasn't fired yet).
- Both Stripe and Razorpay are wired up as separate payment paths — Stripe uses a hosted checkout session, Razorpay uses order creation plus HMAC-SHA256 signature verification on the backend.
- Room images are uploaded via Multer (memory) and pushed to Cloudinary; the returned URLs are stored on the `Room` document.

