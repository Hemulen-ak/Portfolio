/* 
   Script: 3D Koi Pond & Feeding (Patterned)
   Theme: Glass Mandala (Water Edition)
*/

// --- Canvas Setup ---
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let fish = [];
let food = [];
let ripples = [];
const fishCount = 12;

// Mouse State
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Throttled Ripple Spawn
    const now = Date.now();
    if (now - lastRippleTime > 100) {
        ripples.push(new Ripple(mouse.x, mouse.y));
        lastRippleTime = now;
    }
});
let lastRippleTime = 0;

// Resize Handler
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Ripple Class ---
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 60;
        this.opacity = 0.8;
        this.speed = 1.5;
    }

    update() {
        this.radius += this.speed;
        this.opacity -= 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(44, 122, 123, ' + this.opacity + ')'; // Turquoise Visible
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// --- Food Class ---
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.opacity = 1;
    }

    draw() {
        ctx.fillStyle = '#8B4513'; // Brown pellet
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.x - 1, this.y - 1, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- Koi Fish Class (Patterned) ---
class Koi {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 14; // Slightly larger base size
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.8;
        this.maxSpeed = 3.5; // Fast when hungry

        // Colors for gradients
        // 1. Simrik/Red, 2. Marigold/Gold, 3. White (Pattern Base)
        const types = [
            { main: '#ff4757', highlight: '#ff7e8b', pattern: null },
            { main: '#ffa502', highlight: '#ffc048', pattern: '#2f3542' }, // Gold with Black spots
            { main: '#f1f2f6', highlight: '#ffffff', pattern: '#cf3434' }, // White with Red spots (Kohaku)
            { main: '#f1f2f6', highlight: '#ffffff', pattern: '#2f3542' }  // White with Black spots (Bekko)
        ];
        this.type = types[Math.floor(Math.random() * types.length)];

        // Use pattern color if exists, else body is solid
        this.patternColor = this.type.pattern;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        // 1. Food Seeking
        let closestFood = null;
        let minDist = Infinity;

        food.forEach((f, index) => {
            let dx = f.x - this.x;
            let dy = f.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist && dist < 400) {
                minDist = dist;
                closestFood = f;
            }
            if (dist < 10) {
                food.splice(index, 1);
            }
        });

        if (closestFood) {
            let dx = closestFood.x - this.x;
            let dy = closestFood.y - this.y;
            let angleToFood = Math.atan2(dy, dx);

            let angleDiff = angleToFood - this.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            this.angle += angleDiff * 0.08;
            this.speed = Math.min(this.speed + 0.1, this.maxSpeed);
        } else {
            // 2. Normal Wandering & Mouse Interaction

            // Flee from Mouse Logic (Restored)
            if (mouse.x != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    // Swim away!
                    let angleAway = Math.atan2(dy, dx);
                    let angleDiff = angleAway - this.angle;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                    this.angle += angleDiff * 0.1; // Turn fast
                    this.speed = Math.min(this.speed + 0.2, 4); // Burst speed
                }
            }

            this.speed = Math.max(this.speed - 0.05, 0.8);
            this.angle += (Math.random() - 0.5) * 0.05;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(5, 10, this.size, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fins
        const finWiggle = Math.sin(Date.now() * 0.01) * 0.2;
        ctx.fillStyle = this.type.main; // Fin color matches body base
        ctx.globalAlpha = 0.8;

        // Left & Right Fin
        ctx.save(); ctx.translate(5, -5); ctx.rotate(-Math.PI / 4 + finWiggle);
        ctx.beginPath(); ctx.ellipse(0, -this.size * 0.5, this.size * 0.4, this.size * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

        ctx.save(); ctx.translate(5, 5); ctx.rotate(Math.PI / 4 - finWiggle);
        ctx.beginPath(); ctx.ellipse(0, this.size * 0.5, this.size * 0.4, this.size * 0.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.globalAlpha = 1;

        // Body Gradient
        const grad = ctx.createRadialGradient(-this.size * 0.2, -this.size * 0.2, 0, 0, 0, this.size);
        grad.addColorStop(0, this.type.highlight);
        grad.addColorStop(0.5, this.type.main);
        grad.addColorStop(1, '#a0a0a0');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // --- Patterns ---
        if (this.patternColor) {
            ctx.fillStyle = this.patternColor;
            ctx.globalAlpha = 0.8;
            // Spot 1 (Back)
            ctx.beginPath();
            ctx.arc(-this.size * 0.3, 0, this.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
            // Spot 2 (Head sometimes)
            if (this.size % 2 > 0.5) {
                ctx.beginPath();
                ctx.arc(this.size * 0.4, -this.size * 0.1, this.size * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Tail
        const tailWiggle = Math.sin(Date.now() * 0.015) * 0.3;
        ctx.fillStyle = this.type.main;
        ctx.beginPath();
        ctx.moveTo(-this.size + 2, 0);
        ctx.lineTo(-this.size * 2, -this.size * 0.5 + tailWiggle * 5);
        ctx.lineTo(-this.size * 2, this.size * 0.5 + tailWiggle * 5);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#1e272e';
        ctx.beginPath(); ctx.arc(this.size * 0.6, -this.size * 0.2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(this.size * 0.6, this.size * 0.2, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(this.size * 0.65, -this.size * 0.25, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(this.size * 0.65, this.size * 0.15, 1, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    }
}

// Init Fish
for (let i = 0; i < fishCount; i++) {
    fish.push(new Koi());
}

// --- Feeding Logic (Updated to Button Location) ---
const feedBtn = document.getElementById('feed-btn');
if (feedBtn) {
    feedBtn.addEventListener('click', (e) => {
        // Get button position
        const rect = feedBtn.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Spawn 8 pieces of food starting from button
        for (let i = 0; i < 8; i++) {
            // Random scatter around button
            food.push(new Food(
                startX + (Math.random() - 0.5) * 100,
                startY - (Math.random() * 100 + 50) // Throw slightly upwards/outwards
            ));
        }
        ripples.push(new Ripple(startX, startY));
    });
}
// Keyboard shortcut 'F'
window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        feedBtn.click();
    }
});


// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]; r.update(); r.draw();
        if (r.opacity <= 0) ripples.splice(i, 1);
    }
    food.forEach(f => f.draw());
    fish.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
}

animate();

// --- Tilt & Observer (Preserved) ---
const tiltCards = document.querySelectorAll('.tilt-card');
if (tiltCards.length > 0) {
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}
function handleTilt(e) { /* ... same as before */
    const card = this;
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / (cardRect.height / 2)) * -5;
    const rotateY = (mouseX / (cardRect.width / 2)) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}
function resetTilt() { this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`; }

document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });

    // Nav Active State
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 300)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') link.classList.add('active');
        });
    });
});