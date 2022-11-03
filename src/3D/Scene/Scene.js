import React, { useEffect, useState, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { FaUserEdit, BiQrScan } from "react-icons/fa";
import { SketchPicker, BlockPicker } from "react-color";
import "react-color-palette/lib/css/styles.css";
import { ARButton } from 'three/examples/jsm/Button/arButton'
function Scene() {
  const [sketchPickerColor, setSketchPickerColor] = useState({
    color: "#BEB068",
  });
  const [pickcolor, setPickcolor] = useState(false);
  const [btn, setBtnClicked] = useState(false);
  const pickColor = () => {
    setPickcolor(!pickcolor);
  };
  const ref = useRef(null);
  // destructuring rgba from state
  const loader = new FBXLoader();
  let model;
  let canvas;
  let controls;

  useEffect(() => {
    let color = "#ffffff";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    canvas = document.querySelector(".canvas");
    
    canvas.addEventListener("click", (e) => {
      setPickcolor(false);
    });
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      1,
      10000
    );
    camera.lookAt(0, 0, 0);
    camera.position.set(9, 9, 15);

    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.xr.enabled = true;
    
    window.scene = scene;
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);

    scene.add(directionalLight);
    pointLight.position.set(1, 10, 13);
    pointLight2.position.set(-8, -5, -20);
    scene.add(pointLight);
    //  scene.add(pointLight2);

    // event listeners

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    document.querySelector(".edit").appendChild(ARButton.createButton(renderer));
    console.log(canvas)
    window.addEventListener("resize", onResize, false);
    const animation = () => {
      color = sketchPickerColor?.color;
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
    //           textureLoader.load(baseURL + '/' + this.textures[key], //(texture) => {
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

    // loadModel.load('../../Model/chair.fbx', (object3d) {
    //   console.log(object3d)
    //   console.log('heloo')
    //   // scene.add(object3d);
    // });
    const texture = new THREE.TextureLoader().load(
      "Model/Texture/a_bean bag_AlbedoTransparency.jpg"
    );
    const textureWall = new THREE.TextureLoader().load(
      "Model/a_chair_AlbedoTransparency.jpg"
    );
    const normalTextureChair = new THREE.TextureLoader();
    const textureBase = new THREE.TextureLoader().load(
      "Model/a_ground_AlbedoTransparency.jpg"
    );
    const groundTexture = new THREE.TextureLoader().load(
      "Model/a_ground_AlbedoTransparency.jpg"
    );
    normalTextureChair.load(
      "./Model/a_bean bag_AlbedoTransparency.jpg",
      (loadedTexture) => {
        console.log();
        loader.load(
          "./Model/bean bag.fbx",
          (fbx) => {
            model = fbx;
            console.log(model);
            // const box = new THREE.Box3().setFromObject(model.getObjectByName("Bean_Bag"))
            // console.log(box)
            // const vector = new THREE.Vector3(0, 0, 0)
            // camera.lookAt(box.getSize(vector).x/2, 0, box.getSize(vector).z/2)
            // controls.target = new THREE.Vector3(box.getSize(vector).x/2, 0, box.getSize(vector).z/2)
            // controls.update()
            fbx.traverse((child) => {
              if (child.isMesh && child.name.includes("ground")) {
                child.material = new THREE.MeshStandardMaterial();
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = groundTexture;
                child.material.map.wrapS = THREE.RepeatWrapping;
                child.material.map.wrapT = THREE.RepeatWrapping;
                child.material.needsUpdate = true;
                child.material.map.needsUpdate = true;
              } else {
                child.material = new THREE.MeshStandardMaterial();
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = loadedTexture;
                child.material.color = new THREE.Color(color);
                child.material.map.wrapS = THREE.RepeatWrapping;
                child.material.map.wrapT = THREE.RepeatWrapping;
                child.material.needsUpdate = true;
                child.material.color.needsUpdate = true;
                child.material.map.needsUpdate = true;
              }
            });
            // child.material.color = new THREE.Color(color);
            fbx.scale.set(0.04, 0.04, 0.04);
            // fbx.position.x = 15;
            // fbx.position.z = -130;
            // fbx.position.y = -0.6;
            // fbx.rotation.y=.2;
            scene.add(fbx);
          },
          (progress) => {},
          (error) => {
            console.log("error is", error);
          }
        );
      }
    );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    // controls.target.set(0, 0, 0);
    // camera.lookAt(0, 0, 0);
    controls.minDistance = 5.0;
    controls.maxDistance = 8.0;
    controls.update();
    animation();
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.width, canvas.height);
    }
  }, []);
  useEffect(() => {
    changeColor(sketchPickerColor.color);
  }, [sketchPickerColor.color]);

  const changeColor = useCallback(
    (color) => {
      model?.traverse((child) => {
        if (child.isMesh && !child.name.includes("ground")) {
          child.material.color = new THREE.Color(color);
        }
      });
    },
    [model]
  );

  return (
    <div className="home">
      <div className="icon">
        <ul>
          <li>
            {" "}
            <FaUserEdit />
          </li>
          <li>
            {" "}
            <img className="ar-icon" src="ar-icon.png"></img>
          </li>
        </ul>
      </div>

      <div className="change-color">
        {pickcolor ? (
          <div id="element">
            {" "}
            <SketchPicker
              ref={ref}
              onChange={(color) => {
                setSketchPickerColor({ color: color.hex });
              }}
              color={sketchPickerColor.color}
            />
          </div>
        ) : (
          <button id="btn" onClick={pickColor}>
            Pick Color
          </button>
        )}
      </div>

      <div className="edit"></div>

      <canvas className="canvas"></canvas>
    </div>
  );
}
export default Scene;
