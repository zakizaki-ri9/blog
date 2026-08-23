import {
  alignSessionSlotX,
  alignSessionSlotY,
  findPresetByModelId,
  loadPresetSession,
  resetSessionToPreset,
  switchControlScheme,
} from "@/app/sf6-layout/use-cases";
import { createUndoStack } from "@/app/sf6-layout/undo";
import {
  loadPersistedSession,
  savePersistedSession,
} from "@/adapters/storage/browser-session-storage";
import type { LayoutSceneContext } from "@/app/sf6-layout/create-scene";
import { getAlignmentGuides, magnetizePosition } from "@/domain/sf6-layout/align";
import { applyGrab, grabOffset, hasDragMoved } from "@/domain/sf6-layout/coordinates";
import { formatLabelOptionDisplay } from "@/domain/sf6-layout/action-icons";
import { getLabelOptions } from "@/domain/sf6-layout/labels";
import { getRadiusSteps, nearestRadiusIndex, radiusAtIndex } from "@/domain/sf6-layout/radius-presets";
import {
  addSlot,
  createDefaultSlot,
  removeSlot,
  updateSlot,
} from "@/domain/sf6-layout/slots";
import type {
  ControllerPreset,
  MappingsData,
  SessionState,
} from "@/domain/sf6-layout/types";
import {
  downloadLayoutPng,
  pointerToNormalized,
  renderAlignmentGuidesToSvg,
  renderSlotsToSvg,
  VIEW_BOX,
} from "./render";

const MOVE_STEP = 0.01;
const LONG_PRESS_MS = 500;

interface LayoutEditorData {
  presets: ControllerPreset[];
  mappings: MappingsData;
}

interface EditorElements {
  root: HTMLElement;
  presetSelect: HTMLSelectElement;
  presetButtons: HTMLButtonElement[];
  schemeInputs: HTMLInputElement[];
  schemeChips: HTMLElement[];
  resetButton: HTMLButtonElement;
  undoButton: HTMLButtonElement;
  downloadButton: HTMLButtonElement;
  alignXButton: HTMLButtonElement;
  alignYButton: HTMLButtonElement;
  sizeSliders: HTMLInputElement[];
  sizeValues: HTMLElement[];
  sizeTicks: HTMLElement[];
  svg: SVGSVGElement;
  slotsGroup: SVGGElement;
  calloutsGroup: SVGGElement;
  guidesGroup: SVGGElement;
  chromeGroup: SVGGElement | null;
  bodyOutline: SVGRectElement;
  bodyPath: SVGPathElement | null;
  bodyInner: SVGGElement | null;
  liveRegion: HTMLElement;
  referenceLink: HTMLAnchorElement | null;
  referenceNote: HTMLElement | null;
  presetMeta: HTMLElement | null;
  contextMenu: HTMLElement;
}

type MenuView = "root" | "labels";

/** SF6 配置エディタをマウントする */
export function mountLayoutEditor(root: HTMLElement, data: LayoutEditorData): void {
  const editor = queryElements(root);
  if (!editor) return;
  bindLayoutEditor(editor, data);
}

function slotIdFromTarget(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest("[data-slot-id]");
  if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) return null;
  return el.dataset.slotId ?? null;
}

function bindLayoutEditor(editor: EditorElements, data: LayoutEditorData): void {
  const undoStack = createUndoStack();
  const modelIds = data.presets.map((p) => p.modelId);

  let selectedSlotId: string | null = null;
  let session = loadPersistedSession(modelIds)
    ?? loadPresetSession(data.presets[0], "classic", data.mappings);
  let dragSlotId: string | null = null;
  let dragPointerId: number | null = null;
  let dragGrabOffset: { dx: number; dy: number } | null = null;
  let dragStartPointer: { x: number; y: number } | null = null;
  let dragStarted = false;
  let suppressDrag = false;
  let sizeChanging = false;
  let longPressTimer: number | null = null;
  let menuView: MenuView = "root";
  let menuSlotId: string | null = null;
  let menuX = 0;
  let menuY = 0;

  function getCurrentPreset(): ControllerPreset {
    return findPresetByModelId(data.presets, session.baseModelId) ?? data.presets[0];
  }

  function getSceneContext(): LayoutSceneContext {
    return { formFactor: getCurrentPreset().formFactor };
  }

  function exportCaption(): string {
    const preset = getCurrentPreset();
    const short = preset.formFactor === "pad"
      ? "パッド"
      : preset.formFactor === "stick"
        ? "レバー"
        : "レバーレス";
    const scheme = session.controlScheme === "classic" ? "Classic" : "Modern";
    return `${short} / ${scheme} SF6 配置エディター（非公式）`;
  }

  function announce(message: string): void {
    editor.liveRegion.textContent = message;
  }

  function refreshReferenceLink(): void {
    const preset = getCurrentPreset();
    if (!editor.presetMeta) return;

    const parts: string[] = ["SF6 配置エディター"];
    if (preset.manufacturerName) parts.push(preset.manufacturerName);
    parts.push(preset.displayName);
    editor.presetMeta.textContent = parts.join(" / ");

    if (editor.referenceLink) {
      if (preset.meta.sourceUrl) {
        editor.referenceLink.href = preset.meta.sourceUrl;
        editor.referenceLink.hidden = false;
      } else {
        editor.referenceLink.hidden = true;
      }
    }

    if (editor.referenceNote) {
      editor.referenceNote.hidden = !preset.meta.sourceUrl;
    }
  }

  function refreshPresetButtons(): void {
    for (const button of editor.presetButtons) {
      button.dataset.active = button.dataset.preset === session.baseModelId ? "true" : "false";
    }
    editor.presetSelect.value = session.baseModelId;
  }

  function refreshSchemeChips(): void {
    for (const input of editor.schemeInputs) {
      input.checked = input.value === session.controlScheme;
    }
    for (const chip of editor.schemeChips) {
      const value = chip.dataset.schemeChip;
      chip.dataset.active = value === session.controlScheme ? "true" : "false";
    }
  }

  function clearGuides(): void {
    renderAlignmentGuidesToSvg(editor.guidesGroup, null, VIEW_BOX);
  }

  function updateGuides(slotId: string, x: number, y: number): void {
    const guides = getAlignmentGuides(session.slots, slotId, x, y);
    renderAlignmentGuidesToSvg(editor.guidesGroup, guides, VIEW_BOX);
  }

  function clearLongPress(): void {
    if (longPressTimer !== null) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function closeMenu(): void {
    editor.contextMenu.hidden = true;
    editor.contextMenu.replaceChildren();
    menuView = "root";
  }

  function isMenuOpen(): boolean {
    return !editor.contextMenu.hidden;
  }

  function positionMenu(): void {
    const menu = editor.contextMenu;
    menu.style.left = `${menuX}px`;
    menu.style.top = `${menuY}px`;
    const rect = menu.getBoundingClientRect();
    const dx = Math.min(0, window.innerWidth - 8 - rect.right);
    const dy = Math.min(0, window.innerHeight - 8 - rect.bottom);
    menu.style.left = `${Math.max(8, menuX + dx)}px`;
    menu.style.top = `${Math.max(8, menuY + dy)}px`;
  }

  function addMenuItem(
    label: string,
    onClick: () => void,
    options?: { danger?: boolean },
  ): void {
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.className = options?.danger ? "sf6-menu-danger" : "";
    button.textContent = label;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onClick();
    });
    editor.contextMenu.appendChild(button);
  }

  function renderMenu(): void {
    editor.contextMenu.replaceChildren();
    const slot = menuSlotId
      ? session.slots.find((item) => item.id === menuSlotId)
      : undefined;

    if (menuView === "labels" && slot && menuSlotId) {
      addMenuItem("戻る", () => {
        menuView = "root";
        renderMenu();
      });
      for (const option of getLabelOptions(session.controlScheme)) {
        const current = slot.label ?? "";
        const mark = option.value === current ? " ✓" : "";
        addMenuItem(`${formatLabelOptionDisplay(option.value)}${mark}`, () => {
          const slotId = menuSlotId;
          if (!slotId) return;
          undoStack.pushBefore(session);
          applyWithUndo({
            ...session,
            slots: updateSlot(session.slots, slotId, { label: option.value }),
          });
          announce(`ラベルを ${formatLabelOptionDisplay(option.value)} に変更しました`);
          closeMenu();
        });
      }
      positionMenu();
      return;
    }

    if (!slot || !menuSlotId) {
      addMenuItem("ボタン追加", () => addCustomSlot());
      positionMenu();
      return;
    }

    addMenuItem("ラベル", () => {
      menuView = "labels";
      renderMenu();
    });
    addMenuItem(slot.inactive ? "活性にする" : "非活性にする", () => {
      const slotId = menuSlotId;
      if (!slotId) return;
      const nextInactive = !slot.inactive;
      undoStack.pushBefore(session);
      applyWithUndo({
        ...session,
        slots: updateSlot(session.slots, slotId, { inactive: nextInactive }),
      });
      announce(nextInactive ? "非活性にしました" : "活性にしました");
      closeMenu();
    });
    addMenuItem("削除", () => {
      const slotId = menuSlotId;
      if (!slotId) return;
      deleteSlot(slotId);
    }, { danger: true });
    positionMenu();
  }

  function openMenu(clientX: number, clientY: number, slotId: string | null): void {
    menuSlotId = slotId;
    menuView = "root";
    menuX = clientX;
    menuY = clientY;
    if (slotId) {
      selectedSlotId = slotId;
      refreshControls();
    }
    editor.contextMenu.hidden = false;
    renderMenu();
    const first = editor.contextMenu.querySelector<HTMLButtonElement>("[role='menuitem']");
    first?.focus();
  }

  function slotClientPoint(slotId: string): { x: number; y: number } {
    const el = editor.svg.querySelector(`[data-slot-id="${slotId}"]`);
    if (el) {
      const box = el.getBoundingClientRect();
      return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    }
    const rect = editor.svg.getBoundingClientRect();
    return { x: rect.left + 16, y: rect.top + 16 };
  }

  function addCustomSlot(): void {
    const slot = createDefaultSlot(session.slots, undefined, getCurrentPreset().formFactor);
    undoStack.pushBefore(session);
    selectedSlotId = slot.id;
    applyWithUndo({ ...session, slots: addSlot(session.slots, slot) });
    announce(`ボタン ${slot.id} を追加しました`);
    closeMenu();
  }

  function deleteSlot(slotId: string): void {
    undoStack.pushBefore(session);
    if (selectedSlotId === slotId) selectedSlotId = null;
    applyWithUndo({ ...session, slots: removeSlot(session.slots, slotId) });
    announce(`ボタン ${slotId} を削除しました`);
    closeMenu();
  }

  function resetDrag(): void {
    dragSlotId = null;
    dragPointerId = null;
    dragGrabOffset = null;
    dragStartPointer = null;
    dragStarted = false;
  }

  function refreshSizeControls(): void {
    const formFactor = getCurrentPreset().formFactor;
    const steps = getRadiusSteps(formFactor);
    const selected = session.slots.find((slot) => slot.id === selectedSlotId);
    const index = selected ? nearestRadiusIndex(selected.r, formFactor) : 0;
    const label = selected ? `${index + 1} / ${steps.length}` : "—";

    for (const slider of editor.sizeSliders) {
      slider.max = String(Math.max(0, steps.length - 1));
      slider.value = String(index);
      slider.disabled = !selected;
    }
    for (const el of editor.sizeValues) {
      el.textContent = label;
    }
    for (const ticks of editor.sizeTicks) {
      ticks.replaceChildren();
      for (let i = 0; i < steps.length; i += 1) {
        const mark = document.createElement("span");
        mark.textContent = String(i + 1);
        ticks.appendChild(mark);
      }
    }
  }

  function refreshControls(): void {
    refreshPresetButtons();
    refreshSchemeChips();
    refreshSizeControls();

    const selected = session.slots.find((slot) => slot.id === selectedSlotId);
    editor.alignXButton.disabled = !selectedSlotId;
    editor.alignYButton.disabled = !selectedSlotId;
    editor.undoButton.disabled = !undoStack.canUndo();

    refreshReferenceLink();
    renderSlotsToSvg(
      editor.slotsGroup,
      session.slots,
      selectedSlotId,
      undefined,
      getSceneContext(),
      editor.bodyOutline,
      editor.calloutsGroup,
      editor.bodyPath,
      editor.bodyInner,
      editor.chromeGroup,
    );

    if (dragSlotId) {
      const dragSlot = session.slots.find((s) => s.id === dragSlotId);
      if (dragSlot) {
        updateGuides(dragSlotId, dragSlot.x, dragSlot.y);
      }
    } else if (selectedSlotId && selected) {
      updateGuides(selectedSlotId, selected.x, selected.y);
    } else {
      clearGuides();
    }
  }

  function commitSession(next: SessionState, persist = true): void {
    session = next;
    if (selectedSlotId && !session.slots.some((slot) => slot.id === selectedSlotId)) {
      selectedSlotId = null;
    }
    if (persist) savePersistedSession(session);
    refreshControls();
  }

  function applyWithUndo(next: SessionState, persist = true): void {
    commitSession(next, persist);
  }

  function selectPreset(modelId: string): void {
    const preset = findPresetByModelId(data.presets, modelId);
    if (!preset) return;
    undoStack.pushBefore(session);
    selectedSlotId = null;
    closeMenu();
    commitSession(loadPresetSession(preset, session.controlScheme, data.mappings));
    announce(`テンプレートを ${preset.displayName} に変更しました`);
  }

  for (const button of editor.presetButtons) {
    button.addEventListener("click", () => {
      const modelId = button.dataset.preset;
      if (modelId) selectPreset(modelId);
    });
  }

  editor.presetSelect.addEventListener("change", () => {
    selectPreset(editor.presetSelect.value);
  });

  for (const chip of editor.schemeChips) {
    if (chip.tagName !== "BUTTON") continue;
    chip.addEventListener("click", () => {
      const value = chip.dataset.schemeChip;
      if (!value) return;
      const input = editor.schemeInputs.find((item) => item.value === value);
      if (!input || input.checked) return;
      input.checked = true;
      input.dispatchEvent(new Event("change"));
    });
  }

  for (const input of editor.schemeInputs) {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      undoStack.pushBefore(session);
      const next = switchControlScheme(
        session,
        input.value as SessionState["controlScheme"],
        data.mappings,
        getCurrentPreset().formFactor,
      );
      commitSession(next);
      announce(`操作方式を ${input.value} に変更しました`);
    });
  }

  editor.resetButton.addEventListener("click", () => {
    undoStack.pushBefore(session);
    undoStack.clear();
    selectedSlotId = null;
    closeMenu();
    commitSession(
      resetSessionToPreset(
        getCurrentPreset(),
        session.controlScheme,
        data.mappings,
      ),
    );
    announce("プリセット初期状態にリセットしました");
  });

  editor.undoButton.addEventListener("click", () => {
    const restored = undoStack.undo();
    if (!restored) return;
    closeMenu();
    commitSession(restored);
    announce("直前の操作を取り消しました");
  });

  editor.downloadButton.addEventListener("click", () => {
    void downloadLayoutPng(session.slots, getSceneContext(), exportCaption());
    announce("PNG をダウンロードしました");
  });

  editor.alignXButton.addEventListener("click", () => {
    if (!selectedSlotId) return;
    undoStack.pushBefore(session);
    applyWithUndo(alignSessionSlotX(session, selectedSlotId));
    announce(`ボタン ${selectedSlotId} を縦に揃えました`);
  });

  editor.alignYButton.addEventListener("click", () => {
    if (!selectedSlotId) return;
    undoStack.pushBefore(session);
    applyWithUndo(alignSessionSlotY(session, selectedSlotId));
    announce(`ボタン ${selectedSlotId} を横に揃えました`);
  });

  for (const slider of editor.sizeSliders) {
    slider.addEventListener("pointerdown", () => {
      if (!selectedSlotId) return;
      sizeChanging = true;
      undoStack.pushBefore(session);
    });
    slider.addEventListener("input", () => {
      if (!selectedSlotId) return;
      const r = radiusAtIndex(Number(slider.value), getCurrentPreset().formFactor);
      commitSession({
        ...session,
        slots: updateSlot(session.slots, selectedSlotId, { r }),
      }, !sizeChanging);
    });
    slider.addEventListener("change", () => {
      sizeChanging = false;
      savePersistedSession(session);
      const formFactor = getCurrentPreset().formFactor;
      const selected = session.slots.find((slot) => slot.id === selectedSlotId);
      if (!selected) return;
      const index = nearestRadiusIndex(selected.r, formFactor);
      const steps = getRadiusSteps(formFactor);
      announce(`大きさを ${index + 1} / ${steps.length} に変更しました`);
    });
  }

  editor.svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    closeMenu();
    const slotId = slotIdFromTarget(event.target);
    if (!slotId) {
      selectedSlotId = null;
      clearGuides();
      refreshControls();
      if (event.pointerType === "touch") {
        clearLongPress();
        longPressTimer = window.setTimeout(() => {
          suppressDrag = true;
          resetDrag();
          openMenu(event.clientX, event.clientY, null);
        }, LONG_PRESS_MS);
      }
      return;
    }

    selectedSlotId = slotId;
    suppressDrag = false;
    dragSlotId = slotId;
    dragPointerId = event.pointerId;
    editor.svg.setPointerCapture(event.pointerId);
    const slot = session.slots.find((s) => s.id === slotId);
    const pointer = pointerToNormalized(editor.svg, event.clientX, event.clientY);
    if (slot) {
      dragGrabOffset = grabOffset(slot, pointer);
      dragStartPointer = pointer;
      dragStarted = false;
      updateGuides(slotId, slot.x, slot.y);
    }
    refreshControls();
    announce(`編集対象: ${slotId}`);

    if (event.pointerType === "touch") {
      clearLongPress();
      const startX = event.clientX;
      const startY = event.clientY;
      longPressTimer = window.setTimeout(() => {
        suppressDrag = true;
        if (dragPointerId !== null) {
          try {
            editor.svg.releasePointerCapture(dragPointerId);
          } catch {
            // キャプチャ済みでない場合は無視
          }
        }
        resetDrag();
        openMenu(startX, startY, slotId);
      }, LONG_PRESS_MS);
    }
  });

  editor.svg.addEventListener("pointermove", (event) => {
    if (suppressDrag) return;
    if (!dragSlotId || !dragGrabOffset || !dragStartPointer) return;
    const raw = pointerToNormalized(editor.svg, event.clientX, event.clientY);
    if (!dragStarted) {
      if (!hasDragMoved(dragStartPointer, raw)) return;
      clearLongPress();
      undoStack.pushBefore(session);
      dragStarted = true;
    }
    const grabbed = applyGrab(raw, dragGrabOffset);
    const snapped = magnetizePosition(session.slots, dragSlotId, grabbed.x, grabbed.y);
    updateGuides(dragSlotId, snapped.x, snapped.y);
    commitSession({
      ...session,
      slots: updateSlot(session.slots, dragSlotId, snapped),
    }, false);
  });

  editor.svg.addEventListener("pointerup", (event) => {
    clearLongPress();
    if (dragSlotId) {
      try {
        editor.svg.releasePointerCapture(event.pointerId);
      } catch {
        // キャプチャ済みでない場合は無視
      }
      const moved = dragStarted;
      resetDrag();
      clearGuides();
      if (moved) {
        savePersistedSession(session);
        announce(`ボタン ${selectedSlotId ?? ""} の位置を変更しました`);
      }
      refreshControls();
    }
    suppressDrag = false;
  });

  editor.svg.addEventListener("pointercancel", (event) => {
    clearLongPress();
    if (dragSlotId) {
      try {
        editor.svg.releasePointerCapture(event.pointerId);
      } catch {
        // キャプチャ済みでない場合は無視
      }
      const moved = dragStarted;
      resetDrag();
      clearGuides();
      if (moved) {
        savePersistedSession(session);
      }
      refreshControls();
    }
    suppressDrag = false;
  });

  editor.svg.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    clearLongPress();
    suppressDrag = true;
    resetDrag();
    const slotId = slotIdFromTarget(event.target);
    openMenu(event.clientX, event.clientY, slotId);
  });

  editor.contextMenu.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  editor.svg.addEventListener("keydown", (event) => {
    if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
      event.preventDefault();
      if (selectedSlotId) {
        const point = slotClientPoint(selectedSlotId);
        openMenu(point.x, point.y, selectedSlotId);
      } else {
        const rect = editor.svg.getBoundingClientRect();
        openMenu(rect.left + 16, rect.top + 16, null);
      }
      return;
    }

    if (!selectedSlotId) return;
    const slot = session.slots.find((s) => s.id === selectedSlotId);
    if (!slot) return;

    let dx = 0;
    let dy = 0;
    if (event.key === "ArrowLeft") dx = -MOVE_STEP;
    if (event.key === "ArrowRight") dx = MOVE_STEP;
    if (event.key === "ArrowUp") dy = -MOVE_STEP;
    if (event.key === "ArrowDown") dy = MOVE_STEP;

    if (dx !== 0 || dy !== 0) {
      event.preventDefault();
      undoStack.pushBefore(session);
      applyWithUndo({
        ...session,
        slots: updateSlot(session.slots, selectedSlotId, {
          x: slot.x + dx,
          y: slot.y + dy,
        }),
      });
      announce(`ボタン ${selectedSlotId} を移動しました`);
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteSlot(selectedSlotId);
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!isMenuOpen()) return;
    if (editor.contextMenu.contains(event.target as Node)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      closeMenu();
    }
  });

  refreshControls();
}

function queryElements(root: HTMLElement): EditorElements | null {
  const presetSelect = root.querySelector<HTMLSelectElement>("#sf6-preset-select");
  const presetButtons = root.querySelectorAll<HTMLButtonElement>("[data-preset]");
  const schemeInputs = root.querySelectorAll<HTMLInputElement>("input[name^='sf6-scheme']");
  const schemeChips = root.querySelectorAll<HTMLElement>("[data-scheme-chip]");
  const resetButton = root.querySelector<HTMLButtonElement>("#sf6-reset");
  const undoButton = root.querySelector<HTMLButtonElement>("#sf6-undo");
  const downloadButton = root.querySelector<HTMLButtonElement>("#sf6-download");
  const alignXButton = root.querySelector<HTMLButtonElement>("#sf6-align-x");
  const alignYButton = root.querySelector<HTMLButtonElement>("#sf6-align-y");
  const sizeSliders = root.querySelectorAll<HTMLInputElement>("[data-sf6-size-slider]");
  const sizeValues = root.querySelectorAll<HTMLElement>("[data-sf6-size-value]");
  const sizeTicks = root.querySelectorAll<HTMLElement>("[data-sf6-size-ticks]");
  const svg = root.querySelector<SVGSVGElement>("#sf6-svg");
  const slotsGroup = root.querySelector<SVGGElement>("#sf6-slots");
  const calloutsGroup = root.querySelector<SVGGElement>("#sf6-callouts");
  const guidesGroup = root.querySelector<SVGGElement>("#sf6-guides");
  const chromeGroup = root.querySelector<SVGGElement>("#sf6-chrome");
  const bodyOutline = root.querySelector<SVGRectElement>("#sf6-body-outline");
  const bodyPath = root.querySelector<SVGPathElement>("#sf6-body-path");
  const bodyInner = root.querySelector<SVGGElement>("#sf6-body-inner");
  const liveRegion = root.querySelector<HTMLElement>("#sf6-live-region");
  const referenceLink = root.querySelector<HTMLAnchorElement>("#sf6-reference-link");
  const referenceNote = root.querySelector<HTMLElement>("#sf6-reference-note");
  const presetMeta = root.querySelector<HTMLElement>("#sf6-preset-meta");
  const contextMenu = root.querySelector<HTMLElement>("#sf6-context-menu");

  if (
    !presetSelect
    || schemeInputs.length === 0
    || !resetButton
    || !undoButton
    || !downloadButton
    || !alignXButton
    || !alignYButton
    || sizeSliders.length === 0
    || !svg
    || !slotsGroup
    || !calloutsGroup
    || !guidesGroup
    || !bodyOutline
    || !liveRegion
    || !contextMenu
  ) {
    return null;
  }

  return {
    root,
    presetSelect,
    presetButtons: Array.from(presetButtons),
    schemeInputs: Array.from(schemeInputs),
    schemeChips: Array.from(schemeChips),
    resetButton,
    undoButton,
    downloadButton,
    alignXButton,
    alignYButton,
    sizeSliders: Array.from(sizeSliders),
    sizeValues: Array.from(sizeValues),
    sizeTicks: Array.from(sizeTicks),
    svg,
    slotsGroup,
    calloutsGroup,
    guidesGroup,
    chromeGroup,
    bodyOutline,
    bodyPath,
    bodyInner,
    liveRegion,
    referenceLink,
    referenceNote,
    presetMeta,
    contextMenu,
  };
}
