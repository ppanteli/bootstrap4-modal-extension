# BS4Modal — Dynamic Modal jQuery Plugin

A lightweight jQuery plugin that dynamically loads modal content via AJAX or inline HTML, built on top of Bootstrap 4 modals.

---

## Why BS4Modal?

Bootstrap 4 modals are powerful but low-level. To show a modal you need to write the full HTML structure in the page upfront, manage show/hide yourself, and wire up any AJAX loading, spinner, error handling, and cleanup manually — every time.

**Plain Bootstrap 4 approach:**

```html
<!-- HTML must exist in the DOM before you call it -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">My Modal</h5>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
        <!-- manually fetch and inject content here -->
      </div>
    </div>
  </div>
</div>
```

```js
// manually fetch content, handle errors, show spinner, clean up after close...
$('#myModal').modal('show');
```

**With BS4Modal:**

```js
$.bs4Modal({ href: '/path/to/content', title: 'My Modal' });
```

That's it. The plugin:

- Builds and injects the modal HTML dynamically — nothing to add to your page
- Fetches content via AJAX with a built-in loading spinner
- Handles errors and shows a configurable error message if the request fails
- Removes the modal from the DOM after it closes, keeping the page clean
- Manages multiple instances automatically — opening a second modal hides the first
- Exposes a clean API for programmatic control when you need it

---

## Features

- Load modal content from a URL (AJAX) or pass it directly as a string
- Built-in loading spinner while AJAX content is fetching
- Optional response caching to avoid redundant requests
- Configurable header, footer, title, subtitle, and title icon
- CSS animation support with customisable speed and delay
- Mobile-responsive: snaps to a fixed full-screen layout below a configurable breakpoint
- Programmatic control: open, close, dismiss, show/hide loader, enable/disable closing
- Lifecycle hooks: `onOpenBefore`, `onOpen`, `onCloseBefore`, `onClose`
- Multiple modal instances managed automatically (previous modal is hidden when a new one opens)

---

## Requirements

- jQuery 3.5.1+
- Bootstrap 4.6.2

---

## Installation

### CDN

The quickest way — no installation required:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bs4-modal-ext/dist/bs4-modal-ext.min.css">

<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bs4-modal-ext/dist/bs4-modal-ext.min.js"></script>
```

Or via unpkg:

```html
<link rel="stylesheet" href="https://unpkg.com/bs4-modal-ext/dist/bs4-modal-ext.min.css">

<script src="https://unpkg.com/bs4-modal-ext/dist/bs4-modal-ext.min.js"></script>
```

### npm

```bash
npm install bs4-modal-ext
```

### Composer

```bash
composer require ppanteli/bs4-modal-ext
```

### Manual

Copy `bs4.modal.js` into your project and include it after jQuery and Bootstrap JS:

```html
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="bs4-modal-ext.css">

<script src="jquery.min.js"></script>
<script src="bootstrap.bundle.min.js"></script>
<script src="bs4-modal-ext.js"></script>
```

---

## Usage

### 1. Data-attribute (declarative)

Add `data-*` attributes to any element and call `.bs4Modal()` on it:

```html
<a href="/path/to/content" title="My Modal" class="open-modal">Open</a>

<script>
  $('.open-modal').bs4Modal();
</script>
```

Clicking the element triggers an AJAX request to `href` and displays the response inside the modal body.

### 2. jQuery plugin (imperative)

```js
$.bs4Modal({
  href: '/path/to/content',
  title: 'My Modal'
});
```

### 3. Inline / static content

```js
$.bs4Modal({
  title: 'Hello',
  content: '<p>This is static content.</p>'
});
```

Or via a `data-content` attribute on the trigger element — the plugin will skip the AJAX call and render the attribute value directly.

### 4. Destroy the listener

```js
$('.open-modal').bs4Modal('destroy');
```

---

## Options

All options can be passed as a JavaScript object or set via `data-*` attributes on the trigger element. `data-*` attributes always take precedence over options passed to the plugin call.

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `'Modal Title'` | Modal header title. |
| `subtitle` | `string\|false` | `false` | Optional subtitle rendered below the title. |
| `titleIcon` | `string\|false` | `false` | HTML string prepended to the title as an icon. |
| `titleclass` | `string` | `''` | Extra CSS class(es) added to the title element. |
| `modalclass` | `string` | `''` | Extra CSS class(es) added to the root modal element. |
| `modalsize` | `string` | `''` | Bootstrap size modifier added to `.modal-dialog` (e.g. `modal-lg`, `modal-xl`). |
| `content` | `string` | `''` | Static HTML content. When set, AJAX is skipped. |
| `href` | `string` | — | URL to load via AJAX. Required when `content` is not provided. |
| `cache` | `boolean` | `false` | Cache AJAX responses by URL so repeated opens avoid a network request. |
| `isAjax` | `boolean` | auto | Resolved automatically; override only if necessary. |
| `header` | `boolean` | `true` | Show (`true`) or hide (`false`) the modal header. |
| `footer` | `string\|false` | `false` | HTML to render inside the footer. `false` removes the footer. |
| `footerclass` | `string` | `''` | Extra CSS class(es) added to the footer element. |
| `closemodal` | `'auto'\|'manual'` | `'auto'` | `'auto'` — Bootstrap dismiss buttons work normally. `'manual'` — dismiss buttons are removed; you must call `.dismiss()` programmatically. |
| `backdrop` | `boolean\|'static'` | `true` | Bootstrap backdrop option. `'static'` prevents closing by clicking outside. |
| `keyboard` | `boolean` | `true` | Whether pressing Escape closes the modal. |
| `animation` | `string\|false` | `false` | CSS animation class name applied to `.modal-dialog`. |
| `animationSpeed` | `number` | `400` | Animation duration in milliseconds. |
| `animationDelay` | `number` | `0` | Animation delay in milliseconds. |
| `forceScrollableDialog` | `boolean` | `false` | Adds Bootstrap's `modal-dialog-scrollable` class. |
| `mobileBreakdown` | `number\|false` | `576` | Viewport width (px) below which the modal switches to a fixed full-screen layout. Set to `false` to disable. |
| `hideLoader` | `boolean` | `false` | When `true`, the loading spinner is not shown during AJAX requests. |
| `closebtn` | `boolean` | `false` | Render a "Cancel" dismiss button inside the footer when `footer` is `false`. |
| `closebtnclass` | `string` | `''` | Extra CSS class(es) added to the close button. |
| `id` | `string` | auto-generated | Custom `id` attribute for the modal element. |
| `pageNotFoundTemplate` | `string` | `'<div class="alert alert-warning">Page not found!</div>'` | HTML rendered in the modal body when `href` is empty or `#`. |
| `ajaxErrorTemplate` | `string` | `'<div class="alert alert-danger">Failed to load content. Please try again.</div>'` | HTML rendered in the modal body when an AJAX request fails. Override to customise the error message. |

---

## Instance API

`$.bs4Modal()` and `$.fn.bs4Modal()` both return the `Modal` instance, which exposes the following methods:

```js
var modal = $.bs4Modal({ href: '/content', title: 'Demo' });
```

| Method | Description |
|---|---|
| `modal.open()` | Opens the modal. No-op if already open. |
| `modal.close()` | Removes the modal from the DOM and fires `onClose`. |
| `modal.dismiss()` | Triggers Bootstrap's `modal('hide')`. Respects `isClosingDisabled()`. |
| `modal.isOpen()` | Returns `true` if the modal is currently in the DOM. |
| `modal.isClosed()` | Returns `true` if the modal has been removed. |
| `modal.setTitle(title)` | Updates the modal title. |
| `modal.setContent(html)` | Replaces the modal body with the provided HTML string. |
| `modal.prependContent(html)` | Prepends HTML to the existing modal body. |
| `modal.showLoading()` | Shows the loading spinner. |
| `modal.hideLoading()` | Hides the loading spinner. |
| `modal.disableClosing()` | Sets backdrop to `static` and keyboard to `false`, hides dismiss buttons. |
| `modal.resetClosing()` | Restores the original `backdrop` and `keyboard` values. |
| `modal.isClosingDisabled()` | Returns `true` when backdrop is `static` and keyboard is `false`. |
| `modal.refreshContent()` | Recalculates body height and hides the loader. Useful after injecting dynamic content. |

---

## Lifecycle Callbacks

Pass any of these as options to hook into the modal lifecycle:

```js
$.bs4Modal({
  href: '/content',
  onOpenBefore:  function() { console.log('About to open'); },
  onOpen:        function() { console.log('Modal is visible'); },
  onCloseBefore: function() { console.log('About to close'); },
  onClose:       function() { console.log('Modal removed from DOM'); }
});
```

| Callback | Fires when |
|---|---|
| `onOpenBefore` | Immediately before Bootstrap shows the modal. |
| `onOpen` | After the `shown.bs.modal` event — modal is fully visible. |
| `onCloseBefore` | On the `hide.bs.modal` event — before the hide animation starts. |
| `onClose` | After the `hidden.bs.modal` event — modal has been removed from the DOM. |

> `onOpenAfter` and `onCloseAfter` are reserved names but are not currently triggered by the plugin.

---

## Examples

### AJAX modal with a large size and animation

```js
$('.trigger').bs4Modal({
  title: 'User Profile',
  modalsize: 'modal-lg',
  animation: 'fadeInDown',
  animationSpeed: 300
});
```

### Static content, no header, custom footer

```js
$.bs4Modal({
  header: false,
  content: '<p>Are you sure?</p>',
  footer: '<button class="btn btn-danger" id="confirm">Delete</button>',
  closemodal: 'manual'
});
```

### Cached AJAX modal

```js
$.bs4Modal({
  href: '/help/topic/1',
  title: 'Help',
  cache: true
});
```

### Programmatic control

```js
var modal = $.bs4Modal({ href: '/form', title: 'Edit' });

// Disable closing while a form is submitting
modal.disableClosing();

$.post('/form', data, function() {
  modal.resetClosing();
  modal.dismiss();
});
```

---

## License

[MIT](LICENSE) © Pantelis Panteli
