import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        maxLength: [25, "Name should not be more than 25 Characters"],
        required: true
    },
    userName: {
        type: String,
        maxLength: [12, "username should not be more than 12 Characters"],
        unique: true,
        required: true
    },
    email: {
        type: String,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        unique: true,
        required: true
    },
    password: {
        type: String,
        // validate: {
        //             validator: function(value){
        //                 return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
        //             },
        //             message: "Password should be between 8-12 characters and have a special character"
        //         },
        minLength: [6, "password must be atleast 6 characters long."],
        required: true
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    profileImg: {
        type: String,
        default: ""
    },

    coverImg: {
        type:String,
        default: ""
    },

    // socialLinks: [
    //     {
    //         platform: {
    //             type: String,
    //             required: true,
    //             default: ""
    //         },
    //         link: {
    //             type: String,
    //             required: true,
    //             default: ""
    //         }
    //     }
    // ],

    socialLink: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    likedPost: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;