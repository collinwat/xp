function App() {
  this.renderer = new THREE.WebGLRenderer({antialias: true});
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.aspect = this.width / this.height;
  this.clock = new THREE.Clock();
  this.camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 1000);
  this.camera.position.z = 200;

  this.scene = new THREE.Scene();
  this.geometry = new THREE.SphereGeometry(70, 32, 32);
  this.material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    wireframeLinewidth: 1
  });
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.scene.add(this.mesh);
}

App.ready = function(callback, context) {
  var listener = function() {
    document.removeEventListener('DOMContentLoaded', listener, false);
    callback.call(context || this);
  };
  document.addEventListener('DOMContentLoaded', listener, false);
  return listener;
};

App.run = function() {
  return (new this()).run();
};

App.prototype.run = function() {
  App.ready(function(e) {
    this.install();
    this.loop();
  }, this);
};

App.prototype.install = function(elem) {
  this.renderer.setSize(this.width, this.height);
  this.parent = elem || document.body;
  this.parent.appendChild(this.renderer.domElement);
};

App.prototype.loop = function() {
  var self = this;
  requestAnimationFrame(function() {
    self.loop();
  });
  this.update();
  this.renderer.render(this.scene, this.camera);
};

App.prototype.update = function() {
  this.mesh.rotation.x = Date.now() * 0.0002;
  this.mesh.rotation.y = Date.now() * 0.0005;
};
