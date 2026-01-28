// Card definitions
const SUITS = {
    SPADES: { symbol: '♠', color: 'black', name: 'Spades' },
    HEARTS: { symbol: '♥', color: 'red', name: 'Hearts' },
    DIAMONDS: { symbol: '♦', color: 'red', name: 'Diamonds' },
    CLUBS: { symbol: '♣', color: 'black', name: 'Clubs' }
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate all 52 cards
const cards = [];
Object.keys(SUITS).forEach(suitKey => {
    RANKS.forEach(rank => {
        cards.push({
            rank: rank,
            suit: SUITS[suitKey].symbol,
            suitName: SUITS[suitKey].name,
            color: SUITS[suitKey].color,
            display: `${rank}${SUITS[suitKey].symbol}`
        });
    });
});

// Wheel configuration
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas?.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');

// Validate required elements exist
if (!canvas || !ctx || !spinButton || !resultCard || !resultText) {
    console.error('Required DOM elements not found');
    throw new Error('Failed to initialize game: Missing required elements');
}

// Set initial canvas size
const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Wheel state
let rotation = 0;
let isSpinning = false;
let currentCard = null;

// Segment colors (vibrant casino colors)
const segmentColors = [
    '#FF1744', '#9C27B0', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#4CAF50', '#8BC34A',
    '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722'
];

// Offscreen canvas for performance optimization
let offscreenCanvas = null;
let offscreenCtx = null;
let needsRedraw = true;

// Prerender the static wheel to an offscreen canvas
function prerenderWheel() {
    const dpr = window.devicePixelRatio || 1;
    
    if (!offscreenCanvas) {
        offscreenCanvas = document.createElement('canvas');
        offscreenCtx = offscreenCanvas.getContext('2d');
    }

    // Update offscreen canvas size to match main canvas
    if (offscreenCanvas.width !== canvas.width || offscreenCanvas.height !== canvas.height) {
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        
        // Scale offscreen context for logical coordinates
        offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
        offscreenCtx.scale(dpr, dpr);
    }

    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);
    const radius = canvas.width / (2 * dpr) - 10;
    const numSegments = cards.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    offscreenCtx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    offscreenCtx.save();
    offscreenCtx.translate(centerX, centerY);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const angle = i * anglePerSegment;
        const colorIndex = i % segmentColors.length;

        // Draw segment
        offscreenCtx.beginPath();
        offscreenCtx.moveTo(0, 0);
        offscreenCtx.arc(0, 0, radius, angle, angle + anglePerSegment);
        offscreenCtx.closePath();
        offscreenCtx.fillStyle = segmentColors[colorIndex];
        offscreenCtx.fill();
        offscreenCtx.strokeStyle = '#ffffff';
        offscreenCtx.lineWidth = 2;
        offscreenCtx.stroke();

        // Draw card text
        offscreenCtx.save();
        offscreenCtx.rotate(angle + anglePerSegment / 2);
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        offscreenCtx.fillStyle = '#ffffff';
        offscreenCtx.font = 'bold 16px Arial';
        offscreenCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        offscreenCtx.shadowBlur = 4;
        offscreenCtx.fillText(cards[i].display, radius * 0.7, 0);
        offscreenCtx.restore();
    }

    // Draw center circle
    offscreenCtx.beginPath();
    offscreenCtx.arc(0, 0, 30, 0, 2 * Math.PI);
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fill();
    offscreenCtx.strokeStyle = '#ffaa00';
    offscreenCtx.lineWidth = 3;
    offscreenCtx.stroke();

    // Draw center text
    offscreenCtx.fillStyle = '#000000';
    offscreenCtx.font = 'bold 14px Arial';
    offscreenCtx.fillText('SPIN', 0, 0);

    offscreenCtx.restore();
    needsRedraw = false;
}

// Draw the wheel (using prerendered offscreen canvas)
function drawWheel() {
    // Prerender if needed
    if (needsRedraw || !offscreenCanvas) {
        prerenderWheel();
    }

    const dpr = window.devicePixelRatio || 1;
    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);

    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);
    
    // Draw the prerendered wheel
    ctx.drawImage(offscreenCanvas, 0, 0);

    ctx.restore();
}

// Spin animation
function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultCard.classList.remove('show');
    resultText.textContent = 'Spinning...';

    // Random spin parameters
    const minSpins = 5;
    const maxSpins = 8;
    const totalSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalRotation = totalSpins * 2 * Math.PI;
    
    // Random final position
    const randomAngle = Math.random() * 2 * Math.PI;
    const finalRotation = rotation + totalRotation + randomAngle;

    // Animation duration (3-5 seconds)
    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();
    const startRotation = rotation;

    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        rotation = startRotation + (finalRotation - startRotation) * easeProgress;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Normalize rotation
            rotation = rotation % (2 * Math.PI);
            
            // Determine winning card (pointer at top points to -π/2)
            const pointerAngle = (2 * Math.PI - rotation - Math.PI / 2) % (2 * Math.PI);
            const segmentAngle = (2 * Math.PI) / cards.length;
            const winningIndex = Math.floor(pointerAngle / segmentAngle) % cards.length;
            currentCard = cards[winningIndex];

            // Show result
            showResult();
            isSpinning = false;
            spinButton.disabled = false;
        }
    }

    animate();
}

// Show result
function showResult() {
    const cardValue = resultCard.querySelector('.card-value');
    const cardSuit = resultCard.querySelector('.card-suit');

    if (!cardValue || !cardSuit) {
        console.error('Card display elements not found');
        return;
    }

    cardValue.textContent = currentCard.rank;
    cardSuit.textContent = currentCard.suit;
    
    // Set color class
    resultCard.className = 'result-card';
    resultCard.classList.add(currentCard.color);
    
    // Animate in
    setTimeout(() => {
        resultCard.classList.add('show');
    }, 100);

    // Update result text with card name
    const rankName = getRankName(currentCard.rank);
    resultText.textContent = `You got: ${rankName} of ${currentCard.suitName}!`;
}

// Get full rank name
function getRankName(rank) {
    const rankNames = {
        'A': 'Ace',
        'J': 'Jack',
        'Q': 'Queen',
        'K': 'King'
    };
    return rankNames[rank] || rank;
}

// Event listeners
spinButton.addEventListener('click', spin);

// Handle responsive canvas sizing
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    if (!container) {
        console.error('Wheel container not found');
        return;
    }
    
    const size = Math.min(container.offsetWidth, container.offsetHeight, 500);

    // Set the CSS size (logical size in CSS pixels)
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    // Adjust the drawing buffer size for HiDPI displays
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(size * dpr);
    const displayHeight = Math.floor(size * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        needsRedraw = true; // Mark for redraw when size changes
    }

    // Reset and scale the context so drawing uses logical coordinates
    if (typeof ctx !== 'undefined' && ctx && typeof ctx.setTransform === 'function') {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
    
    // Redraw wheel after resize
    drawWheel();
}

// Initialize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
});

// Draw initial wheel
drawWheel();
