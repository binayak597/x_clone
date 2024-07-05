
import mongoose from 'mongoose';
import UserModel from '../model/user.schema.js'
import ApplicationError from '../../../../error-handler/applicationError.js';

export default class AuthRepository{

    signUp = async (user) => {
        
        try {
            const newUser = new UserModel(user);
            if(newUser){
                await newUser.save();
                return newUser;
            }else throw new Error("invalid user data");
        } catch (err) {
            if(err instanceof mongoose.Error.ValidationError) throw new ApplicationError(err.message, 400);
            else if(err instanceof Error) throw new ApplicationError(err.message, 400);
            else throw new ApplicationError("something went wrong", 500);
        }
    }

    findUserByUsername = async (userName) => {

        try {
            return await UserModel.findOne({userName});
        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    findUserByEmail = async (email) => {

        try {
            return await UserModel.findOne({email});
        } catch (err) {
            throw new ApplicationError("something went wrong" ,500);
        }
    }

    findUser = async (id) => {

        try {
            return await UserModel.findById(id).select("-password");
        } catch (error) {
            throw new ApplicationError("something went wrong" ,500);
        }
    }

}