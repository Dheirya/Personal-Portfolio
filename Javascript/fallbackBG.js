let ctx, canvasWidth, canvasHeight;
let clouds = [];
let windParticles = [];
function runFallback(canvas) {
    ctx = canvas.getContext('2d');
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    createClouds(8);
    createWindParticles(24);
    animateBackground();
}
function createWindParticle() {
    const type = Math.random() < 0.6 ? 'dot' : 'streak';
    if (type === 'dot') {
        return {
            type, x: Math.random() * canvasWidth * 0.75, y: Math.random() * canvasHeight,
            size: 0.5 + Math.random() * 1.5, speedX: 1 + Math.random() * 4,
            speedY: (Math.random() - 0.5) * 0.3, opacity: 0.3 + Math.random() * 0.4
        };
    } else {
        const length = 15 + Math.random() * 25;
        const angle = -0.1 + Math.random() * 0.2;
        return {
            type, x: Math.random() * canvasWidth * 0.75, y: Math.random() * canvasHeight,
            length, angle, speedX: 1 + Math.random() * 2,
            speedY: (Math.random() - 0.5) * 0.4, opacity: 0.2 + Math.random() * 0.3,
            width: 1 + Math.random()
        };
    }
}
function createWindParticles(count) {
    const spacing = canvasHeight / count;
    for (let i = 0; i < count; i++) {
        const y = i * spacing + (Math.random() - 0.5) * spacing * 0.9;
        const p = createWindParticle();
        p.y = y;
        windParticles.push(p);
    }
}
function drawWindParticle(p) {
    ctx.globalAlpha = p.opacity;
    if (p.type === 'dot') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, pi2);
        ctx.fill();
    } else {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
            p.x + p.length * Math.cos(p.angle),
            p.y + p.length * Math.sin(p.angle)
        );
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}
function createClouds(count) {
    const minDistance = 200;
    let attempts = 0;
    while (clouds.length < count && attempts < count * 10) {
        const size = 20 + Math.random() * 30;
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const newCloud = {
            x, y, size,
            speed: 0.05 + Math.random() * 0.2,
            dir: Math.random() < 0.5 ? -1 : 1,
            h1: Math.floor(Math.random() * 4) + 1
        };
        let tooClose = clouds.some(c => {
            const dx = c.x - newCloud.x;
            const dy = c.y - newCloud.y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance + size + c.size;
        });
        if (!tooClose) clouds.push(newCloud);
        attempts++;
    }
}
function drawCloud(x, y, size, dir, h1) {
    ctx.fillStyle = '#e7d9bb';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, pi2);
    let s1 = h1 === 2 ? 0.7 : 0.5;
    let s2 = h1 === 3 ? 0.7 : 0.5;
    if (h1 !== 1) {
        ctx.arc(x + dir * size * 0.6, y - dir * size * 0.4, size * 0.8, 0, pi2);
        ctx.arc(x - dir * size * 0.6, y - dir * size * 0.4, size * 0.8, 0, pi2);
    }
    ctx.arc(x + dir * size, y, size * s1, 0, pi2);
    ctx.arc(x - dir * size, y, size * s2, 0, pi2);
    ctx.lineWidth = size * 0.1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.stroke();
    ctx.fill();
}
function drawBackground() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let p of windParticles) drawWindParticle(p);
    for (let c of clouds) drawCloud(c.x, c.y, c.size, c.dir, c.h1);
}
function animateBackground() {
    for (let c of clouds) {
        c.x += c.speed;
        if (c.x - c.size * 2 > canvasWidth) c.x = -c.size * 2;
    }
    for (let i = windParticles.length - 1; i >= 0; i--) {
        const p = windParticles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        const maxX = p.type === 'streak' ? p.x + p.length : p.x;
        if (maxX > canvasWidth + 50) {
            windParticles.splice(i, 1);
            windParticles.push(createWindParticle());
        }
    }
    drawBackground();
    requestAnimationFrame(animateBackground);
}