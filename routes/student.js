const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
mongoose.connect('mongodb+srv://debadutta_91:DBP123.,@cluster0.pf62y.mongodb.net/userDB?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true});
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
  console.log("Successfully connected to MongoDB!");
});

var student_table=new mongoose.Schema({
  name:
  {
    type:String,
    required:true
  },
  email:
  {
    type:String,
    required:true
  },
  city:
  {
    type:String
  },
  school:
  {
    type:String
  },
  password:
  {
    type:String,
    minLength:6
  },
  phone:
  {
    type:Number
  },
  gender:
  {
    type:String
  },
  profileUrl:{
    type:String
  },
  token:
  {
    type:String,
    required:true
  },
  quizs:
  [
    {
      quizid:{
      type : mongoose.Schema.Types.ObjectId
    },
    quizname:{
      type:String
    },
    quiz_duration:{
      type:String
    },
    quiz_start_time:{
      type:Date
    },
    quiz_end_time:{
      type:Date
    },
    quiz_mark:{
      type:String
    },
    teachername:{
      type:String
    },
    teacher_profileurl:{
      type:String
    }
  }
  ]
});
student_table.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

student_table.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
module.exports =mongoose.model("Student",student_table);
