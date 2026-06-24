const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', mouseEvent => {
    cursorGlow.style.left = mouseEvent.clientX + 'px';
    cursorGlow.style.top  = mouseEvent.clientY + 'px';
});

document.querySelectorAll('.glass').forEach(card => {
    card.addEventListener('mousemove', mouseEvent => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${mouseEvent.clientX - rect.left}px`);
        card.style.setProperty('--my', `${mouseEvent.clientY - rect.top}px`);
    });
});

const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('on');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(element => scrollObserver.observe(element));

const navElement = document.getElementById('nav');
const timelineEl = document.querySelector('.timeline');
const tlDots     = document.querySelectorAll('.tl-dot');
const tlItems    = document.querySelectorAll('.tl-item');

function updateTimelineProgress() {
    if (!timelineEl) return;
    const rect    = timelineEl.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalH  = timelineEl.offsetHeight;
    const scrolled = Math.max(0, windowH - rect.top);
    const progress = Math.min(1, scrolled / (totalH + windowH * 0.3));

    timelineEl.style.setProperty('--tl-progress', progress);
    timelineEl.style.setProperty('--tl-mask-stop', progress >= 0.97 ? '100%' : '75%');

    let activeIndex = 0;
    tlItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top + itemRect.height / 2 < windowH * 0.65) {
            activeIndex = index;
        }
    });
    tlDots.forEach((dot, index) => {
        dot.classList.toggle('current', index === activeIndex);
    });
}

window.addEventListener('scroll', () => {
    navElement.classList.toggle('scrolled', window.scrollY > 60);
    updateTimelineProgress();
}, { passive: true });
updateTimelineProgress();

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
    navElement.classList.toggle('menu-open');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', clickEvent => {
        const targetElement = document.querySelector(anchor.getAttribute('href'));
        if (targetElement) {
            clickEvent.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function initBinaryCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const binaryChars = '01';
    const particleCount = 110;
    const particles = Array.from({ length: particleCount }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        char:    binaryChars[Math.floor(Math.random() * 2)],
        opacity: Math.random() * 0.1 + 0.02,
        speed:   Math.random() * 0.28 + 0.08,
        size:    Math.random() > 0.75 ? 13 : 11,
        glowTimer: Math.random() * 200,
    }));

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.glowTimer++;
            const glowPulse = Math.sin(particle.glowTimer * 0.04) * 0.5 + 0.5;
            const finalOpacity = particle.opacity + glowPulse * 0.06;
            ctx.font = `${particle.size}px 'Courier New', monospace`;
            ctx.fillStyle = `rgba(255,138,92,${finalOpacity.toFixed(3)})`;
            ctx.fillText(particle.char, particle.x, particle.y);
            particle.y -= particle.speed;
            if (particle.y < -16) {
                particle.y    = canvas.height + 16;
                particle.x    = Math.random() * canvas.width;
                particle.char = binaryChars[Math.floor(Math.random() * 2)];
            }
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

function decodeText(element, finalText, startDelay) {
    const scramblePool = '01<>{}[]();:/\\|_';
    let frame = 0;
    const totalFrames = 38;

    setTimeout(() => {
        const interval = setInterval(() => {
            element.textContent = finalText.split('').map((letter, index) => {
                const threshold = (index / finalText.length) * totalFrames;
                if (frame > threshold) return letter;
                return scramblePool[Math.floor(Math.random() * scramblePool.length)];
            }).join('');
            frame++;
            if (frame > totalFrames + 4) {
                element.textContent = finalText;
                clearInterval(interval);
            }
        }, 32);
    }, startDelay);
}

function initNameDecode() {
    const firstEl = document.getElementById('decode-first');
    const lastEl  = document.getElementById('decode-last');
    if (firstEl) decodeText(firstEl, firstEl.dataset.final, 400);
    if (lastEl)  decodeText(lastEl,  lastEl.dataset.final,  700);
}

function initTerminal() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const lines = [
        { text: '> initializing...', cls: '' },
        { text: '> loading full_stack.js', cls: '' },
        { text: '  ✓ compiled successfully', cls: 't-ok' },
        { text: '> status: available', cls: 't-ok' },
        { text: '> ready to build.', cls: 't-dim2' },
    ];

    let delay = 600;
    lines.forEach(line => {
        setTimeout(() => {
            const lineEl = document.createElement('div');
            lineEl.classList.add('t-line');
            if (line.cls) lineEl.classList.add(line.cls);
            lineEl.textContent = line.text;
            output.appendChild(lineEl);
        }, delay);
        delay += 420;
    });

    setTimeout(() => {
        const cursorEl = document.createElement('span');
        cursorEl.classList.add('t-cursor');
        output.appendChild(cursorEl);
    }, delay + 100);
}

function animateCounter(element, targetValue, suffix, duration) {
    const startTime = performance.now();
    const startValue = 0;

    function step(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.floor(startValue + (targetValue - startValue) * eased);
        element.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function initCounters() {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            counterObserver.unobserve(entry.target);
            const numEl = entry.target.querySelector('.num');
            if (!numEl) return;
            const raw    = numEl.textContent.trim();
            const match  = raw.match(/^(\d+)(.*)$/);
            if (!match) return;
            animateCounter(numEl, parseInt(match[1], 10), match[2], 1400);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => counterObserver.observe(stat));
}

initBinaryCanvas();
initNameDecode();
initTerminal();
initCounters();
