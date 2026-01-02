import { createApp } from 'vue'
import OpenPatch from './components/OpenPatch.vue'
import type { WindowSettings } from './types/settings'
import './style.css'

function initOpenPatch() {
  if (!window.Settings) {
    console.error('[OpenPatch] window.Settings n\'est pas défini')
    return
  }

  const settings: WindowSettings = window.Settings

  if (!settings.projectId || !settings.version || !settings.patchnotes) {
    console.error('[OpenPatch] Configuration incomplète dans window.Settings')
    return
  }

  const container = document.createElement('div')
  container.id = 'openpatch-widget-container'
  document.body.appendChild(container)

  const app = createApp(OpenPatch, {
    projectId: settings.projectId,
    version: settings.version,
    patchnotes: settings.patchnotes,
    title: settings.patchnotes.title,
    closeButtonText: settings.options?.closeButtonText || 'Compris !',
    forceShow: settings.options?.forceShow || false,
    cssCustomization: settings.css,
    onClose: () => {
      console.log('[OpenPatch] Modal fermée')
    },
    onShown: () => {
      console.log('[OpenPatch] Modal affichée')
    }
  })

  const instance = app.mount(container) as any

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOpenPatch)
} else {
  initOpenPatch()
}
