## 2024-05-15 - Replacing Native Alerts with Accessible Inline Feedback
**Learning:** Native `alert()` dialogs create poor user experiences and are inaccessible, as they block execution, take focus away from the current interaction, and rely on browser-level UI that can be confusing for screen reader users. Replacing them with inline feedback via temporary button text changes combined with an invisible `aria-live` region provides a seamless, accessible way to communicate errors or success states without interrupting the user flow.
**Action:** Always replace native `alert()` and `confirm()` calls with non-blocking, inline UI feedback using `aria-live` for screen readers and visible text/state changes for sighted users.
## 2025-07-07 - Replace interactive spans with button elements
**Learning:** Found an accessibility issue pattern in the custom deck configuration where a simulated button (a `<span>` with an `onclick` handler) was used to remove cards. Spans lack native semantic meaning for screen readers, aren't keyboard focusable by default, and miss out on native keyboard activation (Enter/Space).
**Action:** Replaced the `<span>` with a proper `<button>` element. I also removed default button styles (background, border) in CSS to maintain the visual design, and added a `:focus-visible` state outline to provide clear visual feedback for keyboard users. Always use semantic `<button>` elements for interactive click targets.

## 2026-07-09 - Global focus-visible styles and dynamically revealed inputs
**Learning:** Discovered an accessibility issue pattern where inputs that become visible dynamically (like the custom card count input) often lack implicit ARIA labels because they aren't part of the static layout's labeling scheme. Also noticed that relying on component-specific focus styles led to missing focus indicators for general interactive elements like buttons and dropdowns.
**Action:** Applied a global `:focus-visible` style in CSS to handle basic keyboard focus across all interactive elements (`button`, `select`, `input`) instead of targeting them individually. I will also ensure dynamically revealed inputs get proper `aria-label` attributes if they lack a visible `<label>`.
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

## 2024-03-24 - Inline Destructive Action Confirmation
**Learning:** For destructive actions (like clearing game state), using non-blocking inline state changes (e.g. changing text to "Confirm?" and utilizing aria-live) prevents accidental data loss without breaking user flow or triggering intrusive native confirm() dialogs.
**Action:** Implement similar 2-step click patterns for reset/delete actions where screen real-estate is limited and native dialogs are undesirable.

## 2026-07-15 - Contextual Disabled State Feedback
**Learning:** Found that when buttons become disabled implicitly (like the spin button when the deck empties, or the mark card buttons when nothing is selected), users are often left wondering *why* the interaction is blocked. Relying purely on a visual grayed-out state isn't enough, especially for users relying on screen readers or those unfamiliar with the app's logical constraints.
**Action:** Always provide explicit context for disabled states. For icon-only or primary action buttons, update the button text itself (e.g., "SPIN" -> "NO CARDS") and supplement it with a `title` attribute explaining the blocked state to provide a clear, discoverable reason.
## 2024-05-18 - Prevent Accidental Deletion in Custom Deck
**Learning:** Destructive actions without confirmation (like clearing a carefully built custom deck) can lead to frustrating data loss, and the app's components need consistent protection against accidental clicks.
**Action:** Always implement an inline confirmation pattern (or similar safety check) for destructive actions that erase user-configured state, ensuring accessibility tags are updated to announce the confirmation state to screen readers.

## 2024-05-18 - Disable Destructive Actions for Empty States
**Learning:** Destructive actions (like "Clear Deck") left enabled when there is no state to destroy can cause user confusion, as they may attempt an action that does nothing. This lack of feedback makes the interface feel unresponsive.
**Action:** Always disable destructive action buttons when there is no state to act upon, and provide explicit context for the disabled state via a `title` attribute (e.g., 'Custom deck is already empty') so users understand why the action is blocked.
## 2026-07-20 - Managing Focus During Async States and Redundant ARIA Live Announcements
**Learning:** Found two accessibility patterns:
1. When a button (like "Spin") is disabled during an asynchronous action (like an animation), screen reader users can lose focus entirely if focus is left on the disabled element. Focus should be deliberately managed and returned to a logical interactive element once the action completes.
2. When inserting content into an `aria-live` region, if an image with `alt` text is added alongside text content that says the same thing, screen readers will redundantly announce the result twice.
**Action:**
- Always save the `document.activeElement` before initiating an async state that disables the active element, and restore it (or provide a logical fallback) upon completion.
- Set `alt=""` and `aria-hidden="true"` on images injected into `aria-live` regions when their meaning is already conveyed by adjacent text.

## 2026-07-19 - Contextual Disabled States for Empty Actions
**Learning:** Relying solely on visual grayed-out states for empty states is confusing. Explicit context should be provided using title attributes.
**Action:** Always provide explicit disabled state context using title attributes and disable destructive actions when there is no state to act upon.
## 2026-07-21 - Restoring Focus on Self-Disabling Elements
**Learning:** Found an accessibility issue pattern where elements (like `markSelectedBtn`, `addCustomCardBtn`, and `clearCustomDeckBtn`) disable themselves synchronously after being clicked, or are completely removed from the DOM (like `.remove-custom-card` when it is the last item). This causes screen reader and keyboard focus to drop entirely to the `<body>`, forcing users to navigate through the entire page structure again.
**Action:** When an interactive element disables itself synchronously or gets removed from the DOM, capture and explicitly restore focus to an adjacent logical element (like the parent dropdown `customDeckSelect` or the next available remove button) to prevent focus dropping.

## 2026-07-21 - Explicit Focus Restoration for Synchronous Disabled States
**Learning:** Found an accessibility issue pattern where buttons (like "Mark Selected" and "Add" custom card) disable themselves synchronously in their click handlers, causing focus to drop to the `<body>`. The previous learning only covered async actions (like the spin animation).
**Action:** Always capture the active element (`const wasFocused = document.activeElement === btn`) before disabling it in click handlers, and restore focus to a logical adjacent interactive element (like the associated `select` dropdown) if focus was lost.

## 2026-07-21 - Disable Destructive Actions for Empty States Applied to Reset
**Learning:** Applying the "Disable Destructive Actions for Empty States" principle, the global game "Reset" button should be disabled when the game is already in its initial state (no drawn cards).
**Action:** Always ensure global state reset buttons are disabled with explicit context via `title` attribute when there is no state to reset.

## 2026-07-22 - Semantic Lists for Dynamic Collections
**Learning:** Found an accessibility issue pattern where dynamic collections (like the card history and custom deck builder) were implemented using generic `<div>` tags instead of semantic `<ul>` and `<li>` lists. Screen readers announce list sizes and structure to users navigating with them, providing valuable context that generic `div`s lack.
**Action:** Always use semantic `<ul>`/`<ol>` and `<li>` elements for displaying lists or dynamic collections of items, and ensure `ul`/`ol` tags include an appropriate `aria-label` attribute if they lack a visible labeling element. Update CSS to remove default browser list styling if a custom appearance is required.
