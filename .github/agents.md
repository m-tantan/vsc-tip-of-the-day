# Copilot Instructions for VS Code Tip of the Day

## Repository Overview

This is the **VS Code Tip of the Day** extension - an educational VS Code extension that delivers daily productivity tips to users. The extension helps developers discover VS Code features, shortcuts, and best practices through a notification system with OS-specific optimizations and multi-language support.

## Core Mission

Your primary goal when working on this repository is to:

1. **Promote Community Engagement**: Encourage and facilitate community contributions of tips with proper attribution
2. **Enhance Educational Content**: Add high-quality, actionable VS Code tips that improve developer productivity
3. **Maintain Accessibility**: Ensure all features are accessible and user-friendly across all supported platforms and languages
4. **Preserve Quality**: Maintain code quality, type safety, and consistent user experience

## Repository Structure

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
│   ├── tips.json           # English tips (master file)
│   ├── tips.schema.json    # JSON schema for tip validation
│   └── locales/            # Translated tips (11 languages)
├── .github/workflows/      # CI/CD workflows including Copilot setup
├── media/                  # Extension icons and assets
└── dist/                   # Compiled output (auto-generated)
```

## Key Technologies

- **TypeScript**: Primary language - maintain strict type safety
- **VS Code Extension API**: Follow VS Code best practices
- **Node.js 20+**: Use modern JavaScript features
- **esbuild**: Build system for production bundles
- **ESLint**: Code quality and style enforcement

## Development Workflow

### Building and Testing

1. **Install dependencies**: `npm install`
2. **Compile**: `npm run compile`
3. **Watch mode**: `npm run watch` (auto-recompile on changes)
4. **Type checking**: `npm run check-types`
5. **Linting**: `npm run lint`
6. **Testing**: `npm test`
7. **Debug**: Press `F5` in VS Code to launch extension host

### Publishing

- **Minor version**: `npm run publish:minor` (uses vsce to publish and increment minor version)
- **Prepublish**: Automatically runs type checking, linting, and production build

## Guidelines for Adding Tips

### Tip Structure

All tips must follow the schema defined in `data/tips.schema.json`:

```json
{
  "id": 999,
  "title": "Clear, Action-Oriented Title",
  "content": "Concise description with keyboard shortcuts in backticks like `Ctrl+P`",
  "source": "github-username"  // Optional: for community attribution
}
```

### OS-Specific Tips

For platform-specific content, use OS keys:

```json
{
  "id": 999,
  "title": "Platform-Specific Tip",
  "content": {
    "windows": "Windows-specific content with `Ctrl+...`",
    "macos": "macOS-specific content with `Cmd+...`",
    "linux": "Linux-specific content with `Ctrl+...`"
  }
}
```

### Tip Quality Standards

When adding or reviewing tips:

✅ **DO:**
- Focus on **productivity** and **time-saving** features
- Use **clear, actionable** language
- Include **keyboard shortcuts** in backticks
- Mention **practical use cases**
- Test tips personally before adding
- Support **all operating systems** when relevant
- Add **community attribution** via `source` field

❌ **DON'T:**
- Add vague or overly general tips
- Duplicate existing tip content
- Forget to update translations in `data/locales/`
- Use platform-specific shortcuts without OS variants
- Add tips without testing them first

### Translation Guidelines

All tips must be translated to **11 supported languages**:
- English (en) - **master file**
- Chinese/中文 (zh)
- Hindi/हिन्दी (hi)
- Spanish/Español (es)
- French/Français (fr)
- Arabic/العربية (ar)
- Bengali/বাংলা (bn)
- Portuguese/Português (pt)
- Russian/Русский (ru)
- Japanese/日本語 (ja)
- Hebrew/עברית (he)

**Important**: Maintain the same `id` across all language files for proper mapping.

## Code Quality Standards

### TypeScript Conventions

- Use **strict TypeScript** - no `any` types unless absolutely necessary
- Define interfaces in `src/types.ts`
- Use **meaningful names** for variables and functions
- Add **JSDoc comments** for complex logic
- Handle errors with **try-catch** blocks

### ESLint Rules

Follow the project's ESLint configuration:
- Use **semicolons**
- Use **strict equality** (`===`)
- Use **curly braces** for all control structures
- **camelCase** for variables/functions
- **PascalCase** for types/classes
- **2 spaces** for indentation
- **Double quotes** for strings

### Security Best Practices

- **Sanitize all user input** and dynamic content
- **Prevent XSS** in webview panels
- **Validate JSON** against schema before use
- **Handle file operations** safely with error checks
- **Never commit secrets** or credentials

## Community Contribution Support

### Encouraging Community Tips

- **Promote the attribution feature**: Contributors get credit via `source` field linking to their GitHub profile
- **Make it easy**: Direct users to the [Add a Tip template](https://github.com/m-tantan/vsc-tip-of-the-day/issues/new?template=add-a-tip.md)
- **Review promptly**: Help contributors refine their tips
- **Give credit**: Always preserve `source` attribution when merging tips

### Review Checklist for Community Tips

When reviewing community contributions:

1. ✅ Tip is **accurate** and **tested**
2. ✅ Follows the **JSON schema**
3. ✅ Has a **unique ID**
4. ✅ Includes **source attribution** if from community
5. ✅ Uses proper **keyboard shortcut** formatting
6. ✅ Provides value for **productivity**
7. ✅ Translatable content (no language-specific idioms)
8. ✅ No **duplicate** tips

## Common Tasks

### Adding a New Tip

1. Assign a unique `id` (next sequential number)
2. Add to `data/tips.json` with clear title and content
3. Include `source` field if community-contributed
4. Translate to all 11 languages in `data/locales/`
5. Test the tip appears correctly with `F5`
6. Verify OS-specific content if applicable

### Adding a New Feature

1. Update TypeScript types in `src/types.ts`
2. Implement feature in appropriate module
3. Update `package.json` if adding commands/settings
4. Update UI strings in `src/localization.ts`
5. Test with `F5` and various language settings
6. Update `README.md` and `CHANGELOG.md`
7. Run full test suite: `npm run check-types && npm run lint && npm test`

### Fixing Bugs

1. Reproduce the bug locally
2. Add error handling if missing
3. Test the fix thoroughly
4. Ensure no regressions with existing features
5. Update documentation if behavior changes

## Extension-Specific Considerations

### Startup Behavior

- Extension activates on `onStartupFinished` (low impact)
- Respects user's `startupHourLocal` setting
- Shows daily tip only once per day
- Uses smart random selection to avoid repetition

### Keyboard Accessibility

- All UI must be **fully keyboard navigable**
- Proper **ARIA labels** for screen readers
- **Focus management** in webview panels
- Test with **Tab** navigation

### OS Detection

- Auto-detect user's OS via `osUtils.ts`
- Save to settings for consistency
- Allow manual override in settings
- Optimize tip content per OS

### Localization

- UI strings in `src/localization.ts`
- Tip content in `data/locales/<lang>.json`
- Language selection in tip panel
- Preference persistence

## Testing Strategy

### Manual Testing Checklist

- [ ] Tips display correctly in notification
- [ ] Keyboard shortcuts work (`Ctrl+Alt+T` / `Cmd+Alt+T`)
- [ ] Navigation (Next/Previous/Random) functions
- [ ] Settings icon opens preferences
- [ ] Language switching updates all content
- [ ] OS-specific content shows correct variant
- [ ] Attribution links work for community tips
- [ ] Startup timing respects hour setting
- [ ] Accessibility (keyboard navigation works)

### Regression Testing

Before each release:
- Test on **Windows, macOS, and Linux** if possible
- Verify **all 11 languages** display correctly
- Check **keyboard shortcuts** across platforms
- Test **startup behavior** with various settings
- Verify **community attribution** displays

## Important Files to Know

- **`data/tips.json`**: Master English tips file - always update first
- **`data/tips.schema.json`**: JSON schema - validates tip structure
- **`src/extension.ts`**: Extension entry point - activation logic
- **`src/tipManager.ts`**: Core tip selection and display logic
- **`src/localization.ts`**: All UI text strings for translation
- **`package.json`**: Extension manifest - commands, settings, scripts
- **`CONTRIBUTING.md`**: Contributor guidelines - point users here
- **`.github/workflows/copilot-setup-steps.yml`**: Your setup environment

## Best Practices Summary

1. **Educational First**: Every change should enhance the learning experience
2. **Community Friendly**: Make it easy for others to contribute tips
3. **Quality Over Quantity**: One great tip beats ten mediocre ones
4. **Test Thoroughly**: Use the extension yourself before committing
5. **Document Changes**: Update README and CHANGELOG
6. **Respect Users**: Follow their settings and preferences
7. **Maintain Accessibility**: Everyone should benefit from tips
8. **Preserve Attribution**: Credit community contributors always

## When in Doubt

1. Check existing code patterns in the repository
2. Review `CONTRIBUTING.md` for detailed guidelines
3. Look at recent commits for examples
4. Test changes with `F5` debug mode
5. Run all quality checks: `npm run check-types && npm run lint`

## Remember

You're helping developers worldwide discover VS Code features and improve their productivity. Every tip, translation, and feature you add makes coding better for thousands of users. Prioritize **quality**, **accessibility**, and **community** in all contributions.

## Pull Request Requirements

### Visual Documentation of Changes

**CRITICAL REQUIREMENT**: Every PR description and every push to a PR **MUST** include a screenshot or image showing the changes made. This requirement is non-negotiable and applies to all types of changes.

#### When to Include Images

1. **Initial PR Creation**: Include at least one screenshot showing the changes
2. **After Every Push**: Update the PR description with new screenshots showing the latest state
3. **All Change Types**:
   - UI changes: Show before/after screenshots
   - Code changes: Show relevant code sections or test results
   - Documentation changes: Show the rendered documentation
   - Configuration changes: Show the configuration file and its effect
   - Build/CI changes: Show the build/test output

#### Image Requirements

- Images must be **clear and readable**
- Include **context** (file names, line numbers, or UI elements)
- Use **arrows or annotations** when highlighting specific changes
- For UI changes, show both **before and after** states when possible
- For code changes, show **test results** or **execution output** to prove functionality
- Include **console output** or **error messages** if debugging or fixing issues

#### Why This Is Required

Screenshots ensure:
- **Nothing is broken**: Visual confirmation that changes work as expected
- **Easy review**: Reviewers can quickly understand the impact of changes
- **Documentation**: Future reference for what changed and why
- **Quality assurance**: Catches visual regressions and unexpected side effects

**Note**: Failure to include screenshots will result in the PR being considered incomplete and may delay review or merge.
