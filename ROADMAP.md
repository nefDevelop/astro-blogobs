Roadmap de Simplificación: "Astro-Blogobs Minimal"

  Fase 1: Purga de Componentes y Páginas (Limpieza de Superficie) [COMPLETA]
   [x] 1. Comentarios: Eliminar todos en src/components/comment/ excepto Giscus.
   [x] 2. Páginas secundarias: Borrar friends.astro y sponsor.astro.
   [x] 3. Efectos visuales: Eliminar los scripts de sakura, firefly, pio y ondas de agua.
   [x] 4. Analíticas: Limpiar GoogleAnalytics.astro y MicrosoftClarity.astro.

  Fase 2: Consolidación de Configuración (El Cerebro) [COMPLETA]
   [x] 1. Centralizar configuraciones en src/config/site.config.ts.
   [x] 2. Eliminar archivos de configuración individuales.
   [x] 3. Corregir importaciones en todo el proyecto.

  Fase 3: Refactorización i18n (Idiomas) [COMPLETA]
   [x] 1. Limpiar src/i18n/languages/ para dejar exclusivamente los diccionarios de Español (ES) e Inglés (EN).
   [x] 2. Actualizar mapa de traducciones.

  Fase 4: Limpieza de Estilos y Assets (Rendimiento) [COMPLETA]
   [x] 1. Eliminar imágenes pesadas no usadas (wallpapers de ejemplo).
   [x] 2. Mantener estructura de estilos para estabilidad visual.

  Fase 5: Validación y Obsidian [COMPLETA]
   [x] 1. Asegurar compatibilidad con el flujo de trabajo de Obsidian.
   [x] 2. Mantener soporte para Búsqueda (Pagefind) y Mermaid.
