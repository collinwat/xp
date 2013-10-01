(function(global) {

var THEMES = global.THEMES;
var Chart = global.Chart;
var ChartData = global.ChartData;


/**
 * Initialize a new `BarChart` with the given `options`.
 *
 * Options:
 *
 *  - `ymin` is the lower limit of the y-axis, defaults to 0
 *  - `ymax` is the upper limit of the y-axis, defaults to 100
 *  - `themeId` is the theme id, defaults to 0
 *  - `data` is an array of `ChartData` objects, defaults to two
 *    `ChartData` instances
 */
function BarChart(options) {
  Chart.call(this, options);

  this.ymin = ko.observable(this.options.ymin).extend({ integer: {} });
  this.ymax = ko.observable(this.options.ymax).extend({ integer: {} });
  this.range = ko.computed(this.range, this);
  this.range.subscribe(this.update, this);

  this.steps = ko.observable(this.options.steps, this).extend({
    integer: {
      min: 2,
      max: 10
    }
  });

  this.steps.subscribe(this.update, this);
  this.stepProgress = ko.computed(this.stepProgress, this);

  this.dataRanges = ko.computed(this.dataRanges, this);
  this.dataRanges.subscribe(this.update, this);

  this.selected = ko.observable();
  this.selectedIndex = ko.computed(this.selectedIndex, this);
  this.selectedColor = ko.computed(this.selectedColor, this);
}

BarChart.prototype = Object.create(Chart.prototype);

global.BarChart = BarChart;

BarChart.prototype.allowChartUpdate = true;

BarChart.prototype.defaults = {
  ymin: 0,
  ymax: 100,
  themeId: 0,
  steps: 5,
  data: [
    { value: 42 },
    { value: 76 }
  ]
};

BarChart.prototype.highchartOptions = {
  chart: {
    animation: false,
    credits: false,
    type: 'columnrange',
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  title: false,
  xAxis: {
    allowDecimals: false
  },
  yAxis: {
    allowDecimals: false,
    title: false,
    labels: {
      formatter: function() {
        if (this.isFirst || this.isLast)
          return this.value;
      }
    }
  },
  tooltip: false,
  plotOptions: {
    columnrange: {
      animation: false,
      colorByPoint: true,
      dataLabels: {
        enabled: true,
        inside: true,
        formatter: function() {
          return this.point.high
        },
        style: {
          fontSize: '32px',
          color: '#fff',
        },
        crop: false
      },
      states: {
        hover: {
          enabled: false
        }
      }
    },
    series: {
      cursor: 'pointer',
      events: {}
    }
  },
  series: [{
    data: [
      [0, 42],
      [0, 76]
    ]
  }]
};

BarChart.prototype.stepProgress = function() {
  return this.steps() - 2;
};

BarChart.prototype.range = function() {
  return [this.ymin(), this.ymax()];
};

BarChart.prototype.selectedIndex = function() {
  var i = -1;
  var selected = this.selected();
  var data = this.data();

  if (!selected)
    return;

  for ( ; ++i < data.length; ) {
    if (data[i] === selected)
      return i;
  }
};

BarChart.prototype.selectedColor = function() {
  var point, color,
      colors = this.colors(),
      selected = this.selected();

  if (selected)
    color = selected.color();

  if (!this.highchart)
    return;

  point = this.highchart.series[0].data[this.selectedIndex()];

  if (point && colors.indexOf(point.color) > -1)
    return point.color;
};

BarChart.prototype.dataRanges = function() {
  var value;
  var ymax = this.ymax();
  var ymin = this.ymin();
  return $.map(this.data(), function(datum) {
    value = datum.value();
    newValue = value;

    if (value > ymax)
      newValue = ymax;

    if (value < ymin)
      newValue = ymin;

    if (newValue !== value)
      datum.value(newValue);

    return {
      name: datum.name(),
      value: [ymin, newValue]
    }
  });
};

BarChart.prototype.dataNames = function() {
  return $.map(this.dataRanges(), function(datum) {
    return datum.name || 'Edit Label';
  });
};

BarChart.prototype.dataValues = function() {
  return $.map(this.dataRanges(), function(datum, index) {
    return [datum.value];
  });
};

BarChart.prototype.renderOptions = function() {
  var self = this;
  var options = Chart.prototype.renderOptions.call(this);
  options.yAxis.min = this.ymin();
  options.yAxis.max = this.ymax();
  options.xAxis.categories = this.dataNames();
  options.series = [{
    data: this.dataValues()
  }];

  options.plotOptions.series.events.click = function(e) {
    self.onClickSeries(e, this);
  };

  return options;
};

BarChart.prototype.update = function() {
  if (!this.allowChartUpdate) return;
  this.updateSteps();
  this.updateRange();
  this.updateColors();
  this.updateData();
};

BarChart.prototype.updateRange = function() {
  if (!this.allowChartUpdate) return;
  this.highchart.yAxis[0].setExtremes(this.ymin(), this.ymax());
};

BarChart.prototype.updateColors = function() {
  if (!this.allowChartUpdate) return;
  var colors = this.colors();
  this.highchart.options.colors = colors;
  this.highchart.series[0].update();
};

BarChart.prototype.updateData = function() {
  if (!this.allowChartUpdate) return;
  this.highchart.series[0].setData(this.dataValues(), true);
  this.highchart.xAxis[0].update({
    categories: this.dataNames()
  });
};

BarChart.prototype.updateSteps = function() {
  if (!this.allowChartUpdate) return;
  var steps = Math.min(10, Math.max(2, this.steps()));
  this.highchart.yAxis[0].update({
    tickPositioner: function () {
      var positions = [this.min];
      var tick = Math.floor(this.min);
      var increment = Math.ceil((this.max - this.min) / steps);

      if (steps > 0) {
        for (; tick - increment <= this.max; tick += increment) {
          if (tick < this.max && tick > this.min)
            positions.push(tick);
        }
      }
      positions.push(this.max);
      return positions;
    }
  });
};

BarChart.prototype.addData = function() {
  var ymax = this.ymax();
  var ymin = this.ymin();
  var range = ymax - Math.min(ymax, ymin + 1);
  var value = ymin + Math.round(Math.random() * range);
  this.data.push(new ChartData({
    chart: this,
    value: value
  }));
};

BarChart.prototype.onClickSeries = function(e, series) {
  var data = this.data();
  var index = index < 0 ? 0 : e.point.x;
  var datum = data[index < data.length ? index : data.length - 1];

  if (!datum) return;

  if (this.selected() !== datum)
    this.selected(datum);
  else
    this.selected(undefined);
};

})(this);
