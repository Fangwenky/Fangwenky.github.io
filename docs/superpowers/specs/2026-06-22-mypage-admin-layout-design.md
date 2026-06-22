# Mypage Admin Layout Design

## Goal

Improve long-form editing by making the article library easier to read and giving the Markdown workspace substantially more vertical room.

## Desktop Layout

- Increase the default article-library width from 310px to 380px.
- Show article titles on up to two lines instead of truncating every title to one line.
- Add a clearly labelled control in the library header that completely collapses the library.
- When collapsed, remove the library column from the application grid so the editor uses the released width.
- Keep a compact restore control available in the application header while the library is collapsed.
- Persist the desktop collapsed state in browser local storage.

## Editor Height

- Size the editor workspace from the viewport, with a minimum height of 720px on desktop.
- Keep the Markdown editor and preview at equal heights in split mode.
- Preserve the existing editor-only and preview-only modes.
- On short screens, allow the document page to scroll rather than clipping controls.

## Responsive Behavior

- Below the existing tablet breakpoint, retain the current off-canvas article-library drawer.
- Do not apply the persisted desktop collapsed state to the mobile drawer.
- Keep article titles multi-line on narrow screens without introducing horizontal overflow.

## Interaction And Accessibility

- Use a real button with updated `aria-expanded` and accessible labels.
- Keep keyboard focus styles and the existing Escape-to-close behavior for the mobile drawer.
- Apply a short grid transition only when motion is allowed by the user's preferences.

## Verification

- Verify expanded and collapsed states in the browser.
- Confirm the state survives a reload.
- Confirm titles can use two lines and the editor receives the reclaimed width.
- Run the existing JavaScript checks and automated tests.
- Inspect desktop and narrow layouts for overflow and reachable controls.
