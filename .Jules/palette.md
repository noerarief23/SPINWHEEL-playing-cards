## 2025-07-07 - Replace interactive spans with button elements
**Learning:** Found an accessibility issue pattern in the custom deck configuration where a simulated button (a `<span>` with an `onclick` handler) was used to remove cards. Spans lack native semantic meaning for screen readers, aren't keyboard focusable by default, and miss out on native keyboard activation (Enter/Space).
**Action:** Replaced the `<span>` with a proper `<button>` element. I also removed default button styles (background, border) in CSS to maintain the visual design, and added a `:focus-visible` state outline to provide clear visual feedback for keyboard users. Always use semantic `<button>` elements for interactive click targets.

## 2025-07-08 - Add Empty States for Better UX
**Learning:** Empty lists (like the card history) can leave users wondering what should be there. Providing a clear "empty state" with helpful text ("No cards drawn yet") guides the user and provides better initial context. Similarly, implicit inputs without clear screen-reader labels can cause confusion.
**Action:** Always include empty states for dynamic lists and explicit `aria-label` or `for` attributes on inputs and labels.

## 2026-07-11 - Explicit Focus Styles for Dark Mode
**Learning:** Default browser focus rings (which are often dark blue or black) can be completely invisible against a dark background, making keyboard navigation nearly impossible for users relying on visual focus indicators.
**Action:** Always provide explicit, high-contrast `:focus-visible` styles for all interactive elements (`button`, `select`, `input`, `[tabindex]`) in dark-themed applications.
## 2023-11-20 - Dark Mode Focus Visibility
**Learning:** Default browser focus rings often fail contrast requirements on dark backgrounds (#000000). Keyboard users may lose their place without custom, high-contrast `:focus-visible` styles.
**Action:** Always verify keyboard navigation in dark themes and apply a high-contrast focus ring (e.g., `#00BCD4` on black) using `:focus-visible`.
## 2023-11-20 - Replace blocking alerts with inline feedback
**Learning:** Using blocking browser `alert()` popups for simple form validation interrupts the user experience, shifts focus abruptly, and creates jarring interactions. In single-page applications, users expect fluid, contextual feedback. Additionally, allowing a form submission to proceed when it's known to be invalid (then blocking it) is an anti-pattern.
**Action:** Use inline text changes on buttons (combined with `aria-live` regions for screen readers) to provide contextual, non-blocking feedback. Additionally, use the `:disabled` state to prevent invalid submissions entirely, visually guiding the user.
