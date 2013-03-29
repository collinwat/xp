(function(window) {

var CY = window.CY = window.CY || {};

CY.slice = function(args) {
  return Array.prototype.slice.call(args || [],
                                    Array.prototype.slice(1));
};

CY.bind = function(callback, context) {
  if (!callback)
    return callback;
  if (callback.bind)
    return callback.bind(context);

  var fn = function() {
    return callback.apply(context, arguments);
  };
    callback.bind
  return
};

/**
 * Copy all properties that are explicitly defined on the object and not
 * defined within the object's inheritance chain.
 */
CY.copyOwnProps = function(dest, src) {
  dest = dest || {};
  src = src || {};

  for (var key in src) {
    if (Object.prototype.hasOwnProperty.call(src, key))
      dest[key] = src[key];
  }

  return dest;
}


/**
 * Shamelessly taken from the coffee-script inheritance model.
 */
CY.extend = function(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  CY.copyOwnProps(child, parent);
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.super = parent.prototype;
  return child;
};


/**
 * Make no reservations. We are not supporting the old IE event model.
 * This is to avoid the hell that is IE versioning and tackle modern
 * techniques.
 */
CY.ready = function(callback, context) {
  var listener = function() {
    document.removeEventListener('DOMContentLoaded', listener, false);
    callback.call(context || this);
  };
  document.addEventListener('DOMContentLoaded', listener, false);
  return listener;
};

CY.bind = function(callback, context) {
  if (callback.bind)
    return callback.bind(context);

  return function() {
    return callback.apply(context || this, arguments);
  };
};


/**
 * A base app to seamlessly handle a ready document and provide a simple
 * render loop process.
 */
function CanvasApp(parent) {
  this.parent = parent || document.body;
  this.renderer = new THREE.CanvasRenderer();
  this.scene = new THREE.Scene();
  this.clock = new THREE.Clock();
  this.camera = new THREE.PerspectiveCamera(this.cameraAngle,
                                            this.aspect(),
                                            this.cameraNearPlane,
                                            this.cameraFarPlane);
  this.init();
}

CY.CanvasApp = CanvasApp
CanvasApp.prototype.constructor = CanvasApp;

// Default properties for the PerspectiveCamera
CanvasApp.prototype.cameraAngle = 45;
CanvasApp.prototype.cameraNearPlane = 1;
CanvasApp.prototype.cameraFarPlane = 1000;


/**
 * Inheriting apps call this to inherit from the base CanvasApp.
 *
 *   function ClockyApp1() {
 *     this.super.constructor.call(this);
 *   }
 *   CanvasApp.extend(ClockyApp1);
 */
CanvasApp.extend = function(cls) {
  return CY.extend(cls, this);
};


/**
 * Short hand for instantiating an app and running it immediately.
 */
CanvasApp.run = function(config) {
  return (new this(config)).run();
};


/**
 * Returns the current aspect ratio of the window
 */
CanvasApp.prototype.aspect = function() {
  return window.innerWidth / window.innerHeight;
};


/**
 * Called by the app constructor and meant to be overridden by inheriting apps
 * to instantiate the scene.
 */
CanvasApp.prototype.init = function() {
};


/**
 * This method schedules the start method to be called with the document
 * is ready to be modified. It will only be called if this.running === false.
 */
CanvasApp.prototype.run = function() {
  if (!this.running) {
    this.running = true;
    CY.ready(this.start, this);
    window.addEventListener('resize', CY.bind(this.resize, this), false);
  }
  return this;
};


/**
 * Installs dom nodes, calculates initial dimensions and begins the
 * render loop.
 */
CanvasApp.prototype.start = function() {
  this.install();
  this.loop();
};


/**
 * Shortcut for installing dom elements and calculating element sizes.
 */
CanvasApp.prototype.install = function() {
  this.parent = this.parent || document.body;
  this.resize();
  this.parent.appendChild(this.renderer.domElement);
};


/**
 * Rebuilds the camera projection and sets the rendering size whenever the
 * window is resized.
 */
CanvasApp.prototype.resize = function() {
  this.camera.aspect = this.aspect();
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
};


/**
 * Uses requestAnimationFrame to perform a render loop. Calls this.update to
 * update the scene state and then calls this.render to render the state.
 */
CanvasApp.prototype.loop = function() {
  var self = this;
  requestAnimationFrame(function() {
    self.loop();
  });
  this.update();
  this.render();
};


/**
 * Calls renderer.render with the appropriate scene and camera.
 */
CanvasApp.prototype.render = function() {
  this.renderer.render(this.scene, this.camera);
};


/**
 * Called by the render loop and is meant to be overridden by inheriting apps
 * to update the scene according to the app logic.
 */
CanvasApp.prototype.update = function() {
};


/**
 * An explicit class to render to webgl canvas.
 */
function WebGLApp(parent) {
  CanvasApp.call(this, parent);
}

CY.WebGLApp = CanvasApp.extend(WebGLApp);


WebGLApp.prototype.init = function() {
  this.renderer = new THREE.WebGLRenderer({antialias: true});
};

})(window);
