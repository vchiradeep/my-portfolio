/* ==========================================================================
   PORTFOLIO ENGINE — TYPING EFFECT, PARTICLES, SCROLL & FORM SUBMISSION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTypingEffect();
    initParticlesCanvas();
    initTabSwitcher();
    initScrollAnimations();
    initContactForm();
});

/* --------------------------------------------------------------------------
   1. DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const target = document.getElementById("typing-text");
    if (!target) return;

    const phrases = [
        "Aspiring AI & Full-Stack Developer",
        "B.Tech CSE (AI) Student",
        "Building with React, Python & Modern Web Tech",
        "Automation & Vulnerability Enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE CANVAS PARTICLE SYSTEM
   -------------------------------------------------------------------------- */
function initParticlesCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.3)' : 'rgba(157, 78, 221, 0.3)';
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 3;
                    this.y -= Math.sin(angle) * force * 3;
                }
            }
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
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

/* --------------------------------------------------------------------------
   3. TAB SWITCHER (ABOUT SECTION)
   -------------------------------------------------------------------------- */
function initTabSwitcher() {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${target}`);
            if (activeContent) activeContent.classList.add('active');
        });
    });
}

/* --------------------------------------------------------------------------
   4. GSAP SCROLL TRIGGER REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray('.glass-panel').forEach(panel => {
            gsap.from(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: "top 85%"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }
}

/* --------------------------------------------------------------------------
   5. WEB3FORMS SUBMISSION (NO PAGE RELOAD)
   -------------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    alert('Oops! Something went wrong. Please try again.');
                }
            } catch (error) {
                alert('Error sending message. Please check your internet connection.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
} 