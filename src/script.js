import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { clamp } from 'three/src/math/MathUtils.js';

/**
 * Base
 */
// GLTF loader
const gltfLoader = new GLTFLoader()

// Debug
const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);

const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph',
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/***
 *  Lights
 */
// Ambient Light
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 100
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.dampingFactor = 0.04
// controls.minDistance = 5
// controls.maxDistance = 60
// controls.enableRotate = true
// controls.enableZoom = true
// controls.maxPolarAngle = Math.PI /2.5

/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
// scene.add(cube)


/**
 *  Model
 */

// // Texture Loader
// const textureLoader = new THREE.TextureLoader()
// const bakedTexture = textureLoader.load('any.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding


// // Material
// const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture})

// let model;
// gltfLoader.load(
//     'DeskTop.glb',
//     (gltf) => {

//         //for singular object scene only
//         // gltf.scene.traverse((child) => {
//         //     child.material = bakedMaterial
//         // })

//         // Target's specific object only to apply textures
//         screenMesh = gltf.scene.children.find((child) => {
//             return child.name === 'any'
//         })

//         model = gltf.scene
//         model.scale.set(0.5, 0.5, 0.5) 

//         model = gltf.scene;
//         scene.add(model)
//     }
// )

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x18142c, 1);


/**
 *  Gui 
 */
const params = { color: '#ffffff' };

// add a folder for the scene background color
const folder = pane.addFolder({ title: 'Background Color' });

folder.addInput(params, 'color').on('change', () => {
    const color = new THREE.Color(params.color);
    scene.background = color;
});

// For Tweaking Numbers

// // add a number input to the pane
// const params2 = {value: 1};
// const numberInput = pane.addInput(params2, 'value', {
//   min: 1,
//   max: 5,
//   step: 0.001,
// });

// // update the number value when the input value changes
// numberInput.on('change', () => {
//   console.log(`Number value updated to ${params2.value}`);
// });

///
// Define the colors and positions of the gradient stops

/**
 *  using shaders
 */
// const smaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         color1: { value: new THREE.Color('red') },
//         color2: { value: new THREE.Color('yellow') },
//         color3: { value: new THREE.Color('blue') },
//         clickPosition: { value: new THREE.Vector2(0, 0) }

//       },
//     vertexShader,
//     fragmentShader,
//     wireframe: true
//   });
//   smaterial.uniforms.color1.value = new THREE.Color('red');
//   smaterial.uniforms.color2.value = new THREE.Color('yellow');
//   smaterial.uniforms.color3.value = new THREE.Color('blue');

//   // Create a plane and apply the material to it
// const pgeometry = new THREE.CylinderGeometry(20,20, 50,20,20);
// const pplane = new THREE.Mesh(pgeometry, smaterial);
// scene.add(pplane);

// // Add a mouse event listener to the renderer
// renderer.domElement.addEventListener('click', onRendererClick);

// function onRendererClick(event) {
//   // Get the position of the click relative to the renderer
//   const rect = renderer.domElement.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const width = rect.width;
//   const height = rect.height;
//   const clickPosition = new THREE.Vector2(x / width, 1 - y / height);

//   // Update the material clickPosition uniform
//   smaterial.uniforms.clickPosition.value = clickPosition;
// }

/**
 *  using canvas Texture
 */
let canvas2 = document.createElement('canvas');

canvas2.width = 512;
canvas2.height = 512;

let ctx = canvas2.getContext('2d');

let redRadius = 0
let gradientSize = 256

let gradient = ctx.createRadialGradient(256, 256, redRadius, 256, 256, gradientSize);

let obj = { x: 0.5, y: 0 }
gradient.addColorStop(0, '#FF0000');
gradient.addColorStop(obj.x, '#FFFF00');
gradient.addColorStop(0.8, '#0000FF');
gradient.addColorStop(1, '#000000');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas2.width, canvas2.height);

let texture = new THREE.CanvasTexture(canvas2);

let geometry = new THREE.CylinderGeometry(10, 10, 100, 100, 100);
let material = new THREE.MeshBasicMaterial({ map: texture, wireframe: true });
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
mesh.rotation.y = Math.PI
let previousMaterial = null;

function createTexture(u, v) {
    let canvas = document.createElement('canvas');

    canvas.width = 512;
    canvas.height = 512;

    let ctx = canvas.getContext('2d');
    let gradient = ctx.createRadialGradient(u * canvas.width, v * canvas.height, redRadius, u * canvas.width, v * canvas.height, gradientSize);

    gradient.addColorStop(0, '#FF0000');
    gradient.addColorStop(obj.x, '#FFFF00');
    gradient.addColorStop(0.8, '#0000FF');
    gradient.addColorStop(1, '#000000');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let texture = new THREE.CanvasTexture(canvas);
    return texture;
}


function onMouseClick(event) {
    // ctx.clearRect(0,0, sizes.width, sizes.height)
    let mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * -1;

    var raycaster = new THREE.Raycaster();

    console.log('x: ' + mouse.x, 'y: ' + mouse.y);

    obj.x = clamp(mouse.y, 0, 1)
    obj.y = clamp(mouse.x, 0, 1)

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0) {

        let intersection = intersects[0];

        let uv = intersection.uv;

        let texture = createTexture(uv.x, uv.y);

        if (previousMaterial !== null) {
            mesh.material = previousMaterial;
        }

        mesh.material = new THREE.MeshBasicMaterial({ map: texture, wireframe: true });

        previousMaterial = mesh.material;
    }
}




window.addEventListener('click', onMouseClick);


/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    fpsGraph.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // if(model){

    //     // group.rotation.y = elapsedTime 
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    fpsGraph.end()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()