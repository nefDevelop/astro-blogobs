// Configuración de fuentes
export const fontConfig = {
  // Habilitar la función de fuentes personalizadas
  enable: true,
  // Precargar archivos de fuentes
  preload: true,
  // Fuentes seleccionadas actualmente, admite múltiples combinaciones de fuentes
  selected: ["system"],

  // Lista de fuentes
  fonts: {
    // Fuente del sistema
    system: {
      id: "system",
      name: "Fuente del sistema",
      src: "", // Las fuentes del sistema no necesitan src
      family: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    },

    // Google Fonts - Zen Maru Gothic
    "zen-maru-gothic": {
      id: "zen-maru-gothic",
      name: "Zen Maru Gothic",
      src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
      family: "Zen Maru Gothic",
      display: "swap" as const,
    },

    // Google Fonts - Inter
    inter: {
      id: "inter",
      name: "Inter",
      src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      family: "Inter",
      display: "swap" as const,
    },

    // Fuente Xiaomi - MiSans Normal
    "misans-normal": {
      id: "misans-normal",
      name: "MiSans Normal",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
      family: "MiSans",
      weight: 400,
      display: "swap" as const,
    },

    // Fuente Xiaomi - MiSans Semibold
    "misans-semibold": {
      id: "misans-semibold",
      name: "MiSans Semibold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
      family: "MiSans",
      weight: 600,
      display: "swap" as const,
    },
  },

  // Fallback global de fuentes
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
};
