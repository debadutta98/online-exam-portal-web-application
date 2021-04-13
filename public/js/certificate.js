const { degrees, PDFDocument, rgb, StandardFonts} = PDFLib;
  const showPdf=async function(name,percent,date,techername,ceo,quizname){
const existingPdfBytes = await fetch('/img/cert.pdf').then((res)=> res.arrayBuffer()
);
 const pdfDoc = await PDFDocument.load(existingPdfBytes);
pdfDoc.registerFontkit(fontkit);
 const fontBytes = await fetch("/img/Roboto-Light.ttf").then((res) =>
   res.arrayBuffer()
 );

 const cursivebyte=await fetch("/img/CedarvilleCursive-Regular.ttf").then((res)=>res.arrayBuffer());
 const robot = await pdfDoc.embedFont(fontBytes);
 const cursive=await pdfDoc.embedFont(cursivebyte);
 const pages = pdfDoc.getPages();
 const firstPage = pages[0];
   firstPage.drawText(name, {
   x: 340,
   y: 270,
   size: 30,
   font: robot,
   color: rgb(0.94,0.97,1.00)
 });
 var p=percent+'%';
 firstPage.drawText(String(p),{
   x:630,
   y:210,
   size:15,
   font:robot,
   color:rgb(0.94,0.97,1.00)
 });
 firstPage.drawText(ceo,{
x:465,
y:110,
size:15,
font:cursive,
color:rgb(0.00,0.00,0.00)
 });
 firstPage.drawText(techername,{
x:200,
y:110,
size:15,
font:cursive,
color:rgb(0.00,0.00,0.00)
 });
 firstPage.drawText(techername,{
   x:270,
   y:75,
   size:15,
   font:robot,
   color:rgb(0.94,0.97,1.00)
 })
 firstPage.drawText(quizname,{
   x:400,
   y:212,
   size:15,
   font:robot,
   color:rgb(0.94,0.97,1.00)
 });
firstPage.drawText(date,{
x:390,
y:190,
size:15,
font:robot,
color:rgb(0.94,0.97,1.00)
});
  const pdfBytes = await pdfDoc.save();
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  setTimeout(function(){
    $('.back').css('display','none');
    $('#pdf').css('display','inline');

  document.getElementById('pdf').src = pdfDataUri;
}, 5000);

  }
  var json_info;
  if(typeof(info)==='string')
  {
  json_info=JSON.parse(info);
  }
  if(typeof(info)==='object')
  {
    json_info=info;
  }
  if(typeof(json_info)!=='undefined' && json_info!==null)
  {
    showPdf(json_info.stdname,json_info.percentage,String(moment(json_info.start).format('YYYY-MM-DD')),json_info.techname,'Vikash Kumar',json_info.quiz);
  }
