import type { WindowSettings, JSONConfig } from '../types/settings'

export interface ConfigLoaderOptions {
  jsonUrl?: string
  fallbackSettings?: WindowSettings
}

export async function loadConfig(options: ConfigLoaderOptions = {}): Promise<WindowSettings | null> {
  let jsonConfig: JSONConfig | null = null

  // Step 1: Load from JSON URL if provided (version + patchnotes)
  if (options.jsonUrl) {
    try {
      console.log(`[OpenPatch] Chargement de la configuration depuis ${options.jsonUrl}`)
      const response = await fetch(options.jsonUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      jsonConfig = await response.json() as JSONConfig

      if (!jsonConfig.version || !jsonConfig.patchnotes) {
        throw new Error('Configuration JSON incomplète (version et patchnotes requis)')
      }

      console.log('[OpenPatch] Configuration JSON chargée avec succès')
    } catch (error) {
      console.error('[OpenPatch] Erreur lors du chargement du JSON:', error)
      jsonConfig = null
    }
  }

  // Step 2: Merge with window.Settings (projectId + options + css)
  if (jsonConfig && window.Settings) {
    console.log('[OpenPatch] Fusion de la config JSON avec window.Settings')
    return {
      projectId: window.Settings.projectId,
      version: jsonConfig.version,
      patchnotes: jsonConfig.patchnotes,
      options: window.Settings.options,
      css: window.Settings.css
    }
  }

  // Step 3: Use only window.Settings if no JSON loaded
  if (window.Settings) {
    console.log('[OpenPatch] Utilisation de window.Settings')

    // Validate that window.Settings has required fields
    if (!window.Settings.projectId || !window.Settings.version || !window.Settings.patchnotes) {
      console.error('[OpenPatch] window.Settings incomplet (projectId, version, patchnotes requis)')
      return null
    }

    return window.Settings as WindowSettings
  }

  // Step 4: Use fallback settings if provided
  if (options.fallbackSettings) {
    console.log('[OpenPatch] Utilisation de la configuration de fallback')
    return options.fallbackSettings
  }

  console.error('[OpenPatch] Aucune configuration disponible')
  return null
}
