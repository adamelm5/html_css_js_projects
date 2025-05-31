// Configuration initiale
const fps = 500;
let termWidth;
let termHeight;
let messg = '';
let messg_count = 0;
let oldVelocityX;
let oldVelocityY;
let cornerCollisionCount = 0;

// Élément terminal
const terminal = document.getElementById('terminal');

// Projectile
let projectile = {
    x: 0,
    y: 0,
    vx: 10,
    vy: 10,
};

let time = 0;
let elasticity = 1;

/* initializes the annimation */
function init() {
    updateTerminalSize();
    resetProjectile();
    window.addEventListener('resize', updateTerminalSize);
}

/* terminal size */
function updateTerminalSize() {
    termWidth = 60;
    termHeight = 20;
}

/* resets the projectile's position */
function resetProjectile() {
    projectile.x = Math.floor(termWidth / 2);
    projectile.y = Math.floor(termHeight / 2);
    projectile.vx = 10;
    projectile.vy = 10;
    oldVelocityX = 10;
    oldVelocityY = 10;
    time = 0;
}

/* creates the full string to display */
function createOutput() {
    let output = '\n';

    output += `<span class="info"> Time: ${time.toFixed(1)}s \n Pos: (${projectile.x.toFixed(0)}, ${projectile.y.toFixed(0)})</span>\n`;
    output += `<span class="info"> Speed: ${Math.abs(projectile.vx).toFixed(0)}       (+/- to adjust)</span>`;
       
    output += '\n╔' + '═'.repeat(termWidth - 2) + '╗\n';
   

    for (let y = 0; y < termHeight - 2; y++) {
        output += '║';

        if (Math.round(projectile.y) === y) {
            for (let x = 0; x < termWidth - 2; x++) {
                if (Math.round(projectile.x) === x) {
                    output += '<span class="projectile">DVD</span>';
                    x += 2;
                } else {
                    output += ' ';
                }
            }
        } else {
            output += ' '.repeat(termWidth - 2);
        }
        
        output += '║\n';
    }
    
    output += '╚' + '═'.repeat(termWidth - 2) + '╝\n';
    output += '<span class="projectile">  corner collision count: ' + cornerCollisionCount + '</span>\n';

    if (messg_count > 0) {
        messg_count--;
        output += '<span class="message">' + messg + '</span>';
    }

    terminal.innerHTML = output;
}

/* update the physical conditions */
function update(dt) {
    
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;

    handleCollisions();
    time += dt;

}

/* handle collisions - version améliorée */
function handleCollisions() {

    if (projectile.x <= 0) {
        projectile.vx = Math.abs(projectile.vx) * elasticity;
        oldVelocityX = projectile.vx;
    }
    if (projectile.x >= termWidth - 5) {
        projectile.vx = -Math.abs(projectile.vx) * elasticity;
        oldVelocityX = projectile.vx;
    }
    if (projectile.y <= 0) {
        projectile.vy = Math.abs(projectile.vy) * elasticity;
        oldVelocityY = projectile.vy;
    }
    if (projectile.y >= termHeight - 3) {
        projectile.vy = -Math.abs(projectile.vy) * elasticity;
        oldVelocityY = projectile.vy;
    }

    // Collision avec les côtés
    if ((projectile.x === 0 && projectile.y === 0) ||
        (projectile.x === termWidth - 5 && projectile.y === 0) ||
        (projectile.x === 0 && projectile.y === termHeight - 3) ||
        (projectile.x === termWidth - 5 && projectile.y === termHeight - 3)) {
        cornerCollisionCount++;
    }
}

/* animation loop */
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    if (deltaTime < 0.1)
        update(deltaTime);
    
    createOutput();
    requestAnimationFrame(gameLoop);
}

/* R/r for reset, +/- to adjust velocity, arrows to change direction */
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'r':
        case 'R':
            resetProjectile();
            break;
        case '+':
            projectile.vx = Math.sign(projectile.vx) * (Math.abs(projectile.vx) + 2);
            projectile.vy = Math.sign(projectile.vy) * (Math.abs(projectile.vy) + 2);
            oldVelocity = projectile.vx;
            break;
        case '-':
            if (Math.abs(projectile.vx) === 2 && Math.abs(projectile.vy) === 2) {
                messg_count = 200;
                messg = 'Cannot decrease velocity to zero !';
                break;
            }
            projectile.vx = Math.sign(projectile.vx) * (Math.abs(projectile.vx) - 2);
            projectile.vy = Math.sign(projectile.vy) * (Math.abs(projectile.vy) - 2);
            oldVelocity = projectile.vx;
            break;
        case 'ArrowLeft':
            projectile.vx = -Math.abs(projectile.vx) * elasticity;
            break;
        case 'ArrowRight':
            projectile.vx = Math.abs(projectile.vx) * elasticity;
            break;
        case 'ArrowUp':
            projectile.vy = -Math.abs(projectile.vy) * elasticity;
            break;
        case 'ArrowDown':
            projectile.vy = Math.abs(projectile.vy) * elasticity;
            break;

        case 'S':
        case 's':
            if (projectile.vx === 0 && projectile.vy === 0) {
                projectile.vx = oldVelocityX;
                projectile.vy = oldVelocityY;
                messg_count = 200;
                messg = 'Projectile resumed';
                break;
            }
            projectile.vx = 0;
            projectile.vy = 0;
            messg_count = 200;
            messg = 'Projectile stopped, press S to continue';
            break;
    }
});

init();
requestAnimationFrame(gameLoop);