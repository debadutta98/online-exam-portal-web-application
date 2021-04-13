function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i <ca.length; i++) {
  var c = ca[i];
while (c.charAt(0) == ' ') {
   c = c.substring(1);
}
  if (c.indexOf(name) == 0) {
   return c.substring(name.length, c.length);
 }
}
return "";
}
var str=getCookie('profileinfo')
var json;
if(typeof(str)==='object')
{
	json=str;
}
if(typeof(str)==='string')
{
	json=JSON.parse(str);
}
if(typeof(json)!=='undefined' && json!==null)
{
$('#profile-image1').attr('src',json.profileimage);
$('#user-name').text(json.name);
}
$('#start').on('click',function(){
  if($('#flexCheckChecked').prop('checked'))
  {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    if(!window.location.hostname.includes('.com') && window.location.protocol!== 'https:'){
    window.location.href=window.location.protocol + '//' + window.location.hostname +':'+window.location.port+ "/student"+'/q'+`/startquiz?id=${myParam}`;
  }
  else
  {
      window.location.href=window.location.protocol + '//' + window.location.hostname+ "/student"+'/q'+"/startquiz?id="+myParam;
  }
  }
  else
  {
    alert('Please read the instruction');
  }
});
$('#cancel').on('click',function(){
  if(!window.location.hostname.includes('.com') && window.location.protocol!== 'https:'){
  window.location.href=window.location.protocol + '//' + window.location.hostname +':'+window.location.port+ "/student";
}
else
{
    window.location.href=window.location.protocol + '//' + window.location.hostname+ "/student";
}
})
