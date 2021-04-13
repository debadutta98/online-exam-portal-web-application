

$(window).on('blur', function () {
	var win = window.open("/html/angryTeacher.html", "_self");
	win.close();
});
var index=0;
var studentmark=0;
var quiz_question;
if(typeof(quiz)==='object')
{
	quiz_question=quiz;
}
if(typeof(quiz)==='string')
{
	quiz_question=JSON.parse(quiz);
}
var elem = document.documentElement;
function openFullscreen()
{
	$('.initial').css('display', 'none');
	$('.quiz').css('display','grid');
	if(typeof (quiz_question)!=='undefined' && quiz_question.questions.length>0 && quiz_question.questions.length-1>=index){
		showQuestion(quiz_question.questions[index]);
	}
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
if (document.addEventListener)
{
 document.addEventListener('fullscreenchange', exitHandler, false);
 document.addEventListener('mozfullscreenchange', exitHandler, false);
 document.addEventListener('MSFullscreenChange', exitHandler, false);
 document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
 if (document.webkitIsFullScreen === false || document.mozFullScreen === false || document.msFullscreenElement === false)
 {
	 $('.initial').css('display', 'block');
	 $('.initial').find('.btn').text('continue test');
	 $('.quiz').css('display','none');
$('.quiz_body').find('#questions').html('');
  ///fire your event
 }
}
function showQuestion(obj)
{
	$('.name').text(`${index+1}/${quiz_question.questions.length}`)
	var html=`<h4>${index+1}.</h4>`;
	if(obj.description!==null)
	{
		html=html+`<div id="module" class="container">
			  <p class="collapse" id="collapseExample" aria-expanded="false" style="font-family: 'Lato', sans-serif;">
				${obj.description}
			  <br>`;
	}
	else
	{
		html+=`<div id="module" class="container">
			  <p class="collapse" id="collapseExample" aria-expanded="false" style="font-family: 'Lato', sans-serif;">`;
	}
	if(obj.image!==null && typeof (obj.image)!=='undefined')
	{

		html+=`	  <span class="pop">
			  <img src='${obj.image}' class="img-thumbnail" alt="question-image"  width="20%" height="20%">
			  </span>
			  </p>
				  <a role="button" class="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>
				</div>`
	}
	else
	{
		html+=`</p> <a role="button" class="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>
						</div>`;
	}
	html+='<div class="row">';
 var total=obj.options.length;
 var i=1;
var asci=64;
var count=0;
var app='';

obj.options.forEach(function(value)
{

if(count>1)
{
	count=0;
}
if(count===0)
{
	var ch=String.fromCharCode(++asci);
	if(value.optionimage===null || typeof(value.optionimage)==='undefined'){
		app+=`  <div class="col-md-6">
	    <div class="option_group col-md-12">

	              <div class="option" id='option${i}'>${value.optionname}</div>`
							}
	else
	{
		app+=` <div class="col-md-6">
	    <div class="option_group col-md-12">

			 <label>
				<input type="radio" name="product" class="card-input-element" id='imageoption${i}'/>

					<div class="panel panel-default card-input">
						<div class="panel-heading">

							<img src="${value.optionimage}" class="img-thumbnail" alt="question-image" width="100%" height="100%">

							</div>
					</div>

			</label>`
	}
	if(i==total)
	{
		app+=`</div></div>`;
		html+=app;
	}
}
else if(count===1)
{
		var ch=String.fromCharCode(++asci);
	if(value.optionimage===null || typeof(value.optionimage)==='undefined')
	{
		app+=`

	              <div class="option" id='option${i}'>${value.optionname}</div>`

	}
	else
	{
		app+=`

			 <label>
				<input type="radio" name="product" class="card-input-element" id='imageoption${i}'/>

					<div class="panel panel-default card-input">
						<div class="panel-heading">

							<img src="${value.optionimage}" class="img-thumbnail" alt="question-image" width="100%" height="100%">

							</div>
					</div>

			</label>`;
	}
app+=`</div></div>`;
html+=(app);
app='';
}
count++;
i++;
});
html+='</div>';
$('.quiz_body').find('#questions').append(html);
toggleActive();
}


function toggleActive() {
  let option = document.querySelectorAll("row");
var imgcount=$("img").children().length;
$('.pop').on('click', function() {
	$('.imagepreview').attr('src', $(this).find('img').attr('src'));
	$('#imagemodal').modal('show');
});
var i=1;
var correct=0;
var image=[];
var op=[];
	quiz_question.questions[index].options.forEach(function(value) {
		if(value.optionimage!==null && typeof (value.optionimage)!=='undefined')
		{
			image.push(i)
		}
		else
		{
			op.push(i);
		}
		if(value.correct===true)
		{
			correct++;
		}
	i++;
	})
	if(correct>1)
	{
		$('#information').css('display','inline');
		for(var j=0;j<image.length;j++)
		{
			$('#imageoption'+image[j]).on('click',function()
			{
				$(this).prop('checked',true);
			});
			$('#imageoption'+image[j]).on('dblclick',function()
			{
				$(this).prop('checked',false);
			})
		}
		for(var j=0;j<op.length;j++)
	 {
		 $('#option'+op[j]).on('click',function()
		 {
			 $(this).addClass('active');
		 });
		 $('#option'+op[j]).on('dblclick',function()
		 {
			 if($(this).hasClass('active'))
			 $(this).removeClass('active');
		 })
	 }
	}
	else
	{

		for(var j=0;j<image.length;j++)
 	 {
 		 $('#imageoption'+image[j]).on('click',function()
 		 {

			 for(var k=0;k<op.length;k++)
			 {
				 if($('#option'+op[k]).hasClass('active'))
				 {
					  $('#option'+op[k]).removeClass('active');
				 }
			 }
			 for(var k=0;k<image.length;k++)
			 {
				 if('imageoption'+image[k]!==$(this).attr('id') && $('imageoption'+image[k]).prop('checked'))
				 {
					 $('#imageoption'+image[k]).prop('checked',false);
				 }
			 }
 			 $(this).prop('checked',true);
 		 });
 	 }
	 for(var j=0;j<op.length;j++)
	{

		$('#option'+op[j]).on('click',function()
		{
				$(this).addClass('active');

			for(var k=0;k<op.length;k++)
			{
				if('option'+op[k] !== $(this).attr('id') && $('#option'+op[k]).hasClass('active'))
				{

						$('#option'+op[k]).removeClass('active');

				}
			}
			for(var k=0;k<image.length;k++)
			{
				if($('#imageoption'+image[k]).prop('checked'))
				{
					$('#imageoption'+image[k]).prop('checked',false);
				}
			}
		});
	}
	}

}
function setCookie(name,value,days)
{
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function next()
{
if(index<=quiz_question.questions.length-1)
{
	var correct=[];
	var i=1;
	var img=[]
	quiz_question.questions[index].options.forEach(function(value) {
	    if(value.correct===true && value.optionimage===null)
			{
				correct.push(i);
			}
			else if(value.correct===true && value.optionimage!==null)
			{
				img.push(i);
			}
			i++;
	})
	if(correct.length+img.length>1)
	{
		var c=0;
		for(var j=0;j<img.length;j++)
		{
			if($('#imageoption'+img[j]).prop('checked'))
			{
				c++;
			}
		}
		for(var j=0;j<correct.length;j++)
		{
			if($('#option'+correct[j]).hasClass('active'))
			{
				c++;
			}
		}
		if(c==correct.length+img.length)
		{
			studentmark++;
		}
	}
	else
	{
		if(correct.length>0)
		{
			for(var j=0;j<correct.length;j++)
			{
				if($('#option'+correct[j]).hasClass('active'))
				{
					studentmark++;
				}
			}
		}
		else if(img.length>0)
		{
			for(var j=0;j<img.length;j++)
			{
				if($('#option'+img[j]).prop('checked'))
				{
					studentmark++;
				}
			}
		}
	}
	index++;
	if(index<=quiz_question.questions.length-1)
	{
			showquestion(index);
	}
	else
	{
  var percent=(studentmark/quiz_question.quiz_mark)*100;
	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('id');
	setCookie('client_mark',`${studentmark}/${myParam}`,1);
		///student/method/quiz?q=certificate&id=${quizid}
		if(!window.location.hostname.includes('.com') && window.location.protocol!== 'https:')
		{
		window.location.href=window.location.protocol + '//' + window.location.hostname +':'+window.location.port+ "/student"+'/method'+`/quiz?q=certificate&id=${quiz_question.quiz_id}`;
	 }
	else
	{
			window.location.href=window.location.protocol + '//' + window.location.hostname+  "/student"+'/method'+`/quiz?q=certificate&id=${quiz_question.quiz_id}`;
	}


	}
}
else
{
	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('id');
setCookie('client_mark',`${studentmark}/${myParam}`,1);

		///student/method/quiz?q=certificate&id=${quizid}
		if(!window.location.hostname.includes('.com') && window.location.protocol!== 'https:')
		{
		window.location.href=window.location.protocol + '//' + window.location.hostname +':'+window.location.port+ "/student"+'/method'+`/quiz?q=certificate&id=${quiz_question.quiz_id}`;
	 }
	else
	{
			window.location.href=window.location.protocol + '//' + window.location.hostname+  "/student"+'/method'+`/quiz?q=certificate&id=${quiz_question.quiz_id}`;
	}
}


}

let set=setInterval(function(){
	var currenttime=moment(new Date());
	var endtime=moment(quiz_question.quiz_end_time);
if(currenttime.isAfter(endtime))
{
//redireact to certificate page
}
else
{
	endtime.substract(currenttime);
var s=	moment.duration(endtime).seconds();
var min=moment.duration(endtime).minutes();
var hr=	moment.duration(endtime).hours();
var day=  moment.duration(endtime).days();
		$('.time').text(`${day}:${hr}:${min}:${s}`)
}
},1000);

// var html=`  <h4>1.</h4>
// <div id="module" class="container">
//   <p class="collapse" id="collapseExample" aria-expanded="false" style="font-family: 'Lato', sans-serif;">
// Bacon ipsum dolor amet doner picanha tri-tip biltong leberkas salami meatball tongue filet mignon landjaeger tail. Kielbasa salami tenderloin picanha spare ribs, beef ribs strip steak jerky cow. Pork chop chicken ham hock beef ribs turkey jerky. Shoulder
//     beef capicola doner, tongue tail sausage short ribs andouille. Rump frankfurter landjaeger t-bone, kielbasa doner ham hock shankle venison. Cupim capicola kielbasa t-bone, ball tip chicken andouille venison pork chop doner bacon beef ribs kevin shankle.
//     Short loin leberkas tenderloin ground round shank, brisket strip steak ham hock ham.
//   <br>
//   <span class="pop">
//   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png" class="img-thumbnail" alt="question-image"  width="20%" height="20%">
//   </span>
//   </p>
//   <a role="button" class="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a>
// </div>
// <div class="row">
//   <div class="col-md-6">
//     <div class="option_group col-md-12">
//       <span>A.</span>
//               <div class="option">option 1</div>
//       <span>B.</span>
//               <div class="option">option 2</div>
//     </div>
//     </div>
//   <div class="col-md-6">
//       <div class="option_group col-md-12">
//      <span>C.</span>
//     <div class="option">option 3</div>
//         <span>D.</span>
//          <label>
//           <input type="radio" name="product" class="card-input-element" />
//
//             <div class="panel panel-default card-input">
//               <div class="panel-heading">
//
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png" class="img-thumbnail" alt="question-image" width="100%" height="100%">
//
//                 </div>
//             </div>
//
//         </label>
//
//       </div>
//     </div>
// </div>`
