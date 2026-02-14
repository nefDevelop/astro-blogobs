import type { MusicPlayerConfig } from "../types/config";

// Configuración del reproductor de música
export const musicPlayerConfig: MusicPlayerConfig = {
  // Métodos para deshabilitar el reproductor de música:
  // La plantilla muestra tanto la barra lateral como la barra de navegación por defecto. Normalmente, se recomienda elegir uno y deshabilitar el otro.
  // 1. Barra lateral: Deshabilita el componente de música estableciendo 'enable' en false en la configuración de la barra lateral en sidebarConfig.ts.
  // 2. Barra de navegación: Deshabilita el reproductor de música estableciendo 'showInNavbar' en false en este archivo de configuración.

  // Mostrar la entrada del reproductor de música en la barra de navegación
  showInNavbar: true,

  // Modo de uso: "meting" para usar la API de Meting, "local" para usar una lista de música local
  mode: "meting",

  // Volumen predeterminado (0-1)
  volume: 0.7,

  // Modo de reproducción: 'list'=bucle de lista, 'one'=bucle de una canción, 'random'=reproducción aleatoria
  playMode: "list",

  // Habilitar la visualización de letras
  showLyrics: true,

  // Configuración de la API de Meting
  meting: {
    // Dirección de la API de Meting
    // Por defecto se usa la API oficial, también se puede usar una API personalizada.
    api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
    // Plataforma de música: netease=Netease Cloud Music, tencent=QQ Music, kugou=Kugou Music, xiami=Xiami Music, baidu=Baidu Music
    server: "netease", // Mantener en inglés ya que es un identificador
    // Tipo: song=canción, playlist=lista de reproducción, album=álbum, search=búsqueda, artist=artista
    type: "playlist", // Mantener en inglés ya que es un identificador
    // ID de la lista de reproducción/álbum/canción o palabra clave de búsqueda
    id: "10046455237",
    // Token de autenticación (opcional)
    auth: "",
    // Configuración de API de respaldo (se usa cuando la API principal falla)
    fallbackApis: [
      "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
      "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
    ],
  },

  // Configuración de música local (se usa cuando el modo es 'local')
  // 1. Admite la ruta del archivo de letras
  // lrc: "/assets/music/lrc/hacer-un-corazon-libre-de-tristeza-tararear.lrc",
  // 2. O directamente el contenido de la cadena de letras
  // lrc: "[00:00.00]Contenido de la letra...",
  local: {
    playlist: [
      {
        name: "Hacer un corazón libre de tristeza",
        artist: "Petirrojo / HOYO-MiX / Chevy",
        url: "/assets/music/hacer-un-corazon-libre-de-tristeza-tararear.mp3",
        cover: "/assets/music/cover/109951169585655912.webp",
        lrc: "",
      },
    ],
  },
};
