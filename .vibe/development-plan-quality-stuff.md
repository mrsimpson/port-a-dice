# Development Plan: port-a-dice (quality-stuff branch)

_Generated on 2025-12-18 by Vibe Feature MCP_
_Workflow: [epcc](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/epcc)_

## Goal

Improve quality assurance (QA) setup to match template standards: implement ESLint, Oxlint, Turbo build system, husky pre-commit hooks, lint-staged configuration, and comprehensive test coverage setup with vitest. This ensures consistent code quality, automated checks, and maintainability across the Vue/TypeScript monorepo.

## Explore

### Phase Entrance Criteria:

- [x] Starting phase

## Explore

### Phase Entrance Criteria:

- [x] Starting phase

### Tasks

- [x] Analyzed template setup (typescript-monorepo)
- [x] Review template's QA stack in detail
- [x] Document differences between template and current project
- [x] Identify missing dependencies and configurations
- [x] Understand current project structure and needs

### Completed

- [x] Created development plan file
- [x] Analyzed template QA stack
- [x] Documented comprehensive comparison

## QA Stack Comparison: Template vs Current Project

### Template (typescript-monorepo) Has:

**Linting & Formatting:**

- ESLint 9.39.1 with typescript-eslint
- Oxlint 1.14.0 (fast Rust linter)
- Prettier 3.7.2
- eslint-config-prettier (no conflicts)
- TypeScript strict mode

**Pre-commit Hooks & Task Running:**

- Husky 9.1.7 (git hooks)
- lint-staged 16.2.7 (run tasks on staged files)
- `.lintstagedrc.js`: prettier + oxlint + eslint on JS/TS
- Pre-commit hook: runs `pnpm lint-staged`
- Pre-push hook: runs lint, format, typecheck, test

**Build & Task Orchestration:**

- Turbo 2.6.1 (monorepo task orchestrator)
- `turbo.json` with task definitions for lint, format, typecheck, test, build
- Global dependencies tracked for cache invalidation

**Testing:**

- Vitest 3.2.4 with coverage (v8 provider)
- @vitest/coverage-v8 3.2.4
- Coverage reporters: text, json, html

**Node Version Management:**

- Node 22+ required
- pnpm 9+ required

### Current Project Has:

**Linting & Formatting:**

- ESLint 8.56.0 (older)
- Prettier 3.2.0
- No Oxlint
- No eslint-config-prettier
- No TypeScript strict validation

**Pre-commit Hooks:**

- ❌ No Husky
- ❌ No lint-staged
- No pre-commit/pre-push validation

**Build & Task Orchestration:**

- ❌ No Turbo
- npm workspaces (basic)
- Limited task orchestration

**Testing:**

- Vitest 1.1.0 (older)
- No vitest coverage configuration
- Uses happy-dom (test environment)

**Missing Security/Quality:**

- ❌ No TypeScript strict mode enforcement
- ❌ No pre-push validation
- ❌ No oxlint (fast Rust linter)
- ❌ No test coverage tracking
- ❌ No automated code quality gates

## Plan

### Phase Entrance Criteria:

- [x] Exploration complete - all differences documented
- [x] QA tooling requirements clearly defined
- [x] Dependencies identified and validated
- [x] Integration points understood

### Implementation Strategy

The QA setup will be implemented in 5 sequential workstreams:

**1. Dependency Upgrades & Installation**

- Upgrade ESLint (8 → 9.39) + typescript-eslint
- Upgrade Vitest (1 → 3.2) + coverage
- Add Oxlint (1.14.0)
- Add Husky (9.1)
- Add lint-staged (16.2)
- Add Turbo (2.6) for monorepo orchestration
- Update TypeScript config for strict mode

**2. Configuration Files Setup**

- Create `eslint.config.mjs` (modern flat config format)
- Create `.lintstagedrc.js` (pre-commit tasks)
- Create `turbo.json` (task orchestration)
- Create `oxlint.json` (fast linting rules)
- Update `tsconfig.json` for strict mode
- Update `vitest.config.ts` with coverage setup

**3. Git Hooks Setup (Husky)**

- Initialize husky
- Create `.husky/pre-commit` hook (runs lint-staged)
- Create `.husky/pre-push` hook (runs lint, format, typecheck, test)
- Ensure hooks are executable

**4. Package.json Scripts Restructuring**

- Create unified lint/format commands at root
- Add turbo-based parallel tasks
- Add lint-staged configuration
- Add test coverage commands
- Update existing scripts to use turbo

**5. Documentation & Verification**

- Update project README with QA commands
- Verify all hooks work correctly
- Test cold install workflow
- Document any breaking changes

### Tasks

- [ ] Upgrade ESLint to v9 and typescript-eslint
- [ ] Upgrade Vitest to v3 with coverage support
- [ ] Add Oxlint, Husky, lint-staged, Turbo dependencies
- [ ] Create eslint.config.mjs (flat config format)
- [ ] Create .lintstagedrc.js configuration
- [ ] Create turbo.json with task definitions
- [ ] Create oxlint.json configuration
- [ ] Update tsconfig.json for strict mode
- [ ] Update vitest.config.ts for coverage
- [ ] Initialize and configure husky
- [ ] Create pre-commit hook
- [ ] Create pre-push hook
- [ ] Restructure root package.json scripts
- [ ] Update dice-app package.json scripts
- [ ] Verify all tooling works together
- [ ] Test pre-commit hook flow
- [ ] Test pre-push hook flow
- [ ] Update documentation

### Completed

_None yet_

## Configuration Specifications

### 1. eslint.config.mjs (ESLint v9 Flat Config)

```javascript
Import: @eslint/js, typescript-eslint, eslint-config-prettier
Patterns: **/*.{ts,tsx,vue,js,jsx,mjs}
Features:
  - TypeScript strict parsing with project references
  - Prettier integration (no rule conflicts)
  - Vue 3 component support
Ignored: node_modules/**, dist/**, .vite/**, coverage/**
```

### 2. .lintstagedrc.js

```javascript
Patterns:
  - *.{js,ts,jsx,tsx}: prettier --write → oxlint --fix → eslint --fix
  - *.vue: prettier --write → eslint --fix
  - *: prettier --write --ignore-unknown
```

### 3. turbo.json

```json
Root tasks: lint, lint:fix, format, format:fix, typecheck
Package tasks: build, test, lint, typecheck
Task dependencies:
  - test depends on build
  - build depends on ^build (from dependencies)
Global deps: all config files for cache invalidation
```

### 4. oxlint.json

```json
Level: Production-ready
Rules:
  - Enable all recommended rules
  - Vue 3 support
```

### 5. vitest.config.ts

```typescript
globals: true
environment: happy-dom (for Vue components)
coverage:
  provider: v8
  reporters: text, json, html
  include: src/**
  exclude: node_modules/**, dist/**, **/*.spec.ts
```

### 6. tsconfig.json Updates

```json
compilerOptions:
  strict: true
  noImplicitAny: true
  noUnusedLocals: true
  noUnusedParameters: true
  noImplicitReturns: true
  skipLibCheck: true (for faster builds)
```

## Husky Git Hooks

### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

Runs: Prettier → Oxlint → ESLint on staged files

### .husky/pre-push

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint &&
npm run format:check &&
npm run typecheck &&
npm run test
```

Runs: Full validation before push (can be bypassed with --no-verify if needed)

## Dependency Versions to Install

### Dev Dependencies

| Package                          | Current | Target | Reason                            |
| -------------------------------- | ------- | ------ | --------------------------------- |
| eslint                           | 8.56.0  | 9.39.1 | Flat config support, better rules |
| @typescript-eslint/eslint-plugin | N/A     | 8.48.0 | TypeScript support                |
| @typescript-eslint/parser        | N/A     | 8.48.0 | TypeScript support                |
| typescript-eslint                | N/A     | 8.42.0 | New ESLint v9 format              |
| oxlint                           | N/A     | 1.14.0 | Fast Rust linter                  |
| husky                            | N/A     | 9.1.7  | Git hooks automation              |
| lint-staged                      | N/A     | 16.2.7 | Run checks on staged files        |
| turbo                            | N/A     | 2.6.1  | Task orchestration                |
| vitest                           | 1.1.0   | 3.2.4  | Newer features, better coverage   |
| @vitest/coverage-v8              | N/A     | 3.2.4  | Test coverage reporting           |
| eslint-config-prettier           | N/A     | 10.1.8 | Prevent ESLint/Prettier conflicts |
| prettier                         | 3.2.0   | 3.7.2  | Latest improvements               |

## package.json Scripts Strategy

### Root Level Scripts (dice-roller-monorepo)

```json
{
  "scripts": {
    "dev": "npm run dev --workspace=dice-app",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "test:coverage": "turbo run test:coverage",
    "prepare": "husky"
  }
}
```

### Package Level Scripts (dice-app)

```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --fix --ext .vue,.js,.jsx,.ts,.tsx",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Implementation Notes

**Order of Operations:**

1. Install new dependencies
2. Create config files (eslint, oxlint, turbo, lint-staged)
3. Update TypeScript/Vitest configs
4. Initialize Husky
5. Create git hooks
6. Update package.json scripts
7. Test all tooling

**Key Considerations:**

- Pre-push hook may be slow initially - can add `git push --no-verify` escape hatch
- Vue component testing uses happy-dom (already configured)
- ESLint v9 breaking changes: need new flat config format
- TypeScript strict mode may reveal existing issues - can enable per-file
- Turbo caching improves subsequent runs significantly

**Verification Checklist:**

- [ ] Cold npm install works
- [ ] All linters run without errors
- [ ] Format check passes
- [ ] TypeScript strict mode only shows acceptable errors
- [ ] Pre-commit hook triggers automatically
- [ ] Pre-push hook runs all checks
- [ ] Tests pass with coverage

## Code

### Phase Entrance Criteria:

- [x] Plan is complete and approved
- [x] All configurations designed
- [x] Implementation strategy documented
- [x] Dependencies ready to install

### Tasks

- [x] Upgrade dependencies in root package.json
- [x] Upgrade dependencies in dice-app package.json
- [x] Create eslint.config.mjs
- [x] Create .lintstagedrc.js
- [x] Create turbo.json
- [x] Create oxlint.json
- [x] Update root tsconfig.json for strict mode
- [x] Update dice-app tsconfig.json for strict mode
- [x] Update vitest.config.ts with coverage
- [x] Initialize Husky
- [x] Create .husky/pre-commit hook
- [x] Create .husky/pre-push hook
- [x] Update root package.json scripts
- [x] Update dice-app package.json scripts
- [x] Run ESLint with --fix to auto-correct warnings
- [x] Manually fix ESLint errors (globals, unused vars)
- [x] Format code with prettier
- [x] Run all linters - PASSING (ESLint, Prettier)
- [ ] Fix typecheck (vue-tsc version issue - deferred)
- [x] Run tests - PASSING (34 tests)
- [x] Test pre-commit hook - PASSING
- [ ] Test pre-push hook (without actual push)

### Completed

- [x] All dependencies upgraded and installed with pnpm (9.14.2)
- [x] All config files created (eslint, oxlint, turbo, lint-staged)
- [x] Husky initialized with pre-commit and pre-push hooks
- [x] All TypeScript/JavaScript files fixed for strict linting
- [x] ESLint (v9.39.1) passing cleanly
- [x] Code formatted with Prettier (v3.7.2)
- [x] All tests passing (34 tests with Vitest v3.2.4)
- [x] Pre-commit hook tested and working (runs prettier, oxlint, eslint)
- [x] Turbo task orchestration configured for monorepo
- [x] pnpm workspace configured

## Commit

### Phase Entrance Criteria:

- [ ] All code implementation complete
- [ ] Tests passing
- [ ] All linting and formatting configured
- [ ] Documentation updated

### Tasks

- [ ] _To be added when this phase becomes active_

### Completed

_None yet_

## Key Decisions

**Approach:** Align port-a-dice QA setup with template standards by:

1. Upgrading dependencies (ESLint 8→9, Vitest 1→3)
2. Adding Husky + lint-staged for pre-commit hooks
3. Adding Oxlint for fast linting
4. Setting up Turbo for monorepo task orchestration
5. Configuring comprehensive test coverage
6. Enabling TypeScript strict mode

**Compatibility:** Project uses Vue 3 + Vite. Template is generic monorepo. Will adapt configs for Vue/Vite specifics.

**Scope:** Focus on monorepo root config + dice-app package. Can extend to other packages later.

**Reference:** Template structure at ~/projects/templates/typescript-monorepo/

## Notes

- Current project is simpler (single Vue app vs template's multi-package setup)
- Will need Vue-specific ESLint rules (vue-plugin already present)
- Package manager: npm vs pnpm (template uses pnpm - may stay with npm for now)
- Need to ensure new hooks don't slow down development too much
- Should verify Vite compatibility with test setup

---

_This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on._
