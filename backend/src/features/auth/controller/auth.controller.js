import bcrypt from 'bcryptjs';
import AuthRepository from "../repository/auth.repository.js";
import AuthModel from '../model/auth.model.js';
import generateTokenAndSetCookie from '../../../../utils/generateToken.js';
import UserModel from '../model/user.schema.js';


export default class AuthController{

    constructor(){
        this.authRepository = new AuthRepository();
    }

    signUp = async (req, res) => {
        
        try {
            const {fullName, userName, email, password} = req.body;

        //checking for valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return res.status(400).json({error: "invalid email format"});

        //checking for password length
        if(password.length < 6) return res.status(400).json({error: "password must be atleast 6 charaters long"});


        //checking for username

        const existingUser = await UserModel.findOne({userName});

        if(existingUser) return res.status(400).json({error: "username is already exist"});

        //checking for email

        const existingEmail = await UserModel.findOne({email});

        if(existingEmail) return res.status(400).json({error: "email is already exist"});

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new AuthModel(fullName, userName, email, hashedPassword);

        const createdUser = await this.authRepository.signUp(newUser);
        
        generateTokenAndSetCookie(createdUser._id, createdUser.email, res);
        return res.status(201).send({
            _id: createdUser._id,
            fullName: createdUser.fullName,
            userName: createdUser.userName,
            email: createdUser.email,
            followers: createdUser.followers,
            following: createdUser.following,
            profileImg: createdUser.profileImg,
            coverImg: createdUser.coverImg,
        });
        } catch (err) {
            console.error("error in signup controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    signIn = async (req, res) => {

        try {
            const {userName, password} = req.body;

            const isUser = await UserModel.findOne({userName});
            
            //checking if user exist
            if(!isUser) return res.status(404).json({error: "incorrect credientials"});
            
            //checking if password is correct
            const isCorrect = await bcrypt.compare(password, isUser.password);

            if(!isCorrect) return res.status(404).json({error: "incorrect credientials"});

            generateTokenAndSetCookie(isUser._id, isUser.email, res);
            return res.status(200).json({
                _id: isUser._id,
			    fullName: isUser.fullName,
			    userName: isUser.userName,
			    email: isUser.email,
			    followers: isUser.followers,
			    following: isUser.following,
			    profileImg: isUser.profileImg,
			    coverImg: isUser.coverImg,
            });
        } catch (err) {
            console.error("error in signin controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }

        
    }

    signOut = async (req, res) => {
        try {
            
            res.clearCookie("jwtToken");
            return res.status(200).json({message: "Logout successfully"});
        } catch (err) {
            console.error("error in signout controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }

    }

    getMe = async (req, res) => {

        try {
            const userId = req.userId;
            const isUser = await UserModel.findById(userId).select("-password");

            if(!isUser) return res.status(404).json({error: "user is not found"});

            return res.status(200).json(isUser);
        } catch (err) {
            console.error("error in getme controller -> ", err.message);
            return res.status(500).json({error: err.message});
        }
    }
}