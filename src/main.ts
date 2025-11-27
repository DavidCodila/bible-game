import * as THREE from 'three';

const scene = new THREE.Scene();
const skyBlueColour = 0x87ceeb;
scene.background = new THREE.Color(skyBlueColour); // Sky blue

const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();