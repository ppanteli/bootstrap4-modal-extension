# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-12

### Added
- Initial release of BS4Modal (renamed from `dynamicModal`)
- `$.bs4Modal()` and `$.fn.bs4Modal()` plugin entry points
- AJAX content loading with built-in loading spinner
- Static/inline content support via `content` option or `data-content` attribute
- Response caching via `cache` option
- Configurable header, footer, title, subtitle, and title icon
- CSS animation support with `animation`, `animationSpeed`, and `animationDelay` options
- Mobile full-screen layout below configurable `mobileBreakdown` breakpoint
- `forceScrollableDialog` option for scrollable modal body
- Lifecycle callbacks: `onOpenBefore`, `onOpen`, `onCloseBefore`, `onClose`
- Programmatic API: `open()`, `close()`, `dismiss()`, `isOpen()`, `isClosed()`
- Content API: `setTitle()`, `setContent()`, `prependContent()`, `refreshContent()`
- Loader API: `showLoading()`, `hideLoading()`
- Closing control API: `disableClosing()`, `resetClosing()`, `isClosingDisabled()`
- `ajaxErrorTemplate` option for customisable AJAX error messages
- `pageNotFoundTemplate` option for missing/invalid `href` fallback
- Automatic focus blur on modal close to prevent `aria-hidden` accessibility warning
- `isAjax` resolved automatically based on whether `content` has a value — empty string treated as "no content provided"
- Requires jQuery 3.5.1+ and Bootstrap 4.6.2
- `package.json` for npm distribution
- `composer.json` for Packagist/Composer distribution
- Minified builds in `dist/` via `npm run build`
- MIT License
