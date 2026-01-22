// // require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./config/config");

// const authRoutes = require("./routes/auth.routes");
// const adminRoutes = require("./routes/admin.routes");

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://interioverse-admin-project.vercel.app"
//     ],
//     credentials: true,
//   })
// );

// // Health check
// app.get("/", (req, res) => {
//   res.json({ status: "OK", message: "Interioverse backend running" });
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);

// //  Render-safe port binding
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);

//   //  Connect DB AFTER server is up
//   connectDB()
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));
// });
require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/config");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://interioverse-admin-project.vercel.app",
    ],
    credentials: true,
  })
);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Interioverse backend running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB(); // connect DB after server starts
});
