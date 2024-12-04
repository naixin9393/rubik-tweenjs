import * as THREE from "three";

export default class RubikCube {
    cubies = [];

    constructor() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);

                    const materials = [
                        new THREE.MeshBasicMaterial({ color: colors.right }), // Right
                        new THREE.MeshBasicMaterial({ color: colors.left }), // Left
                        new THREE.MeshBasicMaterial({ color: colors.top }), // Top
                        new THREE.MeshBasicMaterial({ color: colors.bottom }), // Bottom
                        new THREE.MeshBasicMaterial({ color: colors.front }), // Front
                        new THREE.MeshBasicMaterial({ color: colors.back }), // Back
                    ];

                    const cubie = new THREE.Mesh(geometry, materials);

                    cubie.position.set(x, y, z);
                    this.cubies.push(cubie);
                }
            }
        }
    }

    addToScene(scene) {
        for (let cubie of this.cubies) {
            scene.add(cubie);
        }
    }
    
    applyMove(face, clockwise = true) {
        const direction = clockwise ? 1 : -1;
        for (let cubie of this.#getCubiesFromFace(face)) {
            cubie.rotation.x += Math.PI / 2 * direction;
        }

    }
    
    #getCubiesFromFace(face) {
        let result = [];
        switch (face) {
            case "L":
                result = this.cubies.filter(cubie => cubie.position.x === -1);
                break;
        }
        return result;
    }
}

const colors = {
    front: 0xff4444, // Red
    back: 0xff8000, // Orange
    left: 0x0000ff, // Blue
    right: 0x00ff00, // Green
    top: 0xffff33, // Yellow
    bottom: 0xffffff, // White
};
