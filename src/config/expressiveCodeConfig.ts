import type { ExpressiveCodeConfig } from "../types/config";

/**
 * Configuración de expressive-code
 * @see https://expressive-code.com/
 * Después de modificar esta configuración, es necesario reiniciar el servidor de desarrollo de Astro para que surta efecto.
 */

export const expressiveCodeConfig: ExpressiveCodeConfig = {
  // Tema oscuro (para el modo oscuro)
  darkTheme: "one-dark-pro",

  // Tema claro (para el modo claro)
  lightTheme: "one-light",

  // Para más estilos, consulta la documentación oficial de expressive-code:
  // https://expressive-code.com/guides/themes/

  // Configuración del plugin de bloques de código colapsables
  pluginCollapsible: {
    enable: true, // Habilitar la función de colapsar
    lineThreshold: 15, // Muestra el botón de colapsar cuando el número de líneas de código excede 15
    previewLines: 8, // Muestra las primeras 8 líneas cuando está colapsado
    defaultCollapsed: true, // Colapsa los bloques de código largos por defecto
  },
};
