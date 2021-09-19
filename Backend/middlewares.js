const jwt = require('jsonwebtoken');
require('dotenv').config();

function middlewareRolAdmin(req,res,next) {
    const auth = req.headers.authorization;
    const token = auth.substring(7,auth.length);
    const tokenToApprove = jwt.verify(token,process.env.KEY_JWT);
    if(tokenToApprove.rol === "admin"){
        next();
    }else{
        res.status(403);
        res.send("No access permissions. Contact the administrator to resolve the issue.");
    };
};

module.exports = {middlewareRolAdmin};