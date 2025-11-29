# Repository Guidelines

## Project Structure & Module Organization

- **Root directory**: Contains HTML pages, main CSS, and JavaScript files
- **data/**: JavaScript modules with content data (articles, projects, skills, about me)
- **images/**: Static assets including article images and avatar
- **HTML pages**: index.html, about.html, articles.html, projects.html, etc.
- **Main files**: script.js (JavaScript logic), style.css (styling)

## Build, Test, and Development Commands

- **Local development**: Open HTML files directly in browser or use a local server
- **Live server**: python -m http.server 8000 or npx serve . for development
- **No build process**: Static site with direct file serving

## Coding Style & Naming Conventions

- **JavaScript**: ES6 modules, camelCase naming, 4-space indentation
- **CSS**: BEM methodology for class naming, kebab-case
- **File naming**: kebab-case for HTML files (e.g., article-detail.html)
- **Data structure**: Exported constants with descriptive property names
- **Comments**: Chinese comments for user-facing text, English for technical notes

## Testing Guidelines

- **Manual testing**: Test all interactive features in browser
- **Cross-browser**: Verify functionality in Chrome, Firefox, Safari
- **Responsive testing**: Check mobile and desktop layouts
- **Link validation**: Ensure all navigation and detail page links work correctly

## Commit & Pull Request Guidelines

- **Commit messages**: Chinese descriptions with clear purpose (e.g., 修复了关于我页面加载的问题)
- **Conventional format**: Start with action verb, describe changes concisely
- **PR requirements**: Test all affected pages, verify responsive design
- **Content updates**: Test data changes across all relevant pages

## Agent-Specific Instructions

- **Content updates**: When modifying data files, ensure all referencing pages display correctly
- **Navigation**: Maintain consistent URL patterns for detail pages (article-detail.html?id=article1)
- **Images**: Place all images in images/ directory, update references in data files
- **Module imports**: Use relative imports from data/ directory (e.g., import { articles } from './data/articlesData.js')
