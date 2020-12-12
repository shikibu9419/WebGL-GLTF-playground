window.addEventListener('DOMContentLoaded', init);

let camera = null;
let cameraInit = true
let controls;
const RADIUS = 150

function init() {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
  });
  // ウィンドウサイズ設定
  width = document.getElementById('main_canvas').getBoundingClientRect().width;
  height = document.getElementById('main_canvas').getBoundingClientRect().height;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(VRButton.createButton(renderer))

  let mixer;
  let clock = new THREE.Clock();

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.x = 0;
  camera.position.y = 100;
  camera.lookAt(RADIUS, 100, 0)

  const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

  var effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  const manager = new WebVRManager(renderer, effect);

  // Load GLTF or GLB
  const loader = new THREE.GLTFLoader();
  const url = 'scene.gltf';

  let model = null;
  loader.load(
    url,
    function (gltf) {
      console.log(gltf)

      model = gltf.scene;
      console.log(model)
      model.scale.set(10, 10, 10);

      // console.log(textures)
      // // Animation Mixerインスタンスを生成
      // mixer = new THREE.AnimationMixer(copy);
      // // console.log(animation)
      // let action = mixer.clipAction(gltf.animations[0]);

      // //ループ設定
      // action.setLoop(THREE.LoopRepeat);

      // //アニメーションの最後のフレームでアニメーションが終了
      // action.clampWhenFinished = true;

      // //アニメーションを再生
      // action.play();
      // console.log(copy)
      scene.add(model);
    },
    function (error) {
      console.log('An error happened');
      console.log(error);
    }
  );
  renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.gammaOutput = true;
  // renderer.gammaFactor = 2.2;

  const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
  scene.add(light);
  // // 平行光源
  // const light = new THREE.DirectionalLight(0xFFFFFF);
  // // light.intensity = 2; // 光の強さを倍に
  // light.position.set(1, 1, 1);
  // // シーンに追加
  // scene.add(light);

  axis = new THREE.AxesHelper(1000);
  scene.add(axis)

  // renderer.xr.enabled = true;

  // 初回実行
  tick();

  function tick() {
    const r = 400;
    // vrControls.update();
    orbitControls.update(clock.getDelta());
    // pointerLockUpdate(orbitControls, clock.getDelta())

    // if (model != null) {
    //   console.log(model);
    // }
    // renderer.render(scene, camera);
    // camera.lookAt(200, 0, 0)

    requestAnimationFrame(tick);

    // camera.lookAt(r * Math.sin(2 * Math.PI / 360 * i), r * Math.cos(2 * Math.PI / 360 * i) + r, 0)
    // i++;
    // console.log(i)
    // camera.lookAt(0)

    if(mixer) {
      mixer.update(clock.getDelta());
    }

    manager.render(scene, camera)
  }
}