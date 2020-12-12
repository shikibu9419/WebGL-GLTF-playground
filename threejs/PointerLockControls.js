THREE.PointerLockControls = function ( camera, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;

	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

	var PI_2 = Math.PI / 2;

	var vec = new THREE.Vector3();

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion( camera.quaternion );

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max( PI_2 - scope.maxPolarAngle, Math.min( PI_2 - scope.minPolarAngle, euler.x ) );

		camera.quaternion.setFromEuler( euler );

		scope.dispatchEvent( changeEvent );

	}

	function onPointerlockChange() {

		if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { // retaining this method for backward compatibility

		return camera;

	};

	this.getDirection = function () {

		var direction = new THREE.Vector3( 0, 0, - 1 );

		return function ( v ) {

			return v.copy( direction ).applyQuaternion( camera.quaternion );

		};

	}();

	this.moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn( camera.matrix, 0 );

		vec.crossVectors( camera.up, vec );

		camera.position.addScaledVector( vec, distance );

	};

	this.moveRight = function ( distance ) {

		vec.setFromMatrixColumn( camera.matrix, 0 );

		camera.position.addScaledVector( vec, distance );

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		scope.domElement.ownerDocument.exitPointerLock();

	};

	this.connect();

};

THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;

// 呼び出し側

// let moveForward = false;
// let moveBackward = false;
// let moveLeft = false;
// let moveRight = false;
// let canJump = false;

// const onKeyDown = function ( event ) {

//   switch ( event.keyCode ) {

//     case 38: // up
//     case 87: // w
//       moveForward = true;
//       break;

//     case 37: // left
//     case 65: // a
//       moveLeft = true;
//       break;

//     case 40: // down
//     case 83: // s
//       moveBackward = true;
//       break;

//     case 39: // right
//     case 68: // d
//       moveRight = true;
//       break;

//     case 32: // space
//       if ( canJump === true ) velocity.y += 350;
//       canJump = false;
//       break;

//   }
// };

// const onKeyUp = function ( event ) {

//   switch ( event.keyCode ) {

//     case 38: // up
//     case 87: // w
//       moveForward = false;
//       break;

//     case 37: // left
//     case 65: // a
//       moveLeft = false;
//       break;

//     case 40: // down
//     case 83: // s
//       moveBackward = false;
//       break;

//     case 39: // right
//     case 68: // d
//       moveRight = false;
//       break;

//   }
// };

// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

// const velocity = new THREE.Vector3();
// const direction = new THREE.Vector3();

// const pointerLockUpdate = (controls, delta) => {
//   if ( controls.isLocked === true ) {

//     // raycaster.ray.origin.copy( controls.getObject().position );
//     // raycaster.ray.origin.y -= 10;

//     // const intersections = raycaster.intersectObjects( objects );

//     // const onObject = intersections.length > 0;

//     // const delta = ( time - prevTime ) / 1000;

//     velocity.x -= velocity.x * 10.0 * delta;
//     velocity.z -= velocity.z * 10.0 * delta;

//     velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

//     direction.z = Number( moveForward ) - Number( moveBackward );
//     direction.x = Number( moveRight ) - Number( moveLeft );
//     direction.normalize(); // this ensures consistent movements in all directions

//     if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
//     if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

//     // if ( onObject === true ) {

//     //   velocity.y = Math.max( 0, velocity.y );
//     //   canJump = true;

//     // }

//     console.log(velocity)
//     controls.moveRight( - velocity.x * delta );
//     controls.moveForward( - velocity.z * delta );

//     // controls.getObject().position.y += ( velocity.y * delta ); // new behavior

//     // if ( controls.getObject().position.y < 10 ) {

//     //   velocity.y = 0;
//     //   controls.getObject().position.y = 10;

//     //   canJump = true;

//     // }

//   }
// }
