const User =require('../models/Users');
const Jwt =require('jsonwebtoken');
const jwtKey ='myshoppylogin';
const Cart = require('../models/carts');
const Orders = require('../models/orders');

module.exports.signup = async (req,res)=>{

    const user = new User(req.body);
    let result =await user.save();
    result = result.toObject();
    delete result.password;

    let cart = new Cart({userId:result._id});
    let cartResult =await cart.save();
    let order =new Orders({userId:result._id});
    let orderResult = await order.save();

    Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
            res.send({result:"Something went wrong!!!"})
        }
        res.send({result,auth:token})
    })

    

}

module.exports.login =async (req,res) =>{

    if(req.body.email && req.body.password){

        let user  = await User.findOne(req.body).select('-password');
        
        if(user){
            Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.send({result:"Something went wrong!!!"})
                }
                res.send({user,auth:token})
            })
        }
        else{
        res.send({result:"No User Found"});

        }


    }else{
        res.send({
            error:"Check Email or Password"
        })
    }
}