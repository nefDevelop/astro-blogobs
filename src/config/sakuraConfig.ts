import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
  // Habilitar efecto de cerezo
  enable: false,

  // Cantidad de cerezos
  sakuraNum: 21,

  // Límite de veces que los cerezos pueden salirse de los límites, -1 para bucle infinito
  limitTimes: -1,

  // Tamaño del cerezo
  size: {
    // Multiplicador de tamaño mínimo del cerezo
    min: 0.5,
    // Multiplicador de tamaño máximo del cerezo
    max: 1.1,
  },

  // Opacidad del cerezo
  opacity: {
    // Opacidad mínima del cerezo
    min: 0.3,
    // Opacidad máxima del cerezo
    max: 0.9,
  },

  // Velocidad de movimiento del cerezo
  speed: {
    // Movimiento horizontal
    horizontal: {
      // Velocidad mínima de movimiento horizontal
      min: -1.7,
      // Velocidad máxima de movimiento horizontal
      max: -1.2,
    },
    // Movimiento vertical
    vertical: {
      // Velocidad mínima de movimiento vertical
      min: 1.5,
      // Velocidad máxima de movimiento vertical
      max: 2.2,
    },
    // Velocidad de rotación
    rotation: 0.03,
    // Velocidad de desaparición, no debe ser mayor que la opacidad mínima
    fadeSpeed: 0.03,
  },

  // Z-index, asegura que los cerezos se muestren en el nivel adecuado
  zIndex: 100, // Z-index
};
