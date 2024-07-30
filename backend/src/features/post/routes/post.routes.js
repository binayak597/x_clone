import Router from 'express';
import PostController from '../controller/post.controller.js';

const router = Router();

// create an instance of PostController class
const postController = new PostController();


router.get("/all", (req, res) => {
    postController.getAllPosts(req, res);
});

router.get("/user/:username", (req, res) => {
    postController.getUserPosts(req, res);
});

router.get("/following", (req, res) => {
    postController.getFollowingPosts(req, res);
});

router.get("/likes/:id", (req, res) => {
    postController.getLikedPosts(req, res);
});

router.post("/create", (req, res) => {
    postController.createPost(req, res);
});

router.post("/update/:postId", (req, res) => {
    postController.updatePost(req, res);
});

router.delete("/delete/:postId", (req, res) => {
    postController.deletePost(req, res);
});

router.post("/like/:postId", (req, res) => {
    postController.likeUnlikePost(req, res);
});

router.post("/comment/:postId", (req, res) => {
    postController.commentOnPost(req, res);
});

export default router;