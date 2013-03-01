(function(window) {

  var scene = svg('scene').size('100%', '100%').viewbox(0, 0, 300, 300);

  var border = scene.circle(250).center(150, 150).attr({
    fill: 'none',
    stroke: '#000000',
    'stroke-miterlimit': 10,
    'stroke-width': 20,
  });

  var bigHand = scene.line(150, 150, 150, 72).attr({
    fill: 'none',
    stroke: '#000000',
    'stroke-width': 11,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-miterlimit': 10
  });

  var littleHand = scene.line(150, 150, 188, 188).attr({
    fill: 'none',
    stroke: '#000000',
    'stroke-width': 11,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-miterlimit': 10
  });

})(window);
