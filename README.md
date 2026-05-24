# Story Beats

A narrative timeline tool for writers and worldbuilders. Drag-and-drop story beats across a horizontal canvas, organised by act.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project Structure

```
storybeats/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # Entry point — mounts React
    ├── App.tsx               # Root component — state orchestration only
    │
    ├── types/
    │   └── index.ts          # Beat, ActId, BeatTypeId, ModalState, etc.
    │
    ├── data/
    │   └── index.ts          # ACT_CONFIG, BEAT_TYPES, SEED_BEATS
    │
    ├── utils/
    │   └── index.ts          # uid(), getBeatType(), getActConfig(), reorder()
    │
    ├── hooks/
    │   ├── useBeats.ts       # Beat CRUD + localStorage persistence
    │   └── useDragDrop.ts    # Drag-and-drop reorder logic
    │
    ├── styles/
    │   └── global.css        # Fonts, resets, keyframe animations
    │
    └── components/
        ├── index.ts          # Barrel exports
        ├── TensionArc.tsx    # SVG sparkline in the header
        ├── ActLabel.tsx      # Vertical act divider (Setup / Confrontation / Resolution)
        ├── BeatCard.tsx      # Individual beat card with drag state + hover actions
        ├── EditModal.tsx     # Create / edit beat modal
        ├── AppHeader.tsx     # Header: wordmark, sparkline, filter pills, add button
        ├── TimelineCanvas.tsx # Horizontal scroll canvas + drag-drop wiring
        └── AppFooter.tsx     # Beat count + act legend
```

## Design Decisions

- **No external UI library** — all styling is inline CSS for full control over transitions and hover states.
- **Hooks own logic, components own rendering** — `useBeats` and `useDragDrop` contain zero JSX.
- **`App.tsx` is a thin orchestrator** — it wires hooks to components and handles modal state. Nothing else.
- **Data is static** — `data/index.ts` is a config file, not a service. No abstraction needed until there's a backend.

## The Micro-interaction

When dragging a card, the card it will land *next to* shows a glowing amber sliver on its left edge that pulses with `animation: breathe`. It's the one interaction worth pointing at.
