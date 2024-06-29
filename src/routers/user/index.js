const express = require("express");
const router = express.Router();
const userModel = require("../../models/user.model");
const postModel = require("../../models/post.model");

// Create User
router.post("/create-user", (req, res) => {
  const { name, email, password } = req.body;

  const user = new userModel({
    name,
    email,
    password,
  });

  user
    .save()
    .then(() => {
      res.send("Người dùng đã được tạo");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get User Detail by ID
router.get("/get-user-detail/:id", (req, res) => {
  const { id } = req.params;

  userModel
    .findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get All Users
router.get("/get-all-users", (req, res) => {
  userModel
    .find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        error: "Thất bại trong việc lấy dữ liệu người dùng",
        details: err,
      });
    });
});

// Update User
// Update User
router.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  let errorMessages = [];

  // Validate password length
  if (password && password.length < 8) {
    errorMessages.push("Mật khẩu phải có ít nhất 8 ký tự");
  }

  try {
    // Find user by ID
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ error: "Người dùng không tồn tại" });
    }

    // Check if email is being updated and if it already exists for another user
    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        errorMessages.push("Email đã tồn tại trong hệ thống");
      }
    }

    // If there are validation errors, return them
    if (errorMessages.length > 0) {
      return res.status(400).send({ errors: errorMessages });
    }

    // Update user fields
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }

    // Save updated user
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      errorMessages.push("Email đã tồn tại trong hệ thống");
    }

    // If there are validation errors, return them
    if (errorMessages.length > 0) {
      return res.status(400).send({ errors: errorMessages });
    }

    // Handle other errors
    res.status(500).send({
      error: "Thất bại cập nhật thông tin người dùng",
      details: error,
    });
  }
});

// Delete User
router.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user
    console.log("Finding user with ID:", id);
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ error: "Người dùng không tồn tại" });
    }

    // Delete all posts associated with the user
    console.log("Deleting posts for user ID:", id);
    await postModel.deleteMany({ author: id });

    // Verify posts are deleted
    const remainingPosts = await postModel.find({ author: id });
    console.log("Remaining posts for user ID:", id, remainingPosts);

    // Delete the user
    console.log("Deleting user with ID:", id);
    await userModel.findByIdAndDelete(id);

    res.send("Người dùng và các bài đăng liên quan đã bị xóa");
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).send(error);
  }
});
module.exports = router;
// const express = require("express");
// const router = express.Router();
// const userController = require("../../controllers/user.controller");

// // Create User
// router.post("/create-user", userController.createUser);

// // Get User Detail by ID
// router.get("/get-user-detail/:id", userController.getUserDetail);

// // Get All Users
// router.get("/get-all-users", userController.getAllUsers);

// // Update User
// router.put("/update-user/:id", userController.updateUser);

// // Delete User
// router.delete("/delete-user/:id", userController.deleteUser);

// module.exports = router;
