const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const adminController = require("../controller/admin.controller");

router.get("/users", authMiddleware, adminMiddleware, adminController.getAllUsers);
router.put("/verify-user/:userId", authMiddleware, adminMiddleware, adminController.verifyUser);
router.delete("/delete-user/:userId", authMiddleware, adminMiddleware, adminController.deleteUser);

module.exports = router;
