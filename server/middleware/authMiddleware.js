import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.json({ success: false, message: "not authenticated" });
  }

  try {
    let user = await User.findById(userId);

    // If user doesn't exist in DB, create them (for local dev when webhook isn't set up)
    if (!user) {
      try {
        // Fetch user details from Clerk API
        const clerkUser = await clerkClient.users.getUser(userId);

        user = await User.create({
          _id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "user@example.com",
          username: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
          image: clerkUser.imageUrl || "",
        });
        console.log("Created new user in DB:", userId);
      } catch (clerkError) {
        console.log("Error fetching user from Clerk:", clerkError);
        // Fallback: create user with minimal info
        user = await User.create({
          _id: userId,
          email: "user@example.com",
          username: "User",
          image: "",
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.json({ success: false, message: "Authentication failed", error: error.message });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.json({ success: false, message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.json({ success: false, message: "Access denied. Admin privileges required." });
  }

  next();
};