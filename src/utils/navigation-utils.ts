import { url } from "@/utils/url-utils";
/**
 * Funciones de utilidad de navegación
 * Proporciona una funcionalidad de navegación de página unificada, compatible con la navegación sin recarga de Swup.
 */

/**
 * Navega a la página especificada
 * @param url 目标页面URL
 * @param options 导航选项
 */
export function navigateToPage(
  url: string,
  options?: {
    replace?: boolean;
    force?: boolean;
  },
): void {
  // 检查 URL 是否有效
  if (!url || typeof url !== "string") {
    console.warn("navigateToPage: URL proporcionada no válida");
    return;
  }

  // 如果是外部链接，直接跳转
  if (
    url.startsWith("http://") || // Si es un enlace externo, abre en una nueva pestaña.
    url.startsWith("https://") ||
    url.startsWith("//")
  ) {
    window.open(url, "_blank");
    return;
  }

  // Si es un enlace de anclaje, desplázate a la posición correspondiente.
  if (url.startsWith("#")) {
    const element = document.getElementById(url.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Desplázate suavemente a la vista.
    }
    return;
  }

  // 检查 Swup 是否可用
  if (typeof window !== "undefined" && window.swup) {
    try {
      // Usa Swup para la navegación sin recarga.
      if (options?.replace) {
        window.swup.navigate(url, { history: false });
      } else {
        window.swup.navigate(url);
      }
    } catch (error) {
      console.error("La navegación de Swup falló:", error);
      // Retrocede a la navegación normal.
      fallbackNavigation(url, options);
    }
  } else {
    // Swup 不可用时的降级处理
    fallbackNavigation(url, options);
  }
}

/**
 * Función de navegación de respaldo
 * Utiliza la navegación de página normal cuando Swup no está disponible.
 */
function fallbackNavigation(
  url: string,
  options?: {
    replace?: boolean;
    force?: boolean;
  },
): void {
  if (options?.replace) {
    window.location.replace(url);
  } else {
    window.location.href = url;
  }
}

/**
 * Comprueba si Swup está listo
 */
export function isSwupReady(): boolean {
  return typeof window !== "undefined" && !!window.swup;
}

/**
 * Espera a que Swup esté listo
 * @param timeout Tiempo de espera (milisegundos)
 */
export function waitForSwup(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isSwupReady()) {
      resolve(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const checkSwup = () => {
      // Función para comprobar el estado de Swup.
      if (isSwupReady()) {
        clearTimeout(timeoutId);
        document.removeEventListener("swup:enable", checkSwup);
        resolve(true);
      }
    };

    // Escucha el evento de habilitación de Swup.
    document.addEventListener("swup:enable", checkSwup);

    // Establece el tiempo de espera.
    timeoutId = setTimeout(() => {
      document.removeEventListener("swup:enable", checkSwup);
      resolve(false);
    }, timeout);
  });
}

/**
 * Precarga una página
 * @param url URL de la página a precargar
 */
export function preloadPage(url: string): void {
  if (!url || typeof url !== "string") {
    return;
  }

  // Si Swup está disponible, usa su función de precarga.
  if (isSwupReady() && window.swup.preload) {
    try {
      window.swup.preload(url); // Precarga la URL.
    } catch (error) {
      console.warn("Error al precargar la página:", error);
    }
  }
}

/**
 * Obtiene la ruta de la página actual
 */
export function getCurrentPath(): string {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * Comprueba si es la página de inicio
 */
export function isHomePage(): boolean {
  const path = getCurrentPath();
  return path === url("/") || path === url("");
}

/**
 * Comprueba si es una página de artículo
 */
export function isPostPage(): boolean {
  const path = getCurrentPath();
  return path.startsWith(url("/posts/"));
}

/**
 * Comprueba si dos rutas son iguales
 */
export function pathsEqual(path1: string, path2: string): boolean {
  // Normaliza las rutas (elimina la barra final).
  const normalize = (path: string) => {
    return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  };

  return normalize(path1) === normalize(path2);
}
