const snowCanvas = document.getElementById('snow-canvas');
const ctx = snowCanvas.getContext('2d');

let particles = [];
let animationId;

const config = {
    particleCount: 40,
    maxSpeed: 1.5,
    minSpeed: 0.3,
    maxSize: 4,
    minSize: 1,
    maxOpacity: 0.8,
    minOpacity: 0.2,
    windStrength: 0.5,
    flickerSpeed: 0.02
};

function resizeCanvas() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        size: config.minSize + Math.random() * (config.maxSize - config.minSize),
        speedY: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
        speedX: (Math.random() - 0.5) * config.windStrength,
        opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
        flickerOffset: Math.random() * Math.PI * 2
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(createParticle());
    }
}

function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();
}

function updateParticle(particle) {
    particle.y += particle.speedY;
    particle.x += particle.speedX;
    particle.flickerOffset += config.flickerSpeed;
    particle.opacity = particle.opacity + Math.sin(particle.flickerOffset) * 0.01;

    if (particle.y > snowCanvas.height) {
        particle.y = -5;
        particle.x = Math.random() * snowCanvas.width;
    }

    if (particle.x > snowCanvas.width) {
        particle.x = 0;
    } else if (particle.x < 0) {
        particle.x = snowCanvas.width;
    }
}

function animate() {
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    for (const particle of particles) {
        updateParticle(particle);
        drawParticle(particle);
    }

    animationId = requestAnimationFrame(animate);
}

function startSnow() {
    resizeCanvas();
    initParticles();
    animate();
}

function stopSnow() {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

startSnow();
