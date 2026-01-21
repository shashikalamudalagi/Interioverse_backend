const User = require("../model/user.model");

exports.getAllUsers = async (req, res) => {
 
  const users = await User.find({ isListedInAdmin: true })
  .sort({ createdAt: -1 });
  res.json(users);
};

// exports.verifyUser = async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   user.status = "Verified";
//   await user.save();
//   res.json(user);
// };
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // TOGGLE STATUS
    user.status =
      user.status === "Verified" ? "Not Verified" : "Verified";

    await user.save();

    res.json(user); //  return UPDATED user
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res.json({ message: "User deleted" });
};
