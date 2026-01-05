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
            Mode automatique
          </h2>
          <p class="text-gray-600 mb-4">
            Le widget s'affiche automatiquement si une nouvelle version est
            détectée.
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
      v-if="patchnotesConfig"
      ref="autoPatchRef"
      project-id="demo-app"
      :version="currentVersion"
      :patchnotes="patchnotesConfig"
      :title="patchnotesConfig.title"
      :close-button-text="closeButtonText"
      :css-customization="cssCustomization"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import OpenPatch from "./components/OpenPatch.vue";
import type { PatchNotesConfig, CSSCustomization } from "./types/settings";

const currentVersion = ref("1.4.0");

const patchnotesConfig = ref<PatchNotesConfig | null>(window?.Settings?.patchnotes || null);
const closeButtonText = ref(window.Settings?.options?.closeButtonText || 'Fermer');
const cssCustomization = ref<CSSCustomization | undefined>(window?.Settings?.css);

const lastSeenInfo = computed(() => {
  try {
    const stored = localStorage.getItem("openpatch_demo-app_version");
    if (!stored) return "Aucune version enregistrée";
    return JSON.parse(stored);
  } catch {
    return "Erreur de lecture";
  }
});

const changeVersion = () => {
  const versions = ["1.4.0", "1.4.1", "1.5.0", "2.0.0"];
  const currentIndex = versions.indexOf(currentVersion.value);
  const nextIndex = (currentIndex + 1) % versions.length;
  const newVersion = versions[nextIndex];
  if (newVersion) {
    currentVersion.value = newVersion;
  }
};
</script>
