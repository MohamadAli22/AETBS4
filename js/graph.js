/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/

var mySplitCounter=0;
var d;
var fRect;
var fX;
var lRect;
var lX;
var selPath = [];
var ch;
var h;
var x;

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger : 'hover'
    })
})


function removPth(){
  while(selPath.length>0){
    var sp = selPath.pop();
    sp.element.remove();
  }
  
  mkThemDe();
}


function inc(){

  var rr =ch.renderer.rect(fX, fX-2, x-fX, h-39, 3)
        .attr({
            'stroke-width': 2,
            stroke: 'rgba(255,0,0,0.8)',
            fill: 'rgba(255,0,0,0.8)',
            zIndex: 3
        })
        .add();

}



function dec(){
  
}



function noi(){
  
}

function noi(){
  
}


/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
$('#container').bind('mousemove touchmove touchstart', function (e) {
  var chart,
    point,
    i,
    event;

  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
    chart = Highcharts.charts[i];
    // Find coordinates within the chart
    event = chart.pointer.normalize(e.originalEvent);
    // Get the hovered point
    point = chart.series[0].searchPoint(event, true);

    ch = chart;

    if (point) {
      point.highlight(e);
    }
  }
});


$('#container').click(function (e) {
  mySplitCounter++;
  console.log(mySplitCounter);

  var chart,
    point,
    i,
    event;

    chart = Highcharts.charts[0];
    // Find coordinates within the chart
    event = chart.pointer.normalize(e.originalEvent);
    // Get the hovered point
    point = chart.series[0].searchPoint(event, true);

    if (point) {
      //print.y
      //console.log(point);
      // draw lines

      h = chart.chartHeight;
      h= h*(4/5);
      //console.log(h);
      console.log(event);
      

       x= event.chartX;
      //var y= $('#container').position().top;


      var dataset = d;
      //chart.series[0].setData(dataset,true);


      var r =chart.renderer.rect(x, 42, 1, h-39, 1)
        .attr({
            'stroke-width': 1,
            stroke: 'rgba(66,139,202,0.6)',
            fill: 'rgba(66,139,202,0.6)',
            zIndex: 3
        })
        .add();
        

        if(mySplitCounter%2==1){
          fRect = r;
          fX = x;
        }else{
          lRect = r;
          fRect.element.remove();
          lRect.element.remove();
          console.log(fRect);

        var rr =chart.renderer.rect(fX, 42, x-fX, h-39, 3)
        .attr({
            'stroke-width': 2,
            stroke: 'rgba(255,255,255,0.8)',
            fill: 'rgba(255,255,255,0.8)',
            zIndex: 3
        })
        .add();

        selPath.push(rr);


        mkThemEn();

        }

    }
  
});

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(
            e.min,
            e.max,
            undefined,
            false,
            { trigger: 'syncExtremes' }
          );
        }
      }
    });
  }
}


// Get the data. The contents of the data file can be viewed at
$.getJSON(
  'https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/activity.json',
  function (activity) {
    var counter = 1;
    $.each(activity.datasets, function (i, dataset) {

      // Add X values
      dataset.data = Highcharts.map(dataset.data, function (val, j) {
        return [activity.xData[j], val];
      });

      d = dataset.data;

      $('<div class="chart">')
        .appendTo('#container')
        .highcharts({
          chart: {
            marginLeft: 40, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20
          },
          title: {
            text: "music.mp3",
            align: 'left',
            margin: 0,
            x: 30
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          xAxis: {
            crosshair: true,
            events: {
              setExtremes: syncExtremes
            },
            labels: {
              format: '{value} sec'
            }
          },
          yAxis: {
            title: {
              text: null
            }
          },
          tooltip: {
            positioner: function () {
              return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
              };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
              fontSize: '18px'
            },
            valueDecimals: dataset.valueDecimals
          },
          series: [{
            data: dataset.data,
            name: dataset.name,
            //type: dataset.type,
            type: "area",
            color: Highcharts.getOptions().colors[i],
            fillOpacity: 0.3,
            tooltip: {
              valueSuffix: ' ' + "db"
            }
          }]
        });
        counter++;
        if(counter==2)return false;
    });
  }
);
