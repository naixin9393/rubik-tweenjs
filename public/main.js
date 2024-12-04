import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import RubikCube from "./rubik-cube.js";

let scene, renderer;
let camera;
let objetos = [];

init();
loop();

function init() {
    setScene();
    setControls(camera, renderer.domElement);

    const rubikCube = new RubikCube();
    rubikCube.addToScene(scene);
}

function loop() {
    requestAnimationFrame(loop);
    // TWEEN.update();
    renderer.render(scene, camera);
}

function setScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(4, 2.5, 4);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function setControls(camera, dom) {
    const controls = new OrbitControls(camera, dom);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
}