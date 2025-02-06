const jwt = require('jsonwebtoken');
const generateJWTToken=(res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie('token',token, {
        httpOnly:true,
        secure:process.env.Node_ENV === 'production',
        sameSite:'strict',
        maxAge: 7*21*60*1000

    })

    return token;
}


module.exports ={generateJWTToken};