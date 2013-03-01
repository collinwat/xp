(function(window) {

  function SVGClock(id) {
    this.radius = 150;
    this.width = '100%'
    this.height = '100%'
    this.viewbox = {
      x: 0,
      y: 0,
      width: 300,
      height: 300
    }

    this.scene = svg(id);
    this.border = this.createBorder();
    this.hourHand = this.createHand(0.3);
    this.minuteHand = this.createHand(0.6);
    this.update();
  }

  SVGClock.prototype = {

    createBorder: function() {
      var border = this.scene.circle((this.radius * 2) - 20);
      border.center(this.radius, this.radius);
      border.attr({
        fill: 'none',
        stroke: '#000000',
        'stroke-miterlimit': 10,
        'stroke-width': 20,
      });
      return border;
    },

    createHand: function(scale, r) {
      scale = 1 - (scale || 0);
      r = r || this.radius;
      return this.scene.line(r, r, r, r * scale).attr({
        fill: 'none',
        stroke: '#000000',
        'stroke-width': 11,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-miterlimit': 10
      });
    },

    update: function() {
      this.scene.size(this.width, this.height);
      this.scene.viewbox(this.viewbox.x,
                         this.viewbox.y,
                         this.viewbox.width,
                         this.viewbox.height);
    },

    rotate: function(elem, degs) {
      var params = [degs, this.radius, this.radius].join(' ');
      elem.attr('transform', 'rotate(' + params + ')');
    }
  };

  window.SVGClock = SVGClock;

})(window);
