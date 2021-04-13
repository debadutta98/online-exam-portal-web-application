const express=require('express');
const routes=express.Router();
const moment=require('moment');
const jwt=require('jsonwebtoken');
const Teacher= require('./teacher');
const Quiz= require('./quiz');
const Student=require('./student');
routes.get('/quiz',async function(req,res){
var query =req.query;

  if(query.q === 'startnow'){
        await Quiz.findOne({_id:query.id},function(err,doc){
    if(!err){
      var quiz_json=JSON.parse(doc.quiz);
      var sat=moment(quiz_json.quiz_start_time).format('hh:mm a');
      var end=moment(quiz_json.quiz_end_time).format('hh:mm a');
      var date=moment(new Date()).format('DD-MM-YYYY');
      var noq=quiz_json.questions.length;
        res.render('quizInstruction',{quizname:doc.name,mark:doc.mark,duration:doc.duration,noquestion:noq,starttime:sat,endtime:end,datetime:date});
    }
    })
  }
  else if(query.q === 'delete')
  {
    var info;
    if(req.cookies.token)
    {
      info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);

    }
    else if(req.signedCookies.token)
    {
      info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
    }
    else
    {
      res.redirect('/');
    }
    if(typeof(info)!=='undefined')
    {
     await Student.updateOne({email:info.email},{$pull : {"quizs":{ quizid:query.id}}},{ safe: true, upsert: true , useFindAndModify:false},function(err,doc1)
     {
       if(!err)
       {
         res.redirect('/student');
       }
     });
   }
  }
  else if(query.q === 'certificate')
  {
        var info;
        if(req.cookies.token)
        {
          info=jwt.verify(req.cookies.token,process.env.JWT_SECRETKEY);

        }
        else if(req.signedCookies.token)
        {
          info=jwt.verify(req.signedCookies.token,process.env.JWT_SECRETKEY);
        }
        else
        {
          res.redirect('/');
        }
        if(typeof(info)!=='undefined')
        {
        await Quiz.findOne({_id:query.id},async function(err,doc){
          if(!err && doc!==null)
          {
            var bool=false;
            var teachername,totalmark,starttime,studentname,studentmark,quizname;
            techername=doc.teachusername;
            totalmark=doc.mark;
            quizname=doc.name;
            starttime=JSON.parse(doc.quiz).quiz_start_time;


            doc.stdslist.forEach(function(value){
              console.log(value.stdemail,info.email);
              if(value.stdemail===info.email)
              {
                studentname=value.stdname;
                studentmark=value.stdmark;
                bool=true;

                return;
              }
            });
            if(bool)
            {
              if(typeof(studentmark)!=='undefined' && typeof(studentname)!=='undefined' && typeof(techername)!=='undefined')
              {
                var stdper=(studentmark/totalmark)*100;
                if(stdper>60)
                {
                  res.render('certificate',{information:JSON.stringify({stdname:studentname,stdmark:studentmark,techname:  techername,quiz:quizname,start:starttime,percentage:stdper})})
                }
                else
                {
                  res.render('failure',{studentinfo:JSON.stringify({stdmark:studentmark,mark:totalmark,percentage:stdper})})
                }
              }
            }
            else
            {
              var mark=req.cookies.client_mark.spli('/');

              if(typeof(info)!=='undefined' && info!==null && typeof(mark)!=='undefined' && JSON.stringify(mark)!=='[]' && mark[1]===query.id)
              {
              await Quiz.updateOne({_id:query.id},{$addToSet:{"stdslist":{stdname:info.name,stdmark:mark[0],stdemail:info.email}}},{"safe":true,"upsert":true},function(err){
                if(!err)
                {
                  var stdper=(mark[0]/totalmark)*100;
                  if(stdper>60)
                  {

                    res.render('certificate',{information:JSON.stringify({stdname:info.name,stdmark:mark[0],techname:techername,quiz:quizname,start:starttime,percentage:stdper})});
                  }
                  else
                  {
                    res.render('failure',{studentinfo:JSON.stringify({stdmark:mark[0],mark:totalmark,percentage:stdper})});
                  }
                }
              });
            }
            else
            {
              res.redirect('/student');
            }
            }
          }
        });
}
      }

  else if(query.q === 'studentrank')
  {
    await Quiz.findOne({_id:query.id},function(err,doc){
      if(!err)
      {
        res.render('studentrank',{rankcard:JSON.stringify(doc.stdslist),fullmark:doc.mark});
      }
    });
  }
});
routes.get('/startquiz', async function(req,res){
await Quiz.findOne({_id:req.query.id},function(err,doc){
  if(!err && doc!=null)
  {
    res.render("quizFont",{jsonobj:doc.quiz});
  }
  else
  {
console.log(req.query);
  }
});
});
module.exports=routes;
