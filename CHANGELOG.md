# Change Log

All notable changes to the VS Code Tip of the Day extension will be documented in this file.

## [1.3.0] - 2025-09-29

### Added
- **Complete localization support**: All 43 tips now fully translated in 11 languages
  - Added stable numeric `id` field to tip schema for consistent ordering
  - Enhanced Bengali, Hebrew, Hindi, Japanese, Portuguese, and Russian with native character scripts
  - Completed partial translations to achieve full parity across all locales
- **Improved data structure**: Tips now have consistent numeric IDs (1-43) across all languages
  - Updated `data/tips.schema.json` with numeric `id` field
  - Modified `src/types.ts` to include optional `id?: number`

### Changed
- **Full language parity**: All supported languages now have complete 43/43 tip coverage
  - English, Spanish, French, Chinese, Arabic, Bengali, Hebrew, Hindi, Japanese, Portuguese, Russian
- **Enhanced translations**: Improved accuracy and cultural appropriateness across all locales
- **Better maintenance**: Standardized tip ordering and structure for easier updates

## [1.2.2] - 2025-09-27

### New feature
- Added partial language support for Arabic, Bengali, English, Spanish, French, Hebrew, Hindi, Japanese, Portuguese, Russian, Chinese

## [1.2.1] - 2025-09-24

### Security
- Fixed potential XSS vulnerability by properly escaping HTML characters in tip titles and content
- Enhanced webview security by ensuring all user-visible dynamic content is safely escaped
- Improved HTML sanitization in the tip panel webview

### Fixed
- Tip titles and content now properly escape HTML special characters (&, <, >, ", ', `, =, /)
- Prevented potential security issues from malicious content in tip data

## [1.2.0] - 2025-09-24

### Added
- Settings icon (⚙️) in tip panel header for quick access to extension settings
- OS-specific tip optimization with support for Windows, macOS, and Linux
- Automatic operating system detection on first run
- Manual OS selection setting (`tipOfTheDay.operatingSystem`) with options: auto, Windows, macOS, Linux
- Real-time tip re-rendering when OS setting is changed
- Enhanced header layout with title and settings icon
- Changed random tip to be by the hour rather than by the day.

### Changed
- Tips now display "Optimized for [OS]" based on current OS setting
- Extension automatically detects and saves OS preference to settings on first use
- Settings changes now immediately update the tip display without restart

### Fixed
- Improved configuration handling for OS-specific features
- Better error handling for settings initialization

## [1.1.0] - 2025-09-07

### Changed
- Replaced modal dialog with a styled WebView panel for better user experience
- Enhanced UI with centered layout and improved styling
- Modified navigation to show both Previous/Next buttons consistently
- Changed "Next" button behavior to show random tips for more variety
- Removed dedicated Random button for cleaner interface
- Added more tips

## [1.0.0] - 2025-09-06

### Added
- Initial release of VS Code Tip of the Day
- Daily tip display functionality
- Navigation between tips (next, previous, random)
- Configurable startup behavior
- Dismiss options (for today or permanently)
- Keyboard shortcut (Ctrl+Alt+T / Cmd+Alt+T)
- Collection of useful VS Code tips
- Settings to control extension behavior
- Markdown support in tips