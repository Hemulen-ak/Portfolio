// Anime School Theme Scripts
// Sakura Rain Animation

document.addEventListener('DOMContentLoaded', () => {
    console.log("Anime School Theme Loaded!");
    initSakuraRain();
    initTypingEffect();
});

function initSakuraRain() {
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let petals = [];

    // Petal class
    class Petal {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 10 + 5;
            this.speed = Math.random() * 2 + 1;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.color = `rgba(255, 183, 178, ${Math.random() * 0.5 + 0.3})`; // Sakura Pink
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.angle * Math.PI / 180) * 0.5;
            this.angle += this.spin;

            if (this.y > height) {
                this.y = -20;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Simple petal shape
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.size / 2, -this.size / 2, this.size, 0);
            ctx.quadraticCurveTo(this.size / 2, this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);

        // Create petals
        for (let i = 0; i < 50; i++) {
            petals.push(new Petal());
        }

        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
}

function initTypingEffect() {
    // Simple effect to make text appear as if being typed in a visual novel
    const title = document.querySelector('.hero-title');
    if (title) {
        title.style.opacity = '1'; // Ensure visible
        // More complex typing logic could go here if requested
    }
}