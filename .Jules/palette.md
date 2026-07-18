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
