/**
 * Structure des patchnotes dans window.Settings
 */
export interface PatchNoteSection {
  title: string
  items: string[]
}

export interface PatchNotesConfig {
  title: string
  sections: PatchNoteSection[]
}

export interface CSSCustomization {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  buttonTextColor?: string
  borderColor?: string
  accentColor?: string
  buttonBackgroundColor?: string
}

export interface WidgetOptions {
  theme?: 'light' | 'dark'
  display?: 'modal' | 'sidebar' | 'banner'
  position?: 'center' | 'top-right' | 'bottom-right'
  closeButtonText?: string
  forceShow?: boolean
}

/**
 * Configuration minimale depuis le JSON distant
 */
export interface JSONConfig {
  version: string
  patchnotes: PatchNotesConfig
}

/**
 * Configuration globale dans window.Settings
 */
export interface WindowSettings {
  projectId: string
  version?: string
  patchnotes?: PatchNotesConfig
  options?: WidgetOptions
  css?: CSSCustomization
}

/**
 * Configuration pour le chargement JSON
 */
export interface OpenPatchConfig {
  jsonUrl?: string
}

/**
 * Déclaration TypeScript pour window.Settings
 */
declare global {
  interface Window {
    Settings?: WindowSettings
    OpenPatchConfig?: OpenPatchConfig
    OpenPatch?: {
      show: () => void
      hide: () => void
      reset: () => void
    }
  }
}

export {}
