/* 
   Script: 3D Background & UX Interactions
   Theme: Dimensional Flow
*/

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollObserver();
});

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Light fog for depth
    scene.fog = new THREE.FogExp2(0xf5f7fa, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles (Creative Elements)
    const particleCount = 150; // Slightly reduced count for complex shapes
    const particles = new THREE.Group();

    // Geometries - Varied shapes for "Creative/Tech" mix
    const geometries = [
        new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8), // Complex
        new THREE.OctahedronGeometry(0.6), // Sharp
        new THREE.TetrahedronGeometry(0.5), // Simple
        new THREE.IcosahedronGeometry(0.5, 0) // Classic
    ];

    // Theme Colors: Coral, Teal, Sunshine, plus Creative Purple & Deep Blue
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa55eea, 0x45aaf2];

    for (let i = 0; i < particleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7,
            wireframe: Math.random() > 0.8 // 20% wireframe for "Tech" feel
        });

        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);

        // Random spread
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;

        // Random velocity & rotation
        mesh.userData = {
            velX: (Math.random() - 0.5) * 0.05,
            velY: (Math.random() - 0.5) * 0.05,
            velZ: (Math.random() - 0.5) * 0.05,
            rotX: (Math.random() - 0.5) * 0.02,
            rotY: (Math.random() - 0.5) * 0.02
        };

        particles.add(mesh);
    }
    scene.add(particles);

    // Lines (Connections)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x2d3436,
        transparent: true,
        opacity: 0.15
    });

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Rotate group slightly based on mouse
        particles.rotation.y += 0.001 + (targetX - particles.rotation.y) * 0.0005;
        particles.rotation.x += 0.001 + (targetY - particles.rotation.x) * 0.0005;

        // Float particles
        particles.children.forEach(p => {
            p.position.x += p.userData.velX;
            p.position.y += p.userData.velY;
            p.position.z += p.userData.velZ;

            // Individual rotation
            p.rotation.x += p.userData.rotX;
            p.rotation.y += p.userData.rotY;

            // Boundary check (loop around)
            if (p.position.x > 50) p.position.x = -50;
            if (p.position.x < -50) p.position.x = 50;
            if (p.position.y > 50) p.position.y = -50;
            if (p.position.y < -50) p.position.y = 50;
            if (p.position.z > 50) p.position.z = -50;
            if (p.position.z < -50) p.position.z = 50;
        });

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initScrollObserver() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    // 1. Scroll Active Highlighter
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navItems.forEach(item => item.classList.remove('active'));

                // Add active to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));

    // 2. Simple Entrance Animations
    const fadeInElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}