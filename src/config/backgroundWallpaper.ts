import type { BackgroundWallpaperConfig } from "@/types/config";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
  // Modo de fondo de pantalla: "banner" para banner, "overlay" para superposición de pantalla completa, "none" para color sólido sin fondo de pantalla
  mode: "banner",
  // Permite al usuario cambiar el modo de fondo de pantalla a través de la barra de navegación. Establecer en false puede mejorar el rendimiento (solo renderiza el modo actual).
  switchable: true,
  /**
   * Configuración de la imagen de fondo
   * Las rutas de imagen admiten tres formatos:
   * 1. Directorio public (comienza con "/", no optimizado): "/assets/images/banner.avif"
   * 2. Directorio src (no comienza con "/", optimizado automáticamente pero aumenta el tiempo de construcción, recomendado): "assets/images/banner.avif"
   * 3. URL remota: "https://example.com/banner.jpg"
   * Nota: Las imágenes de URL remotas y del directorio public no se optimizarán. Asegúrate de que el tamaño de la imagen sea lo suficientemente pequeño para no afectar la velocidad de carga.
   *
   * Se recomienda no reemplazar las imágenes de ejemplo predeterminadas d1-d6, m1-m6, pero puedes eliminarlas para ahorrar espacio.
   * Esto se debe a que las imágenes de ejemplo pueden cambiar en el futuro, lo que podría sobrescribir tus imágenes personalizadas.
   * Por lo tanto, se sugiere usar otros nombres al usar tus propias imágenes, no d1-d6, m1-m6.
   *
   * Si solo usas una imagen o una API de imagen aleatoria, se recomienda usar directamente el formato de cadena:
   * desktop: "https://t.alcy.cc/pc",   // API de imagen aleatoria
   * desktop: "https://example.com/d1.avif", // Imagen única
   *
   * mobile: "https://t.alcy.cc/mp", // API de imagen aleatoria
   * mobile: "https://example.com/m1.avif", // Imagen única
   *
   * Admite la configuración de múltiples imágenes (array), mostrando una al azar cada vez que se actualiza la página:
   * desktop: [
   * "assets/images/d1.avif",
   * "assets/images/d2.avif",
   * ],
   *
   * mobile:[
   *   "assets/images/m1.avif",
   *   "assets/images/m2.avif",
   * ],
   */
  src: {
    // Imagen de fondo de escritorio (admite una sola o múltiples aleatorias)
    // desktop: "https://example.com/d1.avif",
    desktop: [
      "assets/images/DesktopWallpaper/d1.avif",
      "assets/images/DesktopWallpaper/d2.avif",
      "assets/images/DesktopWallpaper/d3.avif",
      "assets/images/DesktopWallpaper/d4.avif",
      "assets/images/DesktopWallpaper/d5.avif",
      "assets/images/DesktopWallpaper/d6.avif",
    ],
    // Imagen de fondo móvil (admite una sola o múltiples aleatorias)
    // mobile: "https://example.com/m1.avif",
    mobile: [
      "assets/images/MobileWallpaper/m1.avif",
      "assets/images/MobileWallpaper/m2.avif",
      "assets/images/MobileWallpaper/m3.avif",
      "assets/images/MobileWallpaper/m4.avif",
      "assets/images/MobileWallpaper/m5.avif",
      "assets/images/MobileWallpaper/m6.avif",
    ],
  },
  // Configuración específica del modo Banner
  banner: {
    // Posición de la imagen
    // Admite todos los valores de CSS object-position, como: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'...
    // Si no sabes cómo configurar porcentajes, se recomienda usar directamente: 'center' para centrar, 'top' para centrar en la parte superior, 'bottom' para centrar en la parte inferior, 'left' para centrar a la izquierda, 'right' para centrar a la derecha.
    position: "0% 20%",

    // Texto del banner de la página de inicio
    homeText: {
      // Habilitar texto del banner de la página de inicio
      enable: true,
      // Permite al usuario alternar la visualización del título del banner a través del panel de control
      switchable: true,
      // Título principal del banner de la página de inicio
      title: "Lovely firefly!",
      // Tamaño de fuente del título principal del banner de la página de inicio
      titleSize: "3.8rem",
      // Subtítulo del banner de la página de inicio
      subtitle: [
        "In Reddened Chrysalis, I Once Rest",
        "From Shattered Sky, I Free Fall",
        "Amidst Silenced Stars, I Deep Sleep",
        "Upon Lighted Fyrefly, I Soon Gaze",
        "From Undreamt Night, I Thence Shine",
        "In Finalized Morrow, I Full Bloom", // Este ya está en inglés, no necesita traducción
      ],
      // Tamaño de fuente del subtítulo del banner de la página de inicio
      subtitleSize: "1.5rem",
      typewriter: {
        // Habilitar efecto de máquina de escribir
        // Máquina de escribir activada → muestra todos los subtítulos en bucle
        // Máquina de escribir desactivada → muestra un subtítulo aleatorio en cada actualización
        enable: true,
        // Velocidad de escritura (milisegundos)
        speed: 100,
        // Velocidad de borrado (milisegundos)
        deleteSpeed: 50,
        // Tiempo de pausa después de la visualización completa (milisegundos)
        pauseTime: 2000,
      },
    },
    // Crédito de la imagen
    credit: {
      enable: {
        // Mostrar texto de crédito de la imagen del banner en escritorio
        desktop: true,
        // Mostrar texto de crédito de la imagen del banner en móvil
        mobile: true,
      },
      text: {
        // Texto de crédito a mostrar en escritorio
        desktop: "Pixiv - 晚晚喵",
        // Texto de crédito a mostrar en móvil
        mobile: "Pixiv - KiraraShss",
      },
      url: {
        // URL del arte original o la página del artista para escritorio
        desktop: "https://www.pixiv.net/users/108801776",
        // URL del arte original o la página del artista para móvil
        mobile: "https://www.pixiv.net/users/42715864",
      },
    },
    // Configuración de la barra de navegación del banner
    navbar: {
      // Modo de transparencia de la barra de navegación del banner: "semi" semitransparente, "full" completamente transparente, "semifull" transparencia dinámica
      transparentMode: "semifull",
      // Habilitar efecto de desenfoque de cristal esmerilado. Habilitarlo puede afectar el rendimiento de la página. Si no se habilita, será semitransparente. Habilítalo según tus preferencias.
      enableBlur: true,
      // Grado de desenfoque de cristal esmerilado
      blur: 3,
    },
    // Configuración del efecto de animación de ondas de agua. Habilitarlo puede afectar el rendimiento de la página. Habilítalo según tus preferencias.
    waves: {
      enable: {
        // Habilitar efecto de animación de ondas de agua en escritorio
        desktop: true,
        // Habilitar efecto de animación de ondas de agua en móvil
        mobile: true,
      },
      // Permite al usuario alternar la animación de ondas de agua a través del panel de control
      switchable: true,
    },
  },
  // Configuración específica del modo de superposición de pantalla completa
  overlay: {
    // Z-index, asegura que el fondo de pantalla esté en la capa de fondo
    zIndex: -1,
    // Opacidad del fondo de pantalla
    opacity: 0.8,
    // Grado de desenfoque del fondo
    blur: 1,
  },
};
