const Users = require("../modules/Users");

const showAllUsers = async (req, res) => {
  try {
    const users = await Users.find().populate("orders");
    return res.status(200).json(users);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.validated;
    const user = await Users.findById(id).populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("is error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new Users(req.validated);
    await user.save();

    return res.status(201).json({ message: "user saved successfully", user });
  } catch (error) {
    console.error("is Error", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists, use a different email",
      });
    }

    return res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, email, phone, address } = req.validated;
    const updates = Object.fromEntries(
      Object.entries({ name, email, phone, address }).filter(
        ([, value]) => value !== undefined
      )
    );

    const updatedUser = await Users.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Update success!", user: updatedUser });
  } catch (error) {
    console.error("is Error", error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.validated;
    const deletedUser = await Users.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.error("is Error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  showAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
