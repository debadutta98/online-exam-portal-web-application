const express=require('express');
var router = express.Router();
var moment = require('moment');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
var Quiz=require('./quiz.js');
const Teacher= require('./teacher');
router.use(bodyParser.json());
router.get('/:id',async function(req,res){
  await Quiz.deleteOne({_id:req.params.id}, async function(err){
    if(!err)
    {
      var email_info;
      if(req.cookies.token)
      {
          var info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);
        email_info=info.email;
      }
      else if(req.signedCookies.token)
      {
        var info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
      email_info=info.email;
      }
    if(typeof(email_info)!=="undefined"){
      await Teacher.findOne({email:email_info},async function(err1,doc){
      if(!err1)
      {
        await Teacher.findByIdAndUpdate({_id:doc._id},{$pull : {"quizs":{quizid:req.params.id}}},{ safe: true, upsert: true , useFindAndModify:false}, async function(err,doc1){
          if(!err)
          res.redirect('/teacher');
        })
      }
      else
      {
        console.log("error");
      }
    });
  }
    }
  })
})
module.exports=router;
