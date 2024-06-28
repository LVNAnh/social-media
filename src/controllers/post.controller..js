const postModel = require("../models/post.model");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const post = new postModel({
      title,
      content,
      author: authorId,
    });

    const savedPost = await post.save();

    // Update the user's posts array
    await userModel.findByIdAndUpdate(
      authorId,
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    res.send("Post Created and User Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id).populate("author");
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate("author");
    res.send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { currentAuthorId, newAuthorId, title, content } = req.body;

    const post = await postModel.findOne({
      _id: postId,
      author: currentAuthorId,
    });

    if (!post) {
      return res
        .status(404)
        .send({ error: "Post not found or not authorized" });
    }

    post.title = title;
    post.content = content;
    post.author = newAuthorId;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.send(updatedPost);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await postModel.findByIdAndDelete(id);

    // Remove the post reference from the user's posts array
    await userModel.findByIdAndUpdate(
      deletedPost.author,
      { $pull: { posts: deletedPost._id } },
      { new: true }
    );

    res.send("Post Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = exports;
