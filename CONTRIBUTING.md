# Contributing to Life Context Compiler

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🏗️ Development Setup

### Prerequisites
- Node.js 18 or higher
- pnpm 8 or higher

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/life-context-compiler.git
cd life-context-compiler

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## 📁 Project Structure

This is a Turborepo monorepo with the following packages:

| Package | Description |
|---------|-------------|
| `apps/web` | Main React web application |
| `packages/types` | Shared TypeScript types |
| `packages/encryption` | Client-side encryption |
| `packages/storage` | IndexedDB storage layer |
| `packages/audio` | Audio recording utilities |
| `packages/llm` | AI/LLM integrations |

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start all apps
pnpm --filter @lcc/web dev  # Start just web

# Building
pnpm build            # Build all packages
pnpm typecheck        # Run TypeScript checks

# Linting
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
```

## 🌿 Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## 💬 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(audio): add real-time waveform visualization
fix(encryption): handle edge case in key derivation
docs(readme): update installation instructions
```

## 🔐 Security Guidelines

Since this is a privacy-focused application:

1. **Never log sensitive data** - No passcodes, keys, or decrypted content
2. **All encryption client-side** - Never send unencrypted data to servers
3. **Review crypto changes carefully** - Any changes to encryption require extra scrutiny
4. **Test with sensitive scenarios** - Ensure edge cases are handled

## 📝 Pull Request Process

1. Fork and create a feature branch
2. Make your changes with clear commits
3. Update documentation if needed
4. Update CHANGELOG.md under `[Unreleased]`
5. Submit PR with description of changes
6. Wait for review and address feedback

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @lcc/audio test
```

## 📖 Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md for all notable changes
- Add JSDoc comments for public APIs
- Include examples for complex functionality

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## ❓ Questions?

Open an issue with the `question` label or start a discussion.

---

Thank you for contributing to Life Context Compiler! 🎉
