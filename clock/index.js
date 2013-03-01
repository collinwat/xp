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
    this.border = this.createBorder(this.radius + 9).attr({
      stroke: '#ccc',
      'stroke-width': 4
    });
    this.frame = this.createBorder();
    this.hourHand = this.createHand(0.3);
    this.minuteHand = this.createHand(0.6).attr({
      'stroke-width': 8,
    });
    this.secondHand = this.createHand(0.8).attr({
      stroke: '#8C1F1F',
      'stroke-width': 3
    });
    this.update();
  }

  SVGClock.prototype = {

    createBorder: function(r) {
      var border = this.scene.circle(((r || this.radius) * 2) - 25);
      border.center(this.radius, this.radius);
      border.attr({
        fill: 'none',
        stroke: '#000000',
        'stroke-miterlimit': 10,
        'stroke-width': 15,
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
      var time = new Date();
      this.hours = time.getHours() % 12;
      this.minutes = time.getMinutes();
      this.seconds = time.getSeconds();
      this.milliseconds = time.getMilliseconds();

      this.rotate(this.hourHand, 360 * (this.hours / 12));
      this.rotate(this.minuteHand, 360 * (this.minutes / 60));

      var m = this.milliseconds / 1000;
      m = (m > 1 || m < 0) ? 0 : m;

      this.rotate(this.secondHand, 360 * ((this.seconds + m) / 60));

      this.scene.size(this.width, this.height);
      this.scene.viewbox(this.viewbox.x,
                         this.viewbox.y,
                         this.viewbox.width,
                         this.viewbox.height);
    },

    rotate: function(elem, degs) {
      elem.transform({
        rotation: degs,
        cx: this.radius,
        cy: this.radius
      });
    }
  };

  window.SVGClock = SVGClock;

})(window);
