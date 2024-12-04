import * as THREE from "three";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";

export default class RubikCube {
    cubies = [];
    animating = false;

    constructor() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new THREE.BoxGeometry(0.99, 0.99, 0.99);

                    const materials = [
                        new THREE.MeshBasicMaterial({ color: colors.right }), // Right
                        new THREE.MeshBasicMaterial({ color: colors.left }), // Left
                        new THREE.MeshBasicMaterial({ color: colors.top }), // Top
                        new THREE.MeshBasicMaterial({ color: colors.bottom }), // Bottom
                        new THREE.MeshBasicMaterial({ color: colors.front }), // Front
                        new THREE.MeshBasicMaterial({ color: colors.back }), // Back
                    ];

                    const cubie = new THREE.Mesh(geometry, materials);
                    
                    const edges = new THREE.EdgesGeometry(geometry);
                    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
                    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
                    cubie.add(edgeLines); 

                    cubie.position.set(x, y, z);
                    cubie.logicalPosition = { x, y, z };
                    this.cubies.push(cubie);
                }
            }
        }
    }

    addToScene(scene) {
        this.scene = scene;
        for (let cubie of this.cubies) {
            scene.add(cubie);
        }
    }
    
    removeFromScene(scene) {
        for (let cubie of this.cubies) {
            scene.remove(cubie);
        }
    }

    applyMove({ face, clockwise = true }) {
        if (this.animating) return;
        this.animating = true;
        const direction = clockwise ? 1 : -1;
        const group = new THREE.Group();

        for (let cubie of this.#getCubiesFromFace(face)) {
            group.add(cubie);
        }

        this.scene.add(group);

        const axis = { x: 0, y: 0, z: 0 };
        switch (face) {
            case "M":
            case "L":
                axis.x = (Math.PI / 2) * direction;
                break;
            case "R":
                axis.x = -(Math.PI / 2) * direction;
                break;
            case "U":
                axis.y = -(Math.PI / 2) * direction;
                break;
            case "E":
            case "D":
                axis.y = (Math.PI / 2) * direction;
                break;
            case "S":
            case "F":
                axis.z = -(Math.PI / 2) * direction;
                break;
            case "B":
                axis.z = (Math.PI / 2) * direction;
                break;
        }

        new TWEEN.Tween(group.rotation)
            .to(axis, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                group.updateMatrixWorld(true);

                while (group.children.length > 0) {
                    const cubie = group.children[0];
                    cubie.applyMatrix4(group.matrixWorld);
                    this.scene.add(cubie);
                }

                this.scene.remove(group);

                this.#updateLogicalPositions(face, clockwise);
                this.animating = false;
            })
            .start();
    }

    #getCubiesFromFace(face) {
        return this.cubies.filter(({ logicalPosition }) => {
            switch (face) {
                case "L":
                    return logicalPosition.x === -1;
                case "R":
                    return logicalPosition.x === 1;
                case "U":
                    return logicalPosition.y === 1;
                case "D":
                    return logicalPosition.y === -1;
                case "F":
                    return logicalPosition.z === 1;
                case "B":
                    return logicalPosition.z === -1;
                case "M":
                    return logicalPosition.x === 0;
                case "E":
                    return logicalPosition.y === 0;
                case "S":
                    return logicalPosition.z === 0;
                default:
                    return false;
            }
        });
    }

    #getRotationAxis(face) {
        switch (face) {
            case "L":
            case "M":
            case "R":
                return "x";
            case "U":
            case "D":
            case "E":
                return "y";
            case "F":
            case "S":
            case "B":
                return "z";
            default:
                throw new Error("Invalid face");
        }
    }

    #updateLogicalPositions(face, clockwise) {
        const axis = this.#getRotationAxis(face);
        const affectedCubies = this.#getCubiesFromFace(face);
        const rotatingAngle = clockwise ? -Math.PI / 2 : Math.PI / 2;

        const rotate90 = (pos, axis1, axis2, direction) => {
            const temp = pos[axis1];
            pos[axis1] = direction > 0 ? -pos[axis2] : pos[axis2];
            pos[axis2] = direction > 0 ? temp : -temp;
        };

        for (let cubie of affectedCubies) {
            const pos = cubie.logicalPosition;

            switch (face) {
                case "S":
                case "F":
                    rotate90(pos, "x", "y", rotatingAngle > 0 ? 1 : -1);
                    break;
                case "B":
                    rotate90(pos, "x", "y", rotatingAngle > 0 ? -1 : 1);
                    break;
                case "M":
                case "L":
                    rotate90(pos, "y", "z", rotatingAngle > 0 ? -1 : 1);
                    break;
                case "R":
                    rotate90(pos, "y", "z", rotatingAngle > 0 ? 1 : -1);
                    break;
                case "U":
                    rotate90(pos, "x", "z", rotatingAngle > 0 ? -1 : 1);
                    break;
                case "E":
                case "D":
                    rotate90(pos, "x", "z", rotatingAngle > 0 ? 1 : -1);
                    break;
            }

            cubie.logicalPosition = pos;
        }
    }
}

const colors = {
    front: 0xff4444, // Red
    back: 0xff8000, // Orange
    left: 0x0000ff, // Blue
    right: 0x00aa00, // Green
    top: 0xdddd33, // Yellow
    bottom: 0xdddddd, // White
};
