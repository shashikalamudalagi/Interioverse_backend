const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    // Fields that MUST be present
    const REQUIRED_FIELDS = [
      "name",
      "email",
      "phone",
      "type",
      "address",
      "pinCode",
      "location",
      "referralCount",
      "specialization",
      "experience",
      "projectsCount",
      "brand",
      "registeredName",
      
    ];

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    // Validate phone
    if (!/^\d{10}$/.test(req.body.phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits",
      });
    }

    // Validate pin code
    if (!/^\d{6}$/.test(req.body.pinCode)) {
      return res.status(400).json({
        message: "Pin code must be 6 digits",
      });
    }

    // // Check duplicate user
    // const exists = await User.findOne({ email: req.body.email });
    // if (exists) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // Check if user already exists with same email or phone number
const exists = await User.findOne({
  $or: [
    { email: req.body.email },
    { phone: req.body.phone },
  ],
});

if (exists) {
  return res.status(400).json({
    message: "User with this email or phone number already exists",
  });
}


    // Safety check for env
    if (!process.env.USER_DEFAULT_PASSWORD) {
      return res.status(500).json({
        message: "Server misconfigured: USER_DEFAULT_PASSWORD missing",
      });
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(
      process.env.USER_DEFAULT_PASSWORD,
      10
    );

    // Generate profile ID using first 2 letters of user's name
const namePrefix = req.body.name
  .trim()                 // remove extra spaces
  .toUpperCase()          // convert to uppercase
  .replace(/[^A-Z]/g, "") // remove non-letter characters
  .slice(0, 2)            // take first 2 letters
  .padEnd(2, "X");        // fallback if name has only 1 letter

const profileId = `${namePrefix}${Date.now().toString().slice(-5)}`;


    
     // Create new user record in database
    await User.create({
      ...req.body, // includes optional fields safely
      profileId,
      password: hashedPassword,
      role: "user",
      isListedInAdmin: true,
      status: "Not Verified",
      
    });
    // Send success response to frontend
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    // Log error for debugging
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
};


// ================= LOGIN (COOKIE BASED – VERIFICATION ONLY) =================
const login = async (req, res) => {
  try {
    const { role, password } = req.body;

    if (!role || !password) {
      return res
        .status(400)
        .json({ message: "Role and password required" });
    }

    //   SYSTEM PASSWORDS
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const USER_PASSWORD = process.env.USER_PASSWORD;
 

    let verifiedRole = null;

   if (role === "admin" && password === ADMIN_PASSWORD) {
  verifiedRole = "admin";
}

if (role === "user" && password === USER_PASSWORD) {
  verifiedRole = "user";
}


    if (!verifiedRole) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  generate JWT (cookie-based)
    const token = jwt.sign(
      { role: verifiedRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,         // prevents JS access
      sameSite: "lax",
      secure: false, // localhost
    });

    // Send success response with role
    return res.json({
      message: "Verified",
      role: verifiedRole,
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= getCurrentUser =================
// getCurrentUser function verifies logged-in user

const getCurrentUser = async (req, res) => {
  try {
    // Send user role extracted from verified JWT
    res.json({
      role: req.user.role,
    });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ================= LOGOUT =================
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({ message: "Logged out" });
};
module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
};  