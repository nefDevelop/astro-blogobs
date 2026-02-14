import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
  // Tipo de sistema de comentarios: none, twikoo, waline, giscus, disqus, artalk. Por defecto es none, lo que significa que no se habilita ningún sistema de comentarios.
  type: "none",

  // Configuración del sistema de comentarios Twikoo
  twikoo: {
    envId: "https://twikoo.vercel.app",
    // Establecer el idioma del sistema de comentarios Twikoo
    lang: "es",
    // Habilitar la función de estadísticas de visitas a artículos
    visitorCount: true,
  },

  // Configuración del sistema de comentarios Waline
  waline: {
    // Dirección del servicio backend de Waline
    serverURL: "https://waline.vercel.app",
    // Establecer el idioma del sistema de comentarios Waline
    lang: "es",
    // Modo de inicio de sesión para comentarios. Valores opcionales:
    //   'enable'   —— Por defecto, permite a los visitantes comentar de forma anónima e iniciar sesión con OAuth de terceros, la mejor compatibilidad.
    //   'force'    —— Obliga a iniciar sesión para comentar, adecuado para comunidades estrictas, desactiva los comentarios anónimos.
    //   'disable'  —— Prohíbe todos los inicios de sesión y OAuth, solo permite comentarios anónimos (rellenar apodo/correo electrónico), adecuado para mensajes minimalistas.
    login: "enable",
    // Habilitar la función de estadísticas de visitas a artículos
    visitorCount: true,
  },

  // Configuración del sistema de comentarios Artalk
  artalk: {
    // Dirección de la API del programa backend de Artalk
    server: "https://artalk.example.com/",
    // Establecer el idioma de Artalk
    locale: "es",
    // Habilitar la función de estadísticas de visitas a artículos
    visitorCount: true,
  },

  // Configuración del sistema de comentarios Giscus
  giscus: {
    // Establecer el repositorio del sistema de comentarios Giscus
    repo: "CuteLeaf/Firefly",
    // Establecer el ID del repositorio del sistema de comentarios Giscus
    repoId: "R_kgD2gfdFGd",
    // Establecer la categoría del sistema de comentarios Giscus
    category: "General", // Mantener en inglés ya que es un identificador
    // Obtener el ID de la categoría del sistema de comentarios Giscus
    categoryId: "DIC_kwDOKy9HOc4CegmW",
    // Obtener el método de mapeo del sistema de comentarios Giscus
    mapping: "title", // Mantener en inglés ya que es un identificador
    // Obtener el modo estricto del sistema de comentarios Giscus
    strict: "0", // Mantener como string numérico
    // Obtener la función de reacciones del sistema de comentarios Giscus
    reactionsEnabled: "1", // Mantener como string numérico
    // Obtener la función de metadatos del sistema de comentarios Giscus
    emitMetadata: "1", // Mantener como string numérico
    // Obtener la posición de entrada del sistema de comentarios Giscus
    inputPosition: "top", // Mantener en inglés ya que es un identificador
    // Obtener el idioma del sistema de comentarios Giscus
    lang: "es",
    // Obtener el método de carga del sistema de comentarios Giscus
    loading: "lazy", // Mantener en inglés ya que es un identificador
  },

  // Configuración del sistema de comentarios Disqus
  disqus: {
    // Obtener el sistema de comentarios Disqus
    shortname: "firefly",
  },
};
