import { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DragState {
  dragIndex: number | null;
  overIndex: number | null;
  mouseX: number;
  mouseY: number;
  startX: number;
  startY: number;
  originRect: DOMRect | null;
}

interface UseDragDropOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const INITIAL: DragState = {
  dragIndex: null,
  overIndex: null,
  mouseX: 0,
  mouseY: 0,
  startX: 0,
  startY: 0,
  originRect: null,
};

const THRESHOLD = 6; // px — must move this far before drag activates

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDragDrop({ onReorder }: UseDragDropOptions) {
  const [drag, setDrag] = useState<DragState>(INITIAL);
  const dragRef = useRef<DragState>(INITIAL);
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());

  function registerCard(index: number, el: HTMLElement | null) {
    if (el) cardRefs.current.set(index, el);
    else cardRefs.current.delete(index);
  }

  // ── Main pointer move — only attached after threshold is crossed ─────────────

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const state = dragRef.current;
    if (state.dragIndex === null) return;

    let newOver: number | null = null;
    cardRefs.current.forEach((el, idx) => {
      if (idx === state.dragIndex) return;
      const rect = el.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 12 && e.clientX <= rect.right  + 12 &&
        e.clientY >= rect.top  - 40 && e.clientY <= rect.bottom + 40
      ) {
        newOver = idx;
      }
    });

    const next: DragState = { ...state, mouseX: e.clientX, mouseY: e.clientY, overIndex: newOver };
    dragRef.current = next;
    setDrag(next);
  }, []);

  const handlePointerUp = useCallback(() => {
    const state = dragRef.current;
    if (state.dragIndex !== null && state.overIndex !== null && state.dragIndex !== state.overIndex) {
      onReorder(state.dragIndex, state.overIndex);
    }
    dragRef.current = INITIAL;
    setDrag(INITIAL);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [handlePointerMove, onReorder]);

  // ── Start drag — waits for movement threshold before activating ──────────────

  function startDrag(e: React.PointerEvent, index: number) {
    if (e.button !== 0) return;
    // Don't preventDefault here — let clicks through until threshold is crossed

    const startX = e.clientX;
    const startY = e.clientY;
    const el = cardRefs.current.get(index);
    const rect = el?.getBoundingClientRect() ?? null;
    let activated = false;

    function onThresholdMove(ev: PointerEvent) {
      if (activated) return;
      const dx = Math.abs(ev.clientX - startX);
      const dy = Math.abs(ev.clientY - startY);
      if (dx < THRESHOLD && dy < THRESHOLD) return;

      // Threshold crossed — activate drag
      activated = true;

      const next: DragState = {
        dragIndex: index,
        overIndex: null,
        mouseX: ev.clientX,
        mouseY: ev.clientY,
        startX,
        startY,
        originRect: rect,
      };
      dragRef.current = next;
      setDrag(next);

      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";

      cleanup();
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    function onEarlyUp() {
      // Released before threshold — just a click, do nothing
      cleanup();
    }

    function cleanup() {
      window.removeEventListener("pointermove", onThresholdMove);
      window.removeEventListener("pointerup", onEarlyUp);
    }

    window.addEventListener("pointermove", onThresholdMove);
    window.addEventListener("pointerup", onEarlyUp);
  }

  useEffect(() => () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  return { drag, registerCard, startDrag };
}
