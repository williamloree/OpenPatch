<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal -->
        <div class="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">🎉 Nouveautés</h2>
                <p class="text-sm text-blue-100 mt-1">Découvrez les dernières améliorations</p>
              </div>
              <button
                @click="close"
                class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto max-h-[calc(85vh-88px)] px-6 py-6 space-y-6">
            <div
              v-for="patch in patchNotes"
              :key="patch.version"
              class="border-l-4 border-blue-500 pl-4"
            >
              <!-- Version Header -->
              <div class="flex items-center gap-3 mb-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  v{{ patch.version }}
                </span>
                <span class="text-sm text-gray-500">{{ patch.date }}</span>
              </div>

              <!-- Changes by category -->
              <div class="space-y-4">
                <!-- New Features -->
                <div v-if="patch.features?.length">
                  <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <span class="text-green-500">✨</span>
                    Nouvelles fonctionnalités
                  </h4>
                  <ul class="space-y-1.5 ml-6">
                    <li
                      v-for="(feature, idx) in patch.features"
                      :key="idx"
                      class="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Improvements -->
                <div v-if="patch.improvements?.length">
                  <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <span class="text-blue-500">🚀</span>
                    Améliorations
                  </h4>
                  <ul class="space-y-1.5 ml-6">
                    <li
                      v-for="(improvement, idx) in patch.improvements"
                      :key="idx"
                      class="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span class="text-blue-500 mt-0.5">•</span>
                      <span>{{ improvement }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Bug Fixes -->
                <div v-if="patch.fixes?.length">
                  <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <span class="text-orange-500">🐛</span>
                    Corrections
                  </h4>
                  <ul class="space-y-1.5 ml-6">
                    <li
                      v-for="(fix, idx) in patch.fixes"
                      :key="idx"
                      class="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span class="text-orange-500 mt-0.5">•</span>
                      <span>{{ fix }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              @click="close"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Compris !
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  patchNotes: {
    type: Array,
    default: () => [
      {
        version: '2.1.0',
        date: '1 janvier 2026',
        features: [
          'Ajout du mode sombre pour une meilleure expérience nocturne',
          'Nouveau système de notifications en temps réel',
          'Export des données en PDF et Excel'
        ],
        improvements: [
          'Performance améliorée de 40% sur le chargement des listes',
          'Interface utilisateur repensée et plus intuitive',
          'Recherche optimisée avec suggestions intelligentes'
        ],
        fixes: [
          'Correction du bug d\'affichage sur mobile',
          'Résolution des problèmes de synchronisation',
          'Correction des erreurs de validation du formulaire'
        ]
      },
      {
        version: '2.0.5',
        date: '15 décembre 2025',
        improvements: [
          'Temps de réponse API réduit de 30%',
          'Mise à jour des dépendances de sécurité'
        ],
        fixes: [
          'Correction du crash au démarrage sur certains navigateurs',
          'Résolution du problème de timeout sur les gros fichiers'
        ]
      }
    ]
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

const close = () => {
  isOpen.value = false
  emit('update:modelValue', false)
}

// Watch for external changes
import { watch } from 'vue'
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(-20px);
}
</style>