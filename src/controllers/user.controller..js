// src/controllers/user.controller.js

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new userModel({
      name,
      email,
      password,
    });

    await user.save();
    res.send("Người dùng đã được tạo");
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy chi tiết người dùng theo ID
exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm người dùng
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ error: "Người dùng không tồn tại" });
    }

    // Xóa tất cả bài đăng liên quan
    await postModel.deleteMany({ author: id });

    res.send("Người dùng và các bài đăng liên quan đã bị xóa");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = exports;
