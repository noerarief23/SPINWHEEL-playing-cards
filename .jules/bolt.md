## 2024-07-07 - Canvas Animation Hardware Acceleration
**Learning:** For continuous rotation of a complex prerendered canvas (like the 52-segment wheel), using `requestAnimationFrame` to repeatedly call `ctx.clearRect()`, `ctx.translate()`, `ctx.rotate()`, and `ctx.drawImage()` on the main thread is a major CPU bottleneck.
**Action:** Always offload continuous visual transformations of a static canvas to the GPU using CSS `transform: rotate()`. Only use Canvas API drawing methods when the actual contents of the canvas need to change (e.g., removing a segment). Also remember to remove any CSS `transition` properties that might conflict with frame-by-frame JS updates.

## 2024-07-08 - Canvas Resize Event Debouncing
**Learning:** Offscreen canvas prerendering is a fantastic optimization for a complex static 52-segment wheel, but it becomes a major performance liability if the heavy redraw logic is triggered on every single frame during a window resize event.
**Action:** Always debounce the `resize` event listener when it triggers expensive Canvas redraw functions, ensuring recalculations only happen once the user has finished resizing the window.
