import { v2 as cloudinary } from "cloudinary";

import UserModel from "../../auth/model/user.schema.js";
import UserRepository from "../repository/user.repository.js";


export default class UserController{
    
    constructor(){

        this.userRepository = new UserRepository();
    }

    getProfileDetails = async (req, res) => {

        try {
            const {username} = req.params;

            const isUser = await UserModel.findOne({userName: username}).select("-password");

            if(!isUser) return res.status(404).json({error: "user is not found"});

            return res.status(200).json(isUser);

        } catch (err) {
            console.error("error in getprofiledetails controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }
    }

    getSuggestedUsers = async (req, res) => {

        try {
            const userId = req.userId;

        const isUser = await UserModel.findById(userId);

        if(!isUser) return res.status(404).json({error: "user not found"});

        const suggestedUsers = await this.userRepository.getSuggestedUsers(isUser);

        return res.status(200).json({suggestedUsers});
        } catch (err) {
            console.error("error in getsuggested users controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    followUnfollowUser = async (req, res) => {

        try {
            //userId -> to whom, loggedin user wants to follow
        const {userId} = req.params;

        const loggedInUserId = req.userId;

        if(userId === loggedInUserId.toString()) return res.status(400).json({error: "you can't follow/unfollow yourself"})

        //checking if this user is exist
        const isToFollowingUser = await UserModel.findById(userId);

        //checking if logedin user exist
        const isLoggedInUser = await UserModel.findById(loggedInUserId);

        if(!isToFollowingUser || !isLoggedInUser) return res.status(404).json({error: "user is not found"});

        const message = await this.userRepository.followUnfollowUser(isLoggedInUser, isToFollowingUser);
        
        return res.status(200).json({message});

        } catch (err) {
            console.error("error in follow/unfollow user controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    updateUser = async (req, res) => {

        try {
            const {fullName, userName, email, currentPassword, newPassword, socialLink, bio} = req.body;

            let {profileImg, coverImg} = req.body;

            const userId = req.userId;

            //checking if user exist
            let isUser = await UserModel.findById(userId);
            if(!isUser) return res.status(404).json({error: "user is not found"});


            if(userName){
                //check if username is exist
            const existingUsername = await UserModel.findOne({userName});
            if(existingUsername) return res.status(400).json({error: "username is already exist"});
            }

            if(email){
                //checking for invalid email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) return res.status(400).json({error: "invalid email format"});

            //check if email is exist

            const existingEmail = await UserModel.findOne({email});
            if(existingEmail) return res.status(400).json({error: "email is already exist"});
            }

            

            if((!currentPassword && newPassword) || (currentPassword && !newPassword)) return res.status(400).json({error: "please provide both current and new password"}); 

            if(currentPassword && newPassword){

                const isMatch = await bcrypt.compare(currentPassword, isUser.password);

                if(!isMatch) return res.status(400).json({error: "current password is incorrect"});
                
                
                if(newPassword.length < 6) return res.status(400).json({error: "new password must be atleast 6 characters long"});

                const salt = await bcrypt.genSalt(10);
                isUser.password = await bcrypt.hash(newPassword, salt);
            }

            if(profileImg){

                //delete the previous profile image from cloudinary if exist

                if(isUser.profileImg){
                    // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png

                    //this is how the imageurl looks like when we stored in cloudinary 
                    await cloudinary.uploader.destroy(isUser.profileImg?.split("/").pop().split(".")[0]);
                }

                const response = await cloudinary.uploader.upload(profileImg);
                profileImg = response.secure_url;

            }

            if(coverImg){
                 //delete the previous cover image from cloudinary if exist
                 if(isUser.coverImg){

                    await cloudinary.uploader.destroy(isUser.coverImg?.split("/").pop().split(".")[0]);
                 }

                 const response = await cloudinary.uploader.upload(coverImg);
                coverImg = response.secure_url;
            }

            isUser.fullName = fullName || isUser.fullName;
		    isUser.email = email || isUser.email;
		    isUser.userName = userName || isUser.userName;
		    isUser.bio = bio || isUser.bio;
		    isUser.socialLink = socialLink || isUser.socialLink;
		    isUser.profileImg = profileImg || isUser.profileImg;
		    isUser.coverImg = coverImg || isUser.coverImg;

		    isUser = await isUser.save();

		    // password should be null in response
		    isUser.password = null;

            return res.status(200).json(isUser);

        } catch (err) {
            console.error("error in update user controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }
    }
}