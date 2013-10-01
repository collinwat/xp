(function(global) {

var THEMES = global.THEMES;
var Chart = global.Chart;
var ChartData = global.ChartData;


/**
 * Initialize a new `PieChart` with the given `options`.
 *
 * Options:
 *  None
 *
 */
function PieChart(options) {
  return Chart.call(this, options);
}

PieChart.prototype = Object.create(Chart.prototype);

global.PieChart = PieChart;

PieChart.prototype.defaults = {
  themeId: 0,
  data: [
    { value: 42 },
    { value: 76 }
  ]
};

PieChart.prototype.highchartOptions = {
  chart: {
    animation: false,
    credits: false,
    type: 'pie',
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  title: false,
  tooltip: false,
  plotOptions: {
    pie: {
      borderWidth: 10,
      animation: false,
      dataLabels: {
        distance: -2,
        useHTML: true,
        formatter: function() {
          return '<div class="pie-label" style="border-color: ' +
                 this.point.color + '">' +
                 (this.point.x + 1) + '</div>';
        }
      },
      states: {
        hover: {
          enabled: false
        }
      }
    }
  },
  series: [{
    innerSize: '50%',
    data: [42, 76]
  }]
};

PieChart.prototype.update = function() {
};

})(this);
