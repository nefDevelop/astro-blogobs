import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  // Título del anuncio
  title: "Anuncio",

  // Contenido del anuncio
  content: "¡Bienvenido a mi blog! Este es un anuncio de ejemplo.",

  // Permite al usuario cerrar el anuncio
  closable: true,

  link: {
    // Habilitar enlace
    enable: true,
    // Texto del enlace
    text: "Saber más",
    // URL del enlace
    url: "/about/",
    // Enlace interno
    external: false,
  },
};
