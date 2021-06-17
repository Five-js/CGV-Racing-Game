const engine = new Audio("./resources/eng.mp3");
const boost = new Audio("./resources/turbo.mp3");
const rev = new Audio("./resources/rev.wav");

export class BasicCharacterControllerInput {
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
          engine.play();
          break;
        case 65: // a
          this._keys.left = true;
          // engine.play();
          break;
        case 83: // s
          this._keys.backward = true;
          rev.play();
          break;
        case 68: // d
          this._keys.right = true;
          // engine.play();
          break;
        case 32: // SPACE
          this._keys.space = true;
          break;
        case 16: // SHIFT
          this._keys.shift = true;
          boost.play();
          break;
      }
    }
  
    _onKeyUp(event) {
      switch(event.keyCode) {
        case 87: // w
          this._keys.forward = false;
          engine.pause();
          engine.currentTime = 0;
          break;
        case 65: // a
          this._keys.left = false;
          break;
        case 83: // s
          this._keys.backward = false;
          rev.pause();
          rev.currentTime = 0;
          break;
        case 68: // d
          this._keys.right = false;
          break;
        case 32: // SPACE
          this._keys.space = false;
          break;
        case 16: // SHIFT
          this._keys.shift = false;
          boost.pause();
          boost.currentTime = 0;
          break;
      }
    }
  };