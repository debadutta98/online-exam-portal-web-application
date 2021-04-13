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
//26-02-2021
router.get('/',function(req,res){
res.render('createquiz');
})
router.get('/upload',function(req,res){
  res.render('teacherSetting');
})
router.get('/:id',function(req,res){
  if(req.params.id!=='upload')
  res.render('createquiz');
});
router.post('/:id/upload/submit',async function(req,res){
  if(req.cookies.quizquestion!=="null")
  {
    var quiz_json=JSON.parse(req.cookies.quizquestion);
    quiz_json.quiz_start_time=new Date(req.body.quizstarttime)
    quiz_json.quiz_end_time=new Date(req.body.quizendtime)
    quiz_json.quiz_duration=req.body.quizduration;
    quiz_json.quiz_name=req.body.quizname;
    quiz_json.quiz_mark=req.body.quizmark;
    if(req.cookies.token)
    {
        var info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);
      quiz_json.createby=info.name;
      quiz_json.creater_email=info.email;
    }
    else if(req.signedCookies.token)
    {
      var info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
      quiz_json.createby=info.name;
      quiz_json.creater_email=info.email;
    }
    quiz_json.quiz_id=req.params.id;
    await Teacher.findOne({email:quiz_json.creater_email},async function(err,doc){
      if(doc!==null && !err)
      {
        await Quiz.updateOne({_id:req.params.id},{ $set:{quiz:JSON.stringify(quiz_json)}}, async function(err,q1){
          if(!err)
          {
            console.log("Successfully update Quiz");
          }
          else
          {
            console.log("unsuccessfully update Quiz");
          }
        });
      }
    });
  }
});
router.post('/upload/:id',async function(req,res){
if(req.params.id==='submit')
{
  if(req.cookies.quizquestion!=="null")
  {

    var quiz_json=JSON.parse(req.cookies.quizquestion);
    quiz_json.quiz_start_time=new Date(req.body.quizstarttime)
    quiz_json.quiz_end_time=new Date(req.body.quizendtime)
    quiz_json.quiz_duration=req.body.quizduration;
    quiz_json.quiz_name=req.body.quizname;
    quiz_json.quiz_mark=req.body.quizmark;
    var techerid;
    if(req.cookies.token)
    {
        var info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);
      quiz_json.createby=info.name;
      quiz_json.creater_email=info.email;
    }
    else if(req.signedCookies.token)
    {
      var info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
      quiz_json.createby=info.name;
      quiz_json.creater_email=info.email;
    }
    //{
      await Teacher.findOne({email:quiz_json.creater_email},async function(err,doc){
        if(doc!==null && !err)
        {
          var newInstance=new Quiz(
            {
              name:quiz_json.quiz_name,
              techuserid:doc._id,
                teachusername:doc.name,
                maxstudent:req.body.quizmaxstudent,
                duration:req.body.quizduration,
                mark:req.body.quizmark,
                quiz:JSON.stringify(quiz_json),
                 stdslist:[]
            }

          );
            await newInstance.save(async function(err){
              await Teacher.updateOne({email:quiz_json.creater_email},{ $addToSet: { "quizs":{quizid:newInstance._id}}}, {"new":false,"upsert": true,"safe":true},async function(err,q){
                if(!err)
                {
                    quiz_json.quiz_id=newInstance._id;
                    await Quiz.updateOne({_id:newInstance._id},{ $set:{quiz:JSON.stringify(quiz_json)}}, async function(err,q1){
                      if(!err)
                      {
                        console.log("Successfully update Quiz");
                      }
                      else
                      {
                        console.log("unsuccessfully update Quiz");
                      }
                    });
                }
                else
                {
                 console.log("[Teacher error]",error);
                }
              });
            });
        }
      })
      //}
      res.redirect('/teacher');
  }
  else
  {
  console.log("null obj");
  }
}
else
{
  res.redirect('/teacher');
}
})

module.exports=router;
