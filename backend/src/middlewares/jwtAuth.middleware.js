import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {

    try {
        
        //check if token exist
        const token = req.cookies.jwtToken;
        if(!token) return res.status(401).json({error: "Unauthorized - No Token"});

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        if(!payload) return res.status(401).json({error: "Unauthorized - Invalid Token"});

        req.userId = payload.userId;
        console.log("Payload details of JWTToken -> ", payload);
        next();
    } catch (err) {
        
        return res.status(401).json({error: err.message});
    }
}

export default jwtAuth;