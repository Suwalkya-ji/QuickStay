import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayPaymentForBooking
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.post('/stripe-payment', protect, stripePayment);
bookingRouter.post('/razorpay-order', protect, createRazorpayOrder);
bookingRouter.post('/razorpay-payment', protect, razorpayPaymentForBooking);
bookingRouter.post('/verify-razorpay-payment', protect, verifyRazorpayPayment);

export default bookingRouter;