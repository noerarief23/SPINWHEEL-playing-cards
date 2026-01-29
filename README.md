# SPINWHEEL PLAYING CARDS

A modern, interactive web-based spin wheel game featuring all 52 playing cards. Built with pure HTML5, CSS3, and JavaScript - no dependencies required!

## 🌐 Live Demo

**Play now at: [https://noerarief23.github.io/SPINWHEEL-playing-cards/](https://noerarief23.github.io/SPINWHEEL-playing-cards/)**

The game is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

## 🎰 Features

- **Interactive Spin Wheel**: Beautiful, colorful wheel displaying all 52 playing cards (Ace through King, ♠ ♥ ♦ ♣)
- **Smooth Animations**: 3-5 second spin with smooth ease-out cubic easing effect
- **Modern UI**: Dark purple gradient background with vibrant neon pink/cyan accents
- **Responsive Design**: Fully responsive - works perfectly on desktop, tablet, and mobile devices
- **Accessible**: ARIA labels and live regions for screen reader support
- **Production Ready**: Clean, optimized code with error handling and null checks
- **No Dependencies**: Pure vanilla JavaScript - no frameworks or libraries needed

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

1. Click the big **SPIN** button
2. Watch the wheel spin with a smooth animation
3. See your randomly selected card displayed in a beautiful card UI
4. Spin again as many times as you like!

## 📁 Project Structure

```
SPINWHEEL-playing-cards/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── index.html                  # Main HTML structure
├── style.css                   # Modern CSS styling with neon effects
├── script.js                   # Game logic and animation
├── README.md                   # This file
└── DEPLOYMENT_INSTRUCTIONS.md  # Deployment guide (Indonesian)
```

## 🎨 Design Features

- **Neon Glow Effects**: Animated pink and cyan neon text effects on the title
- **Vibrant Color Wheel**: 13 different colors rotating through all card segments
- **Card-Style Display**: Classic playing card appearance for the result
- **Casino Aesthetics**: Professional casino-fun styling throughout
- **Smooth Transitions**: All interactions feature polished animations

## 🛠️ Technical Details

- **HTML5 Canvas**: Used for rendering the spin wheel with precise graphics
- **CSS3 Animations**: Keyframe animations for neon glow effects
- **JavaScript**: Vanilla JS with requestAnimationFrame for smooth spinning
- **Responsive**: CSS media queries for mobile, tablet, and desktop

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

- No external dependencies or CDNs
- No data collection or tracking
- Client-side only - no server required
- Secure by design

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Every push to the `main` branch automatically deploys to GitHub Pages
2. **Manual Deployment**: You can also trigger deployment manually from the Actions tab
3. **Live URL**: After deployment, the site is available at `https://noerarief23.github.io/SPINWHEEL-playing-cards/`

The deployment workflow is defined in `.github/workflows/deploy.yml` and uses GitHub Actions to automatically publish the site.

## 📄 License

This project does not currently have an explicit license. All rights reserved by the author. Please contact the repository owner for permission to use, copy, modify, or distribute this code.

## 🎯 Credits

Created with ❤️ for spinwheel!

---

**Enjoy spinning the wheel and testing your luck!** 🎰✨
