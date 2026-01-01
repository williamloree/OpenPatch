<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
                <p class="text-sm text-blue-100 mt-1">Version {{ version }}</p>
              </div>
              <button
                @click="handleClose"
                class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content with HTML support -->
          <div class="overflow-y-auto max-h-[calc(85vh-88px)] px-6 py-6">
            <div
              v-if="content"
              class="prose prose-sm max-w-none text-gray-700"
              v-html="sanitizedContent"
            ></div>

            <!-- Fallback if no content -->
            <div v-else class="text-center text-gray-500 py-8">
              Aucun contenu à afficher
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              @click="handleClose"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {{ closeButtonText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

/**
 * Props du composant OpenPatch
 */
interface Props {
  /** Identifiant unique du projet */
  projectId: string

  /** Version courante (format semver recommandé: 1.2.3) */
  version: string

  /** Contenu des patchnotes (supporte HTML) */
  content: string

  /** Titre personnalisé de la modal */
  title?: string

  /** Texte du bouton de fermeture */
  closeButtonText?: string

  /** Forcer l'affichage même si déjà vu (pour tests) */
  forceShow?: boolean

  /** Désactiver la détection automatique */
  manual?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '🎉 Nouveautés',
  closeButtonText: 'Compris !',
  forceShow: false,
  manual: false
})

/**
 * Events émis par le composant
 */
const emit = defineEmits<{
  close: []
  shown: []
}>()

// État de visibilité de la modal
const isVisible = ref(false)

/**
 * Clé de stockage localStorage unique par projet
 */
const storageKey = computed(() => `openpatch_${props.projectId}_version`)

/**
 * Récupère la dernière version vue depuis localStorage
 */
const getLastSeenVersion = (): string | null => {
  try {
    const stored = localStorage.getItem(storageKey.value)
    if (!stored) return null

    const data = JSON.parse(stored)
    return data.version || null
  } catch (error) {
    console.warn('[OpenPatch] Erreur lecture localStorage:', error)
    return null
  }
}

/**
 * Sauvegarde la version courante dans localStorage
 */
const saveCurrentVersion = () => {
  try {
    const data = {
      version: props.version,
      timestamp: Date.now()
    }
    localStorage.setItem(storageKey.value, JSON.stringify(data))
  } catch (error) {
    console.error('[OpenPatch] Erreur sauvegarde localStorage:', error)
  }
}

/**
 * Vérifie si une nouvelle version est disponible
 */
const shouldShowPatchNotes = (): boolean => {
  // Mode forcé pour tests
  if (props.forceShow) return true

  const lastSeenVersion = getLastSeenVersion()

  // Première visite ou pas de version sauvegardée
  if (!lastSeenVersion) return true

  // Nouvelle version détectée
  return lastSeenVersion !== props.version
}

/**
 * Sanitize basique du contenu HTML (à améliorer avec une lib comme DOMPurify en prod)
 */
const sanitizedContent = computed(() => {
  // En production, utilisez DOMPurify pour une vraie sanitization
  // import DOMPurify from 'dompurify'
  // return DOMPurify.sanitize(props.content)

  return props.content
})

/**
 * Gère la fermeture de la modal
 */
const handleClose = () => {
  isVisible.value = false
  saveCurrentVersion()
  emit('close')
}

/**
 * Affiche manuellement la modal (pour mode manual)
 */
const show = () => {
  isVisible.value = true
  emit('shown')
}

/**
 * Masque manuellement la modal
 */
const hide = () => {
  handleClose()
}

/**
 * Réinitialise le localStorage pour ce projet
 */
const reset = () => {
  try {
    localStorage.removeItem(storageKey.value)
  } catch (error) {
    console.error('[OpenPatch] Erreur suppression localStorage:', error)
  }
}

// Exposition des méthodes pour utilisation externe
defineExpose({
  show,
  hide,
  reset
})

/**
 * Détection automatique au montage
 */
onMounted(() => {
  if (!props.manual && shouldShowPatchNotes()) {
    // Petit délai pour une meilleure UX
    setTimeout(() => {
      show()
    }, 500)
  }
})

/**
 * Watch des changements de version (hot reload, etc.)
 */
watch(() => props.version, (newVersion, oldVersion) => {
  if (!props.manual && newVersion !== oldVersion && shouldShowPatchNotes()) {
    show()
  }
})
</script>

<style scoped>
/* Animations de transition */
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

/* Styles pour le contenu HTML (prose) */
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #111827;
}

.prose h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.prose h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose strong {
  font-weight: 600;
  color: #111827;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}
</style>
