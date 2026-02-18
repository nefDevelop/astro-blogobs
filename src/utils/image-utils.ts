import { coverImageConfig, siteConfig } from "@/config";
import type { ImageFormat } from "@/types/config";

const { randomCoverImage } = coverImageConfig;

/**
 * Procesa la imagen de portada del artículo
 * Cuando el campo 'image' es "api", devuelve una URL de API con un identificador único
 * @param image - Valor del campo 'image' en el frontmatter del artículo
 * @param seed - Semilla utilizada para generar una URL única (id o slug del artículo)
 */
export function processCoverImageSync(image: string | undefined, seed?: string): string {
  if (!image || image === "") {
    return "";
  }

  if (image !== "api") {
    return image;
  }

  if (!randomCoverImage.enable || !randomCoverImage.apis || randomCoverImage.apis.length === 0) {
    return "";
  }

  // Genera un hash basado en la semilla para asegurar que el mismo artículo siempre use la misma API y parámetros.
  const hash = seed
    ? seed.split("").reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0; // Bitwise operation for hashing
      }, 0)
    : 0;

  // 用hash确定性地选择API（同一篇文章始终选同一个API）
  const apiIndex = Math.abs(hash) % randomCoverImage.apis.length;
  let apiUrl = randomCoverImage.apis[apiIndex];

  // Añade un parámetro hash para asegurar que cada artículo obtenga una imagen diferente.
  if (seed) {
    const separator = apiUrl.includes("?") ? "&" : "?";
    apiUrl = `${apiUrl}${separator}v=${Math.abs(hash)}`;
  }

  return apiUrl;
}

/**
 * Obtiene la configuración de formato de optimización de imagen
 */
export function getImageFormats(): ImageFormat[] {
  const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
  switch (formatConfig) {
    case "avif":
      return ["avif"];
    case "webp":
      return ["webp"];
    default:
      return ["avif", "webp"];
  }
}

/**
 * Obtiene la configuración de calidad de optimización de imagen
 */
export function getImageQuality(): number {
  return siteConfig.imageOptimization?.quality ?? 80;
}

/**
 * Obtiene el formato de imagen de respaldo
 */
export function getFallbackFormat(): "avif" | "webp" {
  const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
  return formatConfig === "avif" ? "avif" : "webp";
}
