
var i=0;
var ui=[];
var bool=true;
function generateID()
{
  i++;
}
$('#add-options').on('click',function(){
generateID();
var html=`<div id="eachoption${i}" style="display:inline-block">
        <!--checkbox for options-->
        <div id="option-edit${i}">
        <input class="form-check-input" type="checkbox" value="" id="checkbox-answer${i}" style="margin-top:25px; margin-left:3px;">
        <!--input for options-->
      <input type="text" id="option${i}" name="firstname" placeholder="Enter options"style="width:70%;border: 2px solid lightcoral; margin-left:20px;" >
      <!--image insert button-->
      <button type="button" id="image-insert${i}" onclick="optionImage(${i});">
         <i class="abc fa fa-image fa-lg"></i>
        </button>
        </div>
        <div id="option-image-show${i}" style="display:none">
        <input class="form-check-input" type="checkbox" value="" id="checkbox-answer-image${i}" style="margin-top:30px; margin-right:3px; margin-left:10px;">
        <img  id="option-image-set${i}" width="100px" height="100px" style="margin-left:30px;"></div>
        </div>`
$('.addoption').append(html);
})
$('#delete-options').on('click',function(){
  if(i>=0)
  {
    v=$('.addoption').find('#eachoption'+i)
    //alert($('.addoption').html())
   v.remove();
  if(i!=0)
  {
    i--;
  }
  }
})
var question_image;
function imageUploadforquestion()
{
question_image=prompt("enter the image link");
if(question_image!==null)
{
$("#question-image-set").attr("src",question_image);
  $("#question-image-set").css("display","inline");
}
else{
  alert("No image !!sorry");
}
}
var image_map={};
function optionImage(img)
{
image_map[img]=prompt("enter the image link")
if(image_map[img]!==null){
  $("#option-image-set"+img).attr("src",image_map[img]);
$("#option-edit"+img).css("display","none");
$("#option-image-show"+img).css("display","contents");
}
else{
   alert("No image !!sorry");
}
}
let c=1;
function generatequestion()
{
  return ++c;
}
$('.float').on('click',function(){
  if($('#fname').val()!=='' && $('#fname').val()!==null && $('#marks').val()!=='' && $('#marks').val()!==null)
{
  $("#save-data").css("display","none");
$("#delete-card").css("display","none");
   $('#another-card').animate({
      opacity: 'hide', // animate slideUp
      right: '500px',  // slide left
    }, 1500, 'linear', function() {
      // Check browser support
if (typeof(Storage) !== "undefined") {
  // Store
      var option=[];
      var img;
      var check;
     var opt=$(this).find('.addoption').html();
     for(var k=1;k<=i;k++)
     {
       if(k in image_map)
       {
        img=image_map[k];
        check=$('#option-image-show'+k).find("#checkbox-answer-image"+k).is(':checked');
       }
       else{
         img=null;
         check=$('#eachoption'+k).find('#checkbox-answer'+k).is(':checked');
       }
       var json_opt={
          optionid:k ,
      optionname:$('#eachoption'+k).find('#option'+k).val() ,
      optionimage:img ,
      correct:check
       }
       option.push(json_opt);
     }
var question={
  id:c,
  description:$('#fname').val(),
  image:question_image,
  mark:$('#marks').val(),
  options:option
}
  if(c==2)
  {
  var qus=[];
  qus.push(question);
  var quiz={
    quiz_id:129013,
    quiz_name:'jaisdj',
    quiz_mark:'10',
    quiz_start_time:'9:30AM',
    quiz_duration:'10:0:0:1',
    quiz_end_time:'4:50AM',
    createby:"user_name",
    creater_email:"Debadutta@gmail.com",
    questions:qus
  }
   localStorage.setItem("jsonkey",JSON.stringify(quiz));
  }
  else
  {
var quiz=JSON.parse(localStorage.getItem("jsonkey"));
  quiz.questions.push(question);
   localStorage.setItem("jsonkey",JSON.stringify(quiz));
  }
}
//if browser not support localStorage
else {
  alert("Your browser not support localStorage please reffer another brawser");
}
    ui.push($('.card-body').html());
   $("#question-image-set").css("display","none");
   question_image="";
    $('#fname').val('')
    $('#marks').val('')
     $(this).find('.addoption').html('');
    i=0;
    });
    var generate=generatequestion();
 $("#another-card").animate({
    right:'0%',
   opacity:"show"
   },400, 'linear',function(){
     $('#another-card').find('h4').find('span').text('Create Question No '+generate+".");
       if(c>=3 && bool)
{
      $('.pagination').find("#next").remove();
  question_nav_button=`<li class="page-item" id="question${c-1}"><button class="page-link" id="question-no${c-1}" onclick="toquestion(${c-1})">${c-1}</button></li>
  <li class="page-item" id="next">
      <button class="page-link" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </button>
    </li>`
  $('.pagination').append(question_nav_button);
}
else{
  bool=true;
}
   });
}
else
{
  if($('#fname').val()==='' || $('#fname').val()===null)
  {
alert('enter your Question');
  }
  else
  {
alert('enter your mark');
  }
}
})
var pag=1;
function toquestion(qno)
{
  pag=qno;
  bool=false;
  var item;
  var qus_arr;
  var option_arr;
  $('#another-card').find('h4').text('Create Question No '+qno+".")
$("#save-data").css("display","inline");
$("#delete-card").css("display","inline");
if(typeof(Storage) !== "undefined")
{
$(".card-body").html(ui[qno-1]);
$(".card-body").find("#add-options").attr("onclick","addoption()")
$(".card-body").find("#delete-options").attr("onclick","deleteoption()")
item=JSON.parse(localStorage.getItem("jsonkey"));
qus_arr=item.questions[qno-1];
c=item.questions.length;
option_arr=qus_arr.options;
i=option_arr.length;
$("#fname").val(qus_arr.description);
$('#marks').val(qus_arr.mark);
for(var k=0;k<i;k++)
{
  if(option_arr[k].optionimage!==null)
  {
    if(option_arr[k].correct===true)
  $('#option-image-show'+(k+1)).find("#checkbox-answer-image"+(k+1)).prop('checked', true);
  else
   $('#option-image-show'+(k+1)).find("#checkbox-answer-image"+(k+1)).prop('checked', false);
  }
  else
  {
  if(option_arr[k].correct===true)
  $("#eachoption"+(k+1)).find("#checkbox-answer"+(k+1)).prop('checked', true);
  else
   $("#eachoption"+(k+1)).find("#checkbox-answer"+(k+1)).prop('checked', false);
  $("#eachoption"+(k+1)).find("#option"+(k+1)).val(option_arr[k].optionname);
  }
}
}
else
{
alert("please switch to another browser");
}
$("#save-data").on("click",function(){
if (typeof(Storage) !== "undefined") {
  // Store
       var option=[];
      var img;
      var check;
     var opt=$(this).find('.addoption').html();
     for(var k=1;k<=i;k++)
     {
       if(k in image_map)
       {
        img=image_map[k];
        check=$('#option-image-show'+k).find("#checkbox-answer-image"+k).is(':checked');
       }
       else{
         img=null;
         check=$('#eachoption'+k).find('#checkbox-answer'+k).is(':checked');
       }
       var json_opt={
          optionid:k ,
      optionname:$('#eachoption'+k).find('#option'+k).val() ,
      optionimage:img ,
      correct:check
       }
       option.push(json_opt);
     }
var question={
  id:c,
  description:$('#fname').val(),
  mark:$('#marks').val(),
  image:question,
  options:option
}
var quiz=JSON.parse(localStorage.getItem("jsonkey"));
  quiz.questions[qno-1]=question;
   localStorage.setItem("jsonkey",JSON.stringify(quiz));
  }
  else{
    alert("switch to another brawser");
  }
ui[qno-1]=$(".card-body").html();
})

$("#delete-card").on("click",function(){
if (typeof(Storage) !== "undefined") {
var quiz=JSON.parse(localStorage.getItem("jsonkey"));
//$(".card").slideUp();
quiz.questions.splice(qno-1,1);
ui.splice(qno-1,1);
if(quiz.questions.length>0)
{
  
  localStorage.setItem("jsonkey",JSON.stringify(quiz));
  if(qno-1>0)
  {
    $('.pagination').find("#question"+(quiz.questions.length+1)).find("#question-no"+(quiz.questions.length+1)).remove();
    toquestion(qno-1);
  }
}
else{
localStorage.removeItem("jsonkey");
ui=[];
$("#fname").val("");
$('#marks').val("");
$(".card-body").find('.addoption').html("");
 $("#save-data").css("display","none");
$("#delete-card").css("display","none");
}
}
else{
alert("switch to another brawser");
}
})
}
function addoption()
{
  generateID();
var html=`<div id="eachoption${i}" style="display:inline-block">
        <!--checkbox for options-->
        <div id="option-edit${i}">
        <input class="form-check-input" type="checkbox" value="" id="checkbox-answer${i}" style="margin-top:25px; margin-left:3px;">
        <!--input for options-->
      <input type="text" id="option${i}" name="firstname" placeholder="Enter options"style="width:70%;border: 2px solid lightcoral; margin-left:20px;" >
      <!--image insert button-->
      <button type="button" id="image-insert${i}" onclick="optionImage(${i});">
         <i class="abc fa fa-image fa-lg"></i>
        </button>
        </div>
        <div id="option-image-show${i}" style="display:none">
        <input class="form-check-input" type="checkbox" value="" id="checkbox-answer${i}" style="margin-top:30px; margin-right:3px; margin-left:10px;">
        <img  id="option-image-set${i}" width="100px" height="100px" style="margin-left:30px;"></div>
        </div>`
$(".card-body").find('.addoption').append(html);
}
function deleteoption()
{
  if(i>=0)
  {
    v=$('.addoption').find('#eachoption'+i)
    //alert($('.addoption').html())
   v.remove();
  if(i!=0)
  {
    i--;
  }
  }
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    localStorage.removeItem('jsonkey');
}
$('#submit-quiz').on('click',function(){
  if (typeof(Storage) !== "undefined") {
if(typeof(localStorage.getItem('jsonkey')) !== null)
{
  setCookie('quizquestion',localStorage.getItem("jsonkey"),1);
  window.location.href=window.location.href+'/upload';
}
else
{
    window.location.href=window.location.href;

}
  }
  else {
    alert('sorry plz switch to another browser');
  }
})
