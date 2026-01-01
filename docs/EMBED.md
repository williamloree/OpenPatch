# 🚀 OpenPatch - Mode Embed (Standalone)

Guide complet pour intégrer OpenPatch sur n'importe quel site web via un simple script.

## 📋 Table des matières

- [Installation rapide](#installation-rapide)
- [Configuration](#configuration)
- [API JavaScript](#api-javascript)
- [Exemples](#exemples)
- [Build et déploiement](#build-et-déploiement)

## ⚡ Installation rapide

Copiez ce code dans votre HTML **avant la fermeture de `</body>`**:

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Mon Site</title>
  </head>
  <body>
    <!-- Votre contenu -->
    <div id="app">
      <h1>Mon Application</h1>
    </div>

    <!-- Configuration OpenPatch -->
    <script>
      window.Settings = {
        projectId: "my-project",
        version: "1.2.0",
        patchnotes: {
          title: "Nouveautés",
          sections: [
            {
              title: "Fonctionnalités",
              items: ["Feature 1", "Feature 2"],
            },
            {
              title: "Corrections",
              items: ["Bug fix 1", "Bug fix 2"],
            },
          ],
        },
      };

      // Chargement du widget
      (function (d, s, x) {
        var t = d.getElementsByTagName(s)[0],
          e = d.createElement(s),
          l = d.createElement(x);
        var io = "https://open-patch.fr/";
        var h = d.getElementsByTagName("head")[0];
        e.type = "module";
        e.src = io + "openpatch.es.js";
        l.rel = "stylesheet";
        l.type = "text/css";
        l.href = io + "openpatch.css";
        t.parentNode.insertBefore(e, t);
        h.appendChild(l);
      })(document, "script", "link");
    </script>
  </body>
</html>
```

## ⚙️ Configuration

### Structure de `window.Settings`

```typescript
window.Settings = {
  // REQUIS
  projectId: string       // Identifiant unique de votre projet
  version: string         // Version courante (semver recommandé)
  patchnotes: {
    title: string         // Titre principal
    sections: [
      {
        title: string     // Titre de la section
        items: string[]   // Liste des éléments
      }
    ]
  }

  // OPTIONNEL
  options: {
    closeButtonText?: string    // Texte du bouton (défaut: "Compris !")
    forceShow?: boolean         // Toujours afficher (défaut: false)
  }
}
```

### Exemple complet

```javascript
window.Settings = {
  projectId: "my-awesome-app",
  version: "2.1.0",
  patchnotes: {
    title: "🎉 Nouveautés v2.1.0",
    sections: [
      {
        title: "✨ Nouvelles fonctionnalités",
        items: [
          "Dashboard de statistiques",
          "Notifications en temps réel",
          "Mode sombre",
          "Export PDF/Excel",
        ],
      },
      {
        title: "🔧 Améliorations",
        items: [
          "Performance +40%",
          "Interface repensée",
          "Recherche optimisée",
        ],
      },
      {
        title: "🐛 Corrections",
        items: [
          "Bug d'affichage mobile",
          "Problèmes de synchronisation",
          "Erreurs de validation",
        ],
      },
    ],
  },
  options: {
    closeButtonText: "Super, merci !",
    forceShow: false, // true pour tests
  },
};
```

## 🎮 API JavaScript

Une fois le widget chargé, vous avez accès à l'API globale `window.OpenPatch`:

### Méthodes disponibles

```javascript
// Afficher manuellement le widget
window.OpenPatch.show();

// Masquer le widget
window.OpenPatch.hide();

// Réinitialiser le localStorage (affichera à nouveau)
window.OpenPatch.reset();
```

### Exemples d'utilisation

```html
<!-- Bouton pour afficher les patchnotes -->
<button onclick="window.OpenPatch.show()">Voir les nouveautés</button>

<!-- Bouton pour réinitialiser -->
<button onclick="window.OpenPatch.reset()">
  Réinitialiser les patchnotes
</button>
```

### Vérifier si le widget est chargé

```javascript
// Attendre que le widget soit disponible
document.addEventListener("DOMContentLoaded", () => {
  if (window.OpenPatch) {
    console.log("OpenPatch est chargé!");

    // Afficher programmatiquement
    // window.OpenPatch.show()
  }
});
```

## 📚 Exemples

### Exemple 1: Site statique simple

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mon Site</title>
  </head>
  <body>
    <h1>Bienvenue</h1>

    <script>
      window.Settings = {
        projectId: "static-site",
        version: "1.0.0",
        patchnotes: {
          title: "Version 1.0.0",
          sections: [
            {
              title: "Lancement",
              items: ["Première version du site"],
            },
          ],
        },
      };

      (function (d, s, x) {
        var t = d.getElementsByTagName(s)[0],
          e = d.createElement(s),
          l = d.createElement(x);
        var io = "https://cdn.jsdelivr.net/npm/openpatch/dist/";
        var h = d.getElementsByTagName("head")[0];
        e.type = "module";
        e.src = io + "openpatch.es.js";
        l.rel = "stylesheet";
        l.href = io + "openpatch.css";
        t.parentNode.insertBefore(e, t);
        h.appendChild(l);
      })(document, "script", "link");
    </script>
  </body>
</html>
```

### Exemple 2: Avec contrôles manuels

```html
<body>
  <button onclick="window.OpenPatch?.show()">Afficher</button>
  <button onclick="window.OpenPatch?.hide()">Masquer</button>
  <button onclick="window.OpenPatch?.reset()">Reset</button>

  <script>
    window.Settings = {
      projectId: "manual-app",
      version: "1.0.0",
      patchnotes: {
        title: "Patchnotes",
        sections: [{ title: "Info", items: ["Test"] }],
      },
      options: {
        forceShow: false, // Ne pas afficher automatiquement
      },
    };

    // Script de chargement...
  </script>
</body>
```

### Exemple 3: Version dynamique depuis le serveur

```html
<script>
  // Récupérer la version depuis votre API
  fetch("/api/version")
    .then((res) => res.json())
    .then((data) => {
      window.Settings = {
        projectId: "dynamic-app",
        version: data.version,
        patchnotes: data.patchnotes,
      };

      // Charger le widget après configuration
      loadOpenPatch();
    });

  function loadOpenPatch() {
    (function (d, s, x) {
      // ... code de chargement
    })(document, "script", "link");
  }
</script>
```

## 🏗️ Build et déploiement

### 1. Générer le bundle

```bash
npm run build:standalone
```

Génère dans `dist/`:

- `openpatch.es.js` - Module ES (recommandé)
- `openpatch.umd.js` - Universal Module Definition
- `openpatch.css` - Styles du widget

### 2. Déployer sur un CDN

Uploadez les fichiers du dossier `dist/` sur votre CDN ou serveur:

```
https://votre-cdn.com/
  ├── openpatch.es.js
  ├── openpatch.umd.js
  └── openpatch.css
```

### 3. Mettre à jour l'URL dans le script

```javascript
var io = "https://votre-cdn.com/";
```

## 🔒 Bonnes pratiques

### Sécurité

- ✅ Utilisez HTTPS pour charger le widget
- ✅ Validez les données de `window.Settings` côté serveur
- ✅ Ne stockez jamais de données sensibles dans `window.Settings`

### Performance

- ✅ Chargez le widget en mode `async` ou à la fin du `<body>`
- ✅ Utilisez un CDN pour le fichier JS et CSS
- ✅ Activez la compression gzip/brotli sur votre serveur

### Versioning

```javascript
// Bonne pratique: utiliser semver
version: "1.2.0"  // ✅
version: "v1.2.0" // ❌
version: "1.2"    // ❌
```

### localStorage

Le widget stocke la version dans:

```
localStorage.openpatch_${projectId}_version
```

Pour forcer l'affichage:

```javascript
// Option 1: Via configuration
options: { forceShow: true }

// Option 2: Reset localStorage
window.OpenPatch?.reset()

// Option 3: Incrémenter la version
version: "1.2.1" // Au lieu de 1.2.0
```

## 🎨 Personnalisation

Le widget utilise Tailwind CSS. Pour personnaliser:

1. Forkez le projet
2. Modifiez `src/components/OpenPatch.vue`
3. Rebuild avec `npm run build:standalone`
4. Déployez votre version personnalisée

## 🐛 Debugging

### Le widget ne s'affiche pas

```javascript
// 1. Vérifier que window.Settings est défini
console.log(window.Settings);

// 2. Vérifier que le widget est chargé
console.log(window.OpenPatch);

// 3. Vérifier le localStorage
console.log(localStorage.getItem("openpatch_my-project_version"));

// 4. Forcer l'affichage
window.Settings.options = { forceShow: true };
```

### Erreurs dans la console

```javascript
// "[OpenPatch] window.Settings n'est pas défini"
// → Définir window.Settings AVANT le chargement du script

// "[OpenPatch] Configuration incomplète"
// → Vérifier projectId, version et patchnotes
```

## 📞 Support

- Documentation complète: [README.md](./README.md)
- Issues: GitHub
- Exemples: [examples/](./examples/)

---

Créé avec ❤️ pour simplifier la communication des mises à jour
