const Jwt =require('jsonwebtoken');
const jwtKey ='myshoppylogin';


function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    if(token){
        // token = token.split(' ')[1];
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                res.status(401).send({result:"Please provide valid token"})
                console.log(err);

            }else{
                // console.log("Verification DONE SUCCESSFULLY !!!");
                next();
            }

        })
    }else{
        res.status(403).send({result:"please add token in headers"});
    }
   

}

module.exports = verifyToken;