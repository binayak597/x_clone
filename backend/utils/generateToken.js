import jwt from 'jsonwebtoken';


const generateTokenAndSetCookie = (userId, userEmail, res) => {

    const token = jwt.sign({userId, userEmail}, process.env.SECRET_KEY,{
        expiresIn: "15d"
    });

    //create custom cookie and send it to client
    res.cookie("jwtToken", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //MS
        httpOnly: "true", //prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attack
        // secure: process.env.NODE_ENV !== "development"

        //basically any body who wants to access this token they can't able to access via javascript
    });
}

export default generateTokenAndSetCookie;