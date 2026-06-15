# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.1] — 2026-06-15

### Added
- `onOpenAfter` callback — fires after `shown.bs.modal`, when the modal is fully visible
- `triggerEl` tracking — the trigger element is stored on the instance and its click lock is cleared on `close()`, preventing duplicate open events
- `disableClosing()` now also updates the live Bootstrap modal instance config (`bs.modal._config`) so backdrop and keyboard behaviour changes take effect immediately on an open modal
- `disableClosing()` is now safe to call before the modal is in the DOM — `_config` values are applied and picked up by `_buildHTML()` when the modal renders

### Changed
- `onOpenBefore` now fires on `show.bs.modal` (before animation starts) instead of before `modal()` is called — more accurate timing
- `onOpen` now fires immediately after `modal('show')` is called
- `onOpenAfter` replaces the old `onOpen` position (after `shown.bs.modal`)
- `_buildHTML()` now reads `_config.backdrop` and `_config.keyboard` for `data-*` attributes, so pre-open `disableClosing()` calls are correctly reflected in the rendered HTML
- `closemodal` option comment updated to reflect `'disabled'` as a valid value alongside `'auto'` and `'manual'`

### Fixed
- `disableClosing()` / `resetClosing()` crashed with `TypeError` when called before the modal was appended to the DOM (`this.$el` was undefined)

---

## [1.1.0] — 2026-06-15

### Changed
- Plugin files renamed from `bs4.modal.js` / `bs4.modal.css` to `bs4-modal-ext.js` / `bs4-modal-ext.css` to align with the npm package name `bs4-modal-ext`

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
