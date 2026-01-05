import type { WindowSettings, OpenPatchConfig } from '../types/settings'

/**
 * Charge la configuration depuis un fichier JSON ou window.Settings
 */
export async function loadConfig(options: OpenPatchConfig): Promise<WindowSettings | null> {
  // Essayer de charger depuis JSON si une URL est fournie
  if (options.jsonUrl) {
    try {
      const response = await fetch(options.jsonUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const config = await response.json() as WindowSettings
      console.log('[OpenPatch] Configuration chargée depuis JSON')
      return config
    } catch (error) {
      console.warn('[OpenPatch] Erreur chargement JSON, fallback vers window.Settings:', error)
    }
  }

  // Fallback vers window.Settings
  if (window.Settings) {
    console.log('[OpenPatch] Configuration chargée depuis window.Settings')
    return window.Settings
  }

  console.error('[OpenPatch] Aucune configuration trouvée')
  return null
}
