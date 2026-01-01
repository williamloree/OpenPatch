# 🎉 OpenPatch

<div align="center">

**Widget universel de patchnotes intelligent pour Vue 3**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

*Affichez vos notes de version de manière élégante, avec détection automatique des nouvelles versions*

[Démo](https://open-patch.fr) • [Documentation](#-documentation) • [Intégration](#-intégration)

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
- ⚡ **Performance optimale** - Bundle léger et optimisé
- 🔧 **Hautement configurable** - Options personnalisables pour tous les besoins
- 📱 **Responsive** - Design adaptatif mobile-friendly
- 🎭 **Modes multiples** - Automatique, manuel ou embed standalone
- 🔒 **Type-safe** - Développé en TypeScript natif
- 🌐 **Multi-plateforme** - Compatible Vue 3, vanilla JS, et frameworks modernes
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

### Mode 1: Automatique (Recommandé)

Le widget s'affiche automatiquement si une nouvelle version est détectée.

```vue
<template>
  <div>
    <h1>Mon Application</h1>

    <!-- Widget OpenPatch avec détection auto -->
    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :patchnotes="patchnotesContent"
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
</script>
```

### Mode 2: Manuel (Contrôle total)

Utilisez le composable `useOpenPatch` pour un contrôle programmatique.

```vue
<template>
  <div>
    <button @click="patch.show()">
      📝 Voir les nouveautés
    </button>

    <button @click="patch.reset()">
      🔄 Réinitialiser
    </button>

    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :patchnotes="patchnotes"
      manual
    />
  </div>
</template>

<script setup lang="ts">
import { useOpenPatch } from '@/composables/useOpenPatch'
import OpenPatch from '@/components/OpenPatch.vue'

const patchnotes = {
  title: "Quoi de neuf ?",
  sections: [...]
}

const patch = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0'
})

// Contrôle programmatique
if (patch.shouldShow()) {
  patch.show()
}

// Réinitialiser pour tests
patch.reset()
</script>
```

### 🌐 Mode Embed (Standalone)

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
      }
    };

    // Chargement du widget
    (function(d,s,x){
      var t=d.getElementsByTagName(s)[0],e=d.createElement(s),l=d.createElement(x);
      var io="https://open-patch.fr/";
      var h=d.getElementsByTagName("head")[0];
      e.type="module";
      e.src=io+"openpatch.es.js";
      l.rel="stylesheet";
      l.type="text/css";
      l.href=io+"openpatch.css";
      t.parentNode.insertBefore(e,t);
      h.appendChild(l);
    })(document,"script","link");
  </script>
</body>
</html>
```

> 📚 **Documentation complète** : Voir [EMBED.md](EMBED.md) pour plus de détails sur l'intégration standalone

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
    },
    {
      title: "🔒 Sécurité",
      items: [
        "Mise à jour des dépendances critiques",
        "Ajout de l'authentification 2FA",
        "Chiffrement des données sensibles"
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
| `title` | `string` | ❌ | `"🎉 Nouveautés"` | Titre personnalisé de la modal |
| `closeButtonText` | `string` | ❌ | `"Compris !"` | Texte du bouton de fermeture |
| `forceShow` | `boolean` | ❌ | `false` | Forcer l'affichage (utile pour tests) |
| `manual` | `boolean` | ❌ | `false` | Désactiver la détection automatique |

### API du composable useOpenPatch

```typescript
const {
  isVisible,     // Ref<boolean> - État actuel de visibilité
  show,          // () => void - Afficher la modal
  hide,          // () => void - Masquer et sauvegarder la version
  shouldShow,    // () => boolean - Vérifier si nouvelle version
  reset,         // () => void - Réinitialiser localStorage
  getLastSeen,   // () => StoredVersion | null - Infos dernière version
  config         // Readonly<OpenPatchConfig> - Config actuelle
} = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0',
  patchnotes: myPatchnotes,
  title: 'Nouveautés',
  closeButtonText: 'Fermer',
  forceShow: false
})
```

### Interface StoredVersion

```typescript
interface StoredVersion {
  version: string
  timestamp: number
}
```

## 📚 Documentation

### 📖 Guides complets

- **[EMBED.md](EMBED.md)** - Guide d'intégration standalone (vanilla JS)
- **[DEPLOY.md](DEPLOY.md)** - Guide de déploiement et configuration CORS

### 🎓 Exemples

Le projet inclut plusieurs exemples d'utilisation :

```
examples/
  ├── vanilla-embed.html        # Intégration vanilla JS
  └── public/example-embed.html # Exemple complet
```

### Exemple avec analytics

```vue
<template>
  <OpenPatch
    project-id="my-app"
    version="1.2.0"
    :patchnotes="patchnotes"
    @shown="trackPatchnotesView"
    @close="trackPatchnotesClose"
  />
</template>

<script setup lang="ts">
import { useAnalytics } from '@/composables/analytics'

const analytics = useAnalytics()

const trackPatchnotesView = () => {
  analytics.track('patchnotes_viewed', {
    version: '1.2.0',
    timestamp: Date.now()
  })
}

const trackPatchnotesClose = () => {
  analytics.track('patchnotes_closed', {
    version: '1.2.0'
  })
}
</script>
```

### Intégration avec système de features flags

```typescript
import { useOpenPatch } from '@/composables/useOpenPatch'
import { useFeatureFlags } from '@/composables/featureFlags'

const features = useFeatureFlags()

const patch = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0',
  patchnotes: myPatchnotes,
  forceShow: features.isEnabled('force-patchnotes')
})

// Afficher seulement si la feature est activée
if (features.isEnabled('patchnotes-enabled') && patch.shouldShow()) {
  patch.show()
}
```

### Chargement asynchrone

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OpenPatch from '@/components/OpenPatch.vue'
import type { PatchNotesConfig } from '@/types/settings'

const patchnotes = ref<PatchNotesConfig | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // Charger depuis API ou fichier JSON
    const response = await fetch('/api/patchnotes/latest')
    patchnotes.value = await response.json()
  } catch (error) {
    console.error('Erreur chargement patchnotes:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <OpenPatch
    v-if="!loading && patchnotes"
    project-id="my-app"
    version="1.2.0"
    :patchnotes="patchnotes"
  />
</template>
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
- `openpatch.css` - Styles Tailwind CSS

### Options de déploiement

```bash
npm install -g gh-pages
npm run build:standalone
gh-pages -d dist
```

URL : `https://votreusername.github.io/openpatch/openpatch.es.js`

#### 2. Netlify (Gratuit)

Créer `netlify.toml` :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, OPTIONS"
```

#### 3. Vercel (Gratuit)

```bash
npm i -g vercel
cd dist && vercel --prod
```

Créer `vercel.json` pour CORS :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

#### 4. Cloudflare Pages

Créer `_headers` dans `dist/` :

```
/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, OPTIONS
```

> 📚 **Documentation complète** : Voir [DEPLOY.md](DEPLOY.md) pour plus d'options et configurations

## 🛠️ Développement

### Prérequis

- Node.js 18+
- npm ou yarn

### Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de dev

# Build
npm run build            # Build standard Vue
npm run build:standalone # Build standalone pour CDN

# Preview
npm run preview          # Preview du build
npm run serve:example    # Servir les exemples
```

### Structure du projet

```
OpenPatch/
├── src/
│   ├── components/
│   │   └── OpenPatch.vue          # Composant principal
│   ├── composables/
│   │   └── useOpenPatch.ts        # Logique réutilisable
│   ├── types/
│   │   └── settings.ts            # Définitions TypeScript
│   ├── App.vue                    # App de démo
│   ├── main.ts                    # Point d'entrée Vue
│   └── standalone.ts              # Point d'entrée standalone
├── examples/
│   └── vanilla-embed.html         # Exemples d'intégration
├── public/
│   └── example-embed.html         # Exemple public
├── EMBED.md                       # Doc intégration standalone
├── DEPLOY.md                      # Doc déploiement
└── README.md                      # Ce fichier
```

## 🎨 Personnalisation

### Styles Tailwind

Le widget utilise Tailwind CSS 4.x. Vous pouvez personnaliser les styles en modifiant :

```vue
<!-- Dans OpenPatch.vue -->
<div class="bg-white rounded-lg shadow-xl">
  <!-- Changez les classes Tailwind -->
</div>
```

### Thème sombre

```vue
<div class="dark:bg-slate-800 dark:text-white">
  <!-- Support du mode sombre -->
</div>
```

### Variables CSS

```css
:root {
  --openpatch-primary: #1e293b;
  --openpatch-accent: #3b82f6;
  --openpatch-radius: 0.5rem;
}
```

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

### Quand afficher les patchnotes ?

```typescript
// ✅ Affiche : Nouvelle version détectée
"2.0.0" → "2.1.0"

// ❌ N'affiche pas : Même version
"2.1.0" → "2.1.0"

// ✅ Affiche : Mode forcé (utile pour tests)
forceShow: true
```

### LocalStorage

Clé utilisée : `openpatch_{projectId}_version`

```javascript
// Exemple de donnée stockée
localStorage.getItem('openpatch_my-app_version')
// → {"version":"1.2.0","timestamp":1704067200000}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines

- ✅ Code TypeScript typé
- ✅ Tests unitaires si applicable
- ✅ Documentation des nouvelles features
- ✅ Respect du style de code existant

## 📝 Changelog

### Version 1.4.0 (Actuelle)
- ✨ Support des sections multiples
- ⚡ Amélioration des performances
- 🐛 Corrections de bugs mineurs

### Version 1.3.0
- 🎨 Design repensé avec Tailwind 4.x
- 📱 Meilleure expérience mobile
- 🔧 Nouvelles options de configuration

### Version 1.2.0
- 🚀 Mode standalone/embed
- 💾 Système de persistance amélioré
- 🎯 Support TypeScript complet

### Version 1.0.0
- 🎉 Release initiale

## 🔒 Sécurité

### localStorage

- Données stockées uniquement en local
- Aucune transmission de données externes
- Clé unique par projet (`openpatch_{projectId}_version`)

### CORS

Pour le mode standalone, assurez-vous d'activer CORS sur votre CDN :

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
```

## ❓ FAQ

**Q: Comment réinitialiser l'historique des versions ?**  
R: Utilisez `patch.reset()` ou supprimez la clé localStorage `openpatch_{projectId}_version`

**Q: Le widget fonctionne-t-il sans Vue ?**  
R: Oui ! Utilisez le mode embed standalone (voir [EMBED.md](EMBED.md))

**Q: Peut-on personnaliser complètement le design ?**  
R: Oui, toutes les classes Tailwind peuvent être modifiées

**Q: Support du SSR (Nuxt, etc.) ?**  
R: Oui, utilisez `<ClientOnly>` pour éviter les erreurs d'hydratation

**Q: Comment gérer plusieurs projets ?**  
R: Utilisez des `projectId` différents pour chaque projet

**Q: Le widget est-il accessible (ARIA) ?**  
R: Oui, les standards d'accessibilité sont respectés

## 🌟 Remerciements

- [Vue.js](https://vuejs.org/) - Framework réactif
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vite](https://vitejs.dev/) - Build tool ultra-rapide

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🔗 Liens

- **Documentation** : [EMBED.md](EMBED.md) | [DEPLOY.md](DEPLOY.md)
- **Repository** : [github.com/williamloree/OpenPatch](https://github.com/williamloree/OpenPatch)
- **Issues** : [github.com/williamloree/OpenPatch/issues](https://github.com/williamloree/OpenPatch/issues)
- **Démo Live** : [open-patch.fr](https://open-patch.fr)

---

<div align="center">

**Fait avec ❤️ par [williamloree](https://github.com/williamloree)**

Si ce projet vous aide, pensez à lui donner une ⭐ !

</div>
  <OpenPatch
    v-if="patchnotes"
    project-id="my-app"
    version="1.2.0"
    :content="patchnotes"
  />
</template>
```

## 🎨 Personnalisation

### Styles personnalisés

Le widget utilise Tailwind CSS. Vous pouvez personnaliser l'apparence en modifiant directement le composant [OpenPatch.vue](src/components/OpenPatch.vue).

### Thème sombre

```vue
<!-- À venir: support du mode sombre automatique -->
```

## 🔒 Sécurité

**Important**: Le contenu HTML n'est pas sanitizé par défaut. Pour une utilisation en production, il est fortement recommandé d'utiliser [DOMPurify](https://github.com/cure53/DOMPurify):

```bash
npm install dompurify
npm install -D @types/dompurify
```

```typescript
// Dans OpenPatch.vue
import DOMPurify from 'dompurify'

const sanitizedContent = computed(() => {
  return DOMPurify.sanitize(props.content)
})
```

## 💾 Stockage localStorage

Le widget stocke les informations dans localStorage avec la clé:
```
openpatch_${projectId}_version
```

Structure:
```json
{
  "version": "1.2.0",
  "timestamp": 1704067200000
}
```

Pour réinitialiser:
```typescript
const patch = useOpenPatch({ ... })
patch.reset()
```

## 🧪 Tests

```bash
npm run dev
```

Ouvrez votre navigateur et testez les 3 modes:
1. Mode automatique (change de version)
2. Mode manuel (boutons)
3. Mode forcé (toujours visible)

## 📝 Structure du projet

```
OpenPatch/
├── src/
│   ├── components/
│   │   └── OpenPatch.vue          # Composant principal
│   ├── composables/
│   │   └── useOpenPatch.ts        # Composable
│   ├── App.vue                    # Démo
│   └── main.ts
├── package.json
└── README.md
```

## 🛠️ Technologies

- **Vue 3** - Framework réactif
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **localStorage** - Persistance

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une PR.

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Créé avec ❤️ pour simplifier la communication des mises à jour
