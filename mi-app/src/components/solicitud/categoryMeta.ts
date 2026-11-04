type IconRef = { name: string; w: number; h: number };

export type CategoryMeta = { subtitle: string; icon: IconRef };

/** Ícono y subtítulo de cada categoría según el diseño de Figma. */
const meta: Record<string, CategoryMeta> = {
  plomeria: { subtitle: "Tuberías, fugas y grifos", icon: { name: "bffb6", w: 16.3, h: 19.55 } },
  electricidad: { subtitle: "Cortos, tomas y paneles", icon: { name: "77816", w: 16, h: 20 } },
  cerrajeria: { subtitle: "Aperturas y chapas", icon: { name: "3ac5e", w: 16, h: 21 } },
  pintura: { subtitle: "Interior y fachadas", icon: { name: "241a7", w: 16, h: 19 } },
  jardineria: { subtitle: "Poda y mantenimiento", icon: { name: "55e8e", w: 20, h: 20 } },
  "panetes y enchapes": {
    subtitle: "Baldosas y resanes",
    icon: { name: "36507", w: 19.95, h: 21 },
  },
};

const fallback: CategoryMeta = { subtitle: "", icon: { name: "36507", w: 19.95, h: 21 } };

export function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function getCategoryMeta(name: string): CategoryMeta {
  return meta[normalizeName(name)] ?? fallback;
}
