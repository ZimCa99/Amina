// game.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Prilagodi veličinu canvas-a ekranu
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.width = 800;
canvas.height = 600;

let score = 0;
let isJumping = false;
let jumpHeight = 0;
let velocity = 0;
let gravity = 0.8;

// Učitaj sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'character_femalePerson_sheetHD.png';

// Srca - beskonačno generisanje
const hearts = [];
const heartImg = new Image();
heartImg.src = 'heart.png';

// Pozicija za sprite (početni frame)
let spriteX = 1152;
let spriteY = 512;
let spriteWidth = 192;
let spriteHeight = 256;

// Player objekat (fiksiran na ekranu)
const player = {
    x: 100, // Fiksna pozicija X
    y: canvas.height - 100,
    width: spriteWidth,
    height: spriteHeight,
    speed: 5,
};

let frame = 0;
let frameCounter = 0;

// Spawn srca
function spawnHeart() {
    const y = canvas.height - 100 - 32;
    const x = canvas.width + Math.random() * 200;
    hearts.push({
        x: x,
        y: y,
        width: 64,
        height: 64,
        collected: false
    });
}

let heartSpawnTimer = 0;

function animateSprite() {
    frameCounter++;
    if (frameCounter >= 10) {
        frame++;
        if (frame > 2) frame = 0;
        frameCounter = 0;
    }

    // Ako skače, koristi drugi red sprite sheet-a
    if (isJumping) {
        spriteY = 0; // drugi red (prilagodi po potrebi)
        spriteX = 192; // koristi samo prvi frame za skok, ili menjaš frame ako ima više
    } else {
        spriteY = 512; // prvi red za hodanje
        spriteX = 1152 + frame * spriteWidth;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeleni pod
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Pomeri srca ulevo i crtaj ih
    hearts.forEach(heart => {
        heart.x -= 3;
        if (!heart.collected) {
            ctx.drawImage(heartImg, heart.x, heart.y, heart.width, heart.height);
        }
    });

    // Ukloni srca koja su izašla sa leve strane
    for (let i = hearts.length - 1; i >= 0; i--) {
        if (hearts[i].x + hearts[i].width < 0) {
            hearts.splice(i, 1);
        }
    }

    // Detekcija skupljanja srca
    hearts.forEach(heart => {
        if (
            !heart.collected &&
            player.x < heart.x + heart.width &&
            player.x + player.width > heart.x &&
            player.y < heart.y + heart.height &&
            player.y + player.height > heart.y
        ) {
            heart.collected = true;
            score += 1;
        }
    });

    // Ukloni srca koja su skupljena
    for (let i = hearts.length - 1; i >= 0; i--) {
        if (hearts[i].collected) {
            hearts.splice(i, 1);
        }
    }

    // Spawn srca na svakih ~60 frame-ova
    heartSpawnTimer++;
    if (heartSpawnTimer > 60) {
        spawnHeart();
        heartSpawnTimer = 0;
    }

    // Skakanje
    if (isJumping) {
        velocity -= gravity;
        jumpHeight += velocity;
        if (jumpHeight <= 0) {
            isJumping = false;
            jumpHeight = 0;
        }
    }

    player.y = canvas.height - 100 - jumpHeight;
    if (player.y > canvas.height - 100) player.y = canvas.height - 100;

    // Animacija: pozivanje funkcije za animaciju
    animateSprite();

    // Prikazivanje trenutnog frame-a sa sprite sheet-a
    ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, player.x, player.y - player.height, player.width, player.height);

    // Prikaz poena
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Poeni: ' + score, 20, 30);

    requestAnimationFrame(gameLoop);
}

// Samo skok - kontrole
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' && !isJumping) {
        isJumping = true;
        velocity = 15;
    }
});

// Dodaj skok na klik/tap za telefon i desktop
canvas.addEventListener('mousedown', function () {
    if (!isJumping) {
        isJumping = true;
        velocity = 15;
    }
});
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    alert('touch!');
    if (!isJumping) {
        isJumping = true;
        velocity = 15;
    }
}, { passive: false });
gameLoop();
