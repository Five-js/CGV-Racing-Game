import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as THREE2 from "./libs/three.js";

// loaders
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';

// controls
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {BasicCharacterController} from './BasicCharacterController.js';
import {ThirdPersonCamera} from './ThirdPersonCamera.js';

// physics
import * as CANNON from './libs/cannon.js';
import {CannonHelper} from './CannonHelper.js';

let isPlaying = false;
let isThirdPerson = true;
let _APP = null;
const time = 10000;

// car related
let car1 = 0x0000ff;
let car1Cabin = 0x000000;
let car2 = 0xff0000;
let car2Cabin = 0x333333;
let car1Or2 = 2;

class Game {
    constructor() {
      // call initializing method
      this.init();
    }
  
    init() {
      // TODO: add button to switch between cameras automatically
      // TODO: add next level button on gameMenu
      // TODO: pause button
      // TODO: add sound
      // TODO: add physics
      // TODO: light effects: shadows, reflection, sun(point light), etc...
      // TODO: fix timer bug
      // TODO: finesse load screen
      // TODO: make timer start after load
      // TODO: test stop game, pause and restart
      // TODO: mouse controls

      // extras
      // TODO: locked cars

      this.setUpGlobalVariables();
      // in game menu
      this.setUpGameMenu();
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

      // handle screen load
      this.screenLoad();
      // animate scene
      this.animate();
    }

    setUpGlobalVariables(){
      this.scene = new THREE.Scene();

      // for loading screen
      this.load = document.getElementById('loading');
      this.load.style.display = 'block';

      this._previousRAF = null;
      this._thirdPersonCamera = null;
      this._controls = null;

      // for cannon
      this.useVisuals = true;

      this.y = -40;

      this.hasWon = false;
      this.hasLost = false;
      this.numberOfLaps = 0;
    }

    screenLoad(){
      setInterval(function(){
        let go = document.getElementById('h1');
        go.innerHTML = 'GO!!!';
        setInterval(function(){
          this.load = document.getElementById('loading');
          this.load.style.display = 'none';
        },2000);
      },10000);
    }

    stopGame(){
      this.numberOfLaps = 0;
      document.body.removeChild(this.renderer.domElement);
      isPlaying = false;
      gameMenu.innerHTML = '';
      let overlay = document.getElementById("overlay");
      overlay.innerHTML = '';
      overlay.style.display = 'none';
      this.hasWon = false;
      let menu = document.getElementById("menu");
      menu.style.display = 'block';
      handleState();
    }

    setUpGameMenu(){
      this.counter = time;
      this.startTime = new Date();
      this.currentLapStart = this.startTime;
      let gameMenu = document.getElementById('gameMenu');
      let stopBtn = document.createElement('Button');
      let timer = document.createElement('p');
      timer.innerHTML = `Time left: ${this.counter}`;
      timer.id = "timer";

      let laps = document.createElement('p');
      laps.innerHTML = `Laps: ${this.numberOfLaps}/3`;
      laps.id = "laps";

      stopBtn.innerHTML = 'Stop Game';
      stopBtn.onclick = (e) => {
        this.stopGame();

        document.querySelector(".buttons").style.display = "flex";
        document.querySelector("#back_button").style.display = "none";
        document.querySelector(".race-container").style.display = "none";
        document.querySelector(".in-game-race-container").style.display = "none";

      };
      gameMenu.appendChild(stopBtn);
      gameMenu.appendChild(timer);
      gameMenu.appendChild(laps);
    }

    playInThirdPerson(){
      const game = this;

      if(this.hasLost){
        this.numberOfLaps = 3;
      }
      if(this.numberOfLaps == 3){
        if(this.hasLost){
          this.hasLost = false;
          this.handleWinOrLoss(false);
        }
        else{
          this.handleWinOrLoss(true);
        }
      }

      if(this.numberOfLaps > 3){
        console.log("error");
      }
      if(this.numberOfLaps < 3){
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
    }

    useWorldCamera(){
      const game = this;

      requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
          this._previousRAF = t;
        }

        game.animate()
        // this.updatePhysics();
        this.renderer.render(this.scene, this.camera);

        this._previousRAF = t;

      });
    }

    animate(){

      if(isThirdPerson){
        this.playInThirdPerson();
      }
      else{
        this.useWorldCamera();
      }
      
    }

    handleWinOrLoss(isWin){
      let overlay = document.getElementById('overlay');
      overlay.innerHTML = '';

      let header = document.createElement('Header');
      if(isWin){
        header.innerHTML = "You Won!";
      }
      else{
        header.innerHTML = "You Lost!";
      }
      overlay.appendChild(header);

      let restartBtn = document.createElement('Button');
      let stopBtn = document.createElement('Button');

      if(isWin){
        restartBtn.innerHTML = "Restart Game";
      }
      else{
        restartBtn.innerHTML = "Try Again";
      }
      stopBtn.innerHTML = "Quit Game";

      // remove overlay contents on restart or stop
      restartBtn.onclick = () => {
        this.restart();
      };
      stopBtn.onclick = () => {
        this.stopGame();
      }

      overlay.appendChild(restartBtn);
      overlay.appendChild(stopBtn);
      overlay.style.display = "block";
    }

    updateTimer(){

      let endTime = new Date();
      let timeDiff = endTime - this.startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds 
      let seconds = Math.round(timeDiff);

      let hasLapped = 0;
      if(this.hasWon){

        // check if player really laped
        let diff = endTime - this.currentLapStart; //in ms
        // strip the ms
        diff /= 1000;

        // get seconds 
        hasLapped = Math.round(diff);
      }

      if(seconds >= 120){
        this.startTime = new Date();
      }

      if(seconds >= 1){
        let timeLeft = this.counter - seconds;
        if(timeLeft<=0){
          this.hasLost = true;
          timeLeft = 0;
        }
        let timer = document.getElementById('timer');
        if(timer){
          timer.innerHTML = `Time left: ${timeLeft}`;
        }
      }

      if(hasLapped > 10 && this.numberOfLaps >= 1 && this.hasWon){
        this.hasWon = false;
        this.numberOfLaps = this.numberOfLaps + 1;
        this.currentLapStart = new Date();
        let laps = document.getElementById('laps');
        if(laps){
          laps.innerHTML = `Laps: ${this.numberOfLaps}/3`;
        }
      }

      if(hasLapped < 10 && this.numberOfLaps >= 1 && this.hasWon){
        this.hasWon = false;
      }

      if(this.hasWon && this.numberOfLaps < 3){
        this.hasWon = false;
        this.numberOfLaps = this.numberOfLaps + 1;
        this.currentLapStart = new Date();
        let laps = document.getElementById('laps');
        if(laps){
          laps.innerHTML = `Laps: ${this.numberOfLaps}/3`;
        }
      }
    }

    step(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
  
      if (this._controls) {
        this._controls.Update(timeElapsedS, this.hasWon);
      }
  
      this._thirdPersonCamera.Update(timeElapsedS);
    }

    restart(){
      this.numberOfLaps = 0;
      // Hide the overlay
      var overlay = document.getElementById("overlay");
      overlay.innerHTML = '';
      overlay.style.display = 'none';

      // Reinitialize us
      document.body.removeChild(this.renderer.domElement);
      let gameMenu = document.getElementById('gameMenu');
      gameMenu.innerHTML = '';
      this.hasWon = false;
      this.init();
    }

    setUpLoader(){
      let loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( './draco_decoder.js' );
      loader.setDRACOLoader( dracoLoader );
      return loader;
    }
  
    loadModels() {
      // objects and constants to be used
      const loader = this.setUpLoader();
      let scene = this.scene;
      let y = this.y;

      // loading and placing the objects
      // this.drawBuildings(y, scene);
      this.drawCar(y, scene);
      this.drawStartLine(loader, y, scene);
      // this.placeTrees();
      this.drawRoads(loader, y, scene);
      // this.drawCross(loader, y, scene);
      // this.drawBarriers(loader, y, scene);

    }

    placeTrees(){
      // first one
      this.drawTrees(loader, y, scene, 0, 50);

      // second cluster
      this.drawTrees(loader, y, scene, -280, 50);

      // 3rd
      this.drawTrees(loader, y, scene, -500, 250);

      // 4th
      this.drawTrees(loader, y, scene, -420, 730);

      // line strip at end
      this.drawTrees(loader, y, scene, 0, 950);
      this.drawTrees(loader, y, scene, -160, 950);
    }
    
    drawBuildings(y, scene){
      const building = './resources/buildingTxt/buldingTexture.png';
      const building2 = './resources/buildingTxt/glassTxt.jpg';
      const building3 = './resources/buildingTxt/simpleTxt.jpg';
      const building4= './resources/buildingTxt/res.jpg';

      // first one (middle)
      this.cluster(0, y, -50, building2, building, building3, building4, scene);
      // back alone
      this.cluster(-160, y, 0, building2, building, building3, building4, scene);
      // back most
      this.cluster(-320, y, 0, building2, building, building3, building4, scene);
      // second left most
      this.cluster(0, y, 110, building2, building, building3, building4, scene);
      // left most
      this.cluster(0, y, 270, building2, building, building3, building4, scene);
      // right most
      this.cluster(0, y, -210, building2, building, building3, building4, scene);
      
    }

    cluster(x, y, z, building2, building, building3, building4, scene){
      // first one
      let texture = new THREE.TextureLoader().load( building2 );
      let geometry = new THREE.BoxGeometry( 50, 100, 50 );
      let material = new THREE.MeshBasicMaterial( { map: texture } );
      let mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(-150+x,y+40, 50+z);
      scene.add( mesh );

      // 2nd one
      texture = new THREE.TextureLoader().load( building );
      geometry = new THREE.BoxGeometry( 80, 80, 80 );
      material = new THREE.MeshBasicMaterial( { map: texture } );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(-150+x,y+30, 130+z);
      scene.add( mesh );

      // 3rd 
      texture = new THREE.TextureLoader().load( building3 );
      geometry = new THREE.BoxGeometry( 60, 130, 60 );
      material = new THREE.MeshBasicMaterial( { map: texture } );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(-220+x,y+53, 50+z);
      scene.add( mesh );

      texture = new THREE.TextureLoader().load( building4 );
      geometry = new THREE.BoxGeometry( 55, 110, 55 );
      material = new THREE.MeshBasicMaterial( { map: texture } );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(-230+x,y+43, 120+z);
      scene.add( mesh );
    }

    Car(colorBody, colorCabin){

      const car = new THREE.Group;

      // backwheel
      const geometry2 = new THREE.CylinderGeometry( 8, 8, 40, 32 );
      const material2 = new THREE.MeshBasicMaterial( {color: 0x000000} );
      let cylinder = new THREE.Mesh( geometry2, material2 );
      cylinder.rotation.set(0, 0 , Math.PI/2);
      cylinder.position.z = cylinder.position.z -5;
      car.add( cylinder );

      // frontwheel
      let cylinderF = new THREE.Mesh( geometry2, material2 );
      cylinderF.rotation.set(0, 0 , Math.PI/2);
      cylinderF.position.z= cylinder.position.z + 33;
      car.add( cylinderF );

      // const backWheel = new THREE.Mesh(
      //     new THREE.BoxBufferGeometry(12, 33, 12),
      //     new THREE.MeshLambertMaterial({color: 0x333333})
      // );
      // backWheel.position.z=6;
      // backWheel.position.x=-18;
      // car.add(backWheel);

      // const frontWheel = new THREE.Mesh(
      //     new THREE.BoxBufferGeometry(12, 33, 12),
      //     new THREE.MeshBasicMaterial({color: 0x333333})
      // );
      // frontWheel.position.z=6;
      // frontWheel.position.x=18;
      // car.add(frontWheel);

      const main = new THREE.Mesh(
          new THREE.BoxBufferGeometry(40, 15, 60),
          new THREE.MeshLambertMaterial({color: colorBody})
      );
      main.position.z=12;
      main.position.y = 8;
      car.add(main);

      const geometry = new THREE.BoxGeometry(40, 12, 32);
      const material = new THREE.MeshBasicMaterial( { color: colorCabin } );
      let cabin = new THREE.Mesh( geometry, material );


      // const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(30, 12, 32),
      // new THREE.MeshLambertMaterial({color: 0xffffff}));
      cabin.position.y = 21.5;
     cabin.position.X=-6;
     cabin.position.z=15;
      car.add(cabin);

      return car;

    }


    drawCar(y, scene){
      let mesh = null;
      if(car1Or2==1){
        mesh = this.Car(car1, car1Cabin);
      }
      else{
        mesh = this.Car(car2,car2Cabin);
      }

      mesh.position.set(5,y-8.5,-50);
      mesh.scale.set(0.15,0.15,0.15);

      if(isThirdPerson){
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
      }
      
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

      // first cluster
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

      // second corner
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-455,y-8,-265);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-445,y-8,-275);
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

      // 3rd
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-430,y-8,-100);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-443,y-8,-90);
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

      // 4th
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-690,y-8,-100);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-683,y-8,-110);
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

      // 5th
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-690,y-8, 280);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-680,y-8, 293);
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

      // 6th
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-360,y-8, 280);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-370,y-8, 270);
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

      // 7th
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-383,y-8, 520);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-370,y-8, 530);
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

      // last
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(18,y-8, 520);
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
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-8, 530);
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
    }

    drawCross(loader, y, scene){
      const roadPiece = './resources/road_crossing/scene.gltf';
      
      // first 
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

      // second
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-443,y-10,-235);
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

      // third
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-443,y-10,-69);
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

      // fourth
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-680,y-10,-69);
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

      // fifth
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-680,y-10,313);
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

      // sixth
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-370,y-10,313);
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

      // seventh
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-370,y-10,550);
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

      // last corner
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-10,550);
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

      // first stretch
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

      // second hori
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-218,y-10,-267);
          mesh.scale.set(30,1,2);
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

      // third short seg
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-443,y-10,-185);
          mesh.scale.set(10,1,2);
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

      // fourth hori
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-560,y-10,-101);
          mesh.scale.set(15,1,2);
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

      // fifth stretch
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-680,y-10, 90);
          mesh.rotation.set(0, Math.PI/2, 0);
          mesh.scale.set(25.5,1,2);
          
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

      // sixth backish
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-525,y-10, 280);
          // mesh.rotation.set(0, Math.PI/2, 0);
          mesh.scale.set(20,1,2);
          
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

      // seventh seg
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-370,y-10, 399);
          mesh.rotation.set(0, Math.PI/2, 0);
          mesh.scale.set(15.4,1,2);
          
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

      // last hori
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(-181,y-10, 518);
          // mesh.rotation.set(0, Math.PI/2, 0);
          mesh.scale.set(24.8,1,2);
          
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

      // final stretch
      loader.load(
        // resource URL
        roadPiece,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5,y-10, 230);
          mesh.rotation.set(0, Math.PI/2, 0);
          mesh.scale.set(38.8,1,2);
          
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

    drawTrees(loader, y, scene, x, z){
      const tree =  './resources/tree/scene.gltf';
      // going left trees
      loader.load(
        // resource URL
        tree,
        // called when the resource is loaded
        function ( gltf ) {

          let mesh = gltf.scene;
          mesh.position.set(5+x,y-10,-400+z);
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
          mesh.position.set(-20+x,y-10,-400+z);
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
          mesh.position.set(-45+x,y-10,-400+z);
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
          mesh.position.set(-70+x,y-10,-400+z);
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
          mesh.position.set(-95+x,y-10,-400+z);
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
          mesh.position.set(-115+x,y-10,-400+z);
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
          mesh.position.set(-135+x,y-10,-400+z);
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
      this.loadModels();
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
      const far = 2000.0;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.set(-450,this.y-10,-180);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      // this.camera.position.set(0, 0, -400);
      // this.camera.lookAt(new THREE.Vector3(-200, 0, 0));
    }

    setUpPhysics(){
      if (this.useVisuals){
        this.helper = new CannonHelper(this.scene);
        // this.helper.addLights(this.renderer);
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
      this.debugRenderer = new THREE2.CannonDebugRenderer(this.scene, this.world);

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
      light = new THREE.AmbientLight(0x404040);
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



function handleState(){
  if(isPlaying){
    _APP = new Game();
  }
  else if(!isPlaying){
    let startBtn = document.getElementById("start_race_button");
    let isCar1 = document.getElementById("car-1");
    let isCar2 = document.getElementById("car-2");

    isCar1.onclick = (e) => {
      car1Or2 = 1;
    }
    isCar2.onclick = (e) => {
      car1Or2 = 2;
    }
    startBtn.onclick = (e) => {
      isPlaying = true;
      let menu = document.getElementById("menu");
      menu.style.display = 'none';
      document.querySelector("#back_button").style.display = "none";
      document.querySelector(".in-game-menu-container").style.display = "flex";
      handleState();
    };
  }
}

window.addEventListener('DOMContentLoaded', () =>{
    handleState();
});