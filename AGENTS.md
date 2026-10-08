# Primary Programming Guidelines & Instructions

## 1. Monorepo Architecture & Dependency Management

The repository is structured as a monorepo utilizing **Bun Package Manager** (Bun Workspaces). It is strictly divided into two distinct domains:

* **`apps/*` (Applications):** Executable applications that drive business logic. These can be HTTP servers (e.g., Hono, Express), frontends (e.g., Next.js, React), MQTT handlers, or background workers. Applications consume packages but should never be imported by other applications or packages.
* **`packages/*` (Packages):** Reusable, encapsulated logic libraries (e.g., database schemas, UI components, shared utilities). Packages are imported directly into applications or other packages to promote DRY (Don't Repeat Yourself) principles.

## 2. Configuration Management

Keep configuration centralized, predictable, and environment-aware.

* All runtime and build-time configurations must reside in `./src/configs/`.
* Use the naming convention `<configure><Name>.ts` (or `.tsx` for React contexts).
* *Examples:* `configureStore.ts`, `configureRestClient.tsx`, `configureEnvironment.ts`.


* Do not scatter `process.env` calls throughout the business logic. Parse and validate environment variables inside a dedicated configuration file and export the validated object.

## 3. Code Organization & Separation of Concerns

Break logic into the smallest possible, highly cohesive modules. Avoid massive monolithic files. Group related logic into directories and separate concerns by file type.

**File Strategy:**

* `types.ts`: Strictly for TypeScript interfaces, types, and enums.
* `utils.ts`: For pure, stateless utility functions (e.g., math operations, string formatting, pure data transformations).
* `[entity].ts`: For the core business logic, classes, or domain models.
* `index.ts`: Use as a barrel file to export public APIs from the folder, keeping internal logic private.

**Refactoring Example:**

```typescript
// ❌ Bad: Monolithic file
export type Resolver = { name: string };
export function compute(a: number, b: number) { return a + b; }
export class OptInResolver implements Resolver { name = 'opt-in'; }

// ✅ Good: Segmented architecture
// types.ts
export interface Resolver {
  name: string;
}

// utils.ts
export function compute(a: number, b: number): number {
  return a + b;
}

// OptInResolver.ts
import { Resolver } from './types';

export class OptInResolver implements Resolver {
  public name = 'opt-in';
}

```

**Package Domain Structure:**

Packages are organized by business domain — one folder per domain, named with a **singular** noun (e.g. `post`, never `posts`). Each domain folder follows the file strategy above and exposes itself through its own `index.ts`, which the package barrel re-exports.

```text
packages/<package>/src/<domain>/
├── types.ts          # Domain types and interfaces
├── utils.ts          # Pure domain helpers
├── <Entity>.ts       # Domain services, classes, and models
├── <entity>.test.ts  # Domain tests
└── index.ts          # Domain barrel
```

```typescript
// packages/core/src/post/index.ts
export * from './PostService';
export * from './types';
export * from './utils';

// packages/core/src/index.ts
export * from './post';
```

## 4. Class-Driven Design & Dependency Injection

Favor Object-Oriented Programming (OOP) with classes over loose function collections for complex business logic.

* **Dependency Injection (DI):** Pass dependencies (e.g., database clients, external API services, or configuration stores) through class constructors rather than hardcoding them or instantiating them internally.
* **Testability:** This architectural choice allows dependencies to be easily mocked or stubbed during automated unit testing (using `bun test`).
* **Lifecycle Management:** Clearly define whether a service is injected as a singleton instance (e.g., a core system parameter service initialized once at startup) or instantiated per request/operation.

```typescript
// ❌ Bad: Hard to mock dependencies and tight coupling
export async function processOrder(orderId: string) {
  const db = new DatabaseClient();
  return db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
}

// ✅ Good: Constructor injection for modularity and testing
export class OrderService {
  constructor(private readonly db: DatabaseClient) {}

  public async processOrder(orderId: string) {
    return this.db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  }
}

```

## 5. Type Safety, Quality Control & Error Handling

* **Strict Typing:** Enforce strict TypeScript definitions across both `apps/*` and `packages/*`. Avoid `any`; use `unknown` if the shape is truly dynamic, followed by explicit type narrowing.
* **Pre-Pull Request Checks:** Before creating a pull request, you must verify code quality locally. All commits and PRs must successfully pass:
* TypeScript type checking (`tsc --noEmit`).
* Biome linting checks (`biome lint`).
* Biome formatting checks (`biome format`).


* **Error Boundaries:** Handle errors gracefully at the application boundary. Packages should throw specific, typed domain errors that applications catch and translate into appropriate HTTP/MQTT responses or frontend UI states.

## 6. Documentation & TSDoc

Every defined function, method, class, interface, and exported type **must** carry a TSDoc comment. Undocumented exported APIs are considered incomplete.

* Use standard TSDoc tags: `@param`, `@returns`, `@throws`, and `@example`.
* Every function-level TSDoc must include an `@example` block showing real usage.
* Describe intent and behavior, not the obvious mechanics of the implementation.

```typescript
// ❌ Bad: no documentation, no usage
export function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// ✅ Good: TSDoc with params, return, and usage
/**
 * Converts an arbitrary string into a URL-safe slug.
 *
 * @param input - The raw string to slugify.
 * @returns A lowercase, hyphen-separated slug.
 *
 * @example
 * ```ts
 * slugify('Hello, Next.js!'); // "hello-next-js"
 * ```
 */
export function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
```

## 7. Testing Conventions

* Test files live beside the code they cover and use the `<entity>.test.ts` naming convention (e.g. `PostService.test.ts`, `utils.test.ts`).
* Every test case name **must** start with `should` and describe the expected behavior, e.g. `it('should convert a title into a url-safe slug', ...)`.
* Describe blocks group tests by the unit under test.
* Assert on observable behavior, not implementation details.

```typescript
// ❌ Bad: vague, passive phrasing
it('slugify works', () => { ... });

// ✅ Good: starts with "should", states the expected behavior
it('should convert a title into a url-safe slug', () => {
  expect(slugify('Hello, Next.js!')).toBe('hello-next-js');
});
```