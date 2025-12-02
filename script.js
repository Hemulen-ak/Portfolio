document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initWisteriaParticles(); // Demon Slayer Animation
    initGlitchEffect();
    initWaterBreathing(); // New
    initSwordSlash(); // New
});

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('.demon-card, .mission-card, .archive-scroll, .contact-crow, .hero-content');

    targets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });

    // Active Nav Link Logic
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.dock-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = 'var(--text-light)';
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--nezuko-pink)';
            }
        });
    });
}

/* --- Wisteria Particles (Canvas) --- */
function initWisteriaParticles() {
    const canvas = document.getElementById('wisteriaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -10;
            this.vx = (Math.random() - 0.5) * 1; // Drift left/right
            this.vy = Math.random() * 1.5 + 0.5; // Fall speed
            this.size = Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.color = Math.random() > 0.5 ? '255, 159, 243' : '155, 89, 182'; // Pink or Purple
            this.alpha = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;

            // Sway motion
            this.x += Math.sin(this.y * 0.01) * 0.5;

            if (this.y > height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.beginPath();
            // Draw a simple petal shape
            ctx.ellipse(0, 0, this.size, this.size * 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- Glitch Effect for Hero Title --- */
function initGlitchEffect() {
    const glitchText = document.querySelector('.breath-title');
    if (!glitchText) return;

    const originalText = glitchText.innerText;
    const chars = '水炎雷獣蟲霞風恋蛇岩音'; // Kanji for breathing styles

    glitchText.addEventListener('mouseover', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchText.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 50);
    });
}

/* --- Water Breathing Trail --- */
function initWaterBreathing() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.4) return; // Limit particle density

        const trail = document.createElement('div');
        trail.classList.add('water-trail');
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 800);
    });
}

/* --- Sword Slash Effect --- */
function initSwordSlash() {
    document.addEventListener('click', (e) => {
        const slash = document.createElement('div');
        slash.classList.add('sword-slash');
        slash.style.left = `${e.clientX}px`;
        slash.style.top = `${e.clientY}px`;

        // Random rotation for variety
        const angle = Math.random() * 360;
        slash.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        document.body.appendChild(slash);

        setTimeout(() => {
            slash.remove();
        }, 400);
    });
}