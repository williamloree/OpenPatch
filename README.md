# OpenPatch

A lightweight Vue 3 component for displaying patch notes and update notifications to your users.

[![NPM Version](https://img.shields.io/npm/v/open-patch)](https://www.npmjs.com/package/open-patch)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)

[Demo](https://williamloree.github.io/OpenPatch/) • [Documentation](#installation) • [GitHub](https://github.com/williamloree/OpenPatch)

---

## About

OpenPatch is a modern, lightweight patch notes widget that integrates easily into any web application. It automatically displays version notes to users only when a new version is released, storing the last seen version in localStorage.

## Features

- **Dual mode**: Use as a Vue component or standalone widget
- **Fully customizable**: CSS custom properties support
- **Smart persistence**: Remembers which updates users have seen
- **Easy integration**: Drop-in script or npm package
- **TypeScript support**: Full type definitions included
- **Lightweight**: Minimal bundle size with Tailwind CSS
- **Responsive**: Mobile-friendly design
- **Accessible**: ARIA standards compliant
- **JSON configuration**: Update patch notes without redeploying

## Installation

### Option 1: NPM Package (Vue Projects)

```bash
npm install open-patch
```

### Option 2: Standalone Script (Any Website)

```html
<link rel="stylesheet" href="https://unpkg.com/open-patch/dist/open-patch.css">
<script src="https://unpkg.com/open-patch/dist/openpatch.es.js" type="module"></script>
```

### Option 3: Development (Clone Repository)

```bash
# Clone the repository
git clone https://github.com/williamloree/OpenPatch.git
cd OpenPatch

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### As a Vue Component

```vue
<template>
  <div>
    <button @click="show">Show Updates</button>
    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :patchnotes="patchnotes"
      title="What's New"
      close-button-text="Got it!"
      @close="handleClose"
      @shown="handleShown"
    />
  </div>
</template>

<script setup lang="ts">
import { OpenPatch, type PatchNotes } from 'open-patch'
import 'open-patch/style.css'

const patchnotes: PatchNotes = {
  title: "Version 1.2.0",
  sections: [
    {
      title: "New Features",
      items: [
        "Dark mode support",
        "Export to PDF"
      ]
    },
    {
      title: "Bug Fixes",
      items: [
        "Fixed login issue"
      ]
    }
  ]
}

const handleClose = () => console.log('Patch notes closed')
const handleShown = () => console.log('Patch notes shown')
</script>
```

### Using the Composable

```vue
<script setup lang="ts">
import { useOpenPatch } from 'open-patch'

const { show, hide, reset } = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0',
  patchnotes: {
    title: "What's New",
    sections: [
      {
        title: "Features",
        items: ["New dashboard", "Export functionality"]
      }
    ]
  }
})

// Show the modal
show()

// Hide it programmatically
hide()

// Reset and show again
reset()
</script>
```

### Standalone Mode - JSON Configuration (Recommended)

**Update your patch notes without redeploying your application!**

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/open-patch/dist/open-patch.css">
</head>
<body>
  <h1>My Website</h1>

  <script type="module">
    // Configure via window object
    window.OpenPatchConfig = {
      jsonUrl: '/patchnotes.json'
    }
  </script>
  <script src="https://unpkg.com/open-patch/dist/openpatch.es.js" type="module"></script>
</body>
</html>
```

**patchnotes.json:**

```json
{
  "projectId": "my-app",
  "version": "1.2.0",
  "patchnotes": {
    "title": "What's New",
    "sections": [
      {
        "title": "Features",
        "items": ["New dashboard", "Notifications"]
      }
    ]
  },
  "options": {
    "closeButtonText": "Got it!",
    "forceShow": false
  },
  "css": {
    "primaryColor": "#4CAF50"
  }
}
```

**Benefits of JSON configuration:**

- Update patch notes without code deployment
- Modify version in production
- Centralized configuration management
- Automatic fallback to `window.Settings` if JSON fails

### Standalone Mode - Inline Configuration

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/open-patch/dist/open-patch.css">
</head>
<body>
  <h1>My Website</h1>

  <script>
    window.Settings = {
      projectId: "my-app",
      version: "1.2.0",
      patchnotes: {
        title: "What's New",
        sections: [
          {
            title: "Features",
            items: ["New dashboard", "Export functionality"]
          },
          {
            title: "Bug Fixes",
            items: ["Fixed login issue"]
          }
        ]
      },
      options: {
        closeButtonText: "Got it!",
        forceShow: false
      },
      css: {
        primaryColor: "#4CAF50",
        backgroundColor: "#f9f9f9",
        textColor: "#333333",
        buttonBackgroundColor: "#4CAF50",
        buttonTextColor: "#ffffff",
        borderColor: "#e0e0e0",
        accentColor: "#81C784"
      }
    }
  </script>
  <script src="https://unpkg.com/open-patch/dist/openpatch.es.js" type="module"></script>
</body>
</html>
```

## Configuration

### Props (Vue Component)

| Prop | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `projectId` | `string` | ✅ | Unique identifier for your project |
| `version` | `string` | ✅ | Current version number |
| `patchnotes` | `PatchNotes` | ✅ | Patch notes content |
| `title` | `string` | ❌ | Modal title (default: from patchnotes) |
| `closeButtonText` | `string` | ❌ | Close button text (default: "Compris !") |
| `forceShow` | `boolean` | ❌ | Always show modal (default: false) |
| `cssCustomization` | `CSSCustomization` | ❌ | CSS custom properties |

### Events

- `@close` - Emitted when modal is closed
- `@shown` - Emitted when modal is displayed

### API (Standalone Mode)

```javascript
// Show the modal
window.OpenPatch.show()

// Hide the modal
window.OpenPatch.hide()

// Reset (clear storage and show again)
window.OpenPatch.reset()
```

## CSS Customization

OpenPatch offers a complete customization system via the `css` object in configuration.

### Available CSS Properties

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `primaryColor` | `string` | `#0f172a` | Primary color (titles, borders on hover) |
| `backgroundColor` | `string` | `#ffffff` | Modal background color |
| `textColor` | `string` | `#334155` | Main text color |
| `buttonBackgroundColor` | `string` | `#0f172a` | Button background color |
| `buttonTextColor` | `string` | `#ffffff` | Button text color |
| `borderColor` | `string` | `#e2e8f0` | Border color |
| `accentColor` | `string` | `#cbd5e1` | Accent color (bullets, item borders) |

### Theme Examples

#### Modern Green Theme

```javascript
css: {
  primaryColor: "#4CAF50",
  backgroundColor: "#f9f9f9",
  textColor: "#333333",
  buttonBackgroundColor: "#4CAF50",
  buttonTextColor: "#ffffff",
  borderColor: "#e0e0e0",
  accentColor: "#81C784"
}
```

#### Professional Blue Theme

```javascript
css: {
  primaryColor: "#1976D2",
  backgroundColor: "#ffffff",
  textColor: "#263238",
  buttonBackgroundColor: "#1976D2",
  buttonTextColor: "#ffffff",
  borderColor: "#BBDEFB",
  accentColor: "#64B5F6"
}
```

#### Dark Theme

```javascript
css: {
  primaryColor: "#BB86FC",
  backgroundColor: "#1E1E1E",
  textColor: "#E1E1E1",
  buttonBackgroundColor: "#BB86FC",
  buttonTextColor: "#000000",
  borderColor: "#2C2C2C",
  accentColor: "#03DAC6"
}
```

#### Energetic Orange Theme

```javascript
css: {
  primaryColor: "#FF6B35",
  backgroundColor: "#FFF8F3",
  textColor: "#2D3142",
  buttonBackgroundColor: "#FF6B35",
  buttonTextColor: "#ffffff",
  borderColor: "#FFE5D9",
  accentColor: "#FFB997"
}
```

## Data Structure

### PatchNotes Format

```typescript
interface PatchNotesConfig {
  title: string
  sections: Array<{
    title: string
    items: string[]
  }>
}
```

### Complete Example

```typescript
const patchnotes: PatchNotesConfig = {
  title: "Version 2.0.0 - Major Redesign",
  sections: [
    {
      title: "🎉 New Features",
      items: [
        "Redesigned user interface",
        "Real-time collaborative mode",
        "Complete REST API integration"
      ]
    },
    {
      title: "⚡ Improvements",
      items: [
        "3x faster loading performance",
        "40% reduction in bundle size",
        "Offline PWA support"
      ]
    },
    {
      title: "🐛 Bug Fixes",
      items: [
        "Fixed crash on iOS Safari",
        "Fixed synchronization bug",
        "Resolved CORS issues"
      ]
    }
  ]
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type {
  PatchNotesConfig,
  PatchNoteSection,
  WindowSettings,
  CSSCustomization,
  WidgetOptions,
  OpenPatchConfig
} from 'open-patch'

// Aliases for compatibility
import type { PatchNotesConfig as PatchNotes } from 'open-patch'
import type { WindowSettings as OpenPatchSettings } from 'open-patch'
```

## Best Practices

### Semantic Versioning

Use [semver](https://semver.org/) format:

```text
1.2.3
│ │ │
│ │ └─ Patch (bug fixes)
│ └─── Minor (new features)
└───── Major (breaking changes)
```

### LocalStorage

Storage key format: `openpatch_last_seen_{projectId}`

```javascript
// Example of stored data
localStorage.getItem('openpatch_last_seen_my-app')
// → "1.2.0"
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Complete build (lib + standalone + types)
npm run build:lib        # Build Vue library
npm run build:standalone # Build standalone for CDN

# Preview
npm run preview          # Preview build
npm run serve:example    # Serve example page
```

### Project Structure

```text
OpenPatch/
├── src/
│   ├── components/
│   │   └── OpenPatch.vue          # Main component
│   ├── composables/
│   │   └── useOpenPatch.ts        # Composable
│   ├── types/
│   │   └── settings.ts            # TypeScript definitions
│   ├── utils/
│   │   └── configLoader.ts        # Config loader utility
│   ├── index.ts                   # Library entry point
│   ├── standalone.ts              # Standalone entry point
│   ├── App.vue                    # Demo app
│   └── main.ts                    # Vue entry point
├── dist/                          # Build output
├── public/                        # Static assets
└── README.md                      # This file
```

## FAQ

**Q: How to reset version history?**
A: Use `window.OpenPatch.reset()` or delete the localStorage key

**Q: Does the widget work without Vue?**
A: Yes! Use standalone mode

**Q: Can I fully customize the design?**
A: Yes, via the `css` configuration object

**Q: How to manage multiple projects?**
A: Use different `projectId` for each project

**Q: Is the widget accessible (ARIA)?**
A: Yes, accessibility standards are respected

## Build & Deployment

### Building for Production

```bash
# Complete build
npm run build
```

Generated files in `dist/`:

- `index.es.js` - ES Module for Vue projects (8.2 kB)
- `openpatch.es.js` - Standalone ES Module with Vue (123 kB)
- `openpatch.umd.js` - Standalone UMD with Vue (77 kB)
- `open-patch.css` - Compiled Tailwind styles (21 kB)
- `index.d.ts` - TypeScript definitions

### Publishing to NPM

```bash
# Login to npm
npm login

# Publish package
npm publish
```

### GitHub Pages Deployment

The project is configured to deploy automatically via GitHub Actions. Each push to `main` triggers a build and deployment.

Demo URL: `https://williamloree.github.io/OpenPatch/`

## Changelog

### Version 1.0.0 (Current)

- ✨ Complete CSS customization system
- ✨ Multi-section support
- ✨ JSON configuration mode
- ⚡ Performance improvements
- 🎨 Complete Tailwind rewrite
- 📦 NPM package ready
- 🔧 Dual mode (Vue + Standalone)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern browsers with ES modules support

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Repository**: [github.com/williamloree/OpenPatch](https://github.com/williamloree/OpenPatch)
- **Issues**: [github.com/williamloree/OpenPatch/issues](https://github.com/williamloree/OpenPatch/issues)
- **Demo**: [williamloree.github.io/OpenPatch](https://williamloree.github.io/OpenPatch/)
- **NPM**: [npmjs.com/package/open-patch](https://www.npmjs.com/package/open-patch)

---

<div align="center">

**Made with ❤️ by [williamloree](https://github.com/williamloree)**

If this project helps you, consider giving it a ⭐!

</div>
