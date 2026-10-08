<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Monorepo Conventions

This app is part of a **Bun workspaces** monorepo. Follow the root `AGENTS.md` for the full guidelines; the essentials for `apps/web` are:

* Application code lives in `src/`; the App Router lives in `src/app/`.
* Configuration lives in `src/configs/` as `configure<Name>.ts` (e.g. `configureEnvironment.ts`). Never scatter `process.env` across the codebase.
* Shared logic is imported from `@playernguyen/core`. Packages organize code by business domain under `packages/<package>/src/<domain>/`, using **singular** domain names (e.g. `post`, never `posts`), each with `types.ts`, `utils.ts`, `<Entity>.ts`, and an `index.ts` barrel.

```text
packages/core/src/post/
├── types.ts
├── utils.ts
├── PostService.ts
├── utils.test.ts
└── index.ts
```

* Every defined function, method, class, interface, and exported type must carry TSDoc with an `@example` block.

```typescript
// apps/web/src/app/page.tsx
import { PostService, type Post } from '@playernguyen/core';

const service = new PostService({ findAll: async (): Promise<Post[]> => [] });
const summaries = await service.listSummaries();
```
