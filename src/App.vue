<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          OpenPatch Widget Demo
        </h1>
        <p class="text-lg text-gray-600">
          Widget universel de patchnotes pour Vue 3
        </p>
      </header>

      <!-- Exemples -->
      <div class="space-y-8">
        <!-- Exemple 1: Mode automatique -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            1️⃣ Mode automatique (recommandé)
          </h2>
          <p class="text-gray-600 mb-4">
            Le widget s'affiche automatiquement si une nouvelle version est détectée.
          </p>
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <code class="text-sm text-gray-800">
              Version actuelle: <strong>{{ currentVersion }}</strong>
            </code>
          </div>
          <button
            @click="changeVersion"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Changer de version (simulation)
          </button>
        </div>

        <!-- Exemple 2: Mode manuel -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            2️⃣ Mode manuel
          </h2>
          <p class="text-gray-600 mb-4">
            Affichage contrôlé par programmation avec le composable.
          </p>
          <div class="flex gap-3">
            <button
              @click="manualPatch.show()"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Afficher les patchnotes
            </button>
            <button
              @click="manualPatch.reset()"
              class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Réinitialiser localStorage
            </button>
          </div>
        </div>

        <!-- Exemple 3: Mode forcé (tests) -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            3️⃣ Mode forcé (pour tests)
          </h2>
          <p class="text-gray-600 mb-4">
            Affiche toujours la modal, même si déjà vue (forceShow: true).
          </p>
          <button
            @click="showForced = true"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Forcer l'affichage
          </button>
        </div>

        <!-- Infos localStorage -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            📊 État localStorage
          </h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <pre class="text-sm text-gray-800">{{ lastSeenInfo }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Widget OpenPatch - Mode automatique -->
    <OpenPatch
      ref="autoPatchRef"
      project-id="demo-app"
      :version="currentVersion"
      :content="patchnotesContent"
      title="🎉 Nouveautés de la version"
      close-button-text="Super, merci !"
      @close="onPatchClosed"
      @shown="onPatchShown"
    />

    <!-- Widget OpenPatch - Mode manuel -->
    <OpenPatch
      ref="manualPatchRef"
      project-id="demo-app-manual"
      version="2.0.0"
      :content="manualContent"
      manual
    />

    <!-- Widget OpenPatch - Mode forcé -->
    <OpenPatch
      v-if="showForced"
      project-id="demo-app-forced"
      version="3.0.0"
      :content="forcedContent"
      force-show
      @close="showForced = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import OpenPatch from './components/OpenPatch.vue'
import { useOpenPatch } from './composables/useOpenPatch'

// Version actuelle (simulée)
const currentVersion = ref('1.2.0')

// Contenu des patchnotes
const patchnotesContent = computed(() => `
  <h2>🚀 Version ${currentVersion.value}</h2>
  <p>Bienvenue dans cette nouvelle version !</p>

  <h3>✨ Nouvelles fonctionnalités</h3>
  <ul>
    <li>Système de notifications en temps réel</li>
    <li>Mode sombre automatique</li>
    <li>Export des données en PDF</li>
  </ul>

  <h3>🔧 Améliorations</h3>
  <ul>
    <li>Performance améliorée de 40%</li>
    <li>Interface utilisateur repensée</li>
    <li>Recherche optimisée</li>
  </ul>

  <h3>🐛 Corrections</h3>
  <ul>
    <li>Correction du bug d'affichage mobile</li>
    <li>Résolution des problèmes de synchronisation</li>
  </ul>
`)

const manualContent = `
  <h2>Mode manuel</h2>
  <p>Ce widget est contrôlé manuellement via le composable <code>useOpenPatch</code>.</p>
  <p>Vous avez le contrôle total sur quand afficher ou masquer la modal.</p>
`

const forcedContent = `
  <h2>Mode forcé</h2>
  <p>Ce widget s'affiche <strong>toujours</strong>, peu importe le localStorage.</p>
  <p>Utile pour les tests et le développement.</p>
`

// Référence pour le mode forcé
const showForced = ref(false)

// Composable pour le mode manuel
const manualPatch = useOpenPatch({
  projectId: 'demo-app-manual',
  version: '2.0.0',
  content: manualContent
})

// Récupère les infos du localStorage
const lastSeenInfo = computed(() => {
  const info = manualPatch.getLastSeen()
  if (!info) {
    return 'Aucune version enregistrée'
  }
  return JSON.stringify(info, null, 2)
})

// Simule un changement de version
const changeVersion = () => {
  const versions = ['1.2.1', '1.3.0', '2.0.0', '2.1.0']
  const currentIndex = versions.indexOf(currentVersion.value)
  const nextIndex = (currentIndex + 1) % versions.length
  const newVersion = versions[nextIndex]
  if (newVersion) {
    currentVersion.value = newVersion
  }
}

// Callbacks
const onPatchClosed = () => {
  console.log('✅ Patchnotes fermés')
}

const onPatchShown = () => {
  console.log('👀 Patchnotes affichés')
}

onMounted(() => {
  console.log('🎯 OpenPatch Demo chargé')
})
</script>
