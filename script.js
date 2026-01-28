// Card definitions
const SUITS = {
    SPADES: { symbol: '♠', color: 'black' },
    HEARTS: { symbol: '♥', color: 'red' },
    DIAMONDS: { symbol: '♦', color: 'red' },
    CLUBS: { symbol: '♣', color: 'black' }
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate all 52 cards
const cards = [];
Object.keys(SUITS).forEach(suitKey => {
    RANKS.forEach(rank => {
        cards.push({
            rank: rank,
            suit: SUITS[suitKey].symbol,
            color: SUITS[suitKey].color,
            display: `${rank}${SUITS[suitKey].symbol}`
        });
    });
});

// Wheel configuration
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');

// Set canvas size
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

// Draw the wheel
function drawWheel() {
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = canvasSize / 2 - 10;
    const numSegments = cards.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const angle = i * anglePerSegment;
        const colorIndex = i % segmentColors.length;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + anglePerSegment);
        ctx.closePath();
        ctx.fillStyle = segmentColors[colorIndex];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw card text
        ctx.save();
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(cards[i].display, radius * 0.7, 0);
        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('SPIN', 0, 0);

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
            
            // Determine winning card
            const pointerAngle = (2 * Math.PI - rotation + Math.PI / 2) % (2 * Math.PI);
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
    const suitName = Object.keys(SUITS).find(key => 
        SUITS[key].symbol === currentCard.suit
    );
    const rankName = getRankName(currentCard.rank);
    resultText.textContent = `You got: ${rankName} of ${suitName}!`;
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
    const size = Math.min(container.offsetWidth, container.offsetHeight, 500);
    
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
}

// Initialize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
    drawWheel();
});

// Draw initial wheel
drawWheel();
