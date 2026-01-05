// Export du composable pour utilisation dans les projets Vue
export { useOpenPatch } from './composables/useOpenPatch'

// Export du composant
export { default as OpenPatch } from './components/OpenPatch.vue'

// Export des types
export type {
  PatchNotesConfig,
  PatchNoteSection,
  WindowSettings,
  CSSCustomization,
  WidgetOptions,
  OpenPatchConfig
} from './types/settings'

// Alias pour compatibilité
export type { PatchNotesConfig as PatchNotes } from './types/settings'
export type { WindowSettings as OpenPatchSettings } from './types/settings'
