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
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

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
        camera.position.x -= 4;
        renderer.render(scene, camera);
      }

      // W == Forwardad
      if (getPressedKey == 87) {
        camera.position.z -= 4;
        renderer.render(scene, camera);
      }

      // S = Backward
      if (getPressedKey == 83) {
        camera.position.z += 4;
        renderer.render(scene, camera);
      }

      // D = Right
      if (getPressedKey == 68) {
        camera.position.x += 4;
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
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement
  let position = floorGeometry.attributes.position;

  

  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  const floortexture = new THREE.TextureLoader().load("textures/grass.jpg", function ( texture ) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 200, 200);

});
  const floormaterial = new THREE.MeshBasicMaterial({ map: floortexture});
  const floor = new THREE.Mesh(floorGeometry, floormaterial);
  scene.add(floor);

  // Add Objects
  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

  position = boxGeometry.attributes.position;
  const colorsBox = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsBox.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsBox, 3)
  );

  // Create Skybox
  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load(
    "textures/skybox/arid2_ft.jpg"
  );
  let texture_bk = new THREE.TextureLoader().load(
    "textures/skybox/arid2_bk.jpg"
  );
  let texture_up = new THREE.TextureLoader().load(
    "textures/skybox/arid2_up.jpg"
  );
  let texture_dn = new THREE.TextureLoader().load(
    "textures/skybox/arid2_dn.jpg"
  );
  let texture_lf = new THREE.TextureLoader().load(
    "textures/skybox/arid2_lf.jpg"
  );
  let texture_rt = new THREE.TextureLoader().load(
    "textures/skybox/arid2_rt.jpg"
  );

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

  for (let i = 0; i < 6; ++i) {
    materialArray[i].side = THREE.BackSide;
  }

  for (let i = 0; i < 100; ++i) {
    const skyboxGeo = new THREE.BoxGeometry(20, 20, 20);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);

    skybox.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    skybox.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    skybox.position.z = Math.floor(Math.random() * 20 - 10) * 20;
    scene.add(skybox);
  }

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
    camera.rotation.x = -mouseY;

    // Rotation about Y axis
    camera.rotation.y = -mouseX;
  }
}
