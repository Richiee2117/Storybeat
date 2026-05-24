// ─── Language type ────────────────────────────────────────────────────────────

export type Lang = "en" | "es";

// ─── Translation map ──────────────────────────────────────────────────────────

export const TRANSLATIONS = {
  en: {
    // App shell
    appTitle: "Story Beats",
    appSubtitle: "Narrative Timeline",
    addBeat: "+ Add Beat",
    beatsCount: (n: number) => `${n} beat${n !== 1 ? "s" : ""} · Drag to reorder`,
    emptyTitle: "✦",
    emptyMessage: "The page is blank. Every story starts somewhere.",
    dragHint: "Drag to reorder",

    // Filters
    filterAll: "All",

    // Acts
    actSetup: "Setup",
    actConfrontation: "Confrontation",
    actResolution: "Resolution",

    // Beat types
    typeInciting: "Inciting Incident",
    typeTurn: "Turning Point",
    typeRevelation: "Revelation",
    typeChoice: "Choice",
    typeEscalation: "Escalation",
    typeClimax: "Climax",
    typeAftermath: "Aftermath",
    typeBeat: "Scene Beat",

    // Card
    noNotes: "No notes yet.",
    editBtn: "Edit",

    // Modal
    modalNewTitle: "New Story Beat",
    modalEditTitle: "Edit Beat",
    fieldTitle: "Beat Title",
    fieldTitlePlaceholder: "What happens here?",
    fieldAct: "Act",
    fieldType: "Beat Type",
    fieldNotes: "Notes",
    fieldNotesPlaceholder: "What does this moment feel like? What's at stake?",
    fieldTension: (n: number) => `Tension — ${n}/10`,
    btnCancel: "Cancel",
    btnAdd: "Add to Timeline",
    btnSave: "Save Changes",
  },

  es: {
    // App shell
    appTitle: "Latidos",
    appSubtitle: "Línea de Tiempo Narrativa",
    addBeat: "+ Agregar Latido",
    beatsCount: (n: number) => `${n} latido${n !== 1 ? "s" : ""} · Arrastra para reordenar`,
    emptyTitle: "✦",
    emptyMessage: "La página está en blanco. Toda historia comienza en algún lugar.",
    dragHint: "Arrastra para reordenar",

    // Filters
    filterAll: "Todos",

    // Acts
    actSetup: "Planteamiento",
    actConfrontation: "Confrontación",
    actResolution: "Resolución",

    // Beat types
    typeInciting: "Incidente Inicial",
    typeTurn: "Punto de Giro",
    typeRevelation: "Revelación",
    typeChoice: "Decisión",
    typeEscalation: "Escalada",
    typeClimax: "Clímax",
    typeAftermath: "Consecuencias",
    typeBeat: "Escena",

    // Card
    noNotes: "Sin notas aún.",
    editBtn: "Editar",

    // Modal
    modalNewTitle: "Nuevo Latido",
    modalEditTitle: "Editar Latido",
    fieldTitle: "Título",
    fieldTitlePlaceholder: "¿Qué sucede aquí?",
    fieldAct: "Acto",
    fieldType: "Tipo de Latido",
    fieldNotes: "Notas",
    fieldNotesPlaceholder: "¿Cómo se siente este momento? ¿Qué está en juego?",
    fieldTension: (n: number) => `Tensión — ${n}/10`,
    btnCancel: "Cancelar",
    btnAdd: "Añadir a la Línea",
    btnSave: "Guardar Cambios",
  },
} as const;

export type T = typeof TRANSLATIONS["en"];
