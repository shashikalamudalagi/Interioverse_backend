require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/config");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",              // local dev
      "https://interioverse-admin-project.vercel.app" // Vercel frontend (replace with YOUR URL)
    ],
    credentials: true,
  })
);

// Health check (IMPORTANT)
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Interioverse backend running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// ✅ FIXED PORT (RENDER SAFE)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
