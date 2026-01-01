<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        data-openpatch-root
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
        style="
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        "
      >
        <div
          class="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
          style="pointer-events: none"
        ></div>

        <div
          data-openpatch-modal
          class="relative w-full max-w-xl max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200/60"
          style="box-sizing: border-box; font-family: inherit"
        >
          <div
            class="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4"
            style="box-sizing: border-box"
          >
            <div
              class="flex items-start justify-between gap-4"
              style="box-sizing: border-box"
            >
              <div class="flex-1 min-w-0" style="box-sizing: border-box">
                <h2
                  class="text-lg font-semibold text-slate-900 truncate"
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: inherit;
                  "
                >
                  {{ title }}
                </h2>
                <p
                  class="text-xs text-slate-500 mt-0.5"
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: inherit;
                  "
                >
                  Version {{ version }}
                </p>
              </div>
              <button
                @click="handleClose"
                class="shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md p-1.5 transition-colors"
                aria-label="Fermer"
                style="
                  box-sizing: border-box;
                  font-family: inherit;
                  border: none;
                  background: transparent;
                  cursor: pointer;
                  appearance: none;
                  -webkit-appearance: none;
                "
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style="display: block"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="overflow-y-auto max-h-[calc(80vh-140px)] px-6 py-5"
            style="box-sizing: border-box"
          >
            <div v-if="patchnotes && patchnotes.sections.length > 0">
              <div
                v-for="(section, index) in patchnotes.sections"
                :key="index"
                :class="{ 'mb-7': index < patchnotes.sections.length - 1 }"
                style="box-sizing: border-box"
              >
                <div
                  class="flex items-center gap-3 mb-3"
                  style="box-sizing: border-box"
                >
                  <span
                    class="inline-flex items-center font-semibold text-slate-600 uppercase tracking-wide"
                    style="
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      font-family: inherit;
                    "
                  >
                    {{ section.title }}
                  </span>
                </div>

                <ul
                  class="list-none p-0 m-0 flex flex-col gap-2.5 cursor-pointer"
                  style="
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  "
                >
                  <li
                    v-for="(item, itemIndex) in section.items"
                    :key="itemIndex"
                    class="flex items-start gap-3 px-3 py-2 bg-slate-50 border-l-[3px] border-slate-300 rounded-md text-[0.9375rem] text-slate-600 leading-relaxed transition-all duration-150 hover:bg-slate-100 hover:border-slate-400"
                    style="
                      box-sizing: border-box;
                      list-style: none;
                      margin: 0;
                      font-family: inherit;
                    "
                  >
                    <span
                      class="flex-1"
                      style="
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        font-family: inherit;
                      "
                      >{{ item }}</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div
              v-else
              class="text-center text-slate-400 py-12 text-sm"
              style="
                box-sizing: border-box;
                margin: 0;
                padding: 3rem 0;
                font-family: inherit;
              "
            >
              Aucun contenu à afficher
            </div>
          </div>

          <div
            class="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4"
            style="box-sizing: border-box"
          >
            <button
              @click="handleClose"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors duration-150 cursor-pointer"
              style="
                box-sizing: border-box;
                font-family: inherit;
                appearance: none;
                -webkit-appearance: none;
                border: none;
              "
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
import { ref, computed, onMounted, watch } from "vue";
import type { PatchNotesConfig } from "../types/settings";

interface Props {
  projectId: string;
  version: string;
  patchnotes: PatchNotesConfig;
  title?: string;
  closeButtonText?: string;
  forceShow?: boolean;
  manual?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "🎉 Nouveautés",
  closeButtonText: "Compris !",
  forceShow: false,
  manual: false,
});

const emit = defineEmits<{
  close: [];
  shown: [];
}>();

const isVisible = ref(false);
const storageKey = computed(() => `openpatch_${props.projectId}_version`);
const getLastSeenVersion = (): string | null => {
  try {
    const stored = localStorage.getItem(storageKey.value);
    if (!stored) return null;

    const data = JSON.parse(stored);
    return data.version || null;
  } catch (error) {
    console.warn("[OpenPatch] Erreur lecture localStorage:", error);
    return null;
  }
};

const saveCurrentVersion = () => {
  try {
    const data = {
      version: props.version,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey.value, JSON.stringify(data));
  } catch (error) {
    console.error("[OpenPatch] Erreur sauvegarde localStorage:", error);
  }
};

const shouldShowPatchNotes = (): boolean => {
  if (props.forceShow) return true;

  const lastSeenVersion = getLastSeenVersion();

  if (!lastSeenVersion) return true;

  return lastSeenVersion !== props.version;
};

const handleClose = () => {
  isVisible.value = false;
  saveCurrentVersion();
  emit("close");
};

const show = () => {
  isVisible.value = true;
  emit("shown");
};

const hide = () => {
  handleClose();
};

const reset = () => {
  try {
    localStorage.removeItem(storageKey.value);
  } catch (error) {
    console.error("[OpenPatch] Erreur suppression localStorage:", error);
  }
};

defineExpose({
  show,
  hide,
  reset,
});

onMounted(() => {
  if (!props.manual && shouldShowPatchNotes()) {
    setTimeout(() => {
      show();
    }, 500);
  }
});

watch(
  () => props.version,
  (newVersion, oldVersion) => {
    if (!props.manual && newVersion !== oldVersion && shouldShowPatchNotes()) {
      show();
    }
  }
);
</script>

<style scoped>
/* Reset CSS spécifique pour isoler la modal */
[data-openpatch-root] *,
[data-openpatch-root] *::before,
[data-openpatch-root] *::after {
  all: unset;
  box-sizing: border-box;
}

/* Restaurer les styles essentiels */
[data-openpatch-root] {
  position: fixed !important;
  z-index: 999999 !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  line-height: 1.5 !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

[data-openpatch-modal] {
  font-family: inherit !important;
}

[data-openpatch-modal] * {
  font-family: inherit !important;
}

/* Assurer que les éléments sont visibles */
[data-openpatch-root] svg {
  display: block !important;
}

[data-openpatch-root] button {
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

[data-openpatch-root] ul {
  list-style: none !important;
}

[data-openpatch-root] li {
  list-style: none !important;
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
