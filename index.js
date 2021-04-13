const express = require("express")
require('dotenv').config()
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const facebookStrategy = require('passport-facebook').Strategy
const cookieSession = require('cookie-session')
const app = express()
const passport = require("passport")
const mongoose = require("mongoose")
app.use(express.static(__dirname + '/public'));
const path = require('path');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
require('./authenticate');
require('./facebookauth');
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2'],
  secret: 's9S=USPLz1cr-SWl8#7_Pr$1$bIvlj=Di1*$4r9mOnA',
  maxAge: new Date(Date.now() + 900000),
  httpOnly: true
}))
mongoose.connect('mongodb+srv://debadutta_91:DBP123.,@cluster0.pf62y.mongodb.net/userDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('sw*TRub?3e=lzl$l1@vo#rlth'));
// assign tech and student shema
const Teacher = require('./routes/teacher');
const Student = require('./routes/student');
const Quiz = require('./routes/quiz');
// define teacher outes
const teacherSettings = require('./routes/techerSpecific');
app.use("/teacher/createquiz", teacherSettings);
const teacherdelete = require('./routes/teacherdelete');
app.use("/teacher/delete", teacherdelete);
const studentmarkSheet = require('./routes/studentMarkSheet');
app.use('/teacher/marksheet', studentmarkSheet);
const studentspecific = require('./routes/studentSpecific');
app.use('/student/:id', studentspecific);
const addQuiz = require('./routes/addquiz');
app.use('/student/add', addQuiz);
const marksheet = require('./routes/studentMarkSheet');
app.use('/student/marksheet', marksheet);









app.get('/student/profile', async function(req, res) {
  var info;
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/student');
  }
  if (typeof(info) !== 'undefined') {
    await Student.findOne({
      email: info.email
    }, function(err, doc) {
      if (!err)
        res.render('userProfile', {
          userinfo: JSON.stringify({
            type: 'student',
            name: doc.name,
            email: doc.email,
            city: doc.city,
            working: doc.school,
            gender: doc.gender,
            profile: doc.profileUrl,
            phone: doc.phone
          })
        });
    })
  }
});
app.get('/teacher/profile', async function(req, res) {
  var info;
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/teacher');
  }
  if (typeof(info) !== 'undefined') {
    await Teacher.findOne({
      email: info.email
    }, function(err, doc) {
      if (!err)
        res.render('userProfile', {
          userinfo: JSON.stringify({
            type: 'teacher',
            name: doc.name,
            email: doc.email,
            city: doc.city,
            working: doc.school,
            gender: doc.gender,
            profile: doc.profileUrl,
            phone: doc.phone
          })
        });
    })
  }
});
app.get('/teacher/settings', async function(req, res) {
  var info;
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/teacher');
  }
  await Teacher.findOne({
    email: info.email
  }, function(err, doc) {
    if (!err) {
      res.render('userSettings', {
        userinfo: JSON.stringify({
          name: doc.name,
          email: doc.email,
          city: doc.city,
          type: 'teacher'
        })
      });
    }
  })
});
app.get('/student/settings', async function(req, res) {
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/student');
  }
  await Student.findOne({
    email: info.email
  }, function(err, doc) {
    if (!err) {
      res.render('userSettings', {
        userinfo: JSON.stringify({
          name: doc.name,
          email: doc.email,
          city: doc.city,
          image: doc.profileUrl,
          type: 'student'
        })
      });
    }
  })
});
app.post('/student/settings/save', async function(req, res) {
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/student');
  }
  var gender, fname, lname, address, waddress, con, phone;
  if (req.body.male) {
    gender = 'Male';
  } else if (req.body.female) {
    gender = 'Female'
  } else if (req.body.trans) {
    gender = 'TransGender';
  }
  fname = req.body.firstname;
  lname = req.body.lastname;
  address = req.body.address;
  con = req.body.country;
  waddress = req.body.working;
  phone = req.body.phone;
  if ((gender !== null && gender !== '' && typeof(gender) !== 'undefined') &&
    (fname !== null && fname !== '' && typeof(fname) !== 'undefined') &&
    (lname !== null && lname !== '' && typeof(lname) !== 'undefined') &&
    (address !== null && address !== '' && address !== 'undefined') &&
    (con !== null && con !== '' && con !== 'undefined') &&
    (waddress !== null && waddress !== '' && waddress !== 'undefined') &&
    (phone !== null && phone !== '' && phone !== 'undefined')
  ) {
    await Student.updateOne({
      email: info.email
    }, {
      $set: {
        name: fname + ' ' + lname,
        city: address + ' ' + ',' + con,
        school: waddress,
        gender: gender,
        phone: phone
      }
    }, {
      "safe": true,
      "upsert": true
    }, function(err) {
      if (!err) {
        res.redirect('/student/profile');
      }

    });
  } else {
    res.redirect('/student/settings')
  }

});
app.post('/teacher/settings/save', async function(req, res) {
  if (req.cookies.token) {
    info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
  } else if (req.signedCookies.token) {
    info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
  } else {
    res.redirect('/teacher');
  }
  var gender, fname, lname, address, waddress, con;
  if (req.body.male) {
    gender = 'Male';
  } else if (req.body.female) {
    gender = 'Female'
  } else if (req.body.trans) {
    gender = 'Other';
  }
  fname = req.body.firstname;
  lname = req.body.lastname;
  address = req.body.address;
  con = req.body.country;
  waddress = req.body.working;
  phone = req.body.phone;
  if ((gender !== null && gender !== '' && typeof(gender) !== 'undefined') &&
    (fname !== null && fname !== '' && typeof(fname) !== 'undefined') &&
    (lname !== null && lname !== '' && typeof(lname) !== 'undefined') &&
    (address !== null && address !== '' && address !== 'undefined') &&
    (con !== null && con !== '' && con !== 'undefined') &&
    (waddress !== null && waddress !== '' && waddress !== 'undefined') &&
    (phone !== null && phone !== '' && phone !== 'undefined')
  ) {
    await Teacher.updateOne({
      email: info.email
    }, {
      $set: {
        name: fname + ' ' + lname,
        city: address + ' ' + ',' + con,
        school: waddress,
        gender: gender,
        phone: phone
      }
    }, {
      "safe": true,
      "upsert": true
    }, function(err) {
      if (!err) {
        res.redirect('/teacher/profile');
      }

    });
  } else {
    res.redirect('/teacher/settings')
  }


});
app.get('/teacher/logout',function(req,res){
  res.clearCookie('token');
  res.redirect('/');
});
app.get('/student/logout',function(req,res){
  res.clearCookie('token');
  res.redirect('/');
})

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email,user_photos,user_hometown,user_gender'
}));

app.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/choice',
    failureRedirect: '/'
  }));


const isLoggedIn = (req, res, next) => {
  if (req.cookies.token || req.signedCookies.token) {
    next();
  } else {
    return res.redirect('/');
  }
}
//teacher root
app.get('/teacher', isLoggedIn, async function(req, res) {
  if (req.cookies.token) {
    var info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
    await Teacher.findOne({
      email: info.email
    }, async function(err, doc) {
      if (doc !== null && !err) {
        res.cookie('profileinfo', JSON.stringify({
          name: info.name,
          profileimage: doc.profileUrl
        }), {
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: false
        });
        await Quiz.find({
          techuserid: doc._id
        }, async function(err1, quiz) {
          if (!err1 && quiz !== null) {
            var json_quiz = [];
            var c = 0;
            quiz.forEach(function(value) {
              json_quiz.push({
                id: String(value._id),
                maxstudent: value.maxstudent,
                mark: value.mark,
                appear_len: value.stdslist.length,
                duration: value.duration,
                name: value.name
              });
            })
            res.render('teacher', {
              quiz_json: JSON.stringify(json_quiz)
            });
          }
        });
      }
    });
  } else if (req.signedCookies.token) {

    var info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
    await Teacher.findOne({
      email: info.email
    }, async function(err, doc) {
      if (doc !== null && !err) {
        res.cookie('profileinfo', JSON.stringify({
          name: info.name,
          profileimage: doc.profileUrl
        }), {
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: false
        });
        await Quiz.find({
          techuserid: doc._id
        }, async function(err1, quiz) {
          if (!err1 && quiz !== null) {
            var json_quiz = [];
            var c = 0;
            quiz.forEach(function(value) {
              json_quiz.push({
                id: String(value._id),
                maxstudent: value.maxstudent,
                mark: value.mark,
                appear_len: value.stdslist.length,
                duration: value.duration,
                name: value.name
              });
            })
            res.render('teacher', {
              quiz_json: JSON.stringify(json_quiz)
            });
          }
        })
      }
    })

  }
})
app.get('/student', isLoggedIn, async function(req, res) {
  if (req.cookies.token) {
    var info = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
    await Student.findOne({
      email: info.email
    }, async function(err, doc) {
      if (!err && doc !== null) {
        res.cookie('profileinfo', JSON.stringify({
          name: info.name,
          profileimage: doc.profileUrl
        }), {
          maxAge: 2 * 60 * 60 * 1000,
          httpOnly: false
        });
        res.render("student", {
          json_key1: JSON.stringify(doc.quizs)
        });
      } else {
        res.render('student', {
          json_key1: undefined
        });
      }
    });
  } else if (req.signedCookies.token) {
    var info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
    await Student.findOne({
      email: info.email
    }, async function(err, doc) {
      var info = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
      if (!err && doc !== null) {
        res.cookie('profileinfo', JSON.stringify({
          name: info.name,
          profileimage: doc.profileUrl
        }), {
          maxAge: 2 * 60 * 60 * 1000,
          httpOnly: false
        });
        res.render("student", {
          json_key1: JSON.stringify(doc.quizs)
        });
      } else {
        res.render('student', {
          json_key1: undefined
        });
      }
    });
  }
});

app.get('/choice/teacher', async function(req, res) {
  if (typeof(req.user)!=='undefined' && req.user.provider === 'google') {
    await Teacher.findOne({
      email: req.user.email
    }, async function(err, doc) {
      if (doc == null && !err) {
        var newinstance = new Teacher({
          name: req.user.displayName,
          email: req.user.email,
          city: '',
          school: '',
          password: req.user.displayName,
          phone: '',
          gender: '',
          profileUrl: req.user.picture,
          token: jwt.sign({
            email: req.user.email,
            name: req.user.displayName,
            type: 'teacher',
            method: 'google'
          }, process.env.JWT_SECRETKEY),
          quizs: []
        });
        await newinstance.save();
        res.cookie('token', jwt.sign({
          email: req.user.email,
          name: req.user.displayName,
          type: 'teacher',
          method: 'google'
        }, process.env.JWT_SECRETKEY), {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/teacher');
      } else {
        res.cookie('token', doc.token, process.env.JWT_SECRETKEY, {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/teacher');
      }
    })
  } else if (typeof(req.user)!=='undefined' && req.user.provider === 'facebook') {
    //  console.log(req.user);
    await Teacher.findOne({
      email: req.user.emails[0].value
    }, async function(err, doc) {
      if (doc == null && !err) {
        var newinstance = new Teacher({
          name: req.user.displayName,
          email: req.user.emails[0].value,
          city: req.user._json.hometown.name,
          school: '',
          password: req.user.displayName,
          phone: '',
          gender: req.user.gender,
          profileUrl: req.user.photos[0].value,
          token: jwt.sign({
            email: req.user.emails[0].value,
            name: req.user.displayName,
            type: 'teacher',
            method: 'facebook'
          }, process.env.JWT_SECRETKEY),
          quizs: []
        });
        await newinstance.save();
        res.cookie('token', jwt.sign({
          email: req.user.emails[0].value,
          name: req.user.displayName,
          type: 'teacher',
          method: 'facebook'
        }, process.env.JWT_SECRETKEY), {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/teacher');
      } else {
        res.cookie('token', doc.token, process.env.JWT_SECRETKEY, {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/teacher');
      }
    })
  }

})
//student root
app.get('/choice/student', async function(req, res) {
  if (typeof(req.user)!=='undefined' && req.user.provider === 'google') {
    await Student.findOne({
      email: req.user.email
    }, async function(err, doc) {
      if (doc == null && !err) {
        var newinstance = new Student({
          name: req.user.displayName,
          email: req.user.email,
          city: '',
          school: '',
          password: req.user.displayName,
          phone: '',
          gender: '',
          profileUrl: req.user.picture,
          token: jwt.sign({
            email: req.user.email,
            name: req.user.displayName,
            type: 'student',
            method: 'google'
          }, process.env.JWT_SECRETKEY),
          quizs: []
        });
        await newinstance.save();
        res.cookie('token', jwt.sign({
          email: req.user.email,
          name: req.user.displayName,
          type: 'student',
          method: 'google'
        }, process.env.JWT_SECRETKEY), {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/student');
      } else {
        res.cookie('token', doc.token, process.env.JWT_SECRETKEY, {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/student');
      }
    })
  }
  //request for fb user
  else if (typeof(req.user)!=='undefined' && req.user.provider === 'facebook') {
    await Student.findOne({
      email: req.user.emails[0].value
    }, async function(err, doc) {
      if (doc == null && !err) {
        var newinstance = new Student({
          name: req.user.displayName,
          email: req.user.emails[0].value,
          city: req.user._json.hometown.name,
          school: '',
          password: req.user.displayName,
          phone: '',
          gender: req.user.gender,
          profileUrl: req.user.photos[0].value,
          token: jwt.sign({
            email: req.user.emails[0].value,
            name: req.user.displayName,
            type: 'student',
            method: 'facebook'
          }, process.env.JWT_SECRETKEY),
          quizs: []
        });
        await newinstance.save();
        res.cookie('token', jwt.sign({
          email: req.user.emails[0].value,
          name: req.user.displayName,
          type: 'student',
          method: 'facebook'
        }, process.env.JWT_SECRETKEY), {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/student');
      } else {
        res.cookie('token', doc.token, process.env.JWT_SECRETKEY, {
          signed: true,
          maxAge: 2 * 60 * 60 * 100,
          httpOnly: true
        });
        res.redirect('/student');
      }
    })
  }
})


app.get('/choice', (req, res) => {
  res.sendFile(__dirname + "/public/html/choice.html");
})

// Auth Routes
app.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home
    res.redirect('/choice');
  }
);



//main root page

app.get("/", function(req, res) {
  if (req.signedCookies.token) {
    var verify = jwt.verify(req.signedCookies.token, process.env.JWT_SECRETKEY);
    res.redirect(`/${verify.type}`)
  } else if (req.cookies.token) {
    var verify = jwt.verify(req.cookies.token, process.env.JWT_SECRETKEY);
    res.redirect(`/${verify.type}`)
  } else {
    res.sendFile(__dirname + "/public/html/index.html");
  }
})
app.get('/signin/newteacher',function(req,res){
res.sendFile(__dirname+"/public/html/signin.html");
});
app.get('/signin/newstudent',function(req,res){
res.sendFile(__dirname+"/public/html/signin.html");
});
app.get('/signup/newteacher',function(req,res){
res.sendFile(__dirname+"/public/html/signup.html");
});
app.get('/signup/newstudent',function(req,res){
res.sendFile(__dirname+"/public/html/signup.html")
});
//signin teacher
app.post('/singin/teacher', async function(req, res) {
  await Teacher.findOne({
    email: req.body.uemail
  }, function(err, doc) {
    if (doc != null && !err) {
      doc.comparePassword(req.body.upassword, function(err, isMatch) {
        if (err) {
          res.redirect('/');
        } else {
          if (isMatch) {
            res.cookie('token', doc.token, {
              signed: true,
              maxAge: 2 * 60 * 60 * 100,
              httpOnly: true
            });
            res.redirect('/teacher');
          } else {
            res.redirect('/');
          }
        }
      });
    } else {
      res.redirect('/');
    }
  })
})
//signin student
app.post('/singin/student', async function(req, res) {

  await Student.findOne({
    email: req.body.uemail
  }, function(err, doc) {
    if (doc != null && !err) {
      doc.comparePassword(req.body.upassword, function(err, isMatch) {
        if (err) {
          res.redirect('/');
        } else {
          if (isMatch) {
            res.cookie('token', doc.token, {
              signed: true,
              maxAge: 2 * 60 * 60 * 100,
              httpOnly: true
            });
            console.log('heeret1');
            res.redirect('/student');
          } else {
            console.log('heere3');
            res.redirect('/');
          }
        }
      });
    } else {
      console.log(doc);
 res.redirect('/');
    }
  })
})

// signup teacher
app.post('/signup/teacher', async function(req, res) {
  await Teacher.findOne({
    email: req.body.email
  }, async function(err, doc) {
    if (doc == null && !err) {
      var newinstance = new Teacher({
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        school: req.body.school,
        password: req.body.password,
        phone: req.body.phone,
        gender: '',
        profileUrl: 'https://png.pngtree.com/png-vector/20190225/ourlarge/pngtree-vector-avatar-icon-png-image_702436.jpg',
        token: jwt.sign({
          email: req.body.email,
          name: req.body.name,
          type: 'teacher',
          method: 'webform'
        }, process.env.JWT_SECRETKEY),
        quizs: []
      });
      await newinstance.save();
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  })
})
//signup student
app.post('/signup/student', async function(req, res) {
  await Student.findOne({
    email: req.body.email
  }, async function(err, doc) {
    if (doc == null && !err) {
      var newinstance = new Student({
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        school: req.body.school,
        password: req.body.password,
        phone: req.body.phone,
        gender: '',
        profileUrl: 'https://png.pngtree.com/png-vector/20190225/ourlarge/pngtree-vector-avatar-icon-png-image_702436.jpg',
        token: jwt.sign({
          email: req.body.email,
          name: req.body.name,
          type: 'student',
          method: 'webform'
        }, process.env.JWT_SECRETKEY),
        quizs: []
      });
      await newinstance.save();
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  })
})
app.listen((process.env.PORT || 3000), function(req, res) {
  console.log("connect");
})
