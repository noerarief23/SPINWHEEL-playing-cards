// Card definitions
const SUITS = {
    SPADES: { symbol: '♠', color: 'black', name: 'Spades' },
    HEARTS: { symbol: '♥', color: 'red', name: 'Hearts' },
    DIAMONDS: { symbol: '♦', color: 'red', name: 'Diamonds' },
    CLUBS: { symbol: '♣', color: 'black', name: 'Clubs' }
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate all 52 cards
const allCards = [];
Object.keys(SUITS).forEach(suitKey => {
    RANKS.forEach(rank => {
        allCards.push({
            rank: rank,
            suit: SUITS[suitKey].symbol,
            suitName: SUITS[suitKey].name,
            color: SUITS[suitKey].color,
            display: `${rank}${SUITS[suitKey].symbol}`
        });
    });
});

// Game state
let availableCards = [...allCards];
let drawnCards = [];
let maxCards = 52; // Default to all cards

// Wheel configuration
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas?.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');
const cardCountSelect = document.getElementById('cardCount');
const customCardCountInput = document.getElementById('customCardCount');
const cardSelect = document.getElementById('cardSelect');
const markSelectedBtn = document.getElementById('markSelectedBtn');
const resetButton = document.getElementById('resetButton');
const cardHistoryDiv = document.getElementById('cardHistory');
const remainingCountSpan = document.getElementById('remainingCount');
const drawnCountSpan = document.getElementById('drawnCount');

// Validate required elements exist
if (!canvas || !ctx || !spinButton || !resultCard || !resultText ||
    !cardCountSelect || !customCardCountInput || !cardSelect ||
    !markSelectedBtn || !resetButton || !cardHistoryDiv || 
    !remainingCountSpan || !drawnCountSpan) {
    console.error('Required DOM elements not found');
    throw new Error('Failed to initialize game: Missing required elements');
}

// Wheel state
let rotation = 0;
let isSpinning = false;
let currentCard = null;
let retryCount = 0;
const MAX_RETRIES = 3;

// Audio for sound effects
let spinningAudio = null;

// Preload audio files
function preloadAudio() {
    // Using local drum roll sound file
    // Download a drum roll MP3 and save it as 'drumroll.mp3' in your project folder
    spinningAudio = new Audio('./drumroll.mp3');
    spinningAudio.volume = 0.6;
    spinningAudio.loop = false;
    
    // Handle audio load error
    spinningAudio.addEventListener('error', () => {
        console.warn('Drum roll audio file not found. Please add drumroll.mp3 to your project folder.');
    });
}

// Play spinning sound
function playSpinningSound() {
    try {
        if (spinningAudio) {
            spinningAudio.currentTime = 0;
            spinningAudio.play().catch(err => console.error('Error playing spin sound:', err));
        }
    } catch (error) {
        console.error('Error playing spinning sound:', error);
    }
}

// Stop spinning sound
function stopSpinningSound() {
    try {
        if (spinningAudio) {
            spinningAudio.pause();
            spinningAudio.currentTime = 0;
        }
    } catch (error) {
        console.error('Error stopping spinning sound:', error);
    }
}

// Play result/win sound effect
function playResultSound() {
    try {
        const winAudio = new Audio('./drumrollresult.mp3');
        winAudio.volume = 0.5;
        winAudio.play().catch(err => console.error('Error playing result sound:', err));
    } catch (error) {
        console.error('Error playing result sound:', error);
    }
}

// Fireworks animation
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        const targetParticleCount = 30 + Math.random() * 20;
        const particleCount = Math.floor(targetParticleCount);
        const colors = ['#ff1744', '#9c27b0', '#2196f3', '#00bcd4', '#4caf50', '#ffeb3b', '#ff9800'];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 3;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1.0,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2 + Math.random() * 3
            });
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= 0.02;
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.life > 0);
    }
    
    draw(ctx) {
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    isDead() {
        return this.particles.length === 0;
    }
}

let fireworksCanvas = null;
let fireworksCtx = null;
let fireworks = [];
let fireworksAnimationId = null;
let fireworksAutoStopTimeout = null;
let fireworksCreationTimeouts = [];
let fireworksResizeListenerAdded = false;

// Create fireworks canvas overlay
function createFireworksCanvas() {
    if (!fireworksCanvas) {
        fireworksCanvas = document.createElement('canvas');
        fireworksCanvas.id = 'fireworksCanvas';
        fireworksCanvas.style.position = 'fixed';
        fireworksCanvas.style.top = '0';
        fireworksCanvas.style.left = '0';
        fireworksCanvas.style.width = '100%';
        fireworksCanvas.style.height = '100%';
        fireworksCanvas.style.pointerEvents = 'none'; // Don't block user interaction
        fireworksCanvas.style.zIndex = '9999';
        document.body.appendChild(fireworksCanvas);
        fireworksCtx = fireworksCanvas.getContext('2d');
        
        // Set canvas size with device pixel ratio for crisp rendering
        resizeFireworksCanvas();
        
        // Add resize listener only once
        if (!fireworksResizeListenerAdded) {
            window.addEventListener('resize', resizeFireworksCanvas);
            fireworksResizeListenerAdded = true;
        }
    }
    return fireworksCanvas;
}

// Resize fireworks canvas
function resizeFireworksCanvas() {
    if (fireworksCanvas) {
        const dpr = window.devicePixelRatio || 1;
        fireworksCanvas.width = window.innerWidth * dpr;
        fireworksCanvas.height = window.innerHeight * dpr;
        
        // Reset transform and scale context for high DPI displays
        if (fireworksCtx) {
            fireworksCtx.setTransform(1, 0, 0, 1, 0, 0);
            fireworksCtx.scale(dpr, dpr);
        }
    }
}

// Start fireworks animation
function startFireworksAnimation() {
    createFireworksCanvas();
    
    // Cancel any existing animation to prevent double-speed rendering
    if (fireworksAnimationId) {
        cancelAnimationFrame(fireworksAnimationId);
        fireworksAnimationId = null;
    }
    
    // Clear any existing timeouts
    if (fireworksAutoStopTimeout) {
        clearTimeout(fireworksAutoStopTimeout);
        fireworksAutoStopTimeout = null;
    }
    
    fireworksCreationTimeouts.forEach(timeout => clearTimeout(timeout));
    fireworksCreationTimeouts = [];
    
    fireworks = [];
    
    // Create multiple fireworks at random positions
    const fireworkCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < fireworkCount; i++) {
        const timeout = setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.1);
            fireworks.push(new Firework(x, y));
        }, i * 300);
        fireworksCreationTimeouts.push(timeout);
    }
    
    // Animate fireworks
    animateFireworks();
    
    // Auto-stop after 3 seconds
    fireworksAutoStopTimeout = setTimeout(stopFireworksAnimation, 3000);
}

// Animate fireworks
function animateFireworks() {
    if (!fireworksCtx) return;
    
    // Clear canvas with logical dimensions (CSS pixels)
    const dpr = window.devicePixelRatio || 1;
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width / dpr, fireworksCanvas.height / dpr);
    
    // Update and draw fireworks
    fireworks.forEach(firework => {
        firework.update();
        firework.draw(fireworksCtx);
    });
    
    // Remove dead fireworks
    fireworks = fireworks.filter(f => !f.isDead());
    
    // Continue animation if there are active fireworks
    if (fireworks.length > 0) {
        fireworksAnimationId = requestAnimationFrame(animateFireworks);
    }
}

// Stop fireworks animation
function stopFireworksAnimation() {
    // Clear timeouts
    if (fireworksAutoStopTimeout) {
        clearTimeout(fireworksAutoStopTimeout);
        fireworksAutoStopTimeout = null;
    }
    
    fireworksCreationTimeouts.forEach(timeout => clearTimeout(timeout));
    fireworksCreationTimeouts = [];
    
    if (fireworksAnimationId) {
        cancelAnimationFrame(fireworksAnimationId);
        fireworksAnimationId = null;
    }
    
    if (fireworksCtx && fireworksCanvas) {
        const dpr = window.devicePixelRatio || 1;
        fireworksCtx.clearRect(0, 0, fireworksCanvas.width / dpr, fireworksCanvas.height / dpr);
    }
    
    fireworks = [];
}

// Segment colors (grayscale)
// const segmentColors = [
//     '#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a',
//     '#5a5a5a', '#6a6a6a', '#7a7a7a', '#8a8a8a',
//     '#999999', '#aaaaaa', '#bbbbbb', '#cccccc',
//     '#dddddd'
// ];
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

    // Match offscreen canvas to main canvas
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    
    // Scale offscreen context
    offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
    offscreenCtx.scale(dpr, dpr);

    // Use LOGICAL coordinates (CSS pixels)
    const size = canvas.width / dpr;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const numSegments = availableCards.length;
    
    // Handle empty wheel
    if (numSegments === 0) {
        offscreenCtx.clearRect(0, 0, size, size);
        offscreenCtx.save();
        offscreenCtx.translate(centerX, centerY);
        
        // Draw empty circle
        offscreenCtx.beginPath();
        offscreenCtx.arc(0, 0, radius, 0, 2 * Math.PI);
        offscreenCtx.fillStyle = '#333';
        offscreenCtx.fill();
        offscreenCtx.strokeStyle = '#ffffff';
        offscreenCtx.lineWidth = 2;
        offscreenCtx.stroke();
        
        // Draw message
        offscreenCtx.fillStyle = '#ffffff';
        offscreenCtx.font = 'bold 20px Arial';
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        offscreenCtx.fillText('No Cards', 0, 0);
        
        offscreenCtx.restore();
        needsRedraw = false;
        return;
    }
    
    const anglePerSegment = (2 * Math.PI) / numSegments;

    offscreenCtx.clearRect(0, 0, size, size);
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
        offscreenCtx.fillText(availableCards[i].display, radius * 0.7, 0);
        offscreenCtx.restore();
    }

    // Draw center circle
    offscreenCtx.beginPath();
    offscreenCtx.arc(0, 0, 30, 0, 2 * Math.PI);
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fill();
    offscreenCtx.strokeStyle = '#666666';
    offscreenCtx.lineWidth = 3;
    offscreenCtx.stroke();

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
    const size = canvas.width / dpr;
    const centerX = size / 2;
    const centerY = size / 2;

    // Clear using logical size
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);
    
    // Draw the prerendered wheel at correct logical size
    ctx.drawImage(offscreenCanvas, 0, 0, size, size);

    ctx.restore();
}

// Spin animation
function spin(isRetry = false) {
    if (isSpinning) return;

    // Check if there are available cards
    if (availableCards.length === 0) {
        resultText.textContent = 'No more cards available! Click the Reset button to start over.';
        return;
    }

    // Reset retry count if this is a new spin (not a retry)
    if (!isRetry) {
        retryCount = 0;
    }

    isSpinning = true;
    spinButton.disabled = true;
    resultCard.classList.remove('show');
    resultText.textContent = 'Spinning...';

    // Play spinning sound effect
    playSpinningSound();

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
            // Stop spinning sound when spin ends
            stopSpinningSound();
            
            // Normalize rotation to positive value
            rotation = ((rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
            
            // Determine winning card (pointer at top points to -π/2)
            let pointerAngle = (2 * Math.PI - rotation - Math.PI / 2) % (2 * Math.PI);
            // Ensure positive angle
            if (pointerAngle < 0) pointerAngle += 2 * Math.PI;
            
            const segmentAngle = (2 * Math.PI) / availableCards.length;
            const winningIndex = Math.floor(pointerAngle / segmentAngle) % availableCards.length;
            currentCard = availableCards[winningIndex];

            // Validate currentCard before processing
            if (!currentCard) {
                console.error(`Invalid card at index ${winningIndex}: availableCards may have been modified during spin`);
                
                // Retry logic
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`Retrying spin... Attempt ${retryCount}/${MAX_RETRIES}`);
                    isSpinning = false;
                    
                    // Wait a bit before retrying (keep button disabled during retry)
                    setTimeout(() => {
                        spin(true);
                    }, 500);
                    return;
                } else {
                    // Max retries reached - inform user to spin manually
                    console.error('Max retries reached. Please try spinning manually.');
                    resultText.textContent = `Spin failed after ${MAX_RETRIES} attempts. Please try spinning again manually.`;
                    isSpinning = false;
                    spinButton.disabled = false;
                    retryCount = 0; // Reset for next attempt
                    return;
                }
            }

            // Remove the drawn card from available cards
            availableCards.splice(winningIndex, 1);
            drawnCards.push(currentCard);
            
            // Update UI
            updateStats();
            addToHistory(currentCard);
            
            // Redraw wheel without the drawn card
            needsRedraw = true;

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
        
        // Play result sound effect
        playResultSound();
        
        // Start fireworks animation
        startFireworksAnimation();
    }, 100);

    // Update result text with card name
    const rankName = getRankName(currentCard.rank);
    resultText.textContent = `${rankName} of ${currentCard.suitName}!`;
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

// Update stats display
function updateStats() {
    remainingCountSpan.textContent = availableCards.length;
    drawnCountSpan.textContent = drawnCards.length;
    
    // Update canvas aria-label to reflect current card count
    canvas.setAttribute('aria-label', `Spin wheel with ${availableCards.length} playing cards`);
    
    // Update the card select dropdown
    updateCardSelect();
}

// Update the card select dropdown with available cards
function updateCardSelect() {
    // Clear existing options except the first one
    cardSelect.innerHTML = '<option value="">-- Select a card --</option>';
    
    // Add options for all available cards
    availableCards.forEach((card, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${card.display} - ${getRankName(card.rank)} of ${card.suitName}`;
        cardSelect.appendChild(option);
    });
}

// Add card to history
function addToHistory(card) {
    if (!card) {
        console.error(
            'Cannot add undefined card to history. Check calling function. Stack trace:',
            new Error().stack
        );
        return;
    }
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const cardDisplay = document.createElement('div');
    cardDisplay.className = `history-item-card ${card.color}`;
    cardDisplay.textContent = card.display;
    
    const cardName = document.createElement('div');
    cardName.className = 'history-item-name';
    cardName.textContent = `${getRankName(card.rank)} of ${card.suitName}`;
    
    historyItem.appendChild(cardDisplay);
    historyItem.appendChild(cardName);
    
    // Add at the top
    cardHistoryDiv.insertBefore(historyItem, cardHistoryDiv.firstChild);
}

// Mark selected card as drawn
function markSelectedCardAsDrawn() {
    const selectedIndex = cardSelect.value;
    
    if (selectedIndex === '') {
        alert('Please select a card from the dropdown');
        return;
    }
    
    // Check if we would exceed maxCards
    if (drawnCards.length >= maxCards) {
        alert('Cannot mark more cards. The configured deck limit has been reached.');
        return;
    }
    
    const index = parseInt(selectedIndex);
    
    if (index < 0 || index >= availableCards.length) {
        alert('Invalid card selection');
        return;
    }
    
    // Get the card and remove it from available cards
    const card = availableCards[index];
    availableCards.splice(index, 1);
    drawnCards.push(card);
    addToHistory(card);
    
    // Update UI
    updateStats();
    needsRedraw = true;
    drawWheel();
    
    // Reset the select dropdown
    cardSelect.value = '';
    
    // Show success feedback
    alert(`Marked ${card.display} as drawn`);
}

// Reset the game
function resetGame() {
    // Reset to initial card count based on config
    const cardCountValue = cardCountSelect.value;
    
    if (cardCountValue === 'custom') {
        // Validate and clamp custom card count
        let customValue = parseInt(customCardCountInput.value);
        if (isNaN(customValue) || customValue < 1) {
            customValue = 1;
        } else if (customValue > 52) {
            customValue = 52;
        }
        customCardCountInput.value = customValue;
        maxCards = customValue;
    } else {
        maxCards = parseInt(cardCountValue);
    }
    
    // Reset available cards to first maxCards
    // Note: When using a partial deck (e.g., 13, 26), cards are taken sequentially
    // from the standard deck order (A♠, 2♠, 3♠, ... K♠, A♥, 2♥, ...).
    // This ensures consistent and predictable deck composition.
    availableCards = allCards.slice(0, maxCards);
    drawnCards = [];
    currentCard = null;
    
    // Clear history
    cardHistoryDiv.innerHTML = '';
    
    // Update stats
    updateStats();
    
    // Reset result display
    resultCard.classList.remove('show');
    resultText.textContent = 'Spin the wheel to get a card!';
    
    // Reset spin state and re-enable button
    isSpinning = false;
    spinButton.disabled = false;
    
    // Redraw wheel
    needsRedraw = true;
    drawWheel();
}

// Handle card count change
function handleCardCountChange() {
    const value = cardCountSelect.value;
    
    if (value === 'custom') {
        customCardCountInput.classList.remove('hidden');
    } else {
        customCardCountInput.classList.add('hidden');
    }
    
    // Auto-reset when changing config
    resetGame();
}

// Event listeners
spinButton.addEventListener('click', () => {
    spin();
});
resetButton.addEventListener('click', resetGame);
cardCountSelect.addEventListener('change', handleCardCountChange);
customCardCountInput.addEventListener('change', resetGame);
markSelectedBtn.addEventListener('click', markSelectedCardAsDrawn);

// Handle responsive canvas sizing
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    if (!container) {
        console.error('Wheel container not found');
        return;
    }
    
    // Use ONLY offsetWidth (aspect-ratio ensures 1:1)
    let size = container.offsetWidth;
    
    // Fallback if offsetWidth is 0
    const CONTAINER_PADDING = 40;
    if (size === 0) {
        size = Math.min(window.innerWidth - CONTAINER_PADDING, 800);
    }

    // Set canvas CSS size (logical pixels)
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    // Set drawing buffer size for HiDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    
    // Scale context to use logical coordinates
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    
    // Mark for redraw
    needsRedraw = true;
    
    // Redraw wheel
    drawWheel();
}

// Initialize
window.addEventListener('resize', resizeCanvas);

// Wait for DOM and layout to be ready
function waitForLayout(callback) {
    let attempts = 0;
    const maxAttempts = 60; // Max 1 second wait
    
    function attempt() {
        const container = document.querySelector('.wheel-container');
        if (container && container.offsetWidth > 0) {
            callback();
        } else if (attempts < maxAttempts) {
            attempts++;
            requestAnimationFrame(attempt);
        } else {
            // Force callback even if container width is 0
            console.warn('Container width still 0 after max attempts, forcing resize');
            callback();
        }
    }

    requestAnimationFrame(attempt);
}

document.addEventListener('DOMContentLoaded', () => {
    preloadAudio();
    // Call resize immediately
    resizeCanvas();
    updateStats();
    // Also wait for proper layout
    waitForLayout(() => {
        resizeCanvas();
        updateStats();
    });
});
