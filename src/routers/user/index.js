const express = require("express");
const router = express.Router();
const userModel = require("../../models/user.model");

nhu cai cc haha
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
router.delete("/delete-user/:id", (req, res) => {
  const { id } = req.params;

  userModel
    .findByIdAndDelete(id)
    .then(() => {
      res.send("User Deleted");
    })
    .catch((err) => {
      res.status(500).send({ error: "Failed to delete user", details: err });
    });
});

router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
