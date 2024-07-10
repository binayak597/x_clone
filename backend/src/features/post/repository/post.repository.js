import ApplicationError from "../../../../error-handler/applicationError.js";
import UserModel from "../../auth/model/user.schema.js";
import NotificationModel from "../../notification/model/notification.schema.js";
import Post from "../model/post.schema.js";

export default class PostRepository{


    createPost = async (postData) => {

        try {

            const newPost = new Post(postData);

            if(!newPost) throw new Error("invalid post");

            await newPost.save();
            return newPost;
            
        } catch (err) {
            if(err instanceof Error) throw new ApplicationError(err.message, 400);
            else throw new ApplicationError("something went wrong", 500);
        }
    }

    commentOnPost = async (post, user, content) => {

        try {
            const commentData = {content, user: user._id};

            const updatedPost = await Post.findByIdAndUpdate(post._id, {
                $push: {
                    comments: commentData
                }
            },
        {
            returnDocument: 'after'
        });

        return updatedPost;

        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    likeUnlikePost = async (post, user) => {

        try {
            const userLikedPost = post.likes.includes(user._id);

            if(userLikedPost){

                //unlike the post

                await Post.findByIdAndUpdate(post._id, {

                    $pull: {
                        likes: user._id
                    }
                });

                await UserModel.findByIdAndUpdate(user._id, {

                    $pull: {
                        likedPost: post._id
                    }
                });

                return "Post unliked successfully";
            }else{

                //like the post

                await Post.findByIdAndUpdate(post._id, {

                    $push: {
                        likes: user._id
                    }
                });

                await UserModel.findByIdAndUpdate(user._id, {

                    $push: {
                        likedPost: post._id
                    }
                });

                //create a notification and send to user
                const newNotification = new NotificationModel({
                    from: user._id,
                    to: post.user,
                    type: "like"
                });

                await newNotification.save();
                return "Post liked successfully";
            }
        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    getAll = async () => {
        try {

            return await Post.find({})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    getLikedPosts = async (user) => {

        try {
            return await Post.find({
                _id: {
                    $in: user.likedPost
                }
            })
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
            
        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    getUserPosts = async (user) => {

        try {
            return await Post.find({
                user: user._id
            })
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    getFollowingPosts = async (user) => {

        const followingUsers = user.following;

        try {
            return await Post.find({

                user: {
                    $in: followingUsers
                }
            })
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });


        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        } 
        
    }
}