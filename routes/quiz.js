const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://debadutta_91:DBP123.,@cluster0.pf62y.mongodb.net/userDB?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true});
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
  console.log("Successfully connected to MongoDB!");
});
var quiz_table=new mongoose.Schema({
  name:
  { type:String,
    required:true},

    techuserid:{
      type:String,
      required:true
    },
    teachusername:{
      type:String,
      required:true
    },
    maxstudent:
    { type:String},
    duration:{
      type:String,
     required:true
   },
   mark:{
     type:String,
     required:true
   },
   quiz:{
     type:String,
     required:true
   },
 stdslist:
   [{
     stdname:{
       type:String
     },
     stdmark:{
       type:String
     },
     stdemail:{
       type:String
     }
   }]

});
module.exports=mongoose.model("Quiz",quiz_table);
