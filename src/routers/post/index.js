const express = require("express");
const router = express.Router();
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");
const userModel = require("../../models/user.model");
// Create Post
router.post("/create-post", (req, res) => {
  const { title, content, authorId } = req.body;

  const post = new postModel({
    title,
    content,
    author: authorId,
  });

  post
    .save()
    .then((savedPost) => {
      return userModel.findByIdAndUpdate(
        authorId,
        { $push: { posts: savedPost._id } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      res.send("Post Created and User Updated");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get Post by ID
router.get("/get-post/:id", (req, res) => {
  const { id } = req.params;

  postModel
    .findById(id)
    .populate("author")
    .then((post) => {
      res.send(post);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get All Posts
router.get("/get-all-posts", (req, res) => {
  postModel
    .find()
    .populate("author")
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Update Post
router.put("/update-post/:postId", (req, res) => {
  const { postId } = req.params;
  const { currentAuthorId, newAuthorId, title, content } = req.body;

  console.log("Received update request:", {
    postId,
    currentAuthorId,
    newAuthorId,
    title,
    content,
  });

  postModel
    .findOne({ _id: postId, author: currentAuthorId })
    .then((post) => {
      if (!post) {
        console.log("Post not found or not authorized");
        return res
          .status(404)
          .send({ error: "Post not found or not authorized" });
      }

      console.log("Found post:", post);

      // Update the post's title, content, and author
      post.title = title;
      post.content = content;
      post.author = newAuthorId;
      post.updatedAt = Date.now();

      console.log("Updated post:", post);

      // Save changes
      return post.save();
    })
    .then((updatedPost) => {
      console.log("Post updated successfully:", updatedPost);
      res.send(updatedPost);
    })
    .catch((err) => {
      console.error("Error updating post:", err);
      res.status(500).send(err);
    });
});

// Delete Post
router.delete("/delete-post/:id", (req, res) => {
  const { id } = req.params;

  postModel
    .findByIdAndDelete(id)
    .then((deletedPost) => {
      return userModel.findByIdAndUpdate(
        deletedPost.author,
        { $pull: { posts: deletedPost._id } },
        { new: true }
      );
    })
    .then(() => {
      res.send("Post Deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
