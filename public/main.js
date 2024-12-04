import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import RubikCube from "./rubik-cube.js";

let scene, renderer;
let camera;
let objetos = [];

let rubikCube = new RubikCube();

init();
loop();

function init() {
    setScene();
    setControls(camera, renderer.domElement);

    rubikCube.addToScene(scene);
    setGUI();
}

function loop() {
    requestAnimationFrame(loop);
    TWEEN.update();
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

function setGUI() {
    const gui = new GUI();
    const folder = gui.addFolder("Movements");
    folder.add({ L: () => rubikCube.applyMove({ face:"L", clockwise:true })}, "L");
    folder.add({ LPrime: () => rubikCube.applyMove({ face:"L", clockwise:false })}, "LPrime").name("L'");
    folder.add({ R: () => rubikCube.applyMove({ face:"R", clockwise:true })}, "R");
    folder.add({ RPrime: () => rubikCube.applyMove({ face:"R", clockwise:false })}, "RPrime").name("R'");
    folder.add({ U: () => rubikCube.applyMove({ face:"U", clockwise:true })}, "U");
    folder.add({ UPrime: () => rubikCube.applyMove({ face:"U", clockwise:false })}, "UPrime").name("U'");
    folder.add({ D: () => rubikCube.applyMove({ face:"D", clockwise:true })}, "D");
    folder.add({ DPrime: () => rubikCube.applyMove({ face:"D", clockwise:false })}, "DPrime").name("D'");
    folder.add({ F: () => rubikCube.applyMove({ face:"F", clockwise:true })}, "F");
    folder.add({ FPrime: () => rubikCube.applyMove({ face:"F", clockwise:false })}, "FPrime").name("F'");
    folder.add({ B: () => rubikCube.applyMove({ face:"B", clockwise:true })}, "B");
    folder.add({ BPrime: () => rubikCube.applyMove({ face:"B", clockwise:false })}, "BPrime").name("B'");
    folder.open();
    const folder2 = gui.addFolder("Reset");
    folder2.add({ Reset: () => { 
        rubikCube.removeFromScene(scene);
        rubikCube = new RubikCube();
        rubikCube.addToScene(scene);
    }}, "Reset");
    
}