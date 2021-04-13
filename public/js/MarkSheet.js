$('#add').on('click', function() {
  $("table").table2excel({
    name: "Worksheet Name",
    filename: "SomeFile.xls", // do include extension
    preserveColors: true // set to true if you want background colors and font colors preserved
  });
});
var gradjson = {
  O: 0,
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0
};
if (typeof(markobj) !== 'undefined') {
  var mark;
if(typeof(markobj)==='string')
{
  mark=JSON.parse(markobj);
}
if(typeof(markobj)==='object')
{
  mark=markobj;
}
if(typeof(mark)!=='undefined'){
  mark.stdlist.forEach(function(value) {
    var per = (value.stdmark / mark.totalmark) * 100;
    var g;
    var s;
    if (per <= 100 && per >= 90) {
      gradjson.O++;
      g='O';
      s='pass';
    } else if (per <= 89 && per >= 89) {
      gradjson.E++;
      g='E';
      s='pass';
    } else if (per <= 79 && per >= 70) {
      gradjson.A++;
      g='A';
      s='pass';
    } else if (per <= 69 && per >= 60) {
      gradjson.B++;
      g='B';
      s='pass';
    } else if (per <= 59 && per >= 50) {
      gradjson.C++;
      g='C';
      s='pass';
    } else if (per <= 49 && per >= 33) {
      gradjson.D++;
      g='D';
      s='pass';
    }
    else
    {
      gradjson.F++;
      g='F';
      s='Fail';
    }
  var html= `<tr>
      <td> <b> 1</b> </td>
      <td>${value.stdname}</td>
      <td><b>${value.stdemail}</b></td>
      <td>${mark.totalmark}</td>
      <td>${value.stdmark}</td>
      <td>${per}</td>
      <td>${g}</td>
      <td>${s}</td>
    </tr>`;
    $('tbody').append(html);
  });

}
}

google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Grade', 'according to percentage'],
          ['O', gradjson.O],
          ['E', gradjson.E],
          ['A',gradjson.A],
          ['B',gradjson.B],
          ['C',gradjson.C],
          ['D',gradjson.D],
          ['F',gradjson.F]
        ]);

        var options = {
          title: 'Overal Record',
          is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }
