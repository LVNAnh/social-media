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
      res.send("User Created");
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
      res.status(500).send({ error: "Failed to get users", details: err });
    });
});

// Update User
router.put("/update-user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  userModel
    .findByIdAndUpdate(id, { name, email, password }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ error: "Failed to update user", details: err });
    });
});

// Delete User
router.delete("/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user
    console.log("Finding user with ID:", id);
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
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
