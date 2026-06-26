# Mypage Project Markdown Content Design

## Summary

Unify visual content editing around Markdown. Articles already use Markdown source files; projects will now use Markdown in `projectsData.js` instead of hand-written HTML strings. The admin project editor will use the same Markdown editing expectations as article editing, and the public site will render project Markdown into HTML at runtime.

## Goals

- Project detail content is authored and saved as Markdown.
- Existing project HTML content is migrated to Markdown.
- New project saves include `contentType: "markdown"`.
- Public project detail pages render Markdown content safely with the same `marked` path already used by article detail pages.
- Search continues to work by stripping rendered HTML or Markdown syntax.
- The admin project preview uses Markdown rendering, not raw HTML insertion.
- Existing article editing remains unchanged and continues to use Markdown.

## Non-Goals

- Do not move project content into separate `content/projects/<id>/index.md` files in this pass.
- Do not add bilingual project Markdown editing in this pass.
- Do not change article data generation.

## Data Model

Each project keeps its current metadata fields and adds:

- `contentType: "markdown"`
- `content`: Markdown source text

The public site will treat missing `contentType` as legacy HTML for compatibility. The admin will always save projects as Markdown after this migration.

## Migration

Convert the current project HTML strings to equivalent Markdown:

- `<h2>` and `<h3>` become Markdown headings.
- Paragraphs become normal Markdown paragraphs.
- `<strong>`, `<code>`, links, and lists become Markdown syntax.
- The new `miaobti` placeholder content becomes Markdown as well.

The migration should preserve meaning and readable formatting, not byte-level HTML structure.

## Backend

`projectStore` will normalize `contentType` to `markdown` for saved projects. It may still read legacy records without `contentType` so old data does not break.

`/api/project-preview` should render Markdown with the existing Markdown renderer. The preview document will receive rendered HTML from Markdown, matching article preview behavior.

## Frontend

Project mode will:

- Label the editor as Markdown project details.
- Use Markdown toolbar commands, not HTML wrapper commands.
- Insert uploaded images as Markdown image syntax.
- Preview rendered Markdown inside the project preview shell.

The project recovery draft namespace stays unchanged.

## Public Site

`mypage/script.js` will render project detail content as Markdown when `contentType === "markdown"` and `window.marked` is available. Legacy HTML remains supported when the field is absent or set to `html`.

## Testing

- Project store tests cover Markdown save and legacy HTML read compatibility.
- Public project rendering logic is checked through browser verification.
- `npm run check` must pass.

## Acceptance Criteria

- All visual article/project content editing uses Markdown.
- `projectsData.js` project `content` fields are Markdown after migration.
- Project detail pages still render formatted content correctly.
- Existing article management behavior is unchanged.
