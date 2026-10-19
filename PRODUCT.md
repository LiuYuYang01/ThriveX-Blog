# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is the site's own readers and prospective contributors: developers and technical writers who land on the ThriveX blog and want structured, durable explanations of how the system works — deployment, architecture, configuration, component usage — rather than chronological blog posts.

A secondary audience is the site owner (single operator, `liuyuyang.net`), who maintains the content from the Admin CMS and needs the documentation to grow without hand-editing navigation arrays.

## Product Purpose

ThriveX is a personal blog platform composed of three deployable units: a Spring Boot 3.5 backend (`ThriveX-Server`), a Vite + React admin CMS (`ThriveX-Admin`), and this Next.js 16 public blog (`ThriveX-Blog`).

Success means a reader can find and understand how the platform is built and run, and the owner can extend that documentation by dropping Markdown files into the repository rather than editing code.

## Positioning

A file-based knowledge layer living inside the blog's own design system. It reuses the blog's existing Markdown rendering pipeline — including its custom widget library, syntax highlighting, math, and callouts — so documentation content supports everything an article supports. It is documentation that ships with the code, not documentation trapped in a database behind an admin login.

## Operating Context

- Content is authored as `.md` files in the repository, read from disk at build/request time, and versioned alongside the code it describes.
- The site is self-hosted via `docker-compose` (MySQL, server, blog, admin), built as a Next.js standalone output.
- The site has a light and dark theme, toggled manually, with a dedicated theme-transition animation (starfield, mountain ridge, layered celestial bodies).
- Site navigation is database-driven from the `cate` table; a documentation entry point is therefore a deliberate static addition, not an automatic consequence of adding content.
- Reader-facing features already shipped and that documentation pages must not break: command palette (Ctrl+K), announcement modal, record/闪念 entry, theme transition.

## Capabilities and Constraints

- Next.js 16 App Router with `cacheComponents`, `reactCompiler`, and Turbopack filesystem caching enabled. `output: 'standalone'`.
- React 19.2.7, Tailwind CSS 4.x, Sass. No MDX — documentation is plain Markdown rendered by `react-markdown`.
- The Markdown pipeline is fixed: `remark-gfm`, `remark-math`, `rehype-katex`, `rehype-highlight`, `rehype-raw`, `rehype-callouts`, `rehype-semantic-blockquotes`, `remark-mark-highlight`, plus a `tx-widget` custom component set (bilibili, youtube, netease media embeds; tabs, timeline, steps, accordion, gallery, CTA, callout, link-card, code-compare, rating-card, two-column compare, quote).
- `src/utils/article.ts` provides `extractArticleHeadings()` for TOC generation, and word-count / reading-time helpers.
- No image generation tooling is available in this environment; imagery must be authored in code or omitted.
- Explicitly undecided: whether documentation pages appear in the site sitemap and in the command palette's page index.

## Brand Commitments

- Name: ThriveX. The existing brand voice in site copy is casual, first-person, and hobbyist-proud rather than corporate; it is Chinese-language first (`lang="zh-CN"`).
- The site sets LXGW WenKai (霞鹜文楷) as its document-wide typeface via `next/font/local`. This is a deliberate, committed brand choice — a Chinese kai/handwriting-adjacent face that must be inherited, not replaced by a system stack.
- Primary colour `#539dfd`, a soft blue, used for focus rings, links, and active states.
- Theme transition is a first-class brand moment, not a settings toggle.
- AGENTS.md project rules apply: Tailwind 4 syntax only, `cursor-pointer` on every clickable thing, no CSS transitions on colour/background values, `react-icons` for all icons, minimal code, semantic PascalCase component names, page-private components under `components/`, shared components under `src/components`, imports via the `@/` alias, and `npm run lint` must pass.

## Evidence on Hand

- Real article content and its rendered form exist under `src/app/article/` — the closest precedent for what a documentation reading experience must feel like.
- `src/app/demo/widgets/page.tsx` is a working precedent for reading a `.md` file from disk with `readFileSync` and rendering it through the article `MD` component with an auto-generated TOC.
- `src/ThriveUI/` contains 20 shipped components (Button, Modal, Tabs, Form, PhotoPreview, Pagination, and others), a real and previously undocumented subject matter for a knowledge base.
- `docker-compose.yml` and each unit's `Docker.md` describe the deployment path factually.
- Absent: no product metrics, user testimonials, customer names, benchmarks, or pricing exist, and future work must not fabricate any.

## Product Principles

1. **Documentation ships with the code.** A page about a feature lives in the repository next to that feature, so it cannot silently drift from what it describes.
2. **Reading comprehension outranks expression.** A documentation page is judged by whether the reader finds what they need and understands it, not by how the page performs.
3. **Extend the world, don't fork it.** The knowledge base is a surface inside the blog and inherits its typeface, palette, theme transition, and Markdown pipeline wholesale.
4. **No dead code.** A page that no route reaches does not exist. Everything built is reachable and linked.
5. **The owner maintains it by dropping a file.** Adding documentation must not require touching navigation arrays or component code.

## Accessibility & Inclusion

Both light and dark themes must meet readable contrast, and the documentation surface is specifically a focus-heavy, keyboard-navigable reading experience: sidebar navigation, in-page table of contents, and prev/next paging must all be reachable and operable by keyboard, with visible focus states built on the existing `#539dfd` focus shadow.
