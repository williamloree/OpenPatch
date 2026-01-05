import { ref, computed } from 'vue'
import type { PatchNotesConfig, CSSCustomization } from '../types/settings'

export interface OpenPatchConfig {
  projectId: string
  version: string
  patchnotes: PatchNotesConfig
  title?: string
  closeButtonText?: string
  forceShow?: boolean
  cssCustomization?: CSSCustomization
}

interface StoredVersion {
  version: string
  timestamp: number
}

export function useOpenPatch(config: OpenPatchConfig) {
  const isVisible = ref(false)

  const storageKey = computed(() => `openpatch_${config.projectId}_version`)

  const getLastSeenVersion = (): string | null => {
    try {
      const stored = localStorage.getItem(storageKey.value)
      if (!stored) return null

      const data: StoredVersion = JSON.parse(stored)
      return data.version || null
    } catch (error) {
      console.warn('[OpenPatch] Erreur lecture localStorage:', error)
      return null
    }
  }

  const saveCurrentVersion = () => {
    try {
      const data: StoredVersion = {
        version: config.version,
        timestamp: Date.now()
      }
      localStorage.setItem(storageKey.value, JSON.stringify(data))
    } catch (error) {
      console.error('[OpenPatch] Erreur sauvegarde localStorage:', error)
    }
  }

  const shouldShow = (): boolean => {
    if (config.forceShow) return true

    const lastSeenVersion = getLastSeenVersion()

    if (!lastSeenVersion) return true

    return lastSeenVersion !== config.version
  }

  const show = () => {
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
    saveCurrentVersion()
  }

  const reset = () => {
    try {
      localStorage.removeItem(storageKey.value)
      console.info('[OpenPatch] Version réinitialisée pour:', config.projectId)
    } catch (error) {
      console.error('[OpenPatch] Erreur suppression localStorage:', error)
    }
  }

  const getLastSeen = (): StoredVersion | null => {
    try {
      const stored = localStorage.getItem(storageKey.value)
      if (!stored) return null
      return JSON.parse(stored)
    } catch (error) {
      console.warn('[OpenPatch] Erreur lecture localStorage:', error)
      return null
    }
  }

  return {
    isVisible,
    show,
    hide,
    shouldShow,
    reset,
    getLastSeen,
    config
  }
}
