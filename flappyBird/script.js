const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Game State
const STATE = {
    START: 'START',
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

let currentState = STATE.START;
let score = 0;
let frames = 0;
let countdownValue = 3;

// Constants
const GRAVITY = 0.20; // Reduced from 0.25
const FLAP_STRENGTH = -5.5;
const SPAWN_RATE = 150; // Increased from 120 for even more horizontal spacing
const PIPE_WIDTH = 50;
const PIPE_GAP = 180; // Increased from 150 for even more vertical spacing
const PIPE_SPEED = 1.8; // Reduced from 2.0

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const countdownScreen = document.getElementById('countdown-screen');
const countdownText = document.getElementById('countdown-text');
const uiOverlay = document.getElementById('ui-overlay');
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');

// Game Objects
class Bird {
    constructor() {
        this.x = 50;
        this.y = 150;
        this.width = 34;
        this.height = 24;
        this.velocity = 0;
    }

    draw() {
        ctx.fillStyle = '#f7d308'; // Bird yellow
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 20, this.y + 4, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 24, this.y + 6, 4, 4);
        
        // Beak
        ctx.fillStyle = '#f7941d';
        ctx.fillRect(this.x + 28, this.y + 12, 10, 6);
    }

    update() {
        if (currentState === STATE.PLAYING) {
            this.velocity += GRAVITY;
            this.y += this.velocity;

            // Ground collision
            if (this.y + this.height >= canvas.height) {
                this.y = canvas.height - this.height;
                gameOver();
            }
            
            // Ceiling collision
            if (this.y <= 0) {
                this.y = 0;
                this.velocity = 0;
            }
        }
    }

    flap() {
        if (currentState === STATE.PLAYING) {
            this.velocity = FLAP_STRENGTH;
        }
    }

    reset() {
        this.y = 150;
        this.velocity = 0;
    }
}

class Pipe {
    constructor() {
        const minPipeHeight = 50;
        const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
        this.top = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
        this.bottom = canvas.height - (this.top + PIPE_GAP);
        this.x = canvas.width;
        this.width = PIPE_WIDTH;
        this.passed = false;
    }

    draw() {
        ctx.fillStyle = '#73bf2e'; // Pipe green
        // Top pipe
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x, 0, this.width, this.top);

        // Bottom pipe
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
        ctx.strokeRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    update() {
        if (currentState === STATE.PLAYING) {
            this.x -= PIPE_SPEED;
        }
    }
}

const bird = new Bird();
let pipes = [];

// Game Logic
function spawnPipe() {
    if (frames % SPAWN_RATE === 0) {
        pipes.push(new Pipe());
    }
}

function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();

        // Collision detection
        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)
        ) {
            gameOver();
        }

        // Score increment
        if (!pipes[i].passed && bird.x > pipes[i].x + pipes[i].width) {
            score++;
            scoreDisplay.innerText = score;
            pipes[i].passed = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }
    }
}

function gameOver() {
    currentState = STATE.GAMEOVER;
    finalScore.innerText = score;
    gameOverScreen.classList.remove('hidden');
    uiOverlay.classList.remove('hidden');
}

function startCountdown() {
    currentState = STATE.COUNTDOWN;
    countdownValue = 3;
    countdownText.innerText = countdownValue;
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    countdownScreen.classList.remove('hidden');
    uiOverlay.classList.remove('hidden');

    const interval = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
            countdownText.innerText = countdownValue;
        } else {
            clearInterval(interval);
            startGame();
        }
    }, 1000);
}

function startGame() {
    currentState = STATE.PLAYING;
    countdownScreen.classList.add('hidden');
    uiOverlay.classList.add('hidden');
}

function resetGame() {
    score = 0;
    frames = 0;
    pipes = [];
    bird.reset();
    scoreDisplay.innerText = '0';
    startCountdown();
}

function togglePause() {
    if (currentState === STATE.PLAYING) {
        currentState = STATE.PAUSED;
        pauseScreen.classList.remove('hidden');
        uiOverlay.classList.remove('hidden');
    } else if (currentState === STATE.PAUSED) {
        currentState = STATE.PLAYING;
        pauseScreen.classList.add('hidden');
        uiOverlay.classList.add('hidden');
    }
}

// Event Listeners
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (currentState === STATE.PLAYING) {
            bird.flap();
        } else if (currentState === STATE.START) {
            resetGame();
        } else if (currentState === STATE.GAMEOVER) {
            resetGame();
        }
    }
});

canvas.addEventListener('click', () => {
    if (currentState === STATE.PLAYING) {
        bird.flap();
    }
});

startBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);

// Main Loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.draw();
    bird.update();

    if (currentState === STATE.PLAYING) {
        spawnPipe();
    }
    
    updatePipes();
    pipes.forEach(pipe => pipe.draw());

    if (currentState !== STATE.PAUSED) {
        frames++;
    }
    
    requestAnimationFrame(loop);
}

loop();
