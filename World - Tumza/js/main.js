let scene, camera, renderer, skybox, controls;

let controlsOn = false;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

document.addEventListener("mousemove", onDocumentMouseMove);

init();
animate();

function init() {
  // Add Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x6e95ce);
  scene.fog = new THREE.Fog(0x6e95ce, 0, 750);

  // Add Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Add Lights
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Hide / Show instructions
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    // Hide Instructions
    document.querySelector("body").style.cursor = "none";
    instructions.style.display = "none";
    blocker.style.display = "none";
    controlsOn = true;
  });

  document.addEventListener("keydown", function (event) {
    // Show Instructions
    var getPressedKey = event.keyCode;

    if (getPressedKey == 27) {
      document.querySelector("body").style.cursor = "default";
      blocker.style.display = "block";
      instructions.style.display = "";
      controlsOn = false;
    }
  });

  // Movement Controls
  document.addEventListener("keydown", function (event) {
    var getPressedKey = event.keyCode;

    if (controlsOn) {
      // A = Left
      if (getPressedKey == 65) {
        camera.position.x -= 40;
        renderer.render(scene, camera);
      }

      // W == Forwardad
      if (getPressedKey == 87) {
        camera.position.z -= 40;
        renderer.render(scene, camera);
      }

      // S = Backward
      if (getPressedKey == 83) {
        camera.position.z += 40;
        renderer.render(scene, camera);
      }

      // D = Right
      if (getPressedKey == 68) {
        camera.position.x += 40;
        renderer.render(scene, camera);
      }
    }
  });

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Add Floor
  let floorGeometry = new THREE.PlaneGeometry(4000, 4000, 200, 200);
  floorGeometry.rotateX(-Math.PI / 2);

  const floortexture = new THREE.TextureLoader().load(
    "textures/grass.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.repeat.set(200, 200);
    }
  );

  const floorMaterial = new THREE.MeshBasicMaterial({ map: floortexture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  // Add Road 1
  const roadGeometry1 = new THREE.BoxGeometry(150, 2000,2);
  roadGeometry1.rotateX(-Math.PI / 2);
  
  const roadTexture = new THREE.TextureLoader().load(
    "textures/road.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.repeat.set(1, 1);
    }
  );

  const roadMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });

  const road1 = new THREE.Mesh(roadGeometry1, roadMaterial);
  scene.add(road1);

  // Add Road 2
  const roadGeometry2 = new THREE.BoxGeometry(1500, 150, 2);
  roadGeometry2.rotateX(-Math.PI / 2);
  
  const road2 = new THREE.Mesh(roadGeometry2, roadMaterial);

  road2.position.x -= 675;
  road2.position.z -= 1000;
  scene.add(road2);

  // Add Road 3
  const roadGeometry3 = new THREE.CylinderGeometry( 300, 300, 2, 100 );
  roadGeometry3.rotateY(-Math.PI / 2);
  
  const road3 = new THREE.Mesh(roadGeometry3, roadMaterial);

  road3.position.x -= 1425;
  road3.position.z -= 775;
  scene.add(road3);

  // Add Road 4
  const roadGeometry4 = new THREE.BoxGeometry(500, 150, 2);
  roadGeometry4.rotateX(-Math.PI / 2);
  
  const road4 = new THREE.Mesh(roadGeometry4, roadMaterial);

  road4.position.x -= 1175;
  road4.position.z -= 550;
  scene.add(road4);

  // Add Road 5
  const roadGeometry5 = new THREE.BoxGeometry(500, 150, 2);
  roadGeometry5.rotateX(-Math.PI / 2);
  
  const road5 = new THREE.Mesh(roadGeometry5, roadMaterial);

  road5.position.x -= 925;
  road5.position.z -= 400;
  scene.add(road5);

  // Add Road 6
  const roadGeometry6 = new THREE.BoxGeometry(500, 150, 2);
  roadGeometry6.rotateX(-Math.PI / 2);
  roadGeometry6.rotateY(-Math.PI / 3);
  
  const road6 = new THREE.Mesh(roadGeometry6, roadMaterial);

  road6.position.x -= 650;
  road6.position.z -= 550;
  scene.add(road6);

  // Add Road 7
  const roadGeometry7 = new THREE.BoxGeometry(500, 150, 2);
  roadGeometry7.rotateX(-Math.PI / 2);

  const road7 = new THREE.Mesh(roadGeometry7, roadMaterial);

  road7.position.x -= 625;
  road7.position.z -= 800;
  scene.add(road7);

  // Add Road 8
  const roadGeometry8 = new THREE.BoxGeometry(150, 1900, 2);
  roadGeometry8.rotateX(-Math.PI / 2);
  
  const road8 = new THREE.Mesh(roadGeometry8, roadMaterial);

  road8.position.x -= 300;
  road8.position.z += 75;
  scene.add(road8);

  // Add Road 9
  const roadGeometry9 = new THREE.BoxGeometry(450, 150, 2);
  roadGeometry9.rotateX(-Math.PI / 2);
  
  const road9 = new THREE.Mesh(roadGeometry9, roadMaterial);

  road9.position.x -= 150;
  road9.position.z += 1000;
  scene.add(road9);

  //
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Resize Window
  window.addEventListener("resize", onWindowResize, false);

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
}

// Resize the window after browser size changes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
  mouseX = ((event.clientX - windowHalfX) / 1000) * Math.PI;
  mouseY = (event.clientY - windowHalfY) / 1000;

  if (controlsOn) {
    // Rotation about X axis
    //camera.rotation.x = -mouseY;

    // Rotation about Y axis
    camera.rotation.y = -mouseX;
  }
}
