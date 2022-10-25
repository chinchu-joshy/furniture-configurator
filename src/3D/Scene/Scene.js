import React, { useEffect } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import FBXLoader from 'three-fbx-loader'
function Scene() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.lookAt(0, 0, 0);
    const canvas = document.querySelector(".canvas");

    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    // adding venus

    window.scene = scene;

    const pointLight = new THREE.PointLight(0xffffff, 1);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.set(8, 5, 5);
    pointLight2.position.set(-8, -5, -5);
    scene.add(pointLight);
    scene.add(pointLight2);
    camera.position.set(4, 4, 8);
    // event listeners

    renderer.setSize(400, 500);
    window.addEventListener("resize", onResize, false);
    const animation = () => {
      requestAnimationFrame(animation);

      controls.update();
      renderer.render(scene, camera);
    };
//  function preloadTexture(){
//   const textureLoader = new THREE.TextureLoader()
//   const textureArray=[]
//   new Promise((resolve,reject)=>{
//     for (const key in this.textures) {
//       this.texturePromises.push(
//         new Promise((resolve, reject) => {
//           textureLoader.load(baseURL + '/' + this.textures[key], (texture) => {
//             this.loadedTextures[key] = texture
//             resolve(texture)
//           })
//         })
//       )
//     }

//     Promise.all(this.texturePromises).then((res) => {
//       if (initialModel) {
//         this.preloadModel(modelName, false, callBack, mode)
//       }
//     })
//   })
//  }
const loadModel = new FBXLoader();

// loadModel.load('../../Model/chair.fbx', function (object3d) {
//   console.log(object3d)
//   console.log('heloo')
//   scene.add(object3d);
// });
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    animation();
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.width, canvas.height);
    }
  }, []);
  return (
    <div className="home">
      <canvas className="canvas"></canvas>
    </div>
  );
}
export default Scene;
