import type { CoverImageConfig } from "../types/config";

/**
 * 文章封面图配置
 *
 * enableInPost - Si se muestra la imagen de portada en la página de detalles del artículo
 *
 * Instrucciones para usar imágenes de portada aleatorias:
 * 1. Agrega image: "api" en el Frontmatter del artículo para usar la función de imagen aleatoria.
 * 2. El sistema intentará todas las APIs configuradas en secuencia, y si todas fallan, usará la imagen de respaldo.
 *
 * // Ejemplo de Frontmatter del artículo:
 * ---
 * title: Título del artículo
 * image: "api"
 * ---
 */
export const coverImageConfig: CoverImageConfig = {
  // Habilitar la imagen de portada en la página de detalles del artículo
  enableInPost: true, // Si se muestra la imagen de portada en la página de detalles del artículo

  randomCoverImage: {
    // Interruptor de la función de imagen de portada aleatoria
    enable: false,
    // Lista de APIs de imágenes de portada
    apis: ["https://t.alcy.cc/pc", "https://www.dmoe.cc/random.php", "https://uapis.cn/api/v1/random/image?category=acg&type=pc"],
    // Imagen de respaldo cuando la API falla
    fallback: "assets/images/cover.avif",
    // Mostrar animación de carga
    showLoading: false,
  },
};
