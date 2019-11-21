const bcrypt = require("bcryptjs"),
     jwt = require("jsonwebtoken"),
     crypto = require("crypto"),
     request = require('request'),
     fs = require('fs'),
     path = require('path'),
     User = require("../models/user"),
     environment = require('../config/environment'),
     config =environment.config();

const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(config.sendgrid_api_key);

exports.NewUser = async (req, res, next) => {
  try {
      const data= await User.findOne({email: req.body.email})
    if (!data) { 
          const password = req.body.password;
          var hashpass=await bcrypt.hash(password, 10);
          const user = new User({
            email: req.body.email,
            name: 'Test',
            password: hashpass, 
            status: 'Active',
            email_varify: true,
            phone: req.body.mobile,
          });
        const saveUser= await user.save()
        if (saveUser) { 
          const msg = {
            to: saveUser.email,
            from: 'chowdary716@gmail.com',
            subject: 'Your Account is Created in TODO APP!',
            html: `Hello..,<br /> <br /> Your Account is Activated. Please login and Created your Todos. <br /> Enjoy. <br /> Happy todos.`,
          };
          sgMail.send(msg); 
            res.status(201).json({
            status: true,
            message: "User created!",
            result: saveUser
          });
        }
    }else {
      res.status(200).json({
        status: false,
        message: "User Already Exists!",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.userLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(403).json({
        message: 'A user with this email could not be found.'
      })      
      return;
    }
    if(user.status=='Inactive'){
      res.status(403).json({
        message: 'Your Account is Inacive !'
      });
      return;
    }
    if(!user.email_varify){
      res.status(403).json({
        message: 'Your Email is Not verified !'
      });
      return;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      res.status(403).json({
        message: 'Wrong password!'
      });
      return;
    }
    const updateData = {
      _id: req.body._id,
      login_ip: req.ip,
      login_date: new Date()
    }
    const updateUser= await user.updateOne({ _id: loadedUser._id}, updateData);
    if(updateUser){
      const jwtData={}
      jwtData.email=loadedUser.email;
      jwtData.userId= loadedUser._id.toString();
      jwtData.role= loadedUser.role;
      
    const token = jwt.sign({ jwtData }, config.jwt_token,{ expiresIn: '8h' } );
   
    res.status(200).json({
      token: token,
      expiresIn: 28800,
      root_account: loadedUser.root_account,
      name: loadedUser.name,
      userId: loadedUser._id,
      role: loadedUser.role,
      email: loadedUser.email,
      password_update: loadedUser.password_update,
      organization: loadedUser.organizationId,
      });
      return;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
