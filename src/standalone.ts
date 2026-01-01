/**
 * Point d'entrée standalone pour utilisation via script embed
 * S'initialise automatiquement avec window.Settings
 */

import { createApp } from 'vue'
import OpenPatch from './components/OpenPatch.vue'
import type { WindowSettings, PatchNotesConfig } from './types/settings'
import './style.css'

/**
 * Convertit la config patchnotes en HTML
 */
function convertPatchnotesToHTML(patchnotes: PatchNotesConfig): string {
  let html = `<h2>${patchnotes.title}</h2>`

  patchnotes.sections.forEach(section => {
    html += `<h3>${section.title}</h3>`
    html += '<ul>'
    section.items.forEach(item => {
      html += `<li>${item}</li>`
    })
    html += '</ul>'
  })

  return html
}

/**
 * Initialise le widget OpenPatch
 */
function initOpenPatch() {
  // Vérifie que window.Settings existe
  if (!window.Settings) {
    console.error('[OpenPatch] window.Settings n\'est pas défini')
    return
  }

  const settings: WindowSettings = window.Settings

  // Validation des données requises
  if (!settings.projectId || !settings.version || !settings.patchnotes) {
    console.error('[OpenPatch] Configuration incomplète dans window.Settings')
    return
  }

  // Créer un conteneur pour le widget
  const container = document.createElement('div')
  container.id = 'openpatch-widget-container'
  document.body.appendChild(container)

  // Convertir les patchnotes en HTML
  const htmlContent = convertPatchnotesToHTML(settings.patchnotes)

  // Créer l'instance Vue
  const app = createApp(OpenPatch, {
    projectId: settings.projectId,
    version: settings.version,
    content: htmlContent,
    title: settings.options?.closeButtonText ? undefined : settings.patchnotes.title,
    closeButtonText: settings.options?.closeButtonText || 'Compris !',
    forceShow: settings.options?.forceShow || false,
    onClose: () => {
      console.log('[OpenPatch] Modal fermée')
    },
    onShown: () => {
      console.log('[OpenPatch] Modal affichée')
    }
  })

  // Monter le widget
  const instance = app.mount(container)

  // Exposer l'API publique
  window.OpenPatch = {
    show: () => {
      if (instance && typeof instance.show === 'function') {
        instance.show()
      }
    },
    hide: () => {
      if (instance && typeof instance.hide === 'function') {
        instance.hide()
      }
    },
    reset: () => {
      if (instance && typeof instance.reset === 'function') {
        instance.reset()
      }
    }
  }

  console.log('[OpenPatch] Widget initialisé avec succès')
}

// Auto-initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOpenPatch)
} else {
  // DOM déjà chargé
  initOpenPatch()
}
