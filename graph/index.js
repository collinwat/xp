/*
 * Depends on:
 *  - knockout
 *  - highcharts
*/
(function(global) {

// A quick hack to prototype theme integration. Taken from:
//   [renderer]/src/lib/themes.js
THEMES = [{
    id: 0,
    name: "Five Seven Five",
    colors: [
      "#f05d33",
      "#149eba",
      "#47ab4a",
      "#ecb126",
      "#8c6654",
      "#026388",
      "#4ac8f7",
      "#db7c06"
    ]
  }, {
    id: 1,
    name: "Seaward",
    backgroundColor: "#6b656e",
    colors: [
      "#6b656e",
      "#bdadb2",
      "#e1cfcc",
      "#c1c5d5",
      "#d6d2bc",
      "#c7ab89",
      "#bdadb2",
      "#a096a3"
    ]
  }, {
    id: 2,
    name: "Picaresque",
    backgroundColor: "#2f1904",
    colors: [
      "#59422d",
      "#786048",
      "#a6692e",
      "#baa28f",
      "#59422d",
      "#786048",
      "#a6692e",
      "#baa28f"
    ]
  }
];

global.THEMES = THEMES;

/**
 * Initialize a new `ChartData` with the given `options`.
 *
 * Options:
 *
 *  - `name` is the name of the data point
 *  - `value` is the value of the data point, defaults to 50
 */
function ChartData(options) {
  this.options = $.extend(Object.create(this.defaults), options || {});
  this.name = ko.observable(this.options.name);
  this.value = ko.observable(this.options.value).extend({ integer: {} });
  this.chart = ko.observable(this.options.chart);
  this.color = ko.computed(this.color, this);
}

global.ChartData = ChartData;

ChartData.prototype.defaults = {
  value: 50
}

ChartData.prototype.color = function() {
  var chart = this.chart();
  var index = chart && chart.data ? chart.data().indexOf(this) : -1;
  return index > -1 ? chart.colors()[index] : '#000000';
};

function Chart(options) {
  var self = this;
  this.options = $.extend(Object.create(this.defaults), options || {});
  this.themeId = ko.observable(this.options.themeId);
  this.theme = ko.computed(this.theme, this);
  this.colors = ko.computed(this.colors, this);
  this.colors.subscribe(this.update, this);

  this.data = this.options.data;
  this.data = ko.observableArray($.map(this.data, function(datum, index) {
    return new ChartData($.extend({}, datum, { chart: this }));
  }));
}

global.Chart = Chart;

Chart.prototype.defaults = {
  themeId: 0
};

Chart.prototype.highchartOptions = {
}

Chart.prototype.theme = function() {
  var index = -1;
  var id = this.themeId();

  for ( ; ++index < THEMES.length; ) {
    if (THEMES[index].id == id)
      return THEMES[index];
  }
};

Chart.prototype.colors = function() {
  var theme = this.theme();

  if (theme && theme.colors)
    return theme.colors;
};

Chart.prototype.render = function() {
  if (!this.highchart) {
    this.highchart = $(this.options.el).
      highcharts(this.renderOptions()).
      highcharts();
    ko.applyBindings(this);
  }
  return this.highchart;
};

Chart.prototype.renderOptions = function() {
  return $.extend({}, this.highchartOptions, {
    colors: this.colors()
  });
};

})(this);
