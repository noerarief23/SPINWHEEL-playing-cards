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

## 2026-07-27 - Contextual Disabled States for Empty Dropdowns
**Learning:** Found that when a dynamic dropdown's backing data is empty, users are left with an empty list or dead-end interaction without context. Relying on an empty list can be confusing, especially for screen reader users or those unfamiliar with the app's logical constraints.
**Action:** Always disable dynamic select dropdowns when their backing data is empty, providing explicit context via a `title` attribute and updating the placeholder option text (e.g., '-- No cards available --') to prevent dead-end interactions.
## 2026-07-23 - Contextual Feedback for Empty Dropdowns
**Learning:** Found an accessibility issue pattern where dynamic `select` dropdowns (like the card selection) appeared enabled but functionally useless when their backing data was empty, leading to "dead-end" interactions.
**Action:** Always disable dynamic select dropdowns when their backing data is empty, providing explicit context via a `title` attribute and updating the placeholder option text (e.g., '-- No cards available --') to prevent confusing empty interactions.
## 2026-07-25 - Contextual Disabled States and Focus Fallbacks for Empty Dropdowns
**Learning:** When dynamic dropdowns (like a custom card selector) become completely empty, disabling them without context leaves users wondering why they can't interact with the element. Additionally, if an action empties the dropdown and disables it, any logic attempting to restore focus to that dropdown will fail, causing focus to drop to the `<body>`.
**Action:** Always disable dynamic select dropdowns when their backing data is empty, providing explicit context via a `title` attribute and updating the placeholder option text (e.g., '-- No cards available --') to prevent dead-end interactions. When restoring focus to elements that might become disabled, always provide a logical, interactive fallback element (like a global 'Reset' button) to maintain the keyboard navigation flow.
## 2023-11-20 - Disable Dynamic Empty Dropdowns
**Learning:** Found an accessibility issue pattern where dynamic dropdown menus (like "Mark cards as drawn") remained enabled even when there were no options left to select. Users could click the dropdown only to find it confusingly empty, which is a dead-end interaction.
**Action:** Always disable dynamic select dropdowns when their backing data is empty. When doing so, provide explicit context via a `title` attribute (e.g. 'All cards have been drawn') and update the placeholder option text (e.g. '-- No cards available --') to explain why the input is blocked and prevent user frustration.

## 2026-07-28 - Proactive Disabled State for Duplicate Choices in Dropdowns
**Learning:** Found that when building a custom list, users were allowed to select an item they had already added, and were only given error feedback *after* trying to click "Add" again. Relying on after-the-fact error validation is a frustrating user experience, especially when the invalid choice (a duplicate) is known beforehand.
**Action:** Proactively disable invalid choices (like duplicates) within UI elements like `<option disabled>` in selects, rather than relying on after-the-fact error validation. Always append explicit contextual text like '(Added)' to explain why the choice is unavailable directly within the dropdown to prevent confusion and dead-end interactions.
## 2026-08-06 - Respecting Reduced Motion Preferences in Canvas Applications
**Learning:** Found that custom canvas animations (like a 5-8 second spin wheel) and prolonged sound effects (like a drumroll) are not natively paused or muted by the OS's 'reduced motion' setting, which can trigger vertigo, nausea, or auditory fatigue for sensitive users. Furthermore, setting animation duration completely to 0 can cause division-by-zero math errors in some animation loops.
**Action:** Always explicitly check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in JavaScript. When true, bypass custom animations (using a safe near-zero duration like 1ms instead of 0) and mute specifically prolonged/disorienting sounds. Standard functional or success audio (like a quick 'win' chime) should remain, as motion preferences are distinct from general auditory preferences.
## 2024-08-04 - Motion vs Auditory Preferences
**Learning:** Motion preferences (e.g., `prefers-reduced-motion`) are distinct from general auditory preferences. When applying reduced-motion checks, users still expect functional/success feedback unless they specifically disable sound.
**Action:** Do not arbitrarily mute standard functional or success audio feedback based on motion preferences; only disable prolonged or visually-tied disorienting sounds.
## 2026-07-28 - Proactively Disable Invalid Choices
**Learning:** Found that relying on after-the-fact error validation messages for invalid choices (like selecting a duplicate item in a custom deck builder) can lead to a frustrating experience. Users prefer to see what options are available upfront rather than being reprimanded after making a selection.
**Action:** Proactively disable invalid choices (like duplicate items) within UI elements (e.g., using `<option disabled>` in selects) rather than relying on after-the-fact error validation messages. Append contextual text like '(Added)' to explicitly explain why the choice is unavailable.
## 2026-07-28 - Proactive Disabled States for Form Options
**Learning:** Found a UX issue where users could select cards that were already added to their custom deck, only to receive a post-action error ("Already added") upon clicking "Add". Reacting to user errors is inferior to preventing them entirely. Relying on users to remember their selections or check the list below creates cognitive load.
**Action:** Always proactively disable invalid choices (like duplicates) directly within the UI elements (e.g., `<option disabled>`). Append contextual text like "(Added)" to the option so the user immediately understands why the choice is unavailable, preventing the error before it can happen.
## 2024-05-18 - Properly handling reduced-motion sound feedback
**Learning:** When applying reduced-motion, specifically distinguish and separate prolonged, motion-tied sounds from standard success auditory feedback (which shouldn't be muted).
**Action:** In future implementations, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` to selectively mute or bypass prolonged sound effects (like spinning wheels) but retain success audio cues (like winning sounds), as motion preferences are distinct from general auditory preferences.
## 2024-05-18 - prefers-reduced-motion for Custom Animations and Sounds
**Learning:** `prefers-reduced-motion` should not only be used for bypassing visual animations like canvas confetti or fast spinning visual elements, but should also apply to bypassing prolonged, potentially disorienting sound effects (like a long 8-second drum roll) that accompany the spinning state. However, standard discrete success feedback audio (like a brief win sound) should be preserved to maintain accessibility standards.
**Action:** When implementing `prefers-reduced-motion` checks, differentiate between prolonged/disorienting functional sounds and discrete feedback sounds. Bypass the former, preserve the latter. Ensure animation durations aren't set to literally 0 to avoid divide-by-zero math errors in canvas easing logic (e.g., set to 1ms).
## 2026-07-31 - Motion Accessibility and Animation Math
**Learning:** Found an accessibility issue pattern where custom canvas-based animations, particle effects (like confetti), and long-running sound effects ignore the user's `prefers-reduced-motion` OS-level preference. Attempting to set an animation duration strictly to `0` can cause mathematical division-by-zero errors in animation logic (e.g., `elapsed / duration`).
**Action:** Always explicitly check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in JavaScript to bypass or simplify custom animations, particle effects, and sound effects for users with motion sensitivities. Setting animation duration to a near-zero value (e.g., 1ms) rather than 0 is preferred to avoid mathematical division-by-zero errors in animation logic while providing an instant state transition.

## 2026-07-30 - Reduced Motion Accessibility in Canvas Animations
**Learning:** When users prefer reduced motion, completely skipping canvas-based particle effects (like fireworks) is crucial for accessibility. For continuous animations (like the spinning wheel) that are deeply integrated with application state and logic (e.g., division operations based on duration), setting the animation duration to a near-zero value (e.g., `1`) is much safer and more reliable than setting it to `0`. Setting it to `0` can cause mathematical division-by-zero errors or infinite loops in animation logic, leading to permanent UI locks.
**Action:** Always check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in JavaScript for custom UI animations. Use early returns to skip decorative particle effects, and use near-zero durations (e.g., `1ms`) instead of true `0` for core state-machine animations to ensure safety while respecting motion sensitivities.
## 2026-07-28 - Reduced Motion Support for Custom JS Animations
**Learning:** Adding an `@media (prefers-reduced-motion: reduce)` block in CSS handles native transitions and animations, but it doesn't automatically stop JavaScript-driven animations (like those rendered on `<canvas>`) or their associated audio effects. If these are overlooked, users with motion sensitivities are still subjected to potentially triggering content.
**Action:** Always explicitly check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in JavaScript before initiating custom animations, particle effects (like confetti), or accompanying sound effects. Use this check to either bypass the animation completely (setting duration to 0) or provide a simplified, motion-free alternative.

## 2024-05-18 - Managing Focus in Destructive Actions
**Learning:** When a destructive action button (like Reset) uses inline confirmation state and then disables itself synchronously upon success, keyboard focus will drop to the document body, breaking the keyboard navigation flow.
**Action:** Always capture `document.activeElement` before executing the destructive action. If the triggering button was focused, explicitly restore focus to the next logical interactive element (e.g., the primary action button like `spinButton`) after the action completes.
## 2026-08-13 - Redundant Screen Reader Announcements for Decorative Icons
**Learning:** Found an accessibility issue pattern where decorative elements containing unicode symbols (like `5♥`) were being announced by screen readers alongside their fully spelled-out text equivalents (like "5 of Hearts"). This creates a redundant and annoying auditory experience (e.g. "5 hearts 5 of Hearts").
**Action:** Always apply `aria-hidden="true"` to elements containing decorative unicode suit symbols when the full text name is already adjacent and visible in the DOM. Avoid adding an additional `.sr-only` element if the full text name is already present, to prevent double-reading by screen readers.

## 2026-08-10 - Hiding Decorative Symbols Next to Full Text
**Learning:** Found an accessibility issue where a decorative unicode suit symbol (like `A♠`) in the card history display was read aloud by screen readers alongside its adjacent full-text name (like "Ace of Spades"). This causes a redundant and confusing double-reading experience (e.g., "A Spades Ace of Spades").
**Action:** Always apply `aria-hidden="true"` to decorative symbols or shorthand displays when a full-text, visible alternative is immediately adjacent, to prevent double-reading by screen readers.
## 2026-08-11 - Hiding Decorative Symbols from Screen Readers
**Learning:** Found an accessibility issue where decorative unicode suit symbols (like `♠` or `♥`) displayed next to their full text names (e.g., "A♠ Ace of Spades") in lists caused redundant and confusing announcements for screen reader users (e.g., reading "A Black Spade Suit Ace of Spades").
**Action:** When displaying decorative unicode symbols alongside full semantic text, wrap the visual symbols in an element with `aria-hidden="true"`, and provide a visually hidden element (`.sr-only`) containing the complete, clear semantic text to ensure a concise and accurate screen reader experience.

## 2024-05-20 - Hide Decorative Card Suits from Screen Readers
**Learning:** When decorative unicode suit symbols (like `♠` or `♥`) are displayed next to their full text names (like "Ace of Spades") in lists or components, screen readers will announce both consecutively, causing a confusing and redundant auditory experience (e.g., "A Spade Suit Ace of Spades").
**Action:** Always wrap decorative unicode symbols in a `span` or `div` with `aria-hidden="true"`, ensuring only the full semantic text representation is accessible to screen readers, keeping the auditory output clean and concise.

## 2026-08-15 - Semantic Landmarks and Heading Hierarchy
**Learning:** Found accessibility issue patterns where non-sequential heading levels (like jumping from `h1` directly to `h3`) and missing ARIA landmarks for functional sections (like configuration and actions) cause problems for assistive technology users navigating single-page apps. The `region` role or `aria-label` is necessary on elements containing form fields to provide context.
**Action:** Always maintain a strict, sequential heading hierarchy (`h1` -> `h2` -> `h3`) within the document. Additionally, ensure all interactive content is wrapped in semantic landmarks (like `<section aria-label="...">` instead of just `<div>`) to allow screen readers to properly identify and jump between distinct areas of the application.
## 2026-08-07 - Visible Context for Sighted Users in Lists
**Learning:** Found a UX/a11y issue in the custom deck builder list: The full card names (e.g., "Ace of Spades") were hidden from sighted users using `.sr-only`, leaving only the symbol ("A♠"). This created a disconnect between the dropdown menu (which showed the full name) and the selected list, making it harder for users to quickly verify their selections. Sighted users benefit from clear, descriptive text just as much as screen reader users.
**Action:** Always aim to make descriptive text visible to all users unless it creates extreme clutter. If an adjacent symbol is purely decorative, hide the symbol from screen readers (`aria-hidden="true"`) and show the text, rather than the other way around.

## 2026-08-16 - Spatial Visualization of Abstract Constraints
**Learning:** Found an opportunity to improve the UX around abstract limits, like the number of cards drawn from a deck. Users typically have to read text (e.g. "Drawn: 5 / Remaining: 47") to understand their progress. This creates minor cognitive load. Visualizing this limit spatially makes the state of the system immediately obvious at a glance.
**Action:** When users are operating within a bounded limit (like drawing from a fixed pool of items), introduce spatial visualizations (like a progress bar) to complement textual representations. Always ensure these visual elements include appropriate ARIA roles (e.g. `role="progressbar"`) and properties (e.g. `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) so that assistive technologies can also convey this semantic information.

## 2026-08-17 - Semantic Meaning for Progress Bars
**Learning:** Found that visual progress bars representing a ratio (like "5 of 52 cards drawn") lack semantic meaning for screen reader users if they only use `aria-valuenow` (which just reads out a percentage number like "10").
**Action:** Always complement `role="progressbar"` with `aria-valuetext` when the progress represents a specific ratio or bounded constraint to convey the exact semantic meaning (e.g., "5 of 52") to screen reader users.
