const express=require('express');
const routes=express.Router();
const moment=require('moment');
const jwt=require('jsonwebtoken');
const Teacher= require('./teacher');
const Quiz= require('./quiz');
const Student=require('./student');
const isLoggedIn = (req, res, next) => {
    if (req.cookies.token || req.signedCookies.token) {
        next();
    } else {
        return res.redirect('/');
    }
}
routes.get('/',isLoggedIn,async function(req,res){
  await Student.find({"quizs":{ "$elemMatch" :{"quizid": req.query.id}}}, async function(err2,doc2){
    if(JSON.stringify(doc2)==='[]')
    {
      if(req.cookies.token)
      {
       var info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);
       await Quiz.findOne({_id: req.query.id},async function(err,doc){
         if(!err && doc!==null)
         {
           var quiz=JSON.parse(doc.quiz);
           if(typeof (quiz)!=='undefined' && quiz!==null){
             await Teacher.findOne({_id:doc.techuserid},async function(err1,doc1){
               if(!err1 && doc1!==null)
               {
                 await Student.updateOne({email:info.email},{$addToSet:{"quizs":{quizid:doc._id,quizname:doc.name,quiz_duration:doc.duration,quiz_start_time:quiz.quiz_start_time,quiz_end_time:quiz.quiz_end_time,quiz_mark:doc.mark,teachername:doc1.name,teacher_profileurl:doc1.profileUrl}}},{"safe":true,"upsert":true},function(err){
                 if(!err)
                 {
                   res.redirect('/student');
                 }
               })
               }
             })
         }
         }
       })
      }
      else if(req.signedCookies.token)
      {
        var info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
        await Quiz.findOne({_id: req.query.id}, async function(err,doc){
          if(!err && doc!==null)
          {
            var quiz=JSON.parse(doc.quiz);
            if(typeof (quiz)!=='undefined' && quiz!==null){
              await Teacher.findOne({_id:doc.techuserid},async function(err1,doc1){
                if(!err1 && doc1!==null)
                {
                  await Student.updateOne({email:info.email},{$addToSet:{"quizs":{quizid:doc._id,quizname:doc.name,quiz_duration:doc.duration,quiz_start_time:quiz.quiz_start_time,quiz_end_time:quiz.quiz_end_time,quiz_mark:doc.mark,teachername:doc1.name,teacher_profileurl:doc1.profileUrl}}},{"safe":true,"upsert":true},function(err){
                  if(!err)
                  {
                    res.redirect('/student');
                  }
                })
                }
              })
          }
          }
        })
      }
    }
    else
    {
res.redirect('/student');
    }
  })
});
module.exports=routes;
