import User from "../models/User.js";

// Get User data using Token (JWT)
// GET /api/user/
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Store User Recent Searched Cities
// POST /api/user/recent-searched-cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = await req.user;
    // Store max 3 recent searched cities
    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Register User as Admin (Hotel Owner)
// POST /api/user/register-as-admin
export const registerAsAdmin = async (req, res) => {
  try {
    const userId = req.user._id;

    // Update user role to admin
    await User.findByIdAndUpdate(userId, { role: "admin" });

    res.json({ success: true, message: "Successfully registered as admin" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};