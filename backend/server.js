import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDB } from './config/coonectToDB.js';




const app = express();

//application level middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json()); //to parse the JSON format data (from req.body)
app.use(express.urlencoded({extended: true})); //parse the form data 

app.use("/", (req, res) => res.send("welcome"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});