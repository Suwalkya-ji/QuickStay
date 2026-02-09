import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities, hotelId } = req.body;

    // Validate price
    if (!pricePerNight || pricePerNight <= 0) {
      return res.json({ success: false, message: "Price per night must be a positive number" });
    }

    // Use provided hotelId or find the first hotel owned by user
    let hotel;
    if (hotelId) {
      hotel = await Hotel.findOne({ _id: hotelId, owner: req.user._id });
      if (!hotel) {
        return res.json({ success: false, message: "Hotel not found or you don't have permission." });
      }
    } else {
      hotel = await Hotel.findOne({ owner: req.user._id });
      if (!hotel) return res.json({ success: false, message: "No Hotel found. Please register a hotel first." });
    }

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms
// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner', 
          select: 'image',
        },
      }).sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms for all hotels owned by the admin
// GET /api/rooms/owner
export const getOwnerRooms = async (req, res) => {
  try {
    // Find all hotels owned by this admin
    const hotels = await Hotel.find({ owner: req.user._id });
    if (!hotels || hotels.length === 0) {
      return res.json({ success: false, message: "No Hotel found. Please register a hotel first." });
    }

    // Get hotel IDs
    const hotelIds = hotels.map(hotel => hotel._id);

    // Find all rooms that belong to any of these hotels
    const rooms = await Room.find({ hotel: { $in: hotelIds } }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
// POST /api/rooms/toggle-availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};