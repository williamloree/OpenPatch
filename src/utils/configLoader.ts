import type { WindowSettings } from '../types/settings'

export interface ConfigLoaderOptions {
  jsonUrl?: string
  fallbackSettings?: WindowSettings
}

export async function loadConfig(options: ConfigLoaderOptions = {}): Promise<WindowSettings | null> {
  // Priority 1: Load from JSON URL if provided
  if (options.jsonUrl) {
    try {
      console.log(`[OpenPatch] Chargement de la configuration depuis ${options.jsonUrl}`)
      const response = await fetch(options.jsonUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const jsonConfig = await response.json() as WindowSettings

      // Validate required fields
      if (!jsonConfig.projectId || !jsonConfig.version || !jsonConfig.patchnotes) {
        throw new Error('Configuration JSON incomplète (projectId, version, patchnotes requis)')
      }

      console.log('[OpenPatch] Configuration JSON chargée avec succès')
      return jsonConfig
    } catch (error) {
      console.error('[OpenPatch] Erreur lors du chargement du JSON:', error)

      // Fallback to window.Settings or fallbackSettings
      if (options.fallbackSettings) {
        console.warn('[OpenPatch] Utilisation de la configuration de fallback')
        return options.fallbackSettings
      }
    }
  }

  // Priority 2: Use window.Settings if available
  if (window.Settings) {
    console.log('[OpenPatch] Utilisation de window.Settings')
    return window.Settings
  }

  // Priority 3: Use fallback settings if provided
  if (options.fallbackSettings) {
    console.log('[OpenPatch] Utilisation de la configuration de fallback')
    return options.fallbackSettings
  }

  console.error('[OpenPatch] Aucune configuration disponible')
  return null
}
