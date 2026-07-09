## 2025-07-07 - Replace interactive spans with button elements
**Learning:** Found an accessibility issue pattern in the custom deck configuration where a simulated button (a `<span>` with an `onclick` handler) was used to remove cards. Spans lack native semantic meaning for screen readers, aren't keyboard focusable by default, and miss out on native keyboard activation (Enter/Space).
**Action:** Replaced the `<span>` with a proper `<button>` element. I also removed default button styles (background, border) in CSS to maintain the visual design, and added a `:focus-visible` state outline to provide clear visual feedback for keyboard users. Always use semantic `<button>` elements for interactive click targets.

## 2026-07-09 - Global focus-visible styles and dynamically revealed inputs
**Learning:** Discovered an accessibility issue pattern where inputs that become visible dynamically (like the custom card count input) often lack implicit ARIA labels because they aren't part of the static layout's labeling scheme. Also noticed that relying on component-specific focus styles led to missing focus indicators for general interactive elements like buttons and dropdowns.
**Action:** Applied a global `:focus-visible` style in CSS to handle basic keyboard focus across all interactive elements (`button`, `select`, `input`) instead of targeting them individually. I will also ensure dynamically revealed inputs get proper `aria-label` attributes if they lack a visible `<label>`.
## 2025-07-08 - Add Empty States for Better UX
**Learning:** Empty lists (like the card history) can leave users wondering what should be there. Providing a clear "empty state" with helpful text ("No cards drawn yet") guides the user and provides better initial context. Similarly, implicit inputs without clear screen-reader labels can cause confusion.
**Action:** Always include empty states for dynamic lists and explicit `aria-label` or `for` attributes on inputs and labels.
