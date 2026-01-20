const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // UI ID (US00001)
    profileId: {
      type: String,
      required: true,
      unique: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },

    // Visible in admin panel or not
    isListedInAdmin: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Verified", "Not Verified"],
      default: "Not Verified",
    },

    phone: String,
    type: String,
    address: String,
    location: String,
    instagram: String,
    linkedin: String,
    experience: String,
    brand: String,
    date: String,
    projectsCount: Number,
    pinCode: String,
    referralCount: Number,
    specialization: String,
    registeredName: String,
    tagLine: String,
    signupDate: {
  type: Date,
  default: Date.now,
},


    projects: [
      {
        name: String,
        location: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
