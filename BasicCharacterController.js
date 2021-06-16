import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {BasicCharacterControllerInput} from './BasicCharacterControllerInput.js';

export class BasicCharacterController {
    constructor(params) {
      this._Init(params);
    }
  
    _Init(params) {
      this._params = params;
      this._target = this._params.target;
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(1, 0.1, 200.0);
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
  
    Update(timeInSeconds, hasWon) {
  
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
      let _R = new CANNON.Quaternion();
      _R = _R.copy(this._target.quaternion.clone());
  
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
        // _R.multiply(_Q);
        _R = _R.mult(_Q);
      }
      if (this._input._keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        // _R.multiply(_Q);
        _R = _R.mult(_Q);
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
  
      if(this._target.position.x <= 55 && this._target.position.x >= -50 && this._target.position.z < -56 && this._target.position.z > -58){
        hasWon = true;
      }
      
  
    }
  
  }