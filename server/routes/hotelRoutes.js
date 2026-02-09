import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { registerHotel, getMyHotels, deleteHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, isAdmin, registerHotel);
hotelRouter.get("/my-hotels", protect, isAdmin, getMyHotels);
hotelRouter.delete("/:id", protect, isAdmin, deleteHotel);

export default hotelRouter;
