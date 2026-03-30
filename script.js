// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // 2. Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const roles = ["Graphic Designer", "Web Developer", "Digital Marketer", "Educator", "Customer Support Specialist"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.skill-category, .project-card, .timeline-content-v2, .about-content, .stat-item');
    revealElements.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 4. Parallax Hero Background
    if (document.querySelector('.hero')) {
        gsap.to('.mandala-bg', {
            y: (index, target) => index === 0 ? 100 : -100,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // 5. Animated Stats (About Page)
    const stats = document.querySelectorAll('.stat-item h2');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: stat,
            start: "top 90%",
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const speed = target / 50;
                    if (count < target) {
                        count += speed;
                        stat.innerText = Math.ceil(count) + "+";
                        setTimeout(updateCount, 30);
                    } else {
                        stat.innerText = target + "+";
                    }
                };
                updateCount();
            }
        });
    });

    // 6. Experience Timeline Progress Line
    if (document.querySelector('.timeline-progress')) {
        gsap.to('.timeline-progress', {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline-v2",
                start: "top center",
                end: "bottom center",
                scrub: true
            }
        });
    }

    // 7. Navbar Entry Animation (Disabled for visibility troubleshooting)
    /*
    const navIcons = document.querySelectorAll('.nav-links a, .nav-brand, .btn-nav-icon');
    gsap.from(navIcons, {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
        delay: 0.5
    });
    */

    // 8. Contact Form Success Simulation
    const form = document.getElementById('contact-form');
    // ... rest of the form logic
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalContent = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = '#28a745';
                btn.style.color = '#fff';
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.style.background = 'var(--accent-amber)';
                    btn.style.color = 'var(--bg-charcoal)';
                }, 3000);
            }, 1500);
        });
    }
});
