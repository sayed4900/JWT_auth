const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const app = express();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3001))
  .catch((err) => console.log(err));

// routes
app.use('*',checkUser); // apply this function to every single route
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies

// app.get('/set-cookies',(req,res)=>{
  
//   // identify the cookie
//   // res.setHeader('Set-cookie','newUser=true'); // I will use the cookie method insted

//   res.cookie('newUser',false);
//   res.cookie('IsEmplyee',true,{maxAge:1000* 60 * 60 * 24 , httpOnly:true});

//   res.send('you got the cookies!');
// })
// app.get('/read-cookies',(req,res)=>{
  
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// })