/* eslint-disable no-unused-vars */
import "./App.css";
import { ARButton } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function App() {
  let camera, scene, renderer, controller, reticle;
  let model = null;

  init();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(
      ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
      })
    );

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Model yükle
    const loader = new GLTFLoader();

    loader.load("/AR-Code-Object-Capture-app-1751148845.glb", function (gltf) {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
    });

    // Reticle (yeşil halka)
    const geometry = new THREE.RingGeometry(0.1, 0.15, 32).rotateX(
      -Math.PI / 2
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    reticle = new THREE.Mesh(geometry, material);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    // Hit test setup
    renderer.xr.addEventListener("sessionstart", () => {
      const session = renderer.xr.getSession();

      session.requestReferenceSpace("viewer").then((refSpace) => {
        session
          .requestHitTestSource({ space: refSpace })
          .then((hitTestSource) => {
            renderer.setAnimationLoop((timestamp, frame) => {
              if (frame) {
                const referenceSpace = renderer.xr.getReferenceSpace();
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length > 0) {
                  const hit = hitTestResults[0];
                  const pose = hit.getPose(referenceSpace);
                  reticle.visible = true;
                  reticle.matrix.fromArray(pose.transform.matrix);
                } else {
                  reticle.visible = false;
                }
              }

              renderer.render(scene, camera);
            });
          });
      });
    });

    // Ekrana dokununca model yerleştir
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", () => {
      if (reticle.visible && model) {
        const clone = model.clone();
        clone.position.setFromMatrixPosition(reticle.matrix);
        scene.add(clone);
      }
    });
    scene.add(controller);
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-3 h-full"
      style={{ zIndex: 1000 }}
    >
      <h1 className="text-3xl font-bold flex items-center">DEMO</h1>
      <div className="flex flex-col items-center justify-start">
        <img
          className="w-full max-w-[500px]"
          src="/augmented%2Breality-1330571993186822657_256px-removebg-preview.png"
          alt=""
          srcset=""
        />
        <p className="uppercase">Click Start Ar</p>
      </div>
    </div>
  );
}

export default App;
