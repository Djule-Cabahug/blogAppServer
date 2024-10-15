const express = require("express");
const postController = require("../controllers/post");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Add a post as authenticated user based on the schema
router.post("/addPost", verify, postController.addPost);

//Get all posts belonging to the authenticated user
router.get("/getMyPosts", verify, postController.getMyPosts);

// Get all posts as any user, no authentication needed
router.get("/getAllPosts", postController.getAllPosts);

// Retrieve a single post by id as any user, no authentication needed
router.get("/getPost/:postId", postController.getPost);

// Update post by id as authenticated user
router.patch("/updatePost/:postId", verify, postController.updatePost);

// Delete post by id as authenticated user
router.delete("/deletePost/:postId", verify, postController.deletePost);

// Add post comment as authenticated user
router.patch("/addComment/:postId", verify, postController.addComment);

// Get post comments as regular user
router.get("/getComments/:postId", postController.getComments);

// Delete any post as admin
router.delete("/deletePostAsAdmin/:postId", verify, verifyAdmin, postController.deletePostAsAdmin);

// Delete any comment as admin
router.delete("/deleteComment/:postId/:commentId", verify, verifyAdmin, postController.deleteComment);

module.exports = router;