import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// 1. Scene Setup
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a192f, 0.001); // Subtle fog fading to dark blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background to let CSS shine through or vice versa
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performant

// 2. Data Network Particles
const particleCount = 700;
const positions = new Float32Array(particleCount * 3);
const velocities = [];

for (let i = 0; i < particleCount * 3; i += 3) {
    // Spread widely
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 50 - 10;
    
    velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    });
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Glowing cyan texture material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

// 3. Line Connections (Data Web)
// Calculate lines between close particles (performance intensive so we do it sparsely or just use solid shapes)
// Instead of lines which are CPU heavy, let's add some large abstract geometrical wireframes floating

const geometries = [
    new THREE.IcosahedronGeometry(7, 1),
    new THREE.OctahedronGeometry(5, 0),
    new THREE.TetrahedronGeometry(4, 0)
];

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x4facfe,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

const objects = [];
for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geometries[i % geometries.length], wireframeMaterial);
    mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40 - 20
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    
    // Add velocity for rotation
    mesh.userData = {
        rx: (Math.random() - 0.5) * 0.005,
        ry: (Math.random() - 0.5) * 0.005
    };
    
    scene.add(mesh);
    objects.push(mesh);
}


// 4. Mouse Interactivity
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll interactivity
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// 5. Build Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particle system slowly
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.02;

    // Rotate abstract geometric shapes
    objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rx;
        obj.rotation.y += obj.userData.ry;
        // Float them up/down gently
        obj.position.y += Math.sin(elapsedTime * 0.5 + obj.position.x) * 0.02;
    });

    // Smooth camera mouse tracking
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    
    // Link camera position/scroll slightly
    camera.position.z = 30 + (scrollY * 0.01);

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
