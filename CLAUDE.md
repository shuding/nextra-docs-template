# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Cardinal product documentation site built with [Nextra](https://nextra.site/) (Next.js-based documentation framework) and TypeScript. The site documents two main products:
- **Cardinal Desktop Application** - Platform for building and deploying custom ops agents
- **Lakerunner** - S3-based observability stack

## Development Commands

```bash
# Install dependencies (requires pnpm)
pnpm i

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build
```

## Git

- Do not use --amend to modify history as we will squash at merge time.

## Architecture

### Documentation Structure
- `pages/` - MDX content files organized by product
  - `pages/_meta.json` - Navigation structure and page titles
  - `pages/vibeshield/` - Desktop Application docs (connectors, product guides, agents)
  - `pages/lakerunner/` - Lakerunner docs
- `components/` - React components used in MDX pages
- `theme.config.tsx` - Nextra theme configuration (logo, SEO, footer)
- `next.config.js` - Next.js configuration with Nextra plugin

### Nextra Conventions
- Each directory can have a `_meta.json` to define navigation order and titles
- Pages are written in MDX (Markdown with JSX support)
- React components from `components/` can be imported directly in MDX files
- Images go in `public/` and are referenced with absolute paths (e.g., `/cardinal.png`)

### Key Components
- `SupportCallout.tsx` - Standard support/contact callout used across pages
- `ExpandableImage.tsx` - Clickable expandable images for screenshots
- `ConnectorGrid.tsx`, `ConnectorCard.tsx` - Grid display for connector documentation
- `ProductQuickAccess.tsx`, `QuickAccessCards.tsx` - Product navigation cards
