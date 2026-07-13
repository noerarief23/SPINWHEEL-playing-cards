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
let customDeckCards = [];

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

// Custom Deck configuration
const customDeckContainer = document.getElementById('customDeckContainer');
const customDeckSelect = document.getElementById('customDeckSelect');
const addCustomCardBtn = document.getElementById('addCustomCardBtn');
const clearCustomDeckBtn = document.getElementById('clearCustomDeckBtn');
const customDeckList = document.getElementById('customDeckList');
const wheelContainer = document.querySelector('.wheel-container');

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
let resultAudio = null; // ⚡ Bolt: Cache result audio instance

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

    // ⚡ Bolt: Preload result sound to avoid disk I/O and garbage collection during critical render path
    resultAudio = new Audio('./result.mp3');
    resultAudio.addEventListener('error', () => {
        console.warn('Result audio file not found.');
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
        // ⚡ Bolt: Use cached audio instance instead of instantiating new Audio() on every win to eliminate latency
        if (resultAudio) {
            resultAudio.currentTime = 1;
            resultAudio.volume = 0.5;
            resultAudio.play().catch(err => console.error('Error playing result sound:', err));
        } else {
            const winAudio = new Audio('./result.mp3');
            winAudio.currentTime = 1;
            winAudio.volume = 0.5;
            winAudio.play().catch(err => console.error('Error playing result sound:', err));
        }
    } catch (error) {
        console.error('Error playing result sound:', error);
    }
}

// Start fireworks animation using canvas-confetti
function startFireworksAnimation() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
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
    let wasRedrawn = false;
    // Prerender if needed
    if (needsRedraw || !offscreenCanvas) {
        prerenderWheel();
        wasRedrawn = true;
    }

    if (wasRedrawn) {
        const dpr = window.devicePixelRatio || 1;
        const size = canvas.width / dpr;

        // Clear using logical size
        ctx.clearRect(0, 0, size, size);

        // Draw the prerendered wheel at correct logical size
        ctx.drawImage(offscreenCanvas, 0, 0, size, size);
    }
    
    // Hardware accelerated rotation via CSS
    canvas.style.transform = `rotate(${rotation}rad)`;
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

    // ⚡ Bolt: Precalculate winning card and preload its image while spin animation plays
    // Determine the predicted winning card by calculating where the pointer will end up
    let predictedRotation = ((finalRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    let predictedPointerAngle = (2 * Math.PI - predictedRotation - Math.PI / 2) % (2 * Math.PI);
    if (predictedPointerAngle < 0) predictedPointerAngle += 2 * Math.PI;
    const segmentAngle = (2 * Math.PI) / availableCards.length;
    const predictedWinningIndex = Math.floor(predictedPointerAngle / segmentAngle) % availableCards.length;
    const predictedCard = availableCards[predictedWinningIndex];
    if (predictedCard) {
        // Preload image over network during 5-8s spin animation to eliminate visual pop-in when showResult() runs
        const img = new Image();
        img.src = `cards/${RANK_MAP[predictedCard.rank]}_of_${SUIT_MAP[predictedCard.suitName]}.svg`;
    }

    // Animation duration (5-8 seconds)
    const duration = 5000 + Math.random() * 3000;
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
            
            // Ensure the canvas displays the final normalized rotation exactly
            canvas.style.transform = `rotate(${rotation}rad)`;

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

const RANK_MAP = {
    'A': 'ace', 'J': 'jack', 'Q': 'queen', 'K': 'king',
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
    '7': '7', '8': '8', '9': '9', '10': '10'
};

const SUIT_MAP = {
    'Spades': 'spades', 'Hearts': 'hearts',
    'Diamonds': 'diamonds', 'Clubs': 'clubs'
};

// Show result
function showResult() {
    resultCard.innerHTML = '';
    
    const cardImage = document.createElement('img');
    cardImage.className = 'card-face-image';
    cardImage.src = `cards/${RANK_MAP[currentCard.rank]}_of_${SUIT_MAP[currentCard.suitName]}.svg`;
    cardImage.alt = `${getRankName(currentCard.rank)} of ${currentCard.suitName}`;
    resultCard.appendChild(cardImage);
    
    resultCard.className = 'result-card';
    resultCard.classList.add(currentCard.color);
    
    setTimeout(() => {
        resultCard.classList.add('show');
        playResultSound();
        startFireworksAnimation();
    }, 100);

    const rankName = getRankName(currentCard.rank);
    resultText.textContent = `${rankName} of ${currentCard.suitName}!`;
}

const RANK_NAMES = {
    'A': 'Ace',
    'J': 'Jack',
    'Q': 'Queen',
    'K': 'King'
};

// Get full rank name
function getRankName(rank) {
    return RANK_NAMES[rank] || rank;
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
    
    // Use DocumentFragment for performance
    const fragment = document.createDocumentFragment();

    // Add options for all available cards
    availableCards.forEach((card, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${card.display} - ${getRankName(card.rank)} of ${card.suitName}`;
        fragment.appendChild(option);
    });

    cardSelect.appendChild(fragment);

    // Also reset button state if it was enabled
    if (markSelectedBtn) {
        markSelectedBtn.disabled = true;
    }
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
    
    // Remove empty state if it exists
    const emptyState = cardHistoryDiv.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Add at the top
    cardHistoryDiv.insertBefore(historyItem, cardHistoryDiv.firstChild);
}

// Mark selected card as drawn
function markSelectedCardAsDrawn() {
    const selectedIndex = cardSelect.value;
    
    if (selectedIndex === '') {
        showButtonFeedback(markSelectedBtn, 'Please select a card');
        return;
    }
    
    // Check if we would exceed maxCards
    if (drawnCards.length >= maxCards) {
        showButtonFeedback(markSelectedBtn, 'Deck limit reached');
        return;
    }
    
    const index = parseInt(selectedIndex);
    
    if (index < 0 || index >= availableCards.length) {
        showButtonFeedback(markSelectedBtn, 'Invalid selection');
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
    
    if (cardCountValue === 'custom-list') {
        maxCards = customDeckCards.length;
        availableCards = [...customDeckCards];
    } else {
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
        availableCards = allCards.slice(0, maxCards);
    }
    
    drawnCards = [];
    currentCard = null;
    
    // Clear history
    cardHistoryDiv.innerHTML = '<div class="empty-state">No cards drawn yet</div>';
    
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
    
    if (value === 'custom-list') {
        customDeckContainer.classList.remove('hidden');
    } else {
        customDeckContainer.classList.add('hidden');
    }

    // Auto-reset when changing config
    resetGame();
}


// Helper for inline button feedback
function showButtonFeedback(button, message) {
    // Store original text if not already stored to prevent overwriting during rapid clicks
    if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
    }
    const originalText = button.dataset.originalText;
    const originalDisabled = button.disabled;

    // Clear existing timeout if any
    if (button.dataset.feedbackTimeout) {
        clearTimeout(parseInt(button.dataset.feedbackTimeout));
    }

    button.textContent = message;
    button.disabled = true;

    // Announce to screen reader
    const originalAriaLabel = button.getAttribute('aria-label');
    if (originalAriaLabel) {
        button.setAttribute('aria-label', message);
    }

    const timeoutId = setTimeout(() => {
        button.textContent = originalText;
        button.disabled = originalDisabled;
        if (originalAriaLabel) {
            button.setAttribute('aria-label', originalAriaLabel);
        }
        delete button.dataset.feedbackTimeout;
    }, 2000);

    button.dataset.feedbackTimeout = timeoutId.toString();
}

// --- Custom Deck Logic ---

function populateCustomDeckSelect() {
    customDeckSelect.innerHTML = '<option value="">-- Select a card to add --</option>';
    const fragment = document.createDocumentFragment();
    allCards.forEach((card, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${card.display} - ${getRankName(card.rank)} of ${card.suitName}`;
        fragment.appendChild(option);
    });
    customDeckSelect.appendChild(fragment);

    // Reset button state
    if (addCustomCardBtn) {
        addCustomCardBtn.disabled = true;
    }
}

function renderCustomDeckList() {
    customDeckList.innerHTML = '';
    if (customDeckCards.length === 0) {
        customDeckList.innerHTML = '<span style="color: #666; font-style: italic;">No cards added yet</span>';
        return;
    }

    const fragment = document.createDocumentFragment();

    customDeckCards.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = 'custom-deck-item';

        const cardText = document.createElement('span');
        cardText.className = card.color;
        cardText.textContent = card.display;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-custom-card';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${getRankName(card.rank)} of ${card.suitName}`);
        removeBtn.onclick = () => removeCustomCard(index);

        item.appendChild(cardText);
        item.appendChild(removeBtn);
        fragment.appendChild(item);
    });

    customDeckList.appendChild(fragment);
}

function removeCustomCard(index) {
    customDeckCards.splice(index, 1);
    renderCustomDeckList();
    if (cardCountSelect.value === 'custom-list') {
        resetGame();
    }
}

addCustomCardBtn.addEventListener('click', () => {
    const selectedIndex = customDeckSelect.value;
    if (selectedIndex === '') {
        showButtonFeedback(addCustomCardBtn, 'Please select a card');
        return;
    }

    const card = allCards[parseInt(selectedIndex)];

    // Optional: prevent duplicates
    if (customDeckCards.some(c => c.display === card.display)) {
        showButtonFeedback(addCustomCardBtn, 'Already added');
        return;
    }

    customDeckCards.push(card);
    customDeckSelect.value = '';
    customDeckSelect.dispatchEvent(new Event('change')); // Trigger change to update disabled state
    renderCustomDeckList();

    if (cardCountSelect.value === 'custom-list') {
        resetGame();
    }

    showButtonFeedback(addCustomCardBtn, 'Added!');
});

clearCustomDeckBtn.addEventListener('click', () => {
    customDeckCards = [];
    renderCustomDeckList();
    if (cardCountSelect.value === 'custom-list') {
        resetGame();
    }
});

// Disable buttons initially and enable on valid select
cardSelect.addEventListener('change', () => {
    markSelectedBtn.disabled = cardSelect.value === '';
});
// Set initial state
markSelectedBtn.disabled = true;

customDeckSelect.addEventListener('change', () => {
    addCustomCardBtn.disabled = customDeckSelect.value === '';
});
// Set initial state
addCustomCardBtn.disabled = true;


// Initialize custom deck select
populateCustomDeckSelect();
renderCustomDeckList();

// --- End Custom Deck Logic ---

// Event listeners
spinButton.addEventListener('click', () => {
    spin();
});

// Spacebar shortcut for spinning
document.addEventListener('keydown', (e) => {
    // Only trigger if spacebar is pressed
    if (e.code === 'Space') {
        // Prevent default scrolling behavior

        // Don't trigger if user is interacting with form elements
        const activeElement = document.activeElement;
        const ignoreElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];

        if (activeElement && ignoreElements.includes(activeElement.tagName)) {
            return; // Let the native element handle the spacebar
        }

        e.preventDefault();

        // Trigger spin if not already spinning and button is not disabled
        if (!isSpinning && !spinButton.disabled) {
            spin();
            // Provide visual feedback
            spinButton.classList.add('active');
            setTimeout(() => spinButton.classList.remove('active'), 150);
        }
    }
});

resetButton.addEventListener('click', resetGame);
cardCountSelect.addEventListener('change', handleCardCountChange);
customCardCountInput.addEventListener('change', resetGame);
markSelectedBtn.addEventListener('click', markSelectedCardAsDrawn);

// ⚡ Bolt: Debounce utility to prevent layout thrashing on rapid events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle responsive canvas sizing
function resizeCanvas() {
    // ⚡ Bolt: Use globally cached wheelContainer to avoid redundant DOM queries
    if (!wheelContainer) {
        console.error('Wheel container not found');
        return;
    }
    
    // Use ONLY offsetWidth (aspect-ratio ensures 1:1)
    let size = wheelContainer.offsetWidth;
    
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
// ⚡ Bolt: Debounce resize event to prevent synchronous recalculation 60fps and CPU spikes
const debouncedResize = debounce(resizeCanvas, 250);
window.addEventListener('resize', debouncedResize);

// Wait for DOM and layout to be ready
function waitForLayout(callback) {
    let attempts = 0;
    const maxAttempts = 60; // Max 1 second wait
    
    function attempt() {
        // ⚡ Bolt: Use cached wheelContainer
        if (wheelContainer && wheelContainer.offsetWidth > 0) {
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
