import { ref, computed } from 'vue'

/**
 * Configuration pour le composable useOpenPatch
 */
export interface OpenPatchConfig {
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
}

/**
 * Données stockées dans localStorage
 */
interface StoredVersion {
  version: string
  timestamp: number
}

/**
 * Composable pour gérer les patchnotes de manière programmatique
 *
 * @example
 * ```ts
 * const { isVisible, show, hide, shouldShow } = useOpenPatch({
 *   projectId: 'my-app',
 *   version: '1.2.0',
 *   content: '<h2>Nouveautés v1.2.0</h2><ul><li>Feature 1</li></ul>'
 * })
 * ```
 */
export function useOpenPatch(config: OpenPatchConfig) {
  const isVisible = ref(false)

  /**
   * Clé de stockage localStorage unique par projet
   */
  const storageKey = computed(() => `openpatch_${config.projectId}_version`)

  /**
   * Récupère la dernière version vue depuis localStorage
   */
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

  /**
   * Sauvegarde la version courante dans localStorage
   */
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

  /**
   * Vérifie si les patchnotes doivent être affichés
   */
  const shouldShow = (): boolean => {
    // Mode forcé pour tests
    if (config.forceShow) return true

    const lastSeenVersion = getLastSeenVersion()

    // Première visite ou pas de version sauvegardée
    if (!lastSeenVersion) return true

    // Nouvelle version détectée
    return lastSeenVersion !== config.version
  }

  /**
   * Affiche la modal des patchnotes
   */
  const show = () => {
    isVisible.value = true
  }

  /**
   * Masque la modal et sauvegarde la version
   */
  const hide = () => {
    isVisible.value = false
    saveCurrentVersion()
  }

  /**
   * Réinitialise le localStorage pour ce projet
   */
  const reset = () => {
    try {
      localStorage.removeItem(storageKey.value)
      console.info('[OpenPatch] Version réinitialisée pour:', config.projectId)
    } catch (error) {
      console.error('[OpenPatch] Erreur suppression localStorage:', error)
    }
  }

  /**
   * Récupère la dernière version vue
   */
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
    /** État de visibilité de la modal */
    isVisible,

    /** Afficher la modal */
    show,

    /** Masquer la modal */
    hide,

    /** Vérifier si doit afficher */
    shouldShow,

    /** Réinitialiser le localStorage */
    reset,

    /** Récupérer les infos de dernière version vue */
    getLastSeen,

    /** Configuration actuelle */
    config
  }
}
