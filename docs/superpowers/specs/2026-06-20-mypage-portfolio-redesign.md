# Mypage Portfolio Redesign

## Goal

Turn `mypage/` into a clearer personal portfolio for internship and early-career opportunities while preserving Fangwenky's approachable, handmade visual identity. The site should also remain useful to technical peers who want to browse projects and learning notes.

## Design Direction

Use a modern technical-portfolio structure with light notebook-inspired details. The visual system will use warm paper surfaces, dark ink text, a blue-violet primary accent, and a restrained coral highlight. Hand-drawn lines and slight card offsets remain as accents rather than dominating the layout.

The interface must avoid invented credentials, awards, employment claims, metrics, or contact details. All personal content comes from the repository's existing data.

## Information Architecture

The homepage will lead with a new hero section that immediately answers:

- Who Fangwenky is.
- The current focus on AI, deep learning, and practical engineering.
- Where to view representative work and how to make contact.

Below the hero, the homepage will present:

1. A compact focus and capability overview.
2. Selected projects with clearer outcomes and technologies.
3. Recent writing that demonstrates sustained learning.
4. A concise learning journey/about preview.
5. A direct contact call to action.

The existing article, project, archive, search, detail, and about pages remain. Their navigation, surfaces, typography, spacing, controls, and footer will be aligned with the new visual system.

## Content Strategy

The homepage copy will be concise, concrete, and bilingual. It will frame the owner as a student/developer learning in public and building practical AI projects, without overstating experience. Projects and articles will remain data-driven from the current JavaScript modules.

Representative content will be prioritized over raw quantity. Calls to action will favor viewing projects, reading articles, visiting GitHub, and contacting the owner through existing links.

## Interaction And Accessibility

- Preserve the existing Chinese/English language switch and apply it to new copy.
- Add a light/dark theme control using semantic CSS variables and persisted preference.
- Keep navigation usable by keyboard and screen readers, including visible focus states.
- Respect `prefers-reduced-motion` and avoid mandatory autoplay or distracting movement.
- Maintain useful tap targets and responsive layouts at small-phone, tablet, and desktop widths.
- Use semantic headings, descriptive labels, and informative image alternative text.

## Technical Approach

Continue using static HTML, CSS, and ES modules so GitHub Pages and the VPS can serve identical files without a build step. Reuse the existing content modules and rendering functions. Changes should remain concentrated in `mypage/`, with only documentation or deployment notes added outside it when necessary.

No new framework or production dependency will be introduced. External font and icon use will be reduced or given robust fallbacks where practical.

## SEO And Sharing

- Correct canonical and Open Graph URLs for the `/mypage/` GitHub Pages path and VPS domain where feasible.
- Improve page titles and descriptions around Fangwenky's AI learning, engineering projects, and technical writing.
- Add structured profile/site metadata without making unsupported claims.
- Ensure social preview and favicon assets resolve from nested and detail pages.

## Verification

- Run the existing content generator and audit scripts.
- Serve `mypage/` locally and inspect all primary pages at desktop and mobile widths.
- Test navigation, language switching, theme switching, search, project/article cards, detail pages, and reduced-motion behavior.
- Check the browser console for runtime and asset errors.
- Verify the pushed `main` revision on GitHub and deploy the same `mypage/` content to `/var/www/fangwenky-home/current` on the VPS.
- Verify both `https://fangwenky.github.io/mypage/` and `https://fangwenky.dpdns.org/` after deployment.

## Scope Boundaries

This redesign does not add a backend, analytics service, CMS replacement, fabricated resume data, or a new domain configuration. Existing article content and unrelated repository projects will not be rewritten.
