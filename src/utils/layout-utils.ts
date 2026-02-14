import { backgroundWallpaper } from "../config";

// Unifica un valor único o un array en un array.
const toArray = (src: string | string[] | undefined): string[] => {
  if (!src) return [];
  if (Array.isArray(src)) return src;
  return [src];
};

// Función de utilidad para el manejo de imágenes de fondo
// 返回所有配置的图片（用于构建时渲染所有图片）
export const getBackgroundImages = () => {
  const bgSrc = backgroundWallpaper.src;

  if (typeof bgSrc === "object" && bgSrc !== null && !Array.isArray(bgSrc) && ("desktop" in bgSrc || "mobile" in bgSrc)) {
    const srcObj = bgSrc as {
      desktop?: string | string[];
      mobile?: string | string[];
    };
    const desktopImages = toArray(srcObj.desktop);
    const mobileImages = toArray(srcObj.mobile);
    return {
      desktop: desktopImages.length > 0 ? desktopImages : mobileImages,
      mobile: mobileImages.length > 0 ? mobileImages : desktopImages,
      isMultiple: desktopImages.length > 1 || mobileImages.length > 1,
    };
  }
  // Si es una cadena o un array, se usa tanto para escritorio como para móvil.
  const images = toArray(bgSrc as string | string[]);
  return {
    desktop: images,
    mobile: images,
    isMultiple: images.length > 1,
  };
};

// Función de guardia de tipo
export const isBannerSrcObject = (
  src: string | string[] | { desktop?: string | string[]; mobile?: string | string[] },
): src is { desktop?: string | string[]; mobile?: string | string[] } => {
  return typeof src === "object" && src !== null && !Array.isArray(src) && ("desktop" in src || "mobile" in src);
};

// 获取默认背景图片（返回第一张，用于 SEO 等场景）
// Obtiene la imagen de fondo predeterminada (devuelve la primera, utilizada para SEO y otros escenarios).
export const getDefaultBackground = (): string => {
  const images = getBackgroundImages();
  return images.desktop[0] || images.mobile[0] || "";
};

// Comprueba si es la página de inicio.
export const isHomePage = (pathname: string): boolean => {
  // Obtiene la URL base.
  const baseUrl = import.meta.env.BASE_URL || "/";
  const baseUrlNoSlash = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  if (pathname === baseUrl) return true;
  if (pathname === baseUrlNoSlash) return true;
  if (pathname === "/") return true;

  return false;
};

// Obtiene el desplazamiento del banner.
export const getBannerOffset = (position = "center") => {
  const bannerOffsetByPosition = {
    top: "100vh",
    center: "50vh",
    bottom: "0",
  };
  return bannerOffsetByPosition[position as keyof typeof bannerOffsetByPosition] || "50vh";
};
