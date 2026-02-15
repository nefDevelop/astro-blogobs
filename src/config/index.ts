// Archivo de índice de configuración - Exporta todas las configuraciones de forma unificada
// De esta manera, los componentes pueden importar múltiples configuraciones relacionadas a la vez, reduciendo las declaraciones de importación repetitivas.

// Exportación de tipos
export type {
  AnnouncementConfig,
  BackgroundWallpaperConfig,
  CommentConfig,
  CoverImageConfig,
  ExpressiveCodeConfig,
  FooterConfig,
  LicenseConfig,
  MusicPlayerConfig,
  NavBarConfig,
  ProfileConfig,
  SakuraConfig,
  SidebarLayoutConfig,
  SiteConfig,
  SponsorConfig,
  SponsorItem,
  SponsorMethod,
  WidgetComponentConfig,
  WidgetComponentType,
} from "../types/config";
// Configuración de anuncios
export { adConfig1, adConfig2 } from "./adConfig";
// Configuración de anuncios
export { announcementConfig } from "./announcementConfig";
// Configuración de estilo
export { backgroundWallpaper } from "./backgroundWallpaper";
// Configuración de funciones
export { commentConfig } from "./commentConfig";
export { coverImageConfig } from "./coverImageConfig";
export { expressiveCodeConfig } from "./expressiveCodeConfig";
export { fontConfig } from "./fontConfig";
export { footerConfig } from "./footerConfig";
export { friendsPageConfig, getEnabledFriends } from "./friendsConfig";
export { licenseConfig } from "./licenseConfig";
// Configuración de componentes

export { navBarConfig, navBarSearchConfig } from "./navBarConfig";

export { profileConfig } from "./profileConfig";
export { sakuraConfig } from "./sakuraConfig";
// Configuración de diseño
export { sidebarLayoutConfig } from "./sidebarConfig";
// Configuración principal
export { siteConfig } from "./siteConfig";
export { sponsorConfig } from "./sponsorConfig";
