var container;
var renderer;
var scene;
var camera;
var mesh;
var start = Date.now();
var fov = 30;

window.addEventListener('load', function() {
  console.log("1");

  // grab the container from the DOM
  container = document.getElementById( "container" );

  // create a scene
  scene = new THREE.Scene();

  // create a camera the size of the browser window
  // and place it 100 units away, looking towards the center of the scene
  camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 100;

  scene.add(new THREE.AmbientLight(0xFFFFFF, 0.5));

  light2 = new THREE.PointLight(0xFFFFFF, 0.5);
  scene.add(light2);
  light2.position.z = 5;
  light2.position.x = 10;
  light2.position.y = 12;
  //var plh2 = new THREE.PointLightHelper(light2,1);

  // create a wireframe material
  basicMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true,
    side: THREE.DoubleSide
  });

  var lambertMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    side: THREE.DoubleSide
  });

  var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    specular: 0xFFFFFF,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
    shininess: 300
  });

  // create a sphere and assign the material
  /*
  mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(20, 4),
    basicMaterial
  );
  scene.add(mesh);
  */

  var widthSegmentCount = 400;
  var heightSegmentCount = 400;

  console.log("2");
  var planeGeometry = new THREE.PlaneGeometry(50, 50, widthSegmentCount - 1, heightSegmentCount - 1);
  //var boxGeometry = new THREE.BoxGeometry(50, 100, 1, widthSegmentCount, heightSegmentCount, 1);
  /*
  var plane = THREE.SceneUtils.createMultiMaterialObject(planeGeometry, [
    phongMaterial
  ]);
  */
  console.log("3");
  var plane = new THREE.Mesh(
    planeGeometry,
    phongMaterial // basicMaterial // lambertMaterial
  );
  console.log("4");

  scene.add(plane);

  plane.rotation.x = -Math.PI / 3.5;
  plane.rotation.y = Math.PI / 8;
  plane.rotation.z = -Math.PI / 20;

  noise.seed(Math.random());
  const noisePeriod = widthSegmentCount / 3;
  const multiplier = 4;

  console.log("start");
  // x is along width
  // y is along height
  for (var x = 0; x < widthSegmentCount; x++) {
    for (var y = 0; y < heightSegmentCount; y++) {
      var noiseValue = noise.simplex2(x / noisePeriod, y / noisePeriod);
      // noiseValue is between -1 and 1; normalize to 0 ... 1
      var rawValue = multiplier * (noiseValue + 1) / 2;
      //var clippedValue = rawValue - Math.floor(rawValue);
      var value = (Math.cos(rawValue * 2 * Math.PI) + 1) / 2;

      //value = Math.floor(value * 256);

      planeGeometry.vertices[x + y * widthSegmentCount].z = value * 2;
    }
  }
  console.log("end");

  // create the renderer and attach it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  render();
} );

function render() {
  // let there be light
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
