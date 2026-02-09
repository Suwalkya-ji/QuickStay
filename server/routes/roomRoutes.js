import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createRoom, getRooms, toggleRoomAvailability, getOwnerRooms, } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 5), protect, isAdmin, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, isAdmin, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, isAdmin, toggleRoomAvailability);

export default roomRouter;
