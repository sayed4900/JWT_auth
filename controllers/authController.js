const User = require('../models/User');
const jwt = require('jsonwebtoken');
// handler errors

const handleErrors = (err)=>{
    console.log(err.message,err.code);
    let errors = {email:'',password:''};

    // incorrect email
    if (err.message==='Incorrect email'){
        errors.email = 'This email is not registered'
    }
    // incorrect password
    if (err.message==='Incorrect password'){
        errors.password = 'Wrong password'
    }
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
const maxAge = 3 * 24 * 60 * 60 ;
const createToken = (id)=>{
    return jwt.sign({id},'Top-secret',{
        expiresIn:maxAge
    })
}

module.exports.getSignup=(req,res,next)=>{
    res.render('signup')
}

module.exports.postSignup= async (req,res,next)=>{
    const {email,password} = req.body;

    try{
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge * 1000});
        res.status(201).json(user);
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}


module.exports.getLogin=(req,res,next)=>{
    res.render('login')
}


module.exports.postLogin = async (req,res,next)=>{
    const {email , password} = req.body;
    
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge * 1000});
        
        res.status(200).json({user:user._id})

    }catch(err){
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.getLogout = async (req,res,next)=>{
    res.cookie('jwt', '', { maxAge: 0 }); // jwt=''
    res.redirect('/');
}