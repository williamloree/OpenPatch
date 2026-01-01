# 🎉 OpenPatch Widget

Widget universel de patchnotes pour Vue 3 avec Tailwind CSS. Affiche automatiquement les notes de version aux utilisateurs uniquement lors d'une nouvelle version.

## ✨ Fonctionnalités

- ✅ **Détection automatique** de nouvelles versions
- 💾 **Stockage localStorage** de la dernière version vue
- 🎨 **Design moderne** avec Tailwind CSS
- 🚀 **Léger et performant**
- 🔧 **Hautement configurable**
- 📱 **Responsive** et mobile-friendly
- 🎯 **Support HTML** dans le contenu
- 🔒 **TypeScript** natif

## 📦 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd OpenPatch

# Installer les dépendances
npm install

# Lancer en dev
npm run dev
```

## 🚀 Utilisation rapide

### Mode 1: Automatique (Recommandé)

Le widget s'affiche automatiquement si une nouvelle version est détectée.

```vue
<template>
  <div>
    <!-- Votre application -->
    <h1>Mon Application</h1>

    <!-- Widget OpenPatch -->
    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :content="patchnotesContent"
    />
  </div>
</template>

<script setup lang="ts">
import OpenPatch from './components/OpenPatch.vue'

const patchnotesContent = `
  <h2>Version 1.2.0</h2>
  <h3>Nouvelles fonctionnalités</h3>
  <ul>
    <li>Ajout du mode sombre</li>
    <li>Export PDF</li>
  </ul>
  <h3>Corrections</h3>
  <ul>
    <li>Fix du bug d'affichage</li>
  </ul>
`
</script>
```

### Mode 2: Manuel (avec composable)

Contrôle total via le composable `useOpenPatch`.

```vue
<template>
  <div>
    <button @click="patch.show()">
      Voir les nouveautés
    </button>

    <button @click="patch.reset()">
      Réinitialiser
    </button>

    <OpenPatch
      project-id="my-app"
      version="1.2.0"
      :content="content"
      manual
    />
  </div>
</template>

<script setup lang="ts">
import { useOpenPatch } from './composables/useOpenPatch'
import OpenPatch from './components/OpenPatch.vue'

const content = '<h2>Mes patchnotes</h2>'

const patch = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0',
  content
})

// Vérifier si doit afficher
if (patch.shouldShow()) {
  patch.show()
}
</script>
```

### Mode 3: Forcé (pour tests)

Affiche toujours la modal, même si déjà vue.

```vue
<OpenPatch
  project-id="my-app"
  version="1.2.0"
  :content="content"
  force-show
/>
```

## 🎛️ Props du composant

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `projectId` | `string` | ✅ | - | Identifiant unique du projet |
| `version` | `string` | ✅ | - | Version courante (semver recommandé) |
| `content` | `string` | ✅ | - | Contenu HTML des patchnotes |
| `title` | `string` | ❌ | `"🎉 Nouveautés"` | Titre de la modal |
| `closeButtonText` | `string` | ❌ | `"Compris !"` | Texte du bouton de fermeture |
| `forceShow` | `boolean` | ❌ | `false` | Forcer l'affichage (tests) |
| `manual` | `boolean` | ❌ | `false` | Désactiver la détection auto |

## 🎯 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | - | Émis quand l'utilisateur ferme la modal |
| `shown` | - | Émis quand la modal s'affiche |

## 🔧 API du composable

```typescript
const {
  isVisible,     // Ref<boolean> - État de visibilité
  show,          // () => void - Afficher la modal
  hide,          // () => void - Masquer la modal
  shouldShow,    // () => boolean - Vérifier si doit afficher
  reset,         // () => void - Réinitialiser localStorage
  getLastSeen,   // () => StoredVersion | null - Dernière version vue
  config         // OpenPatchConfig - Configuration
} = useOpenPatch({
  projectId: 'my-app',
  version: '1.2.0',
  content: '<h2>Patchnotes</h2>'
})
```

## 📚 Exemples avancés

### Avec callbacks

```vue
<OpenPatch
  project-id="my-app"
  version="1.2.0"
  :content="content"
  @close="handleClose"
  @shown="handleShown"
/>

<script setup lang="ts">
const handleClose = () => {
  console.log('Modal fermée')
  // Analytics, etc.
}

const handleShown = () => {
  console.log('Modal affichée')
  // Analytics, etc.
}
</script>
```

### Contenu dynamique

```vue
<script setup lang="ts">
import { computed } from 'vue'

const version = ref('1.2.0')

const content = computed(() => `
  <h2>Version ${version.value}</h2>
  <p>Date: ${new Date().toLocaleDateString()}</p>
  <ul>
    <li>Fonctionnalité 1</li>
    <li>Fonctionnalité 2</li>
  </ul>
`)
</script>

<template>
  <OpenPatch
    project-id="my-app"
    :version="version"
    :content="content"
  />
</template>
```

### Avec fichier externe

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const patchnotes = ref('')

onMounted(async () => {
  const response = await fetch('/patchnotes.html')
  patchnotes.value = await response.text()
})
</script>

<template>
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
