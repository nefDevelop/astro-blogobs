import {
  BANNER_HEIGHT_EXTEND,
  DARK_MODE,
  DEFAULT_THEME,
  LIGHT_MODE,
  SYSTEM_MODE,
  WALLPAPER_BANNER,
  WALLPAPER_NONE,
  WALLPAPER_OVERLAY,
} from "@constants/constants";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import { backgroundWallpaper, expressiveCodeConfig, siteConfig } from "../config";
import { isHomePage as checkIsHomePage } from "./layout-utils";

// Declare global functions
declare global {
  interface Window {
    initSemifullScrollDetection?: () => void;
    semifullScrollHandler?: () => void;
  }
}

export function getDefaultHue(): number {
  const fallback = "250";
  // Comprueba si está en un entorno de navegador
  if (typeof document === "undefined") {
    return Number.parseInt(fallback, 10);
  }
  const configCarrier = document.getElementById("config-carrier");
  return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getDefaultTheme(): LIGHT_DARK_MODE {
  // Si defaultMode está configurado en el archivo de configuración, usa el valor configurado.
  // De lo contrario, usa DEFAULT_THEME (compatibilidad con versiones anteriores).
  return siteConfig.themeColor.defaultMode ?? DEFAULT_THEME;
}

// 获取系统主题
export function getSystemTheme(): LIGHT_DARK_MODE {
  if (typeof window === "undefined") {
    return LIGHT_MODE;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_MODE : LIGHT_MODE;
}

// 解析主题（如果是system模式，则获取系统主题）
export function resolveTheme(theme: LIGHT_DARK_MODE): LIGHT_DARK_MODE {
  if (theme === SYSTEM_MODE) {
    return getSystemTheme();
  }
  return theme;
}

export function getHue(): number {
  // Primero comprueba el objeto global
  if (typeof window === "undefined" || !window.localStorage) {
    return getDefaultHue();
  }
  const stored = localStorage.getItem("hue");
  return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
  // Primero comprueba si está en un entorno de navegador
  if (typeof window === "undefined" || !window.localStorage || typeof document === "undefined") {
    return;
  }
  localStorage.setItem("hue", String(hue));
  const r = document.querySelector(":root") as HTMLElement;
  if (!r) {
    return;
  }
  r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
  // Comprueba si está en un entorno de navegador
  if (typeof document === "undefined") {
    return;
  }

  // Resuelve el tema
  const resolvedTheme = resolveTheme(theme);

  // Obtiene la información completa del estado actual del tema
  const currentIsDark = document.documentElement.classList.contains("dark");
  const currentTheme = document.documentElement.getAttribute("data-theme");

  // 计算目标主题状态
  let targetIsDark = false; // 初始化默认值
  switch (resolvedTheme) {
    case LIGHT_MODE:
      targetIsDark = false;
      break;
    case DARK_MODE:
      targetIsDark = true;
      break;
    default:
      // Maneja el caso predeterminado, usa el estado actual del tema
      targetIsDark = currentIsDark;
      break;
  }

  // Detecta si realmente se necesita un cambio de tema:
  // 1. Si el estado de la clase 'dark' ha cambiado.
  // 2. Si el tema de expressiveCode necesita ser actualizado.
  const needsThemeChange = currentIsDark !== targetIsDark;
  const expectedTheme = targetIsDark ? expressiveCodeConfig.darkTheme : expressiveCodeConfig.lightTheme;
  const needsCodeThemeUpdate = currentTheme !== expectedTheme;

  // 如果既不需要主题切换也不需要代码主题更新，直接返回
  if (!needsThemeChange && !needsCodeThemeUpdate) {
    return;
  }

  // 批量 DOM 操作，减少重绘
  if (needsThemeChange) {
    // Añade una clase de protección de transición (pero causaría muchas repintadas, por lo que se usa un método más ligero).
    // document.documentElement.classList.add("is-theme-transitioning");

    // Cambia directamente el tema, utilizando las propiedades de las variables CSS para que el navegador optimice la transición.
    if (targetIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Set the theme for Expressive Code based on current mode
  if (needsCodeThemeUpdate) {
    document.documentElement.setAttribute("data-theme", expectedTheme);
  }
}

// 系统主题监听器引用
let systemThemeListener: // Referencia al listener del tema del sistema
  ((e: MediaQueryListEvent | MediaQueryList) => void) | null = null;

export function setTheme(theme: LIGHT_DARK_MODE): void {
  // Comprueba si está en un entorno de navegador
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.setItem !== "function" // Comprueba si setItem es una función
  ) {
    return;
  }

  // 先应用主题
  applyThemeToDocument(theme);

  // Guarda en localStorage
  localStorage.setItem("theme", theme);

  // Si se cambia al modo 'system', es necesario escuchar los cambios del tema del sistema.
  if (theme === SYSTEM_MODE) {
    setupSystemThemeListener();
  } else {
    // Si se cambia a otro modo, elimina el listener del tema del sistema.
    cleanupSystemThemeListener();
  }
}

// 设置系统主题监听器
export function setupSystemThemeListener() {
  // Primero limpia los listeners anteriores
  cleanupSystemThemeListener();

  if (typeof window === "undefined") {
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Callback para manejar los cambios del tema del sistema
  const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const isDark = e.matches;
    const currentIsDark = document.documentElement.classList.contains("dark");

    // Si el estado del tema no ha cambiado, retorna directamente.
    if (currentIsDark === isDark) {
      return;
    }

    // 直接应用系统主题，不使用过渡保护类以避免大量重绘
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Set the theme for Expressive Code
    const expressiveTheme = isDark // Establece el tema para Expressive Code
      ? expressiveCodeConfig.darkTheme
      : expressiveCodeConfig.lightTheme;
    document.documentElement.setAttribute("data-theme", expressiveTheme);

    // Dispara un evento personalizado para notificar a otros componentes (solo se dispara cuando realmente hay un cambio).
    window.dispatchEvent(new CustomEvent("theme-change"));
  };

  // Llama una vez inmediatamente para establecer el estado inicial.
  handleSystemThemeChange(mediaQuery);

  // 监听系统主题变化（现代浏览器）
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else {
    // 兼容旧浏览器
    mediaQuery.addListener(handleSystemThemeChange);
  }

  systemThemeListener = handleSystemThemeChange;
}

// 清理系统主题监听器
function cleanupSystemThemeListener() {
  // Limpia el listener del tema del sistema
  if (typeof window === "undefined" || !systemThemeListener) {
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (mediaQuery.removeEventListener) {
    mediaQuery.removeEventListener("change", systemThemeListener);
  } else {
    // 兼容旧浏览器
    mediaQuery.removeListener(systemThemeListener);
  }

  systemThemeListener = null;
}

export function getStoredTheme(): LIGHT_DARK_MODE {
  // Comprueba si está en un entorno de navegador
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.getItem !== "function" // Comprueba si getItem es una función
  ) {
    return getDefaultTheme();
  }
  return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme();
}

// Inicializa el listener del tema (para después de la carga de la página)
export function initThemeListener() {
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.getItem !== "function" // Comprueba si getItem es una función
  ) {
    return;
  }

  const theme = getStoredTheme();

  // Si el tema es 'system', es necesario escuchar los cambios del tema del sistema.
  if (theme === SYSTEM_MODE) {
    setupSystemThemeListener();
  }
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE) {
  // Comprueba si se permite cambiar el modo de fondo de pantalla.
  const isSwitchable = backgroundWallpaper.switchable ?? true;
  if (!isSwitchable) {
    // Si no se permite el cambio, retorna directamente sin realizar ninguna operación.
    return;
  }

  // 获取当前的壁纸模式
  const currentMode = (document.documentElement.getAttribute("data-wallpaper-mode") as WALLPAPER_MODE) || backgroundWallpaper.mode;

  // Si el modo no ha cambiado, retorna directamente.
  if (currentMode === mode) {
    // Incluso si es el mismo modo, asegúrate de que el estado de la UI sea correcto.
    ensureWallpaperState(mode);
    return;
  }

  // Añade una clase de protección de transición.
  document.documentElement.classList.add("is-wallpaper-transitioning");

  // Actualiza el atributo de datos.
  document.documentElement.setAttribute("data-wallpaper-mode", mode);

  // Usa requestAnimationFrame para asegurar que se ejecute en el siguiente frame, evitando el parpadeo.
  requestAnimationFrame(() => {
    const body = document.body;

    // Elimina todas las clases CSS relacionadas con el fondo de pantalla.
    body.classList.remove("enable-banner", "wallpaper-transparent");

    // Añade las clases CSS correspondientes según el modo.
    switch (mode) {
      case WALLPAPER_BANNER:
        body.classList.add("enable-banner");
        showBannerMode();
        break;
      case WALLPAPER_OVERLAY:
        body.classList.add("wallpaper-transparent");
        showOverlayMode();
        break;
      case WALLPAPER_NONE:
        hideAllWallpapers();
        break;
      default:
        hideAllWallpapers();
        break;
    }

    // Actualiza el modo de transparencia de la barra de navegación.
    updateNavbarTransparency(mode);

    // Elimina la clase de protección de transición en el siguiente frame.
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-wallpaper-transitioning");
    });
  });
}

// 确保壁纸状态正确
function ensureWallpaperState(mode: WALLPAPER_MODE) {
  // Asegura que el estado del fondo de pantalla sea correcto.
  const body = document.body;

  // Elimina todas las clases CSS relacionadas con el fondo de pantalla.
  body.classList.remove("enable-banner", "wallpaper-transparent");

  // Añade las clases CSS correspondientes según el modo.
  switch (mode) {
    case WALLPAPER_BANNER:
      body.classList.add("enable-banner");
      showBannerMode();
      break;
    case WALLPAPER_OVERLAY:
      body.classList.add("wallpaper-transparent");
      showOverlayMode();
      break;
    case WALLPAPER_NONE:
      hideAllWallpapers();
      break;
  }

  // Actualiza el modo de transparencia de la barra de navegación.
  updateNavbarTransparency(mode);
}

function showBannerMode() {
  // Muestra el 'wallpaper-wrapper' y cambia al modo banner.
  const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
  if (wallpaperWrapper) {
    // Elimina la clase de modo overlay.
    wallpaperWrapper.classList.remove("wallpaper-overlay");

    // Restaura la posición 'top' del modo banner.
    wallpaperWrapper.style.top = `-${BANNER_HEIGHT_EXTEND}vh`;

    // Comprueba si la página actual es la página de inicio.
    const isHomePage = checkIsHomePage(window.location.pathname);
    const isMobile = window.innerWidth < 1024; // Comprueba si es un dispositivo móvil.

    // 移动端非首页时，不显示banner；桌面端始终显示
    if (isMobile && !isHomePage) {
      wallpaperWrapper.style.display = "none";
      wallpaperWrapper.classList.add("mobile-hide-banner");
    } else {
      // 首页或桌面端：先设置display，然后使用requestAnimationFrame确保渲染
      wallpaperWrapper.style.display = "block";
      wallpaperWrapper.style.setProperty("display", "block", "important");
      requestAnimationFrame(() => {
        wallpaperWrapper.classList.remove("hidden");
        wallpaperWrapper.classList.remove("opacity-0");
        wallpaperWrapper.classList.add("opacity-100");
        wallpaperWrapper.classList.remove("mobile-hide-banner");
      });
    }
  }

  // Muestra el texto de crédito de la imagen del banner.
  const creditDesktop = document.getElementById("banner-credit-desktop");
  const creditMobile = document.getElementById("banner-credit-mobile");
  if (creditDesktop) creditDesktop.style.display = "";
  if (creditMobile) creditMobile.style.display = "";

  // Muestra el texto del banner de la página de inicio (si está habilitado y es la página de inicio).
  const bannerTextOverlay = document.querySelector(".banner-text-overlay");
  if (bannerTextOverlay) {
    // Comprueba si homeText está habilitado.
    const homeTextEnabled = backgroundWallpaper.banner?.homeText?.enable;

    // Comprueba si la página actual es la página de inicio.
    const isHomePage = checkIsHomePage(window.location.pathname);

    // 只有在启用且在首页时才显示
    if (homeTextEnabled && isHomePage) {
      bannerTextOverlay.classList.remove("hidden");
    } else {
      bannerTextOverlay.classList.add("hidden");
    }
  }

  // Ajusta la posición del contenido principal.
  adjustMainContentPosition("banner");

  // Maneja la posición del área de contenido principal en dispositivos móviles que no son la página de inicio.
  const mainContentWrapper = document.querySelector(".absolute.w-full.z-30");
  if (mainContentWrapper) {
    const isHomePage = checkIsHomePage(window.location.pathname); // Comprueba si es la página de inicio.
    const isMobile = window.innerWidth < 1024;
    // 只在移动端非首页时调整主内容位置
    if (isMobile && !isHomePage) {
      mainContentWrapper.classList.add("mobile-main-no-banner");
    } else {
      mainContentWrapper.classList.remove("mobile-main-no-banner");
    }
  }

  // Elimina el efecto de transparencia (el modo banner no usa semitransparencia).
  adjustMainContentTransparency(false);

  // Ajusta la transparencia de la barra de navegación.
  const navbar = document.getElementById("navbar");
  if (navbar) {
    // Obtiene la configuración del modo de transparencia de la barra de navegación (modo banner).
    const transparentMode = backgroundWallpaper.banner?.navbar?.transparentMode || "semi";
    navbar.setAttribute("data-transparent-mode", transparentMode);

    // Reinicializa la detección de desplazamiento en modo semitransparente (si es necesario).
    if (transparentMode === "semifull" && typeof window.initSemifullScrollDetection === "function") {
      window.initSemifullScrollDetection();
    }
  }
}

function showOverlayMode() {
  // Cambia el 'wallpaper-wrapper' al modo overlay.
  const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
  if (wallpaperWrapper) {
    // Añade la clase de modo overlay.
    wallpaperWrapper.classList.add("wallpaper-overlay");
    // 显示壁纸
    wallpaperWrapper.style.display = "block";
    wallpaperWrapper.style.setProperty("display", "block", "important");
    wallpaperWrapper.style.top = "";
    requestAnimationFrame(() => {
      wallpaperWrapper.classList.remove("hidden");
      wallpaperWrapper.classList.remove("opacity-0");
      wallpaperWrapper.classList.add("opacity-100");
      wallpaperWrapper.classList.remove("mobile-hide-banner");
    });
  }

  // Oculta el texto de crédito de la imagen del banner.
  const creditDesktop = document.getElementById("banner-credit-desktop");
  const creditMobile = document.getElementById("banner-credit-mobile");
  if (creditDesktop) creditDesktop.style.display = "none";
  if (creditMobile) creditMobile.style.display = "none";

  // Oculta el texto del banner de la página de inicio.
  const bannerTextOverlay = document.querySelector(".banner-text-overlay");
  if (bannerTextOverlay) {
    bannerTextOverlay.classList.add("hidden");
  }

  // Ajusta la transparencia del contenido principal.
  adjustMainContentTransparency(true);

  // Ajusta el diseño al modo compacto.
  adjustMainContentPosition("overlay");
}

function hideAllWallpapers() {
  // Oculta todos los fondos de pantalla.
  // Oculta el fondo de pantalla.
  const wallpaperWrapper = document.getElementById("wallpaper-wrapper");

  if (wallpaperWrapper) {
    wallpaperWrapper.style.display = "none";
    wallpaperWrapper.classList.add("hidden");
    wallpaperWrapper.classList.add("opacity-0");
    wallpaperWrapper.classList.remove("wallpaper-overlay");
  }

  // Oculta el texto de crédito de la imagen del banner.
  const creditDesktop = document.getElementById("banner-credit-desktop");
  const creditMobile = document.getElementById("banner-credit-mobile");
  if (creditDesktop) creditDesktop.style.display = "none";
  if (creditMobile) creditMobile.style.display = "none";

  // Oculta el texto del banner de la página de inicio.
  const bannerTextOverlay = document.querySelector(".banner-text-overlay");
  if (bannerTextOverlay) {
    bannerTextOverlay.classList.add("hidden");
  }

  // Ajusta la posición y transparencia del contenido principal.
  adjustMainContentPosition("none");
  adjustMainContentTransparency(false);
}

function updateNavbarTransparency(mode: WALLPAPER_MODE) {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let transparentMode: string;
  let enableBlur: boolean;

  // Configura el modo de transparencia de la barra de navegación y el efecto de desenfoque según el modo de fondo de pantalla actual.
  if (mode === WALLPAPER_OVERLAY) {
    // Modo de fondo de pantalla de pantalla completa
    transparentMode = "none";
    enableBlur = false;
  } else if (mode === WALLPAPER_NONE) {
    // Modo de fondo de color sólido
    transparentMode = "none";
    enableBlur = false;
  } else {
    // Modo Banner: usa el modo de transparencia y el efecto de desenfoque configurados.
    transparentMode = backgroundWallpaper.banner?.navbar?.transparentMode || "semi";
    enableBlur = backgroundWallpaper.banner?.navbar?.enableBlur ?? true;
  }

  // Actualiza el atributo de modo transparente de la barra de navegación.
  navbar.setAttribute("data-transparent-mode", transparentMode);
  navbar.setAttribute("data-enable-blur", String(enableBlur));

  // Elimina las clases de modo transparente existentes.
  navbar.classList.remove("navbar-transparent-semi", "navbar-transparent-full", "navbar-transparent-semifull");

  // 移除scrolled类
  navbar.classList.remove("scrolled"); // Elimina la clase 'scrolled'.

  // Función de detección de desplazamiento
  if (transparentMode === "semifull" && mode === WALLPAPER_BANNER && typeof window.initSemifullScrollDetection === "function") {
    // Habilita la detección de desplazamiento solo en el modo 'semifull' del Banner.
    window.initSemifullScrollDetection();
  } else if (window.semifullScrollHandler) {
    // Elimina el listener de desplazamiento.
    window.removeEventListener("scroll", window.semifullScrollHandler);
    delete window.semifullScrollHandler;
  }
}

function adjustMainContentPosition(mode: WALLPAPER_MODE | "banner" | "none" | "overlay") {
  const mainContent = document.querySelector(".absolute.w-full.z-30") as HTMLElement;
  if (!mainContent) return;

  // Elimina las clases de posición existentes.
  mainContent.classList.remove("mobile-main-no-banner", "no-banner-layout");

  switch (mode) {
    case "banner":
      // Modo Banner: el contenido principal está debajo del banner.
      mainContent.style.top = "calc(var(--banner-height) - 3rem)";
      break;
    case "overlay":
      // Modo Overlay: usa un diseño compacto, el contenido principal comienza debajo de la barra de navegación.
      mainContent.classList.add("no-banner-layout");
      mainContent.style.top = "5.5rem";
      break;
    case "none":
      // Modo sin fondo de pantalla: el contenido principal comienza debajo de la barra de navegación.
      mainContent.classList.add("no-banner-layout");
      mainContent.style.top = "5.5rem";
      break;
    default:
      mainContent.style.top = "5.5rem";
      break;
  }
}

function adjustMainContentTransparency(enable: boolean) {
  const mainContent = document.querySelector(".absolute.w-full.z-30");
  const body = document.body;

  if (!mainContent || !body) return;

  if (enable) {
    mainContent.classList.add("wallpaper-transparent");
    body.classList.add("wallpaper-transparent");
  } else {
    mainContent.classList.remove("wallpaper-transparent");
    body.classList.remove("wallpaper-transparent");
  }
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
  // 检查是否在浏览器环境中
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.setItem !== "function" // Comprueba si setItem es una función
  ) {
    return;
  }
  localStorage.setItem("wallpaperMode", mode);
  applyWallpaperModeToDocument(mode);
}

export function initWallpaperMode(): void {
  const storedMode = getStoredWallpaperMode();
  applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
  // Comprueba si está en un entorno de navegador
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.getItem !== "function" // Comprueba si getItem es una función
  ) {
    return backgroundWallpaper.mode;
  }
  return (localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) || backgroundWallpaper.mode;
}

// Waves animation functions
export function getDefaultWavesEnabled(): boolean {
  const wavesConfig = backgroundWallpaper.banner?.waves?.enable;
  if (typeof wavesConfig === "object") {
    // Si es una configuración por dispositivo, comprueba el dispositivo actual.
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
    return isMobile ? (wavesConfig.mobile ?? false) : (wavesConfig.desktop ?? false);
  }
  return wavesConfig ?? false;
}

export function getStoredWavesEnabled(): boolean {
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.getItem !== "function" // Comprueba si getItem es una función
  ) {
    return getDefaultWavesEnabled();
  }
  const stored = localStorage.getItem("wavesEnabled");
  if (stored === null) {
    return getDefaultWavesEnabled();
  }
  return stored === "true";
}

export function setWavesEnabled(enabled: boolean): void {
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.setItem !== "function" // Comprueba si setItem es una función
  ) {
    return;
  }
  localStorage.setItem("wavesEnabled", String(enabled));
  applyWavesEnabledToDocument(enabled);
}

export function applyWavesEnabledToDocument(enabled: boolean): void {
  if (typeof document === "undefined") {
    return;
  } // Si no está en un entorno de navegador, retorna.
  // Actualiza el atributo html, el CSS surtirá efecto inmediatamente.
  document.documentElement.setAttribute("data-waves-enabled", String(enabled));
  // 同时更新元素样式（兼容性）
  const wavesElement = document.getElementById("header-waves");
  if (wavesElement) {
    if (enabled) {
      wavesElement.style.display = "";
      wavesElement.classList.remove("waves-disabled");
    } else {
      wavesElement.style.display = "none";
      wavesElement.classList.add("waves-disabled");
    }
  }
}

// Banner title functions
export function getDefaultBannerTitleEnabled(): boolean {
  return backgroundWallpaper.banner?.homeText?.enable ?? true;
}

export function getStoredBannerTitleEnabled(): boolean {
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.getItem !== "function" // Comprueba si getItem es una función
  ) {
    return getDefaultBannerTitleEnabled();
  }
  const stored = localStorage.getItem("bannerTitleEnabled");
  if (stored === null) {
    return getDefaultBannerTitleEnabled();
  }
  return stored === "true";
}

export function setBannerTitleEnabled(enabled: boolean): void {
  if (
    typeof localStorage === "undefined" || // Comprueba si localStorage está disponible
    typeof localStorage.setItem !== "function" // Comprueba si setItem es una función
  ) {
    return;
  }
  localStorage.setItem("bannerTitleEnabled", String(enabled));
  applyBannerTitleEnabledToDocument(enabled);
}

export function applyBannerTitleEnabledToDocument(enabled: boolean): void {
  if (typeof document === "undefined") {
    return;
  } // Si no está en un entorno de navegador, retorna.
  // Actualiza el atributo html, el CSS surtirá efecto inmediatamente.
  document.documentElement.setAttribute("data-banner-title-enabled", String(enabled));
  // 同时更新元素样式（兼容性）
  const bannerTextOverlay = document.querySelector(".banner-text-overlay") as HTMLElement;
  if (bannerTextOverlay) {
    if (enabled) {
      bannerTextOverlay.classList.remove("user-hidden");
    } else {
      bannerTextOverlay.classList.add("user-hidden");
    }
  }
}
