/*
 * Modern Portfolio & Resource Hub - Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeaderScroll();
    initSakuraAnimation();
    initMobileMenu();
});

/**
 * Initialize Intersection Observer for fade-in animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active state
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navContainer.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navContainer.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize Sakura Petal Animation
 */
function initSakuraAnimation() {
    const container = document.createElement('div');
    container.id = 'sakura-container';
    document.body.prepend(container);

    const petalCount = 30; // Number of petals

    for (let i = 0; i < petalCount; i++) {
        createPetal(container);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('sakura');

    // Randomize size
    const size = Math.random() * 10 + 10; // 10px to 20px
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    // Randomize position
    petal.style.left = `${Math.random() * 100}vw`;

    // Randomize animation duration and delay
    const duration = Math.random() * 5 + 5; // 5s to 10s
    const delay = Math.random() * 5;

    petal.style.animationDuration = `${duration}s, ${Math.random() * 2 + 2}s`; // Fall duration, Sway duration
    petal.style.animationDelay = `-${delay}s, -${Math.random()}s`;

    container.appendChild(petal);

    // Reset petal when it falls out of view to keep DOM light
    petal.addEventListener('animationiteration', () => {
        petal.style.left = `${Math.random() * 100}vw`;
    });
}