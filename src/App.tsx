import { useState } from "react";
import type { Beat, FilterId, ModalState } from "./types";
import { useBeats } from "./hooks/useBeats";
import { useLang } from "./i18n";
import {
  AppHeader,
  AppFooter,
  TimelineCanvas,
  EditModal,
} from "./components";

export function App() {
  const { beats, addBeat, updateBeat, deleteBeat, moveBeat } = useBeats();
  const { lang, toggleLang, t } = useLang();
  const [modal, setModal] = useState<ModalState>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  function handleSave(beat: Beat) {
    const exists = beats.some((b) => b.id === beat.id);
    if (exists) updateBeat(beat);
    else addBeat(beat);
    setModal(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppHeader
        beats={beats}
        activeFilter={activeFilter}
        lang={lang}
        t={t}
        onFilterChange={setActiveFilter}
        onAddBeat={() => setModal("new")}
        onToggleLang={toggleLang}
      />

      <TimelineCanvas
        beats={beats}
        activeFilter={activeFilter}
        t={t}
        onEdit={(beat) => setModal(beat)}
        onDelete={deleteBeat}
        onReorder={moveBeat}
      />

      <AppFooter beats={beats} t={t} />

      {modal !== null && (
        <EditModal
          beat={modal === "new" ? null : modal}
          t={t}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
