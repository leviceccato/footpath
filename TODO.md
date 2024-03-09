A list of complete and incomplete tasks to track progress.

## To do (lowest to highest priority)

- Add syntax highlighting
- Statically define colours (don't parse)
- Fix code documents/tabs
- Add tooltips for language and colour picker buttons
- Fix modal background contrast for dark colours
- Create favicon
- Optimise computed values to potentially use createMemo across codebase
- Add hex input for colour
- Prevent Escape from closing Popover if focus doesn't change
- Deploy to Netlify and update docs
- Add Footpath branding

## Doing

- Fix MenuChild hovering. How to keep parent active when child is hovered? Context? Managing all elements in root element? Something else?

## Done (most recent to oldest)

- Make "thin 1px lines" DPR indepedent (always 1px, ignore browser zoom)
- Rename to Footpath
- Create Menu tree component
- Prevent Popover closing on focusout, base on Esc press instead
- Add global activeCodeDocument property and remove individual isActive
- Expose composables as namespaced objects, rather for destructuring (e.g. useCodeDocuments)
- Explicitly expose props from native elements
- Refactor Popover to support mulitple popovers per button
- Match scrollbar style to theme
- Make code editor async
- Add new defaultProps utility
- Allow dragging outside colour picker
- Prevent tabbing out of code editor
