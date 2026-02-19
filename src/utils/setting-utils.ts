import { backgroundWallpaper, siteConfig } from "../config";
import type { WALLPAPER_MODE } from "../types/config";

// Helper type for enable configurations that can be boolean or an object
type EnableConfigValue = boolean | { desktop: boolean; mobile: boolean };

// Helper function to resolve enable configurations
function resolveEnableConfig(configValue: EnableConfigValue | undefined, defaultValue: boolean): boolean {
  if (typeof configValue === "boolean") {
    return configValue;
  }
  if (typeof configValue === "object" && configValue !== null) {
    return configValue.desktop; // Prioritize desktop setting for a single boolean return
  }
  return defaultValue;
}
// Initialization functions
export function initThemeListener(): void {
  // Listen for storage changes to sync theme across tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
      const theme = event.newValue;
      if (theme) {
        applyThemeToDocument(theme);
      }
    }
    if (event.key === "hue") {
      const hue = event.newValue;
      if (hue) {
        applyHue(hue);
      }
    }
  });
}

// Theme functions
export function applyThemeToDocument(theme: string): void {
  const LIGHT_MODE = "light";
  const DARK_MODE = "dark";
  const SYSTEM_MODE = "system";

  function getSystemTheme(): string {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_MODE : LIGHT_MODE;
  }

  const resolvedTheme = theme === SYSTEM_MODE ? getSystemTheme() : theme;
  if (resolvedTheme === DARK_MODE) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function getStoredTheme(): string {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") {
    return siteConfig.themeColor.defaultMode ?? "light";
  }
  return localStorage.getItem("theme") || (siteConfig.themeColor.defaultMode ?? "light");
}

export function setTheme(theme: string): void {
  if (typeof localStorage === "undefined" || typeof localStorage.setItem !== "function") {
    return;
  }
  localStorage.setItem("theme", theme);
  applyThemeToDocument(theme);
}

export function getDefaultHue(): number {
  return siteConfig.themeColor.hue;
}

export function getHue(): number {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") {
    return getDefaultHue();
  }
  const storedHue = localStorage.getItem("hue");
  return storedHue ? Number(storedHue) : getDefaultHue();
}

export function applyHue(hue: string | number): void {
  document.documentElement.style.setProperty("--hue", String(hue));
}

export function setHue(hue: string | number): void {
  localStorage.setItem("hue", String(hue));
  applyHue(hue);
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE): void {
  if (typeof document === "undefined") {
    return;
  }

  const WALLPAPER_BANNER = "banner";
  const WALLPAPER_OVERLAY = "overlay";
  const WALLPAPER_NONE = "none";

  document.documentElement.setAttribute("data-wallpaper-mode", mode);

  // Use requestAnimationFrame to avoid layout thrashing
  requestAnimationFrame(() => {
    if (mode === WALLPAPER_NONE || mode === WALLPAPER_OVERLAY) {
      document.body.classList.remove("enable-banner");
      document.body.classList.add("no-banner-layout");
    } else {
      document.body.classList.add("enable-banner");
      document.body.classList.remove("no-banner-layout");
    }

    if (mode === WALLPAPER_OVERLAY) {
      document.body.classList.add("wallpaper-transparent");
    } else {
      document.body.classList.remove("wallpaper-transparent");
    }

    // Handle wallpaper wrapper visibility
    const wallpaperWrapper = document.getElementById("wallpaper-wrapper");
    if (wallpaperWrapper) {
      if (mode === WALLPAPER_OVERLAY) {
        wallpaperWrapper.classList.add("wallpaper-overlay");
        wallpaperWrapper.style.display = "block";
        wallpaperWrapper.classList.remove("hidden", "opacity-0", "mobile-hide-banner");
        wallpaperWrapper.classList.add("opacity-100");
      } else if (mode === WALLPAPER_NONE) {
        wallpaperWrapper.style.display = "none";
        wallpaperWrapper.classList.add("hidden", "opacity-0");
      } else {
        wallpaperWrapper.classList.remove("wallpaper-overlay");
        wallpaperWrapper.style.display = "block";
        wallpaperWrapper.classList.remove("mobile-hide-banner");
      }
    }
  });
}

export function initWallpaperMode(): void {
  const storedMode = getStoredWallpaperMode();
  applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") {
    return backgroundWallpaper.mode;
  }
  return (localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) || backgroundWallpaper.mode;
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
  if (typeof localStorage === "undefined" || typeof localStorage.setItem !== "function") {
    return;
  }
  localStorage.setItem("wallpaperMode", mode);
  applyWallpaperModeToDocument(mode);
}

// Banner title functions
export function getDefaultBannerTitleEnabled(): boolean {
  const enableConfig = backgroundWallpaper.banner?.homeText?.enable;
  return resolveEnableConfig(enableConfig, true); // Default to true if not specified
}

export function getStoredBannerTitleEnabled(): boolean {
  if (typeof localStorage === "undefined" || typeof localStorage.getItem !== "function") {
    return getDefaultBannerTitleEnabled();
  }
  const stored = localStorage.getItem("bannerTitleEnabled");
  if (stored === null) {
    return getDefaultBannerTitleEnabled();
  }
  return stored === "true";
}

export function setBannerTitleEnabled(enabled: boolean): void {
  if (typeof localStorage === "undefined" || typeof localStorage.setItem !== "function") {
    return;
  }
  localStorage.setItem("bannerTitleEnabled", String(enabled));
  applyBannerTitleEnabledToDocument(enabled);
}

export function applyBannerTitleEnabledToDocument(enabled: boolean): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-banner-title-enabled", String(enabled));
  const bannerTextOverlay = document.querySelector(".banner-text-overlay") as HTMLElement;
  if (bannerTextOverlay) {
    if (enabled) {
      bannerTextOverlay.classList.remove("user-hidden");
    } else {
      bannerTextOverlay.classList.add("user-hidden");
    }
  }
}

