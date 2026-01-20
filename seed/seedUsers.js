const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const allUsers = require("../utils/allUsers");
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // FULL RESET
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("admin123", 10);

    //  NORMALIZE DATA FOR SCHEMA
    const users = allUsers.map((u, index) => ({
      profileId: u.profileId || u.id || `US${String(index + 1).padStart(5, "0")}`,
      name: u.name,
      email: u.email,
      password: passwordHash,
      role: u.role || "user",
      isListedInAdmin: true,

      phone: u.phone,
      type: u.type,
      address: u.address,
      location: u.location,
      instagram: u.instagram,
      linkedin: u.linkedin,
      experience: u.experience,
      brand: u.brand,
      date: u.date,
      status: u.status || "Not Verified",
      projectsCount: u.projectsCount || 0,
      pinCode: u.pinCode,
      referralCount: u.referralCount || 0,
      specialization: u.specialization,
      registeredName: u.registeredName,
      tagLine: u.tagLine,
      signupDate: u.signupDate,
      projects: u.projects || [],
    }));

    await User.insertMany(users);
    console.log(`✅ Inserted ${users.length} users`);

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedUsers();
