// 3D Fish Swimming Background Animation using Three.js
(function () {
    const canvas = document.getElementById('fish-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 30;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xE8A430, 0.6, 50);
    pointLight.position.set(-10, 5, 10);
    scene.add(pointLight);

    // Create a single fish group
    function createFish() {
        const fish = new THREE.Group();

        // Body - elongated ellipsoid
        const bodyGeom = new THREE.SphereGeometry(1, 24, 16);
        bodyGeom.scale(2.2, 0.8, 0.7);
        const bodyMat = new THREE.MeshPhongMaterial({
            color: 0xE8A430,
            specular: 0xffffff,
            shininess: 80,
            transparent: true,
            opacity: 0.7
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        fish.add(body);

        // Head - slightly smaller sphere at front
        const headGeom = new THREE.SphereGeometry(0.55, 16, 12);
        headGeom.scale(1.2, 0.85, 0.75);
        const headMat = new THREE.MeshPhongMaterial({
            color: 0xD4922A,
            specular: 0xffffff,
            shininess: 90,
            transparent: true,
            opacity: 0.7
        });
        const head = new THREE.Mesh(headGeom, headMat);
        head.position.x = 1.8;
        fish.add(head);

        // Eye
        const eyeGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMat = new THREE.MeshPhongMaterial({ color: 0x111111, specular: 0xffffff, shininess: 100 });
        const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
        eyeR.position.set(2.1, 0.2, 0.3);
        fish.add(eyeR);
        const eyeL = eyeR.clone();
        eyeL.position.z = -0.3;
        fish.add(eyeL);

        // Tail fin
        const tailGeom = new THREE.BufferGeometry();
        const tailVerts = new Float32Array([
            0, 0, 0,
            -1.2, 0.7, 0,
            -1.2, -0.7, 0
        ]);
        tailGeom.setAttribute('position', new THREE.BufferAttribute(tailVerts, 3));
        tailGeom.computeVertexNormals();
        const tailMat = new THREE.MeshPhongMaterial({
            color: 0xE8A430,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55
        });
        const tail = new THREE.Mesh(tailGeom, tailMat);
        tail.position.x = -2.0;
        fish.add(tail);

        // Dorsal fin
        const dorsalGeom = new THREE.BufferGeometry();
        const dorsalVerts = new Float32Array([
            0, 0, 0,
            0.3, 0.8, 0,
            -0.6, 0.7, 0,
            -0.3, 0, 0
        ]);
        const dorsalIdx = new Uint16Array([0, 1, 2, 0, 2, 3]);
        dorsalGeom.setAttribute('position', new THREE.BufferAttribute(dorsalVerts, 3));
        dorsalGeom.setIndex(new THREE.BufferAttribute(dorsalIdx, 1));
        dorsalGeom.computeVertexNormals();
        const dorsalMat = new THREE.MeshPhongMaterial({
            color: 0xD4922A,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45
        });
        const dorsal = new THREE.Mesh(dorsalGeom, dorsalMat);
        dorsal.position.set(0.2, 0.6, 0);
        fish.add(dorsal);

        // Pectoral fins (side fins)
        const finGeom = new THREE.BufferGeometry();
        const finVerts = new Float32Array([
            0, 0, 0,
            -0.5, -0.4, 0.6,
            -0.2, -0.1, 0.3
        ]);
        finGeom.setAttribute('position', new THREE.BufferAttribute(finVerts, 3));
        finGeom.computeVertexNormals();
        const finMat = new THREE.MeshPhongMaterial({
            color: 0xD4922A,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const finR = new THREE.Mesh(finGeom, finMat);
        finR.position.set(1.0, -0.2, 0.3);
        fish.add(finR);
        const finL = finR.clone();
        finL.position.z = -0.3;
        finL.scale.z = -1;
        fish.add(finL);

        return { group: fish, tail, dorsal, finR, finL };
    }

    // Create multiple fish at different depths
    const fishes = [];
    const fishConfigs = [
        { scale: 1.2, speed: 0.4, yOffset: 2, zOffset: -5, xSpeed: 0.3 },
        { scale: 0.7, speed: 0.55, yOffset: -3, zOffset: 2, xSpeed: 0.45 },
        { scale: 0.5, speed: 0.7, yOffset: 5, zOffset: 5, xSpeed: 0.6 },
        { scale: 0.9, speed: 0.35, yOffset: -1, zOffset: -2, xSpeed: 0.25 },
        { scale: 0.4, speed: 0.65, yOffset: 4, zOffset: 8, xSpeed: 0.5 }
    ];

    fishConfigs.forEach((cfg) => {
        const fish = createFish();
        fish.group.scale.set(cfg.scale, cfg.scale, cfg.scale);
        fish.group.position.set(
            (Math.random() - 0.5) * 60,
            cfg.yOffset + (Math.random() - 0.5) * 4,
            cfg.zOffset
        );
        scene.add(fish.group);
        fishes.push({
            ...fish,
            config: cfg,
            phase: Math.random() * Math.PI * 2,
            baseY: cfg.yOffset
        });
    });

    // Underwater particles (bubbles)
    const particleCount = 60;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xE8A430,
        size: 0.15,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse tracking for subtle camera parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Animate each fish
        fishes.forEach((f) => {
            const t = elapsed * f.config.speed + f.phase;

            // Swimming forward (looping)
            f.group.position.x += f.config.xSpeed * 0.02;
            if (f.group.position.x > 35) f.group.position.x = -35;

            // Vertical bob
            f.group.position.y = f.baseY + Math.sin(t * 0.8) * 1.5;

            // Body wave rotation
            f.group.rotation.z = Math.sin(t * 1.2) * 0.08;
            f.group.rotation.y = Math.sin(t * 0.5) * 0.1;

            // Tail wag
            f.tail.rotation.y = Math.sin(t * 3) * 0.35;

            // Dorsal fin wave
            f.dorsal.rotation.z = Math.sin(t * 2) * 0.1;

            // Pectoral fins flap
            f.finR.rotation.x = Math.sin(t * 2.5) * 0.2;
            f.finL.rotation.x = -Math.sin(t * 2.5) * 0.2;
        });

        // Animate particles upward slowly
        const posArray = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3 + 1] += 0.008;
            if (posArray[i * 3 + 1] > 20) {
                posArray[i * 3 + 1] = -20;
                posArray[i * 3] = (Math.random() - 0.5) * 80;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Subtle camera parallax from mouse
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
