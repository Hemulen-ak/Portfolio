/* 
   Script: The Immersive Engine
   Tech: Three.js (WebGL), GSAP (Animation), Lenis (Smooth Scroll)
*/

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initThreeJS();
    initMagneticUI();
    initAnimations();
});

/* ----------------------------------
   1. Smooth Scroll (Lenis)
---------------------------------- */
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

/* ----------------------------------
   2. 3D Background (Three.js)
---------------------------------- */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF3F0EB, 0.0015); // Match Paper Background

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;
    camera.position.y = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles (Wave System)
    const particleCount = 700;
    const particles = new THREE.Group();
    const geometry = new THREE.CircleGeometry(0.5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x121212 }); // Ink Dark

    const particleMesh = new THREE.InstancedMesh(geometry, material, particleCount);
    const dummy = new THREE.Object3D();

    // Create Grid of Particles
    const rows = 25;
    const cols = 28;
    const separation = 8;

    // We will use standard meshes for ease of individual animation in this loop
    // But for performance, InstancedMesh is better. Let's stick to Group of Meshes for wave Logic simplicity
    // Converting to individual meshes for the sine wave effect

    const dots = [];

    for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (x * separation) - ((cols * separation) / 2);
            mesh.position.z = (z * separation) - ((rows * separation) / 2);
            mesh.position.y = 0;

            scene.add(mesh);
            dots.push({ mesh, x: x, z: z, initialY: 0 });
        }
    }

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.05;

        // Wave Logic
        dots.forEach(dot => {
            // Distance from mouse influence
            // Simple sine wave based on time + position
            const waveY = Math.sin((dot.x * 0.5) + time) * 2 + Math.cos((dot.z * 0.3) + time) * 2;

            // Mouse Repulsion / Attraction
            // We'll add a subtle tilt to the whole scene based on mouse

            dot.mesh.position.y = waveY;

            // Scale based on sine
            const scale = (Math.sin((dot.x * 0.5) + time) + 2) * 0.5;
            dot.mesh.scale.set(scale, scale, scale);
        });

        // Camera Sway
        camera.position.x += (mouseX * 20 - camera.position.x) * 0.05;
        camera.position.y += (50 + mouseY * 10 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ----------------------------------
   3. Magnetic UI (Dock)
---------------------------------- */
function initMagneticUI() {
    const dockIcons = document.querySelectorAll('.dock-link');

    dockIcons.forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic Pull
            gsap.to(icon, {
                x: x * 0.5,
                y: y * 0.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });
}

/* ----------------------------------
   4. Cinematic Reveals (GSAP)
---------------------------------- */
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Cover Page Reveal
    const coverTitle = document.querySelector('.cover-title');
    if (coverTitle) {
        gsap.from(coverTitle.children, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 0.2
        });
    }

    // Gallery Items Reveal
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1, // Stagger effect
            ease: 'power2.out'
        });
    });

    // Sticker Float Animation
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(sticker => {
        gsap.to(sticker, {
            y: -20,
            rotation: '+=5',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}
