# 🚀 Guide de déploiement OpenPatch

Guide complet pour déployer le widget OpenPatch avec gestion CORS.

## 📋 Prérequis

1. Build du projet
2. Accès à un serveur web ou CDN
3. Configuration CORS activée

## 🔨 Build du projet

```bash
# Générer les fichiers de production
npm run build:standalone
```

Fichiers générés dans `dist/`:
- `openpatch.es.js` - Bundle ES Module (recommandé)
- `openpatch.umd.js` - Bundle UMD (compatibilité)
- `openpatch.css` - Styles du widget

## 🌐 Options de déploiement

### Option 1: GitHub Pages (Gratuit + CORS activé)

**Avantages:** Gratuit, CORS activé par défaut, CDN rapide

1. Créer un repo GitHub
2. Activer GitHub Pages
3. Uploader le dossier `dist/`

```bash
# Exemple avec gh-pages
npm install -g gh-pages

# Déployer
gh-pages -d dist
```

URL finale: `https://votreusername.github.io/openpatch/openpatch.es.js`

### Option 2: Netlify (Gratuit + CORS)

**Avantages:** Gratuit, CORS activé, déploiement automatique

1. Créer un compte sur [Netlify](https://netlify.com)
2. Drag & drop le dossier `dist/`
3. Configurer les headers CORS

Créer `netlify.toml` à la racine:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"
```

### Option 3: Vercel (Gratuit + CORS)

**Avantages:** Gratuit, CORS facile, déploiement Git

1. Installer Vercel CLI
```bash
npm i -g vercel
```

2. Déployer
```bash
cd dist
vercel --prod
```

3. Créer `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" }
      ]
    }
  ]
}
```

### Option 4: Cloudflare Pages (Gratuit + CORS)

1. Connecter votre repo GitHub
2. Build command: `npm run build:standalone`
3. Output directory: `dist`
4. Créer `_headers`:

```
/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

### Option 5: Serveur Apache

Uploader les fichiers via FTP et créer `.htaccess`:

```apache
# .htaccess dans le dossier dist/
<IfModule mod_headers.c>
    # Activer CORS pour tous les domaines
    Header set Access-Control-Allow-Origin "*"

    # Ou restreindre à certains domaines
    # Header set Access-Control-Allow-Origin "https://monsite.com"

    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"

    # Cache pour performance
    <FilesMatch "\.(js|css)$">
        Header set Cache-Control "public, max-age=31536000"
    </FilesMatch>
</IfModule>

# Compression gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>
```

### Option 6: Serveur Nginx

Configuration `/etc/nginx/sites-available/openpatch`:

```nginx
server {
    listen 80;
    server_name patch.williamloree.fr;

    root /var/www/openpatch/dist;
    index index.html;

    # CORS Headers
    location ~* \.(js|css)$ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";

        # Cache
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types application/javascript text/css;
    gzip_min_length 1000;
}
```

Recharger Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Option 7: jsDelivr (CDN npm gratuit)

Si vous publiez sur npm:

1. Publier le package:
```bash
npm publish
```

2. Utiliser jsDelivr:
```html
<script>
  var io = "https://cdn.jsdelivr.net/npm/openpatch@latest/dist/";
</script>
```

### Option 8: unpkg (CDN npm gratuit)

```html
<script>
  var io = "https://unpkg.com/openpatch@latest/dist/";
</script>
```

## 🧪 Tester la configuration CORS

### Test 1: Vérifier les headers

```bash
curl -I https://patch.williamloree.fr/openpatch.es.js
```

Vous devez voir:
```
Access-Control-Allow-Origin: *
```

### Test 2: Test depuis un navigateur

```html
<!DOCTYPE html>
<html>
<head><title>Test CORS</title></head>
<body>
  <script>
    fetch('https://patch.williamloree.fr/openpatch.es.js')
      .then(r => r.text())
      .then(text => console.log('✅ CORS OK', text.length))
      .catch(err => console.error('❌ CORS Error', err))
  </script>
</body>
</html>
```

### Test 3: Outil en ligne

Tester sur: https://www.test-cors.org/

## 🔐 Sécurité CORS

### CORS ouvert (développement/CDN public)

```apache
Header set Access-Control-Allow-Origin "*"
```

✅ Avantages: Fonctionne partout
❌ Inconvénients: Accessible depuis n'importe quel site

### CORS restreint (production)

```apache
# Autoriser seulement certains domaines
SetEnvIf Origin "^https://(www\.)?monsite\.com$" ORIGIN_ALLOWED=$0
Header set Access-Control-Allow-Origin "%{ORIGIN_ALLOWED}e" env=ORIGIN_ALLOWED
```

Ou avec Nginx:
```nginx
set $cors_origin "";
if ($http_origin ~* "^https://(www\.)?monsite\.com$") {
    set $cors_origin $http_origin;
}
add_header Access-Control-Allow-Origin $cors_origin;
```

## 📊 Monitoring

### Vérifier les erreurs CORS

Dans Chrome DevTools > Console, cherchez:
```
Access to script at '...' has been blocked by CORS policy
```

### Headers de débogage

```apache
# Ajouter temporairement pour débug
Header set X-Debug-CORS "enabled"
```

## 🚀 Solution rapide pour votre cas

**Pour `patch.williamloree.fr`**, ajoutez dans votre `.htaccess`:

```apache
<IfModule mod_headers.c>
    # CORS pour tous les domaines
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"

    # Cache navigateur
    <FilesMatch "\.(js|css)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/javascript text/css
</IfModule>

# Types MIME
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
</IfModule>
```

Ou si vous utilisez **cPanel**:

1. Aller dans "Gestionnaire de fichiers"
2. Naviguer vers le dossier contenant les fichiers JS/CSS
3. Créer/éditer `.htaccess` avec le contenu ci-dessus
4. Sauvegarder

## ✅ Checklist de déploiement

- [ ] Build du projet (`npm run build:standalone`)
- [ ] Upload des fichiers vers le serveur
- [ ] Configuration CORS ajoutée
- [ ] Test CORS avec `curl -I`
- [ ] Test depuis un navigateur externe
- [ ] Compression gzip activée
- [ ] Cache headers configurés
- [ ] URL mise à jour dans les exemples

## 🆘 Dépannage

### Erreur: "No 'Access-Control-Allow-Origin' header"

➡️ Headers CORS manquants → Vérifier configuration serveur

### Erreur: "MIME type mismatch"

➡️ Type MIME incorrect → Ajouter `AddType application/javascript .js`

### Erreur: 404 Not Found

➡️ Fichier introuvable → Vérifier le chemin et les permissions

### Headers CORS pas appliqués

➡️ Module Apache non activé:
```bash
sudo a2enmod headers
sudo systemctl restart apache2
```

## 📞 Support

Si vous avez besoin d'aide avec la configuration CORS de votre serveur, fournissez:
- Type de serveur (Apache, Nginx, etc.)
- Accès au fichier de config
- Message d'erreur exact

---

✨ Une fois déployé avec CORS, le widget fonctionnera sur tous les sites!
