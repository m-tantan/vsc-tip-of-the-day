# Contributing to VS Code Tip of the Day

Thank you for your interest in contributing to VS Code Tip of the Day! We welcome contributions from the community and are pleased to have you here.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold this commitment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem** in as much detail as possible
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected to see
- **Include screenshots or animated GIFs** if possible
- **Specify your VS Code version** and operating system
- **Include extension version** from the VS Code extensions panel

#### Template for Bug Reports

```markdown
**Description:**
A clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened

**Environment:**
- VS Code Version: 
- Extension Version: 
- Operating System: 
- Language: 
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List any similar features** in other extensions if applicable

### Adding New Tips

We love new tips! To add a new tip:

1. Tips are stored in `/data/tips.json` and translated versions in `/data/locales/`
2. Each tip must have:
   - A unique numeric `id`
   - A `title`
   - `content` with useful information
   - OS-specific content when applicable (`windows`, `macos`, `linux`)
3. Follow the JSON schema defined in `/data/tips.schema.json`
4. Ensure the tip is helpful, accurate, and actionable

### Contributing Translations

We support 11 languages and welcome translation contributions:

- English (`en`)
- Chinese Mandarin (`zh`)
- Hindi (`hi`)
- Spanish (`es`)
- French (`fr`)
- Arabic (`ar`)
- Bengali (`bn`)
- Portuguese (`pt`)
- Russian (`ru`)
- Japanese (`ja`)
- Hebrew (`he`)

To contribute translations:

1. Translate tips in `/data/locales/<language-code>.json`
2. Update UI strings in `/src/localization.ts` if needed
3. Ensure all tips are translated for completeness
4. Maintain the same numeric `id` across all language files
5. Test your translations in VS Code with the language setting

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 22.x or later)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/vsc-tip-of-the-day.git
   cd vsc-tip-of-the-day
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Open in VS Code:**
   ```bash
   code .
   ```

5. **Install recommended extensions** when prompted (ESLint, TypeScript problem matcher, Extension Test Runner)

### Building and Testing

- **Compile the extension:**
  ```bash
  npm run compile
  ```

- **Watch for changes** (automatically recompile):
  ```bash
  npm run watch
  ```

- **Run linter:**
  ```bash
  npm run lint
  ```

- **Type checking:**
  ```bash
  npm run check-types
  ```

- **Run tests:**
  ```bash
  npm test
  ```

- **Debug the extension:**
  - Press `F5` to open a new VS Code window with the extension loaded
  - Set breakpoints in your code
  - Use the Debug Console to see output

### Project Structure

```
vsc-tip-of-the-day/
├── src/
│   ├── extension.ts        # Main extension entry point
│   ├── tipManager.ts       # Manages tip selection and state
│   ├── tipState.ts         # Handles tip state persistence
│   ├── localization.ts     # UI localization strings
│   ├── osUtils.ts          # OS detection utilities
│   ├── types.ts            # TypeScript type definitions
│   └── panel/              # WebView panel implementation
├── data/
│   ├── tips.json           # English tips (master)
│   ├── tips.schema.json    # JSON schema for tips
│   └── locales/            # Translated tips
├── media/                  # Extension icons and assets
├── dist/                   # Compiled output (generated)
└── out/                    # Test compilation output (generated)
```

## Pull Request Process

### Before Submitting

1. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-number-description
   ```

2. **Make your changes** following our coding guidelines

3. **Test your changes** thoroughly:
   - Run `npm run lint` to check code style
   - Run `npm run check-types` to verify TypeScript
   - Run `npm test` if tests exist
   - Press `F5` to test the extension manually

4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: describe what you added"
   ```
   or
   ```bash
   git commit -m "Fix: describe what you fixed"
   ```

### Submitting the Pull Request

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub from your fork to our `main` branch

3. **Fill in the PR template** (if available) with:
   - Description of changes
   - Related issue numbers (e.g., "Fixes #123")
   - Type of change (bug fix, new feature, translation, etc.)
   - Checklist of completed tasks

4. **Wait for review** - maintainers will review your PR and may request changes

5. **Make requested changes** if needed and push them to the same branch

### PR Review Criteria

Your PR should:
- ✅ Follow the coding standards (ESLint configuration)
- ✅ Include appropriate error handling
- ✅ Not break existing functionality
- ✅ Have clear, descriptive commit messages
- ✅ Include updated documentation if adding features
- ✅ Pass all lint and type checks

## Coding Guidelines

### TypeScript Style

- Follow the existing code style in the project
- Use TypeScript for type safety
- Follow ESLint rules defined in `eslint.config.mjs`
- Use meaningful variable and function names
- Add comments for complex logic

### ESLint Configuration

We use ESLint with TypeScript support. Key rules:
- Use semicolons
- Use strict equality (`===`)
- Use curly braces for all control structures
- Follow naming conventions (camelCase for variables/functions, PascalCase for types/classes)

### Code Formatting

- Use 2 spaces for indentation (consistent with existing code)
- Use double quotes for strings
- Add trailing commas in multiline objects/arrays
- Keep line length reasonable (under 120 characters when possible)

### Best Practices

- Write modular, reusable code
- Handle errors gracefully with try-catch blocks
- Sanitize user input and dynamic content (prevent XSS)
- Follow VS Code extension best practices
- Keep dependencies minimal
- Avoid breaking changes when possible

## Tips for Contributing

- **Start small** - Consider starting with documentation improvements, typo fixes, or small bug fixes
- **Ask questions** - If you're unsure about something, open an issue to discuss it
- **Be patient** - Maintainers may take time to review PRs
- **Be respectful** - We're all here to make this extension better
- **Check existing issues** - Someone might already be working on your idea
- **One PR per feature** - Keep PRs focused on a single change

## Need Help?

- Check existing [issues](https://github.com/m-tantan/vsc-tip-of-the-day/issues)
- Read the [README.md](README.md) for usage information
- Review [CHANGELOG.md](CHANGELOG.md) for recent changes
- Look at [vsc-extension-quickstart.md](vsc-extension-quickstart.md) for VS Code extension development basics

## License

By contributing to VS Code Tip of the Day, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing! 🎉 Your efforts help make VS Code Tip of the Day better for everyone.
