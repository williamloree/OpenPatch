<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>

        <div
          class="relative w-full max-w-xl max-h-[80vh] rounded-lg shadow-xl overflow-hidden border op-modal"
          :style="customStyles"
        >
          <div class="sticky top-0 z-10 border-b px-6 py-4 op-header">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-semibold truncate op-title">{{ title }}</h2>
                <p class="text-xs mt-0.5 op-version">Version {{ version }}</p>
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
                  <span class="inline-flex items-center px-3 py-1 bg-linear-to-br from-slate-50 to-slate-200 border border-slate-300 rounded-full text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    {{ section.title }}
                  </span>
                </div>

                <ul class="list-none p-0 m-0 flex flex-col gap-2.5 last:mb-5">
                  <li
                    v-for="(item, itemIndex) in section.items"
                    :key="itemIndex"
                    class="flex items-start gap-3 px-3 py-2 rounded-md text-[0.9375rem] leading-relaxed transition-all duration-150 op-item cursor-pointer"
                  >
                    <!-- <span class="inline-block w-1.5 h-1.5 rounded-full mt-2 shrink-0 op-bullet"></span> -->
                    <span class="flex-1 op-item-text">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="text-center text-slate-400 py-12 text-sm">
              Aucun contenu à afficher
            </div>
          </div>

          <div class="sticky bottom-0 border-t px-6 py-4 op-footer">
            <button
              @click="handleClose"
              class="w-full text-sm font-medium py-2.5 px-4 rounded-md transition-colors duration-150 op-button cursor-pointer"
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
import type { PatchNotesConfig, CSSCustomization } from '../types/settings'

interface Props {
  projectId: string
  version: string
  patchnotes: PatchNotesConfig
  title?: string
  closeButtonText?: string
  forceShow?: boolean
  manual?: boolean
  cssCustomization?: CSSCustomization
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

const customStyles = computed(() => {
  if (!props.cssCustomization) return {}

  const styles: Record<string, string> = {}

  if (props.cssCustomization.primaryColor) {
    styles['--op-primary-color'] = props.cssCustomization.primaryColor
  }
  if (props.cssCustomization.backgroundColor) {
    styles['--op-bg-color'] = props.cssCustomization.backgroundColor
  }
  if (props.cssCustomization.textColor) {
    styles['--op-text-color'] = props.cssCustomization.textColor
  }
  if (props.cssCustomization.buttonTextColor) {
    styles['--op-button-text-color'] = props.cssCustomization.buttonTextColor
  }
  if (props.cssCustomization.borderColor) {
    styles['--op-border-color'] = props.cssCustomization.borderColor
  }
  if (props.cssCustomization.accentColor) {
    styles['--op-accent-color'] = props.cssCustomization.accentColor
  }
  if (props.cssCustomization.buttonBackgroundColor) {
    styles['--op-button-bg-color'] = props.cssCustomization.buttonBackgroundColor
  }

  return styles
})

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
/* Variables CSS par défaut */
.op-modal {
  --op-bg-color: #ffffff;
  --op-text-color: #334155;
  --op-primary-color: #0f172a;
  --op-border-color: #e2e8f0;
  --op-accent-color: #cbd5e1;
  --op-button-bg-color: #0f172a;
  --op-button-text-color: #ffffff;

  background-color: var(--op-bg-color);
  border-color: var(--op-border-color);
}

.op-header {
  background-color: var(--op-bg-color);
  border-color: var(--op-border-color);
}

.op-footer {
  background-color: var(--op-bg-color);
  border-color: var(--op-border-color);
}

.op-title {
  color: var(--op-primary-color);
}

.op-version {
  color: var(--op-text-color);
  opacity: 0.7;
}

.op-item {
  background-color: var(--op-bg-color);
  filter: brightness(0.98);
  border-left: 3px solid var(--op-accent-color);
  color: var(--op-text-color);
}

.op-item:hover {
  filter: brightness(0.95);
  border-left-color: var(--op-primary-color);
}

.op-item-text {
  color: var(--op-text-color);
}

.op-bullet {
  background-color: var(--op-accent-color);
}

.op-button {
  background-color: var(--op-button-bg-color);
  color: var(--op-button-text-color);
}

.op-button:hover {
  filter: brightness(0.9);
}

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
</style>
