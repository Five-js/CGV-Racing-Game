import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
// import * as THREE2 from "./libs/three.js";
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';

let isPlaying = false;

class Game {
    constructor() {
      // cannon uses this
      this.useVisuals = true;
      this.y = -40;
      // call initializing method
      this.init();
    }
  
    init() {
      // TODO: finish road circuit
      // TODO: quit game without reload (clean up scene)

      this.setUpGameMenu();
      this.scene = new THREE.Scene();
      // visuals set up: shadows, viewport, antialias, etc...
      this.setUpVisuals();
      // camera set up
      this.setUpCamera();
      // set up lighting
      this.setUpLights();
      // controls
      this.setUpControls();
      // the world
      this.createWorld();
      // physics
      // this.setUpPhysics();

      this._thirdPersonCamera = null;
      this._controls = null;
      this.loadModels();
  
      
      // animate scene
      this._previousRAF = null;
      this.animate();
    }

    setUpGameMenu(){
      this.counter = 60;
      this.startTime = new Date();
      let gameMenu = document.getElementById('gameMenu');
      let stopBtn = document.createElement('Button');
      let timer = document.createElement('p');
      timer.innerHTML = `Time left: ${this.counter}`;
      timer.id = "timer";

      stopBtn.innerHTML = 'Stop Game';
      stopBtn.onclick = (e) => {
        // isPlaying = false;
        // gameMenu.innerHTML = '';
        // this.renderer.clear();
        // handleState();
        window.location.reload();
      };
      gameMenu.appendChild(stopBtn);
      gameMenu.appendChild(timer);
    }

    animate(){
      const game = this;
      requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
          this._previousRAF = t;
        }

        game.animate()
        // this.updatePhysics();
        this.renderer.render(this.scene, this.camera);

        this.step(t - this._previousRAF);
        this._previousRAF = t;

        this.updateTimer();
      });
    }

    updateTimer(){
      let endTime = new Date();
      let timeDiff = endTime - this.startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds 
      let seconds = Math.round(timeDiff);

      if(seconds >= 60){
        this.startTime = new Date();
      }

      if(seconds >= 1){
        let timeLeft = this.counter - seconds;
        let timer = document.getElementById('timer');
        timer.innerHTML = `Time left: ${timeLeft}`;
      }
    }

    step(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
  
      if (this._controls) {
        this._controls.Update(timeElapsedS);
      }
  
      this._thirdPersonCamera.Update(timeElapsedS);
    }
  

    loadModels() {

      const loader = new GLTFLoader();

      // Optional: Provide a DRACOLoader instance to decode compressed mesh data
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( './draco_decoder.js' );
      loader.setDRACOLoader( dracoLoader );
      let scene = this.scene;
      let y = this.y;

      this.drawCar(loader, y, scene, this._thirdPersonCamera, this._controls);
      this.drawStartLine(loader, y, scene);
      // this.drawTrees(loader, y, scene);
      this.drawRoads(loader, y, scene);
      // this.drawCross(loader, y, scene);
      // this.drawBarriers(loader, y, scene);

    }

    drawCar(loader, y, scene, cam, cntrl){
      let geometry = new THREE.BoxBufferGeometry( 2, 2, 4 );
      let material = new THREE.MeshNormalMaterial();

      let mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(5,y-8,-50);
      const params = {
        camera: this.camera,
        scene: this. scene,
        target: mesh,
      }
      this._controls = new BasicCharacterController(params);
        
      this._thirdPersonCamera = new ThirdPersonCamera({
        camera: this.camera,
        target: this._controls,
      });
      scene.add(mesh);
      // let camera = this.camera;
      // const car = './resources/car/scene.gltf';
      //   loader.load(
      //     // resource URL
      //     car,
      //     // called when the resource is loaded
      //     function ( gltf ) {
    
      //       let mesh = gltf.scene;
      //       mesh.position.set(5,y-8,-50);
      //       mesh.scale.set(0.03,0.03,0.03);
      //       mesh.rotation.set(0, Math.PI, 0);

      //       const params = {
      //         camera,
      //         scene,
      //         target: mesh,
      //       }
      //       cntrl = new BasicCharacterController(params);
        
      //       cam = new ThirdPersonCamera({
      //         camera,
      //         target: cntrl,
      //       });
    
      //       scene.add( mesh );
    
      //     },
      //     // called while loading is progressing
      //     function ( xhr ) {
    
      //       console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
      //     },
      //     // called when loading has errors
      //     function ( error ) {
    
      //       console.log( error );
    
      //     }
      //   );
    }

    drawBarriers(loader, y, scene){
      const roadPiece = './resources/barrier/scene.gltf';
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-8,-280);
          mesh.scale.set(4,4,8);
          mesh.rotation.set(0, Math.PI/2, 0);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(17,y-8,-270);
          mesh.scale.set(4,4,8);
          // mesh.rotation.set(0, Math.PI/2, 0);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
    }

    drawCross(loader, y, scene){
      const roadPiece = './resources/road_crossing/scene.gltf';
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-10,-235);
          mesh.scale.set(4,1,4.5);
          // mesh.rotation.set(0, Math.PI/2, 0);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
    }

    drawRoads(loader, y, scene){
      const roadPiece = './resources/road/scene.gltf';
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-10,-150);
          mesh.scale.set(15,1,2);
          mesh.rotation.set(0, Math.PI/2, 0);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-110,y-10,-267);
          mesh.scale.set(15,1,2);
          // mesh.rotation.set(0, Math.PI/2, 0);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
    }

    drawTrees(loader, y, scene){
      const tree =  './resources/tree/scene.gltf'
      // going right trees
      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(30,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(55,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
      
      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(80,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(105,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(130,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(155,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(180,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
      


      // going left trees
      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-20,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-45,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-70,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-95,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-115,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );

      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-135,y-10,-400);
          mesh.scale.set(0.03,0.03,0.03);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
    }

    drawStartLine(loader, y, scene){
      loader.load(
        // resource URL
        './resources/starting_line/scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-5,-50);
          mesh.scale.set(0.1,0.1,0.1);
          scene.add( mesh );

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( error );

        }
      );
    }

    skybox(){
      const loader = new THREE.CubeTextureLoader();
      const sky = loader.load([
          './resources/humble_ft.jpg',
          './resources/humble_bk.jpg',
          './resources/humble_up.jpg',
          './resources/humble_dn.jpg',
          './resources/humble_rt.jpg',
          './resources/humble_lf.jpg',
      ]);
      this.scene.background = sky;
    }

    ground(){
      const textureLoader = new THREE.TextureLoader();
      const grass = new THREE.MeshBasicMaterial({
        map: textureLoader.load('./resources/grass.jpg'),
      });
      const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(5000, 5000, 10, 10),
          grass
          );
      ground.castShadow = false;
      ground.receiveShadow = true;
      ground.position.y = -50;
      ground.rotation.x = -Math.PI / 2;
      this.groundMesh = ground;
      this.scene.add(this.groundMesh);
    }

    createWorld(){
      this.skybox();
      this.ground();

      // sphere
      const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xdd88aa
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
      sphereMesh.castShadow = true;
      this.sphereMesh = sphereMesh;
      // this.scene.add( this.sphereMesh );
    }

    updatePhysics(){
      this.world.step(this.fixedTimeStep);
      this.groundMesh.position.copy(this.groundBody.position);
      this.sphereMesh.position.copy(this.sphereBody.position);
    }

    setUpControls(){
      const controls = new OrbitControls(
      this.camera, this.renderer.domElement);
      controls.target.set(0, 20, 0);
      controls.update();
    }

    setUpCamera(){
      let y = this.y;
      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 1.0;
      const far = 1000.0;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.set(0, 0, 50);
      this.camera.lookAt(new THREE.Vector3(0, 0, -50));
      // this.camera.position.set(0, 0, -400);
      // this.camera.lookAt(new THREE.Vector3(-200, 0, 0));
    }

    setUpPhysics(){
      if (this.useVisuals){
        this.helper = new CannonHelper(this.scene);
        this.helper.addLights(this.renderer);
      }

      this.initPhysics();
    }

    initPhysics(){
      const world = new CANNON.World();
      this.world = world;
      this.fixedTimeStep = 1.0/60.0;
      this.damping = 0.01;
      
      world.broadphase = new CANNON.NaiveBroadphase();
      world.gravity.set(0, -10, 0);
      // this.debugRenderer = new THREE2.CannonDebugRenderer(this.scene, this.world);

      const groundShape = new CANNON.Plane();
      this.groundMaterial = new CANNON.Material();
      this.groundBody = new CANNON.Body({
        mass: 0
      });
      this.groundBody.addShape(groundShape);
      this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.add(this.groundBody);

      const sphereShape = new CANNON.Sphere(0.5);
      this.sphereMaterial = new CANNON.Material();
      this.sphereBody = new CANNON.Body({
        mass: 5
      });
      this.sphereBody.addShape(sphereShape);
      this.sphereBody.position.set(0, 20, 0);
      world.add(this.sphereBody);

      // Create contact material behaviour
      const contact_ground_sphere = new CANNON.ContactMaterial(this.groundMaterial, this.sphereMaterial, { friction: 0.0, restitution: 1 });
      
      this.world.addContactMaterial(contact_ground_sphere);
      
    }

    setUpLights(){
      let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      light.position.set(20, 100, 10);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      light.shadow.bias = -0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.left = 100;
      light.shadow.camera.right = -100;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = -100;
      this.scene.add(light);
      light = new THREE.AmbientLight(0xFFFFFF, 4.0);
      this.scene.add(light);
    }

    setUpVisuals(){
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      window.addEventListener('resize', () => {
        this.onWindowResize();
      }, false);
    }

    onWindowResize(){
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
}

class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._target = this._params.target;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();

    this._input = new BasicCharacterControllerInput();

  }

  get Position() {
    return this._position;
  }

  get Rotation() {
    if (!this._target) {
      return new THREE.Quaternion();
    }
    return this._target.quaternion;
  }

  Update(timeInSeconds) {

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    // const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = this._target.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    this._target.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(this._target.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(this._target.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(this._target.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    this._target.position.add(forward);
    this._target.position.add(sideways);

    this._position.copy(this._target.position);

  }

}

class BasicCharacterControllerInput {
  constructor() {
    this._Init();    
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      // case 16: // SHIFT
      //   this._keys.shift = true;
      //   break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      // case 16: // SHIFT
      //   this._keys.shift = false;
      //   break;
    }
  }
};

class ThirdPersonCamera {
  constructor(params) {
    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0, 20, -40);
    idealOffset.applyQuaternion(this._params.target.Rotation);
    idealOffset.add(this._params.target.Position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(this._params.target.Rotation);
    idealLookat.add(this._params.target.Position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}


class CannonHelper{
  constructor(scene){
      this.scene = scene;
  }
  
  addLights(renderer){
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

      // LIGHTS
      const ambient = new THREE.AmbientLight( 0x888888 );
      this.scene.add( ambient );

      const light = new THREE.DirectionalLight( 0xdddddd );
      light.position.set( 3, 10, 4 );
      light.target.position.set( 0, 0, 0 );

      light.castShadow = true;

      const lightSize = 10;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 50;
      light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
      light.shadow.camera.right = light.shadow.camera.top = lightSize;

      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      this.sun = light;
      this.scene.add(light);    
  }
  
  createCannonTrimesh(geometry){
  if (!geometry.isBufferGeometry) return null;
  
  const posAttr = geometry.attributes.position;
  const vertices = geometry.attributes.position.array;
  let indices = [];
  for(let i=0; i<posAttr.count; i++){
    indices.push(i);
  }
  
  return new CANNON.Trimesh(vertices, indices);
}

createCannonConvex(geometry){
  if (!geometry.isBufferGeometry) return null;
  
  const posAttr = geometry.attributes.position;
  const floats = geometry.attributes.position.array;
  const vertices = [];
  const faces = [];
  let face = [];
  let index = 0;
  for(let i=0; i<posAttr.count; i+=3){
    vertices.push( new CANNON.Vec3(floats[i], floats[i+1], floats[i+2]) );
    face.push(index++);
    if (face.length==3){
      faces.push(face);
      face = [];
    }
  }
  
  return new CANNON.ConvexPolyhedron(vertices, faces);
}
  
  addVisual(body, name, castShadow=true, receiveShadow=true){
  body.name = name;
  const textureLoader = new THREE.TextureLoader();
  const grass = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./resources/grass.jpg'),
  });
  this.currentMaterial = grass;
  if (this.currentMaterial===undefined) this.currentMaterial = new THREE.MeshLambertMaterial({color:0x088888});
  if (this.settings===undefined){
    this.settings = {
      stepFrequency: 60,
      quatNormalizeSkip: 2,
      quatNormalizeFast: true,
      gx: 0,
      gy: 0,
      gz: 0,
      iterations: 3,
      tolerance: 0.0001,
      k: 1e6,
      d: 3,
      scene: 0,
      paused: false,
      rendermode: "solid",
      constraints: false,
      contacts: false,  // Contact points
      cm2contact: false, // center of mass to contact points
      normals: false, // contact normals
      axes: false, // "local" frame axes
      particleSize: 0.1,
      shadows: false,
      aabbs: false,
      profiling: false,
      maxSubSteps:3
    }
    this.particleGeo = new THREE.SphereGeometry( 1, 16, 8 );
    this.particleMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  }
  // What geometry should be used?
  let mesh;
  if(body instanceof CANNON.Body) mesh = this.shape2Mesh(body, castShadow, receiveShadow);

  if(mesh) {
    // Add body
    body.threemesh = mesh;
          mesh.castShadow = castShadow;
          mesh.receiveShadow = receiveShadow;
    this.scene.add(mesh);
  }
}

shape2Mesh(body, castShadow, receiveShadow){
  const obj = new THREE.Object3D();
  const material = this.currentMaterial;
  const game = this;
  let index = 0;
  
  body.shapes.forEach (function(shape){
    let mesh;
    let geometry;
    let v0, v1, v2;

    switch(shape.type){

    case CANNON.Shape.types.SPHERE:
      const sphere_geometry = new THREE.SphereGeometry( shape.radius, 8, 8);
      mesh = new THREE.Mesh( sphere_geometry, material );
      break;

    case CANNON.Shape.types.PARTICLE:
      mesh = new THREE.Mesh( game.particleGeo, game.particleMaterial );
      const s = this.settings;
      mesh.scale.set(s.particleSize,s.particleSize,s.particleSize);
      break;

    case CANNON.Shape.types.PLANE:
      geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
      mesh = new THREE.Object3D();
      const submesh = new THREE.Object3D();
      const ground = new THREE.Mesh( geometry, material );
      ground.scale.set(100, 100, 100);
      submesh.add(ground);

      mesh.add(submesh);
      break;

    case CANNON.Shape.types.BOX:
      const box_geometry = new THREE.BoxGeometry(  shape.halfExtents.x*2,
                            shape.halfExtents.y*2,
                            shape.halfExtents.z*2 );
      mesh = new THREE.Mesh( box_geometry, material );
      break;

    case CANNON.Shape.types.CONVEXPOLYHEDRON:
      const geo = new THREE.Geometry();

      // Add vertices
      shape.vertices.forEach(function(v){
        geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
      });

      shape.faces.forEach(function(face){
        // add triangles
        const a = face[0];
        for (let j = 1; j < face.length - 1; j++) {
          const b = face[j];
          const c = face[j + 1];
          geo.faces.push(new THREE.Face3(a, b, c));
        }
      });
      geo.computeBoundingSphere();
      geo.computeFaceNormals();
      mesh = new THREE.Mesh( geo, material );
      break;

    case CANNON.Shape.types.HEIGHTFIELD:
      geometry = new THREE.Geometry();

      v0 = new CANNON.Vec3();
      v1 = new CANNON.Vec3();
      v2 = new CANNON.Vec3();
      for (let xi = 0; xi < shape.data.length - 1; xi++) {
        for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
          for (let k = 0; k < 2; k++) {
            shape.getConvexTrianglePillar(xi, yi, k===0);
            v0.copy(shape.pillarConvex.vertices[0]);
            v1.copy(shape.pillarConvex.vertices[1]);
            v2.copy(shape.pillarConvex.vertices[2]);
            v0.vadd(shape.pillarOffset, v0);
            v1.vadd(shape.pillarOffset, v1);
            v2.vadd(shape.pillarOffset, v2);
            geometry.vertices.push(
              new THREE.Vector3(v0.x, v0.y, v0.z),
              new THREE.Vector3(v1.x, v1.y, v1.z),
              new THREE.Vector3(v2.x, v2.y, v2.z)
            );
            var i = geometry.vertices.length - 3;
            geometry.faces.push(new THREE.Face3(i, i+1, i+2));
          }
        }
      }
      geometry.computeBoundingSphere();
      geometry.computeFaceNormals();
      mesh = new THREE.Mesh(geometry, material);
      break;

    case CANNON.Shape.types.TRIMESH:
      geometry = new THREE.Geometry();

      v0 = new CANNON.Vec3();
      v1 = new CANNON.Vec3();
      v2 = new CANNON.Vec3();
      for (let i = 0; i < shape.indices.length / 3; i++) {
        shape.getTriangleVertices(i, v0, v1, v2);
        geometry.vertices.push(
          new THREE.Vector3(v0.x, v0.y, v0.z),
          new THREE.Vector3(v1.x, v1.y, v1.z),
          new THREE.Vector3(v2.x, v2.y, v2.z)
        );
        var j = geometry.vertices.length - 3;
        geometry.faces.push(new THREE.Face3(j, j+1, j+2));
      }
      geometry.computeBoundingSphere();
      geometry.computeFaceNormals();
      mesh = new THREE.Mesh(geometry, MutationRecordaterial);
      break;

    default:
      throw "Visual type not recognized: "+shape.type;
    }

    mesh.receiveShadow = receiveShadow;
    mesh.castShadow = castShadow;
          
          mesh.traverse( function(child){
              if (child.isMesh){
                  child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
              }
          });

    var o = body.shapeOffsets[index];
    var q = body.shapeOrientations[index++];
    mesh.position.set(o.x, o.y, o.z);
    mesh.quaternion.set(q.x, q.y, q.z, q.w);

    obj.add(mesh);
  });

  return obj;
}
  
  updateBodies(world){
      world.bodies.forEach( function(body){
          if ( body.threemesh != undefined){
              body.threemesh.position.copy(body.position);
              body.threemesh.quaternion.copy(body.quaternion);
          }
      });
  }
}



function handleState(){
  if(isPlaying){
    let _APP = new Game();
  }
  else if(!isPlaying){
    let menu = document.getElementById("menu");

    let heading = document.createElement("H1");
    heading.innerText = "Racing Game";
    heading.style.color = "white";

    let startBtn = document.createElement("Button");
    startBtn.innerText = "Start Game";
    startBtn.onclick = (e) => {
      isPlaying = true;
      menu.innerHTML = '';
      handleState();
    };

    menu.appendChild(heading);
    menu.appendChild(startBtn);
  }
}

window.addEventListener('DOMContentLoaded', () =>{
    handleState();
});
  
