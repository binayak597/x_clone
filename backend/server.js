

//external modules

import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
	api_key: process.env.CLOUDINARY_APIKEY,
	api_secret: process.env.CLOUDINARY_APISECRET
});

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


//custom modules

import { connectToDB } from './config/coonectToDB.js';
import authRoutes from './src/features/auth/routes/auth.routes.js'
import userRoutes from './src/features/user/routes/user.routes.js'
import jwtAuth from './src/middlewares/jwtAuth.middleware.js';




const app = express();

//application level middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json()); //to parse the JSON format data (from req.body)
app.use(express.urlencoded({extended: true})); //parse the form data 


//api gateway

//requests related to auth routes
//http://localhost:8080/api/auth

app.use("/api/auth", authRoutes);


//requests related to auth routes
//http://localhost:8080/api/user

app.use("/api/user", jwtAuth, userRoutes);

// app.use("/", (req, res) => res.send("welcome"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});