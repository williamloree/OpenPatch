<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>

        <div class="relative w-full max-w-xl max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200/60">
          <div class="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold text-slate-900 truncate">{{ title }}</h2>
                <p class="text-xs text-slate-500 mt-0.5">Version {{ version }}</p>
              </div>
              <button
                @click="handleClose"
                class="shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md p-1.5 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="overflow-y-auto max-h-[calc(80vh-140px)] px-6 py-5">
            <div v-if="patchnotes && patchnotes.sections.length > 0">
              <div
                v-for="(section, index) in patchnotes.sections"
                :key="index"
                :class="{ 'mb-7': index < patchnotes.sections.length - 1 }"
              >
                <div class="flex items-center gap-3 mb-3">
                  <span class="inline-flex items-center px-3 py-1 bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {{ section.title }}
                  </span>
                </div>

                <ul class="list-none p-0 m-0 flex flex-col gap-2.5">
                  <li
                    v-for="(item, itemIndex) in section.items"
                    :key="itemIndex"
                    class="flex items-start gap-3 px-4 py-2.5 bg-slate-50 border-l-[3px] border-slate-300 rounded-md text-[0.9375rem] text-slate-600 leading-relaxed transition-all duration-150 hover:bg-slate-100 hover:border-slate-400"
                  >
                    <span class="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></span>
                    <span class="flex-1">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="text-center text-slate-400 py-12 text-sm">
              Aucun contenu à afficher
            </div>
          </div>

          <div class="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4">
            <button
              @click="handleClose"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors duration-150"
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
import { ref, onMounted, watch } from 'vue'
import type { PatchNotesConfig } from '../types/settings'

interface Props {
  projectId: string
  version: string
  patchnotes: PatchNotesConfig
  title?: string
  closeButtonText?: string
  forceShow?: boolean
  manual?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '🎉 Nouveautés',
  closeButtonText: 'Compris !',
  forceShow: false,
  manual: false
})

interface Emits {
  (e: 'close'): void
  (e: 'shown'): void
}

const emit = defineEmits<Emits>()

const isVisible = ref(false)

const STORAGE_KEY_PREFIX = 'openpatch_last_seen_'

const getStorageKey = () => `${STORAGE_KEY_PREFIX}${props.projectId}`

const getLastSeenVersion = (): string | null => {
  try {
    return localStorage.getItem(getStorageKey())
  } catch (error) {
    console.error('[OpenPatch] Erreur lecture localStorage:', error)
    return null
  }
}

const saveLastSeenVersion = () => {
  try {
    localStorage.setItem(getStorageKey(), props.version)
  } catch (error) {
    console.error('[OpenPatch] Erreur sauvegarde localStorage:', error)
  }
}

const shouldShowPatchNotes = (): boolean => {
  if (props.forceShow) return true
  const lastSeenVersion = getLastSeenVersion()
  if (!lastSeenVersion) return true
  return lastSeenVersion !== props.version
}

const handleClose = () => {
  isVisible.value = false
  saveLastSeenVersion()
  emit('close')
}

const show = () => {
  isVisible.value = true
  emit('shown')
}

const hide = () => {
  isVisible.value = false
}

const reset = () => {
  try {
    localStorage.removeItem(getStorageKey())
    console.log('[OpenPatch] LocalStorage réinitialisé pour', props.projectId)
  } catch (error) {
    console.error('[OpenPatch] Erreur reset localStorage:', error)
  }
}

defineExpose({
  show,
  hide,
  reset,
  isVisible
})

onMounted(() => {
  if (!props.manual && shouldShowPatchNotes()) {
    isVisible.value = true
    emit('shown')
  }
})

watch(() => props.version, (newVersion, oldVersion) => {
  if (!props.manual && newVersion !== oldVersion && shouldShowPatchNotes()) {
    isVisible.value = true
    emit('shown')
  }
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
