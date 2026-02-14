import type { Live2DModelConfig, SpineModelConfig } from "../types/config";

// Configuración de la chica de la mascota Spine
export const spineModelConfig: SpineModelConfig = {
  // Interruptor de la chica de la mascota Spine
  enable: false,

  // Configuración del modelo Spine
  model: {
    // Ruta del archivo del modelo Spine
    path: "/pio/models/spine/firefly/1310.json",
    // Escala del modelo
    scale: 1.0,
    // Desplazamiento en el eje X
    x: 0,
    // Desplazamiento en el eje Y
    y: 0,
  },

  // Configuración de posición
  position: {
    // Posición de visualización: bottom-left, bottom-right, top-left, top-right. Nota: en la esquina inferior derecha puede bloquear el botón de volver arriba.
    corner: "bottom-left", // Mantener en inglés ya que es un identificador
    // Desplazamiento X desde el borde
    offsetX: 0,
    // Desplazamiento Y desde el borde inferior
    offsetY: 0,
  },

  // Configuración de tamaño
  size: {
    // Ancho del contenedor
    width: 135,
    // Altura del contenedor
    height: 165,
  },

  // Configuración interactiva
  interactive: {
    // Interruptor de función interactiva
    enabled: true,
    // Lista de animaciones que se reproducen aleatoriamente al hacer clic
    clickAnimations: ["emoji_0", "emoji_1", "emoji_2", "emoji_3", "emoji_4", "emoji_5", "emoji_6"],
    // 点击时随机显示的文字消息
    clickMessages: [
      // Mensajes de texto que se muestran aleatoriamente al hacer clic
      "¡Hola! Soy Firefly~",
      "¡Hoy también hay que esforzarse! ✨",
      "¿Quieres ver las estrellas conmigo? 🌟",
      "¡Recuerda descansar bien~",
      "¿Hay algo que quieras decirme? 💫",
      "¡Exploremos juntos el mundo desconocido! 🚀",
      "Cada estrella tiene su propia historia~⭐",
      "¡Espero traerte calidez y alegría! 💖",
    ],
    // Tiempo de visualización del mensaje (milisegundos)
    messageDisplayTime: 3000,
    // Lista de animaciones en espera
    idleAnimations: ["idle", "emoji_0", "emoji_1", "emoji_3", "emoji_4"],
    // Intervalo de cambio de animación en espera (milisegundos)
    idleInterval: 8000,
  },

  // Configuración responsiva
  responsive: {
    // Ocultar en dispositivos móviles
    hideOnMobile: true, // Ocultar en dispositivos móviles
    // Punto de interrupción móvil
    mobileBreakpoint: 768,
  },

  // Z-index
  zIndex: 1000, // Z-index

  // Opacidad
  opacity: 1.0,
};

// Configuración de la chica de la mascota Live2D
export const live2dModelConfig: Live2DModelConfig = {
  // Interruptor de la chica de la mascota Live2D
  enable: false,
  // Configuración del modelo Live2D
  model: {
    // Ruta del archivo del modelo Live2D
    path: "/pio/models/live2d/snow_miku/model.json",
    // path: "/pio/models/live2d/illyasviel/illyasviel.model.json",
  },

  // Configuración de posición
  position: {
    // Posición de visualización: bottom-left, bottom-right, top-left, top-right. Nota: en la esquina inferior derecha puede bloquear el botón de volver arriba.
    corner: "bottom-left",
    // 距离边缘0px
    offsetX: 0,
    // 距离下边缘0px
    offsetY: 0,
  },

  // Configuración de tamaño
  size: {
    // Ancho del contenedor
    width: 135,
    // Altura del contenedor
    height: 165,
  },

  // Configuración interactiva
  interactive: {
    // Interruptor de función interactiva
    enabled: true,
    // Mensajes de texto que se muestran aleatoriamente al hacer clic. Las mociones y expresiones se leerán automáticamente del archivo JSON del modelo.
    clickMessages: [
      // Mensajes de texto que se muestran aleatoriamente al hacer clic
      "¡Hola! Soy Miku~",
      "¿Necesitas ayuda?",
      "¡Qué buen día hace hoy!",
      "¿Quieres jugar conmigo?",
      "¡Recuerda descansar a tiempo!",
    ],
    // Tiempo de visualización de los mensajes de texto aleatorios (milisegundos)
    messageDisplayTime: 3000,
  },

  // Configuración responsiva
  responsive: {
    // Ocultar en dispositivos móviles
    hideOnMobile: true, // Ocultar en dispositivos móviles
    // Punto de interrupción móvil
    mobileBreakpoint: 768,
  },
};
