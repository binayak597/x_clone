import PostRepository from '../repository/post.repository.js'
import UserModel from '../../auth/model/user.schema.js';
import { v2 as cloudinary } from 'cloudinary';
import PostModel from '../model/post.model.js';
import Post from '../model/post.schema.js';

export default class PostController{

    constructor(){

        this.postRepository = new PostRepository();
    }

    createPost = async (req, res) => {

        try {
            
            const {content} = req.body;
            let {postImg} = req.body;

            const userId = req.userId;

            const isUser = await UserModel.findById(userId);

            if(!isUser) return res.status(404).json({error: "user is not found"});

            if(!content && !postImg) return res.status(400).json({error: "post must have an image or content"});

            if(postImg){

                const response = cloudinary.uploader.upload(postImg);
                postImg = (await response).secure_url;
            }


            const newPost = new PostModel(isUser._id, content, postImg);

            const createdPost = await this.postRepository.createPost(newPost);

            return res.status(201).json(createdPost);
        } catch (err) {
            console.error("error in createPost controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }

    }


    deletePost = async (req, res) => {

        try {
            
            const {postId} = req.params;
            const userId = req.userId;
            const isPost = await Post.findById(postId);
            if(!isPost) return res.status(404).json({error: "post is not found"});

            const isUser = await UserModel.findById(userId);
            if(!isUser) return res.status(404).json({error: "user is not found"});

            if(isUser._id.toString() !== isPost.user.toString()) return res.status(404).json({error: "you are not authorized to delete this post"});

            if(isPost.postImg){

                const imgId = postImg.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(imgId);
            }

            await Post.findByIdAndDelete(isPost._id);

            return res.status(200).json({message: 'post deleted successfully'});

        } catch (err) {
            console.error("error in deletePost controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }
    }

    commentOnPost = async (req, res) => {

        try {
           const {content} = req.body;
           const {postId} = req.params;
           const userId = req.userId;

           const isUser = await UserModel.findById(userId);
           if(!isUser) return res.status(404).json({error: "user is not found"});

           const isPost = await Post.findById(postId);

           if(!isPost) return res.status(404).json({error: "post is not found"});

           if(!content) return res.status(400).json({error: "content field is required"});
           
            const updatedPost = await this.postRepository.commentOnPost(isPost, isUser, content);

            return res.status(200).json(updatedPost);

        } catch (err) {
            console.error("error in commentOn Post controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    updatePost = async (req, res) => {

        try {
            const {postId} = req.params;
            const {content} = req.body;
            let {postImg} = req.body;

            const userId = req.userId;

            const isUser = await UserModel.findById(userId);
           if(!isUser) return res.status(404).json({error: "user is not found"});

           let isPost = await Post.findById(postId);

           if(!isPost) return res.status(404).json({error: "post is not found"});

           if(postImg && isPost.postImg){

                //delete the previous postImg

                const imgId = isPost.postImg.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(imgId);


                //store newImg
                const response = await cloudinary.uploader.upload(postImg);
                postImg = response.secure_url;
           }

           isPost.content = content || isPost.content;
           isPost.postImg = postImg || isPost.postImg;

           await isPost.save();

           return res.status(200).json(isPost);
            
        } catch (err) {
            console.error("error in update Post controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }
    }

    likeUnlikePost = async (req, res) => {

        try {
            const {postId} = req.params;
            const userId = req.userId;

            const isUser = await UserModel.findById(userId);
           if(!isUser) return res.status(404).json({error: "user is not found"});

           const isPost = await Post.findById(postId);

           if(!isPost) return res.status(404).json({error: "post is not found"});
        
           const message = await this.postRepository.likeUnlikePost(isPost, isUser);

           return res.status(200).json({message});

        } catch (err) {
            console.error("error in likeUnlikePost controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    getAllPosts = async (req, res) => {

        try {
            const userId = req.userId;

            const isUser = await UserModel.findById(userId);
            if(!isUser) return res.status(404).json({error: "user is not found"});

            const posts = await this.postRepository.getAll();

            if(posts.length === 0) return res.status(200).json([]);

            return res.status(200).json(posts);
        } catch (err) {
            console.error("error in getAllPosts controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message}); 
        }
    }

    getLikedPosts = async (req, res) => {

        try {
            const userId = req.userId;

            const isUser = await UserModel.findById(userId);
            if(!isUser) return res.status(404).json({error: "user is not found"});

            const likedPosts = await this.postRepository.getLikedPosts(isUser);

            if(likedPosts === 0) return res.status(200).json([]);

            return res.status(200).json(likedPosts);
        } catch (err) {
            console.error("error in getLikedPosts controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    getUserPosts = async (req, res) => {

        try {
            
            const {username} = req.params;

            const isUser = await UserModel.findOne({userName: username});

            if(!isUser) return res.status(404).json({error: "user is not found"});

            const userPosts = await this.postRepository.getUserPosts(isUser);

            if(userPosts.length === 0) return res.status(200).json([]);

            return res.status(200).json(userPosts);
        } catch (err) {
            console.error("error in getUserPosts controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    getFollowingPosts = async (req, res) => {
        
        try {
            
            const userId = req.userId;

            const isUser = await UserModel.findById(userId);

            if(!isUser) return res.status(404).json({error: "user is not found"});

            const followingPosts = await this.postRepository.getFollowingPosts(isUser);

            if(followingPosts.length === 0) return res.status(200).json([]);

            return res.status(200).json(followingPosts);
            
        } catch (err) {
            console.error("error in getFollowingPosts controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }
}