# Mypage Admin Project Management Design

## Summary

Extend the existing local Publishing Desk so it can manage homepage projects as well as articles. The project feature will reuse the current admin server, token-protected local UI, recovery drafts, image upload flow, preview frame, workspace status, publish confirmation, GitHub push, and VPS deployment pipeline.

Projects will continue to use `mypage/data/projectsData.js` as their source of truth. This keeps the public site stable and avoids a data migration while removing the need to edit the JavaScript file by hand.

## Goals

- Add a clear `Articles / Projects` content switch in the admin UI.
- List, search, create, edit, save, and delete projects visually.
- Edit all current project fields: `id`, `title`, `description`, `image`, `tags`, `link`, `category`, `date`, and detail `content`.
- Save project changes back to `mypage/data/projectsData.js`.
- Preview project detail content with the real site stylesheet.
- Support project image upload into `mypage/images/` and image selection from existing site images.
- Preserve browser recovery drafts for unsaved project edits.
- Include project file changes in the existing publish prepare and publish flow.
- Keep unrelated local files, including `.claude/`, excluded from publishing.

## Non-Goals

- Do not migrate projects into Markdown folders in this pass.
- Do not add project translations or multilingual project editing unless the current site already consumes that shape.
- Do not add project status or private drafts. Projects are public once saved and published.
- Do not build a separate desktop app or a second admin page.

## Data Model

The backend will parse and rewrite `mypage/data/projectsData.js` as an exported array named `projects`.

Each project record contains:

- `id`: locked after first save, used in `project-detail.html?id=...`.
- `title`: card and detail title.
- `description`: card summary and search text.
- `image`: cover path, normally `images/...`.
- `tags`: string array.
- `link`: external demo or source link.
- `category`: project grouping.
- `date`: ISO date string.
- `content`: trusted HTML string rendered on the public project detail page.

The writer should preserve a clean deterministic format rather than trying to keep comments inside `projectsData.js`. This is acceptable because the admin becomes the editing surface for the file.

## Backend Design

Add a `projectStore` service with the same boundary style as `contentStore`:

- `listProjects()`
- `readProject(id)`
- `saveProject(payload)`
- `deleteProject(id)`
- `listProjectImages()`
- `saveProjectImage(file)`

Validation rules:

- `id`, `title`, `description`, `image`, `category`, `date`, and `content` are required.
- `id` accepts letters, numbers, hyphen, and underscore.
- `tags` is normalized from comma-separated input or an array.
- `link` may be empty, `#`, relative, or HTTP(S).
- New IDs must not collide with existing projects.
- Existing IDs are locked after first save.
- Uploaded images must pass the existing MIME and magic-byte checks.

New API routes:

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `DELETE /api/projects/:id`
- `GET /api/projects/assets`
- `POST /api/projects/upload`
- `POST /api/project-preview`

The preview route returns a full preview document using the public site CSS and a project-detail container, mirroring the current article preview route.

## Frontend Design

The admin UI keeps one shell and adds a content switch near the sidebar heading:

- `文章库` mode keeps the current article workflow unchanged.
- `项目库` mode swaps the list, filters, metadata fields, editor labels, toolbar behavior, and delete copy.

Project editing uses:

- A metadata panel for title, description, date, category, tags, link, image, and locked ID.
- A large `HTML 详情` editor for the `content` field.
- A small helper toolbar for common HTML blocks: heading, paragraph, list, link, image, and code.
- Image upload and image picker connected to `mypage/images/`.
- Split preview using the public project detail layout.

Recovery drafts use a separate key namespace, such as `mypageAdminProjectRecovery:*`, so article recovery entries are never mixed with project drafts.

## Publish Flow

The existing publish service should not become project-specific. Project changes are normal workspace changes and should appear in:

- workspace status
- publish prepare diff summary
- confirmation fingerprint
- exact staging
- commit and push
- VPS release upload
- hash verification

Pure project edits are public once saved and included in the next publish. Article-only draft exclusion rules remain unchanged for article Markdown files.

## Error Handling

- If `projectsData.js` cannot be parsed, the UI shows a blocking project-library error with the raw parse message.
- If a project save fails validation, the form highlights missing fields and keeps the recovery draft.
- If upload fails, the editor content is not modified.
- If delete is confirmed, the project is removed from `projectsData.js`; uploaded shared images are not automatically deleted.
- If publish fails, the current retry behavior stays unchanged.

## Testing

Backend `node:test` coverage:

- project JS parse and deterministic rewrite
- field validation
- ID lock and duplicate ID rejection
- tag normalization
- image MIME and magic-byte reuse
- project deletion
- project preview document generation
- publish prepare includes `mypage/data/projectsData.js` and project images when changed

Manual browser checks:

- switch between article and project modes
- create a project, save, reload, and verify ID lock
- edit an existing project and confirm preview matches site styling
- upload/select a project image
- close and reopen the tab to restore unsaved project recovery draft
- delete a project with confirmation
- prepare publish and verify project files appear in the diff
- check desktop and narrow layouts for no horizontal overflow

## Acceptance Criteria

- Projects can be managed without editing `projectsData.js` directly.
- Existing article management behavior remains intact.
- Existing public project pages still work with the generated `projectsData.js`.
- `npm run check` passes.
- A real publish can push project changes to `origin/main` and deploy to the VPS through the existing release flow.
