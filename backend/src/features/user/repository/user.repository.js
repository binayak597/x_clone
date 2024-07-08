import UserModel from "../../auth/model/user.schema.js";
import ApplicationError from "../../../../error-handler/applicationError.js";
import NotificationModel from "../../notification/model/notification.schema.js";

export default class UserRepository{


    followUnfollowUser = async (loggedInUser, followingUser) => {

        try {
            //checking if user is already present in the following list of the loggedinuser
        const isFollowing = loggedInUser.following.includes(followingUser._id);

        if(isFollowing){

            //unfollow the user

            await UserModel.findByIdAndUpdate(loggedInUser._id, {
                $pull: {
                    following: followingUser._id
                }
            });

            await UserModel.findByIdAndUpdate(followingUser._id, {
                $pull: {
                    followers: loggedInUser._id
                }
            });

            return "User unfollowed successfully";

        }else{

            //follow the user

            await UserModel.findByIdAndUpdate(loggedInUser._id, {
                $push: {
                    following: followingUser._id
                }
            });

            await UserModel.findByIdAndUpdate(followingUser._id, {
                $push: {
                    followers: loggedInUser._id
                }
            });

            //create a notification to send the user

            const newNotification = new NotificationModel({

                from: loggedInUser._id,
                to: followingUser._id,
                type: "follow"
            });

            await newNotification.save();

            return "User followed successfully";

        }
        } catch (err) {
            throw new ApplicationError("something went wrong" ,500); 
        }
    }

    getSuggestedUsers = async (user) => {


        try {
            const userFollowedByMe = await UserModel.findById(user._id).select("following");

        const users = await UserModel.aggregate([
            {
                $match: {
                    _id: {
                        $ne: user._id
                    }
                }
            },
            {
                $sample: {
                    size: 20
                }
            }
        ]);

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));

        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach(user => user.password = null);

        return suggestedUsers;
        } catch (err) {
            throw new ApplicationError("something went wrong" ,500);
        }
    }

}