# SPINWHEEL PLAYING CARDS

A modern, interactive web-based spin wheel game featuring all 52 playing cards with advanced card management features. Built with HTML5 Canvas, CSS3, and JavaScript with confetti animations!

## 🌐 Live Demo

**Play now at: [https://noerarief23.github.io/SPINWHEEL-playing-cards/](https://noerarief23.github.io/SPINWHEEL-playing-cards/)**

The game is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

## 🎰 Features

- **Interactive Spin Wheel**: Beautiful, colorful wheel displaying all 52 playing cards (Ace through King, ♠ ♥ ♦ ♣)
- **Card Management System**: 
  - Choose how many cards to draw (All 52, Half Deck 26, Quarter Deck 13, or Custom amount)
  - Manually mark specific cards as drawn from dropdown
  - Cards are automatically removed from wheel after being drawn
  - Reset button to start fresh
- **Card History Panel**: Track all drawn cards with visual history and statistics
- **Sound Effects**: Drum roll during spin and result sound when card is revealed
- **Fireworks Animation**: Celebratory confetti animation using canvas-confetti library
- **Smooth Animations**: 3-5 second spin with smooth ease-out cubic easing effect
- **Modern UI**: Minimalist black background with clean white accents
- **Responsive Design**: Fully responsive - works perfectly on desktop, tablet, and mobile devices
- **Accessible**: ARIA labels and live regions for screen reader support
- **Production Ready**: Clean, optimized code with error handling and null checks

## 🚀 Quick Start

### Play Online
Visit the live demo at **[https://noerarief23.github.io/SPINWHEEL-playing-cards/](https://noerarief23.github.io/SPINWHEEL-playing-cards/)**

### Run Locally
Simply open `index.html` in your web browser, or serve it with any HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080` in your browser.

## 🎮 How to Play

1. **Configure Your Game** (optional):
   - Select how many cards you want to draw from the dropdown (52, 26, 13, or custom)
   - Manually mark specific cards as drawn if needed
2. Click the big **SPIN** button
3. Watch the wheel spin with smooth animation and drum roll sound
4. See your randomly selected card displayed in a beautiful card UI with confetti celebration
5. View your card history in the side panel
6. Spin again - drawn cards are automatically removed from the wheel
7. Click the **Reset** button (bottom right) to start over

## 📁 Project Structure

```
SPINWHEEL-playing-cards/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── cards/                      # SVG card images (52 cards + jokers)
│   ├── ace_of_spades.svg
│   ├── 2_of_hearts.svg
│   └── ... (all 52 cards)
├── index.html                  # Main HTML structure
├── style.css                   # Modern CSS styling
├── script.js                   # Game logic and animation
├── drumroll.mp3                # Spinning sound effect
├── result.mp3                  # Result/win sound effect
├── README.md                   # This file
└── DEPLOYMENT_INSTRUCTIONS.md  # Deployment guide (Indonesian)
```

## 🎨 Design Features

- **Minimalist Black Theme**: Clean black background with white accents
- **Vibrant Color Wheel**: 13 different colors rotating through all card segments
- **Card-Style Display**: Classic playing card appearance for the result
- **SVG Card Graphics**: High-quality vector card images for all 52 cards
- **Confetti Celebration**: Canvas-based fireworks animation on card reveal
- **Smooth Transitions**: All interactions feature polished animations
- **Fixed Reset Button**: Always accessible reset button in bottom right corner

## 🛠️ Technical Details

- **HTML5 Canvas**: Used for rendering the spin wheel with precise graphics and fireworks
- **CSS3 Animations**: Smooth transitions and slide-in animations for history items
- **JavaScript**: Vanilla JS with requestAnimationFrame for smooth spinning
- **External Library**: canvas-confetti (CDN) for celebration effects
- **Audio**: HTML5 Audio API for sound effects (drumroll.mp3, result.mp3)
- **Responsive**: CSS media queries for mobile (320px+), tablet, and desktop
- **State Management**: Tracks available cards, drawn cards, and game configuration

## 🌟 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📱 Mobile Support

Fully optimized for mobile devices with:
- Touch-friendly button sizes
- Responsive wheel sizing
- Adaptive text and spacing
- Mobile-first design approach

## 🔒 Security

- Minimal external dependencies (only canvas-confetti from CDN)
- No data collection or tracking
- Client-side only - no server required
- Secure by design
- All game state stored in browser memory only

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Every push to the `main` branch automatically deploys to GitHub Pages
2. **Manual Deployment**: You can also trigger deployment manually from the Actions tab
3. **Live URL**: After deployment, the site is available at `https://noerarief23.github.io/SPINWHEEL-playing-cards/`

The deployment workflow is defined in `.github/workflows/deploy.yml` and uses GitHub Actions to automatically publish the site.

## 📄 License

This project does not currently have an explicit license. All rights reserved by the author. Please contact the repository owner for permission to use, copy, modify, or distribute this code.

## 🎯 Credits

Created with ❤️ by ODIN for spinwheel!

**External Libraries:**
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Confetti animation effects

---

**Enjoy spinning the wheel and testing your luck!** 🎰✨
