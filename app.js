/* ==========================================================================
   INTERACTIVE PORTFOLIO ENGINE — PARTICLES, TERMINAL & ANIMATIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    initTypewriter();
    initCardTilting();
    initTabSystem();
    initTerminalCLI();
    initContactFormEngine();
    initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. CANVAS INTERACTIVE PARTICLE NETWORK
   -------------------------------------------------------------------------- */
function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", (e) => {
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
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
        }

        draw() {
            ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
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

            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let angle = Math.atan2(dy, dx);
                let force = (mouse.radius - distance) / mouse.radius;
                this.x -= Math.cos(angle) * force * 4;
                this.y -= Math.sin(angle) * force * 4;
            }
        }
    }

    for (let i = 0; i < 90; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect lines
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 120 - 0.7})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const target = document.getElementById("typewriter");
    if (!target) return;

    const phrases = [
        "Full-Stack Web Engineer",
        "AI Workflow Automation Specialist",
        "B.Tech CSE (AI) Student",
        "Building Intelligent Web Systems"
    ];

    let pIndex = 0;
    let cIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[pIndex];

        if (isDeleting) {
            target.textContent = current.substring(0, cIndex - 1);
            cIndex--;
        } else {
            target.textContent = current.substring(0, cIndex + 1);
            cIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && cIndex === current.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && cIndex === 0) {
            isDeleting = false;
            pIndex = (pIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* --------------------------------------------------------------------------
   3. 3D CARD TILT EFFECT & MOUSE GLOW
   -------------------------------------------------------------------------- */
function initCardTilting() {
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}

/* --------------------------------------------------------------------------
   4. TAB SYSTEM
   -------------------------------------------------------------------------- */
function initTabSystem() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(`tab-${target}`)?.classList.add("active");
        });
    });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE TERMINAL CLI
   -------------------------------------------------------------------------- */
function initTerminalCLI() {
    const input = document.getElementById("terminalInput");
    const body = document.getElementById("terminalBody");

    if (!input || !body) return;

    const commands = {
        help: "Available commands: <span class='text-accent'>about, skills, projects, contact, clear, whoami</span>",
        about: "V Chiradeep — B.Tech CSE (AI) student in Tirupati focusing on Full-Stack Dev and AI Integration.",
        skills: "React.js, Node.js, Express, Python, Supabase, Firebase, Gemini API, n8n Automation.",
        projects: "1. ACE (AI Career Assistant)<br>2. Student Leave Management System",
        contact: "Email form configured! Use the contact section below to reach out.",
        whoami: "guest_user@chiradeep-portfolio"
    };

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.trim().toLowerCase();
            input.value = "";

            const line = document.createElement("div");
            line.className = "terminal-output-line";
            line.innerHTML = `<p><span class="prompt">chiradeep@dev:~$</span> ${cmd}</p>`;
            body.insertBefore(line, input.parentElement);

            const response = document.createElement("div");
            response.className = "terminal-response";

            if (cmd === "clear") {
                const outputs = body.querySelectorAll(".terminal-output-line, .terminal-response");
                outputs.forEach(el => el.remove());
                return;
            }

            if (commands[cmd]) {
                response.innerHTML = `<p class="text-sub">${commands[cmd]}</p>`;
            } else if (cmd !== "") {
                response.innerHTML = `<p style="color: #ff5f56;">Command not found: '${cmd}'. Type 'help' for options.</p>`;
            }

            body.insertBefore(response, input.parentElement);
            body.scrollTop = body.scrollHeight;
        }
    });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM SUBMISSION (WEB3FORMS)
   -------------------------------------------------------------------------- */
function initContactFormEngine() {
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            submitBtn.disabled = true;

            const formData = new FormData(form);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert("Message sent successfully! I will get back to you shortly.");
                    form.reset();
                } else {
                    alert("Failed to send message. Please try again.");
                }
            } catch (err) {
                alert("Network error. Please check your internet connection.");
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

/* --------------------------------------------------------------------------
   7. SCROLL TRIGGER ANIMATIONS (GSAP)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray(".glass-card").forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }
}