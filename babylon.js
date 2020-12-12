var canvas = document.querySelector("#canvas");
var engine = new BABYLON.Engine(canvas, true);

window.addEventListener('resize', function() {
    engine.resize();
});

var scene = init(engine);

function init(engine) {
  // Create a scene.
  var scene = new BABYLON.Scene(engine);

  // Create a default skybox with an environment.
  // var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);
  // var currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

  // Append glTF model to scene.
  // BABYLON.SceneLoader.Append("./shoebill/", "scene.gltf", scene, function (scene) {

  BABYLON.SceneLoader.ImportMesh(null, "./shoebill/", "scene.gltf", scene, function(result) {
    console.log(result)
    // Create a default arc rotate camera and light.
    //  scene.createDefaultCameraOrLight(true, true, true);

    // The default camera looks at the back of the asset.
    // Rotate the camera by 180 degrees to the front of the asset.
    // scene.activeCamera.alpha += Math.PI;
  });

  return scene;
};
