# 🎉 OpenPatch

<div align="center">

**Widget universel de patchnotes intelligent pour Vue 3**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

*Affichez vos notes de version de manière élégante, avec détection automatique des nouvelles versions*

[Démo](https://williamloree.github.io/OpenPatch/) • [Documentation](#-documentation) • [Intégration](#-intégration)

</div>

---

## 📖 À propos

OpenPatch est un widget de patchnotes moderne et léger qui s'intègre facilement dans n'importe quelle application web. Il affiche automatiquement les notes de version aux utilisateurs uniquement lors d'une nouvelle version, en stockant la dernière version vue dans le localStorage.

### 🎯 Cas d'usage

- ✅ Applications SaaS nécessitant une communication des mises à jour
- ✅ Sites e-commerce informant des nouvelles fonctionnalités
- ✅ Dashboards administratifs avec releases fréquentes
- ✅ Applications mobiles hybrides (Progressive Web Apps)
- ✅ Extensions de navigateur nécessitant un changelog

## ✨ Fonctionnalités

- 🚀 **Détection automatique** - Affiche les patchnotes uniquement lors d'une nouvelle version
- 💾 **Persistance intelligente** - Stockage localStorage de la dernière version vue
- 🎨 **Design moderne** - Interface élégante avec Tailwind CSS 4.x
- 🎭 **Personnalisation CSS** - Couleurs et styles entièrement personnalisables
- ⚡ **Performance optimale** - Bundle léger et optimisé
- 🔧 **Hautement configurable** - Options personnalisables pour tous les besoins
- 📱 **Responsive** - Design adaptatif mobile-friendly
- 🌐 **Multi-plateforme** - Compatible Vue 3, vanilla JS, et frameworks modernes
- 🔒 **Type-safe** - Développé en TypeScript natif
- ♿ **Accessible** - Respect des standards ARIA

## 📦 Installation

### Pour développeurs Vue 3

```bash
# Cloner le dépôt
git clone https://github.com/williamloree/OpenPatch.git
cd OpenPatch

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Pour intégration standalone

Voir la section [Mode Embed](#-mode-embed-standalone) ci-dessous.

## 🚀 Utilisation

### Mode Embed (Standalone) - Recommandé

Intégrez OpenPatch sur **n'importe quel site web** sans dépendances Vue !

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Site</title>
</head>
<body>
  <div id="app">
    <h1>Mon Application</h1>
  </div>

  <!-- Configuration OpenPatch -->
  <script>
    window.Settings = {
      projectId: "my-project",
      version: "1.4.0",
      patchnotes: {
        title: "Nouveautés",
        sections: [
          {
            title: "Fonctionnalités",
            items: [
              "Ajout du dashboard",
              "Nouveau système de notifications"
            ]
          },
          {
            title: "Corrections",
            items: [
              "Correction de bugs mineurs",
              "Amélioration des performances"
            ]
          }
        ]
      },
      options: {
        closeButtonText: "Compris !",
        forceShow: false
      },
      css: {
        primaryColor: "#4CAF50",
        backgroundColor: "#f9f9f9",
        textColor: "#333333",
        buttonTextColor: "#ffffff",
        buttonBackgroundColor: "#4CAF50",
        borderColor: "#e0e0e0",
        accentColor: "#81C784"
      }
    };

    // Chargement du widget
    (function(d,s,x){
      var t=d.getElementsByTagName(s)[0],e=d.createElement(s),l=d.createElement(x);
      var io="https://williamloree.github.io/OpenPatch/";
      var h=d.getElementsByTagName("head")[0];
      e.type="module";
      e.src=io+"openpatch.es.js";
      l.rel="stylesheet";
      l.type="text/css";
      l.href=io+"open-patch.css";
      t.parentNode.insertBefore(e,t);
      h.appendChild(l);
    })(document,"script","link");
  </script>
</body>
</html>
```

### Mode Vue 3

```vue
<template>
  <div>
    <h1>Mon Application</h1>

    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :patchnotes="patchnotesContent"
      :css-customization="customColors"
    />
  </div>
</template>

<script setup lang="ts">
import OpenPatch from '@/components/OpenPatch.vue'

const patchnotesContent = {
  title: "Nouveautés v1.2.0",
  sections: [
    {
      title: "Fonctionnalités",
      items: [
        "Ajout du mode sombre",
        "Export PDF des rapports",
        "Système de notifications en temps réel"
      ]
    },
    {
      title: "Corrections",
      items: [
        "Correction du bug d'affichage sur mobile",
        "Amélioration des performances de chargement"
      ]
    }
  ]
}

const customColors = {
  primaryColor: "#4CAF50",
  backgroundColor: "#f9f9f9",
  textColor: "#333333",
  buttonBackgroundColor: "#4CAF50",
  buttonTextColor: "#ffffff"
}
</script>
```

## 🎨 Personnalisation CSS

OpenPatch offre un système complet de personnalisation via l'objet `css` dans la configuration.

### Options de personnalisation

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `primaryColor` | `string` | `#0f172a` | Couleur principale (titres, bordures au hover) |
| `backgroundColor` | `string` | `#ffffff` | Couleur de fond de la modal |
| `textColor` | `string` | `#334155` | Couleur du texte principal |
| `buttonBackgroundColor` | `string` | `#0f172a` | Couleur de fond du bouton |
| `buttonTextColor` | `string` | `#ffffff` | Couleur du texte du bouton |
| `borderColor` | `string` | `#e2e8f0` | Couleur des bordures |
| `accentColor` | `string` | `#cbd5e1` | Couleur d'accent (bullets, bordures items) |

### Exemples de thèmes

#### Thème vert moderne

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

#### Thème bleu professionnel

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

#### Thème sombre

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

#### Thème orange énergique

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

## 📐 Structure des données

### Format PatchNotes

```typescript
interface PatchNotesConfig {
  title: string
  sections: Array<{
    title: string
    items: string[]
  }>
}
```

### Exemple complet

```typescript
const patchnotes: PatchNotesConfig = {
  title: "Version 2.0.0 - Refonte majeure",
  sections: [
    {
      title: "🎉 Nouvelles fonctionnalités",
      items: [
        "Interface utilisateur repensée",
        "Mode collaboratif en temps réel",
        "Intégration API REST complète"
      ]
    },
    {
      title: "⚡ Améliorations",
      items: [
        "Performance de chargement x3",
        "Réduction de 40% de la taille du bundle",
        "Support PWA offline"
      ]
    },
    {
      title: "🐛 Corrections",
      items: [
        "Correction du crash sur iOS Safari",
        "Fix du bug de synchronisation",
        "Résolution des problèmes CORS"
      ]
    }
  ]
}
```

## 🎛️ Configuration

### Props du composant OpenPatch

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `projectId` | `string` | ✅ | - | Identifiant unique du projet pour le localStorage |
| `version` | `string` | ✅ | - | Version courante (format semver recommandé) |
| `patchnotes` | `PatchNotesConfig` | ✅ | - | Structure des notes de version |
| `cssCustomization` | `CSSCustomization` | ❌ | `{}` | Personnalisation des couleurs |
| `title` | `string` | ❌ | `"🎉 Nouveautés"` | Titre personnalisé de la modal |
| `closeButtonText` | `string` | ❌ | `"Compris !"` | Texte du bouton de fermeture |
| `forceShow` | `boolean` | ❌ | `false` | Forcer l'affichage (utile pour tests) |
| `manual` | `boolean` | ❌ | `false` | Désactiver la détection automatique |

### Options de configuration (window.Settings)

```typescript
interface WindowSettings {
  projectId: string              // Identifiant unique du projet
  version: string                // Version actuelle
  patchnotes: PatchNotesConfig   // Contenu des patchnotes
  options?: {
    closeButtonText?: string     // Texte du bouton
    forceShow?: boolean          // Forcer l'affichage
  }
  css?: CSSCustomization         // Personnalisation des couleurs
}
```

## 🚀 Build & Déploiement

### Build pour production

```bash
# Build standalone (pour CDN)
npm run build:standalone

# Build standard (pour intégration Vue)
npm run build
```

Fichiers générés dans `dist/` :
- `openpatch.es.js` - Bundle ES Module (recommandé)
- `openpatch.umd.js` - Bundle UMD (compatibilité navigateurs)
- `open-patch.css` - Styles CSS

### Déploiement sur GitHub Pages

Le projet est configuré pour déployer automatiquement via GitHub Actions. Chaque push sur `main` déclenche un build et un déploiement.

URL : `https://williamloree.github.io/OpenPatch/`

## 💡 Bonnes pratiques

### Versionning sémantique

Utilisez le format [semver](https://semver.org/) :

```
1.2.3
│ │ │
│ │ └─ Patch (corrections de bugs)
│ └─── Minor (nouvelles fonctionnalités)
└───── Major (changements majeurs)
```

### LocalStorage

Clé utilisée : `openpatch_last_seen_{projectId}`

```javascript
// Exemple de donnée stockée
localStorage.getItem('openpatch_last_seen_my-app')
// → "1.2.0"
```

## 🛠️ Développement

### Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de dev

# Build
npm run build            # Build standard Vue
npm run build:standalone # Build standalone pour CDN

# Preview
npm run preview          # Preview du build
```

### Structure du projet

```
OpenPatch/
├── src/
│   ├── components/
│   │   └── OpenPatch.vue          # Composant principal
│   ├── types/
│   │   └── settings.ts            # Définitions TypeScript
│   ├── App.vue                    # App de démo
│   ├── main.ts                    # Point d'entrée Vue
│   └── standalone.ts              # Point d'entrée standalone
├── examples/
│   └── vanilla-embed.html         # Exemples d'intégration
├── public/
│   └── index.html                 # Page de démo
└── README.md                      # Ce fichier
```

## ❓ FAQ

**Q: Comment réinitialiser l'historique des versions ?**
R: Utilisez `window.OpenPatch.reset()` ou supprimez la clé localStorage

**Q: Le widget fonctionne-t-il sans Vue ?**
R: Oui ! Utilisez le mode embed standalone

**Q: Peut-on personnaliser complètement le design ?**
R: Oui, via l'objet `css` dans la configuration

**Q: Comment gérer plusieurs projets ?**
R: Utilisez des `projectId` différents pour chaque projet

**Q: Le widget est-il accessible (ARIA) ?**
R: Oui, les standards d'accessibilité sont respectés

## 📝 Changelog

### Version 1.4.0 (Actuelle)
- ✨ Système de personnalisation CSS complet
- ✨ Support des sections multiples
- ⚡ Amélioration des performances
- 🎨 Refonte complète en Tailwind pur
- 🐛 Corrections de bugs mineurs

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🔗 Liens

- **Repository** : [github.com/williamloree/OpenPatch](https://github.com/williamloree/OpenPatch)
- **Issues** : [github.com/williamloree/OpenPatch/issues](https://github.com/williamloree/OpenPatch/issues)
- **Démo Live** : [williamloree.github.io/OpenPatch](https://williamloree.github.io/OpenPatch/)

---

<div align="center">

**Fait avec ❤️ par [williamloree](https://github.com/williamloree)**

Si ce projet vous aide, pensez à lui donner une ⭐ !

</div>
