

//external modules

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//custom modules

import { connectToDB } from './config/coonectToDB.js';
import authRoutes from './src/features/auth/routes/auth.routes.js'




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

// app.use("/", (req, res) => res.send("welcome"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});