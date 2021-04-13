function appendtocol(profileimage,duration,mark,name,quizid,c,teachername,start,end){
  var html=`
    <div class="col-md-4">
    <div class="card profile-card">

  <div class="card-img-block">
    <img class="img-fluid" src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=500&h=650&auto=compress&cs=tinysrgb" alt="Card image cap" id="quizimage${c}">
  </div>

  <div class="card-body pt-5">
    <img src="${profileimage}" alt="profile-image" class="profile" />
    <h5 class="card-title">${teachername}</h5>
    <div class="card-block text-center">
      <h5 class="card-title">${name}</h5>
      <span>Quiz Duration</span>
      <br>
      <span>${duration}</span>
      <br>
      <span> Total Mark:${mark}</span>
      <br>
      <span id="countdown${c}">Time to start</span>
    </div>
    <br>
    <div class="icon-block"><a href="/student/method/quiz?q=startnow&id=${quizid}" id="startnow${c}"><i class="fas fa-pen"></i></a><a href="/student/method/quiz?q=delete&id=${quizid}"> <i class="fas fa-trash"></i></a>
      <a href="/student/method/quiz?q=certificate&id=${quizid}" id="certificate${c}"> <i class="fas fa-certificate"></i></a>
      <a href="/student/method/quiz?q=studentrank&id=${quizid}" id="rank${c}"><i class="fas fa-user-graduate"></i></a>
    </div>
  </div>
</div>
</div>`
return html;
}
var c=1;
if(typeof (json) !=='undefined' || json!==null)
{
  if (typeof (json) === 'object') {
  json_key = json;
}
else if (typeof (json) === 'string')
{
  json_key = JSON.parse(json);
}
if(json_key.length>0){
json_key.forEach(function(value){
  var html=appendtocol(value.teacher_profileurl,value.quiz_duration,value.quiz_mark,value.quizname,value.quizid,c,value.teachername,value.quiz_start_time,value.quiz_end_time);
  $('.container').find('.row').append(html);
c++;
});
c=1
var x=setInterval(function(){
  json_key.forEach(function(value)
  {
    var start=moment(value.quiz_start_time);
    var end=moment(value.quiz_end_time);
    var current=moment(new Date());
if(start.isAfter(current))
{
    current.substract(start);
    var seconds = moment.duration(current).seconds();
    var minutes = moment.duration(current).minutes();
    var hours   = moment.duration(current).hours();
    var days    = moment.duration(current).days();
    $('#countdown'+c).text(`${days}d:${hours}hr:${minutes}min:${seconds}sec`);
    if(!$('#startnow'+c).hasClass('disabled'))
    {
      $('#startnow'+c).addClass('disabled');
      $('#certificate'+c).addClass('disabled');
      $('rank'+c).addClass('disabled');
    }
  }
  else if(start.isBefore(current))
  {
   if(end.isAfter(current))
   $('#countdown'+c).text('Continue');
   else
      $('#countdown'+c).text('Unavailable');

      if($('#startnow'+c).hasClass('disabled'))
      {
        $('#startnow'+c).removeClass('disabled');
        $('#certificate'+c).removeClass('disabled');
        $('rank'+c).removeClass('disabled');
      }
  }
  else
  {
    if($('#startnow'+c).hasClass('disabled'))
    {
      $('#startnow'+c).removeClass('disabled');
      $('#certificate'+c).removeClass('disabled');
      $('rank'+c).removeClass('disabled');
    }
 $('#countdown'+c).text('Start Now');
  }
  c++;
  }
)
c=1;
},1000);

const numItemsToGenerate = json_key.length;

function renderItem(k){
  fetch(`https://source.unsplash.com/1600x900/?book`).then((response)=> {
$('#quizimage'+k).attr('src',response.url);
  });
}
for(let i=1;i<=numItemsToGenerate;i++){
  renderItem(i);
}

}
}
// quizid:{
// type : mongoose.Schema.Types.ObjectId
// },
// quizname:{
// type:String
// },
// quiz_duration:{
// type:String
// },
// quiz_start_time:{
// type:Date
// },
// quiz_end_time:{
// type:Date
// },
// quiz_mark:{
// type:String
// },
// teachername:{
// type:String
// },
// teacher_profileurl:{
// type:String
// }
