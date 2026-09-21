/* ==========================================================================
   GLASSMORPHIC OS ENGINE — INTERACTION, PARTICLES & ANIMATIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initParticlesCanvas();
    initDraggableWindows();
    initMagneticButtons();
    init3DTiltCards();
    initGridPositions();
});

/* --------------------------------------------------------------------------
   1. INTERACTIVE CANVAS PARTICLE SYSTEM
   -------------------------------------------------------------------------- */
function initParticlesCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

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
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(157, 78, 221, 0.4)';
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Cursor Repulsion Effect
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 4;
                    this.y -= Math.sin(angle) * force * 4;
                }
            }
        }
    }

    for (let i = 0; i < 70; i++) {
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
   2. DRAGGABLE WINDOWS (INTERACT.JS)
   -------------------------------------------------------------------------- */
function initDraggableWindows() {
    if (window.innerWidth <= 768) return; // Disable dragging on mobile

    interact('.draggable-window').draggable({
        allowFrom: '.window-header',
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });

    // Bring window to top on click
    document.querySelectorAll('.glass-window').forEach(win => {
        win.addEventListener('mousedown', () => {
            document.querySelectorAll('.glass-window').forEach(w => w.style.zIndex = '10');
            win.style.zIndex = '50';
        });
    });
}

/* --------------------------------------------------------------------------
   3. MAGNETIC HOVER BUTTONS (GSAP)
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

/* --------------------------------------------------------------------------
   4. 3D CARD TILT PARALLAX EFFECT
   -------------------------------------------------------------------------- */
function init3DTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

/* --------------------------------------------------------------------------
   5. WORKSPACE GRID INITIALIZATION & RESET
   -------------------------------------------------------------------------- */
function initGridPositions() {
    const isMobile = window.innerWidth <= 768;

    const initialLayout = [
        { id: 'window-hero', x: 40, y: 20 },
        { id: 'window-about', x: 450, y: 20 },
        { id: 'window-projects', x: 860, y: 20 },
        { id: 'window-skills', x: 40, y: 340 },
        { id: 'window-achievements', x: 450, y: 340 }
    ];

    function applyGrid() {
        if (isMobile) return;

        initialLayout.forEach(item => {
            const win = document.getElementById(item.id);
            if (win) {
                gsap.to(win, {
                    x: item.x,
                    y: item.y,
                    duration: 1,
                    ease: "power3.inOut"
                });
                win.setAttribute('data-x', item.x);
                win.setAttribute('data-y', item.y);
            }
        });
    }

    applyGrid();

    // Reset button functionality
    const resetBtn = document.getElementById('resetWorkspaceBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', applyGrid);
    }

    // Navbar focus link trigger
    document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetWin = document.getElementById(targetId);

            if (targetWin) {
                document.querySelectorAll('.glass-window').forEach(w => w.style.zIndex = '10');
                targetWin.style.zIndex = '50';

                gsap.fromTo(targetWin, 
                    { scale: 0.98 }, 
                    { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
                );
            }
        });
    });
}