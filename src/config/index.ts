// Archivo de índice de configuración - Exporta todas las configuraciones de forma unificada
export * from "./site.config";

// Exportación de tipos (opcional, ya que site.config puede no exportar todos los tipos)
export type {
	AnnouncementConfig,
	BackgroundWallpaperConfig,
	CoverImageConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SidebarLayoutConfig,
	SiteConfig,
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";
