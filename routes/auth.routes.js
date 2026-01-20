const express = require("express");
const router = express.Router();

const { signup, login, getCurrentUser, logout } = require("../controller/auth.controller");

const protect = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/current-user", protect, getCurrentUser);
router.post("/logout", logout);


module.exports = router;
