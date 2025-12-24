# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19 with TypeScript, Tailwind CSS v4, and Biome for linting/formatting. The project uses shadcn/ui components with the "new-york" style variant.

## Development Commands

### Package Manager
This project uses **pnpm** (not npm). Always use pnpm commands.

### Essential Commands
- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter checks
- `pnpm format` - Format code with Biome
- `pnpm lint-format` - Lint and auto-fix with Biome
- `pnpm typecheck` - Run TypeScript type checking without emitting files

## Code Quality

### Biome Configuration
Biome is configured with:
- 4-space indentation
- Single quotes for JavaScript/TypeScript
- Next.js and React recommended rules enabled
- Import organization on save
- VCS integration with Git

### Type Checking
TypeScript is configured with strict mode. The project uses:
- Path alias `@/*` maps to project root
- React JSX transform (react-jsx)
- ES2017 target
- Bundler module resolution

## Architecture

### Framework & Styling
- **Next.js 16** with App Router (not Pages Router)
- **Turbopack** enabled for development builds
- **Tailwind CSS v4** (latest major version) via PostCSS plugin
- Uses Tailwind's new `@theme inline` syntax for design tokens
- CSS variables-based theming with light/dark mode support
- tw-animate-css for animations

### UI Component System
- **shadcn/ui** components in `components/ui/`
- Style variant: "new-york"
- Icon library: lucide-react
- Uses CVA (class-variance-authority) for component variants
- `cn()` utility in `lib/utils.ts` merges Tailwind classes safely

### Path Aliases
Import paths are configured in tsconfig.json:
- `@/components` → components directory
- `@/lib` → lib directory
- `@/hooks` → hooks directory
- `@/` → project root

### Fonts
- Uses Geist Sans and Geist Mono from next/font/google
- Font variables: `--font-geist-sans`, `--font-geist-mono`

### Styling System
- Global styles in `app/globals.css`
- Design tokens using CSS custom properties (oklch color space)
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Radius system from `--radius-sm` to `--radius-4xl`
- Color palette includes sidebar, chart, and semantic colors

## Adding shadcn/ui Components

Use the shadcn CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` following the configured style.
