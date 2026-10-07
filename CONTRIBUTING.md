# Contributing to Greece

Thank you for considering contributing to **Greece**! We welcome contributions of any kind—bug reports, feature requests, documentation improvements, or code contributions.

## Getting Started

1. **Fork the repository** and clone your fork:
   ```bash
   git clone https://github.com/your-username/greece-hieroglyphs-full.git
   cd greece-hieroglyphs-full
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   > We use **pnpm** for fast, deterministic installs.
3. **Run the development servers**:
   - Web client: `pnpm dev:web`
   - Mobile client: `pnpm dev:mobile`
   - API server: `pnpm dev:api`
4. **Create a new branch** for your work:
   ```bash
   git checkout -b feature/awesome-new-feature
   ```
5. **Make your changes**, add tests where applicable, and ensure the existing test suite passes:
   ```bash
   pnpm test
   ```
6. **Commit** with clear, descriptive messages following the Conventional Commits style.
7. **Push** to your fork and open a Pull Request against the `main` branch.

## Code Style & Linting

- Use **Prettier** and **ESLint** with the project's shared configuration.
- Follow the existing folder structure and naming conventions.
- Write TypeScript types explicitly; avoid `any`.
- Add **JSDoc** comments for public functions.

## Review Process

- All PRs undergo automated CI checks (type‑checking, lint, test suite).
- A maintainers' review is required before merging.
- Include a brief description of the change, relevant issue numbers, and screenshots if UI changes are involved.

## Thanks!

Your contributions help make Greece better for everyone. 🎉
