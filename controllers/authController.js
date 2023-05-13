const User = require('../models/User');
const jwt = require('jsonwebtoken');
// handler errors

const handleErrors = (err)=>{
    console.log(err.message,err.code);
    let errors = {email:'',password:''};

    // duplicate 
    if (err.code===11000)
        errors['email'] = "This email is extisted, Please use another one"
    // valdition errors
    if (err.message.includes('user validation failed')){
        // console.log('💥💥💥',Object.values(err.errors));
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            
        });
    }

    return errors;
}

const createToken = (id)=>{
    return jwt.sign({id},'Top-secret',{
        expiresIn:'3d'
    })
}

module.exports.getSignup=(req,res,next)=>{
    res.render('signup')
}

module.exports.postSignup= async (req,res,next)=>{
    const {email,password} = req.body;

    try{
        const user = await User.create({email,password});
        res.status(201).json(user);
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}


module.exports.getLogin=(req,res,next)=>{
    res.render('login')
}


module.exports.postLogin=(req,res,next)=>{
    res.send('user login in')
}