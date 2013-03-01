(function(window) {

function App(parent) {
  CY.WebGLApp.call(this, parent);
}
CY.App = CY.WebGLApp.extend(App);

App.prototype.init = function() {
  this.camera.position.z = 200;
  this.geometry = new THREE.SphereGeometry(50, 32, 32);
  this.material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    wireframeLinewidth: 1
  });
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.scene.add(this.mesh);
};

App.prototype.update = function() {
  this.mesh.rotation.x = Date.now() * 0.0002;
  this.mesh.rotation.y = Date.now() * 0.0005;
};

})(window);
