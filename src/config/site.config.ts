import type {
	SiteConfig,
	ProfileConfig,
	CommentConfig,
	NavBarConfig,
	SidebarLayoutConfig,
	BackgroundWallpaperConfig,
	ExpressiveCodeConfig,
	FontConfig,
	LicenseConfig,
	CoverImageConfig,
	NavBarSearchConfig,
} from "../types/config";
import { LinkPreset, NavBarSearchMethod } from "../types/config";

// --- Site Configuration ---
export const siteConfig: SiteConfig = {
	title: "Lluvia y Té",
	subtitle: "Blog Personal",
	site_url: "https://firefly.cuteleaf.cn", // Update this to your URL
	description: "Relájate y disfruta leyendo.",
	keywords: ["Astro", "Blog", "Markdown"],
	lang: "es",
	themeColor: {
		hue: 165,
		fixed: false,
		defaultMode: "system",
	},
	card: {
		border: true,
	},
	favicon: [
		{
			src: "/favicon/favicon.ico",
		},
	],
	navbar: {
		logo: {
			type: "icon",
			value: "material-symbols:eco-outline",
			alt: "🍀",
		},
		title: "Firefly",
		widthFull: false,
		followTheme: false,
	},
	siteStartDate: "2025-01-01",
	rehypeCallouts: {
		theme: "obsidian",
	},
	showLastModified: true,
	outdatedThreshold: 30,
	sharePoster: true,
	generateOgImages: false,
	pages: {
		sponsor: false,
	},
	postListLayout: {
		defaultMode: "grid",
		allowSwitch: true,
		grid: {
			masonry: false,
			columns: 2,
		},
	},
	pagination: {
		postsPerPage: 10,
	},
	analytics: {
		googleAnalyticsId: "",
		microsoftClarityId: "",
	},
	imageOptimization: {
		formats: "webp",
		quality: 85,
	},
	font: {
		enable: true,
		preload: true,
		selected: ["system"],
		fonts: {
			system: {
				id: "system",
				name: "Fuente del sistema",
				src: "",
				family:
					"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
			},
		},
		fallback: [
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"sans-serif",
		],
	},
};

// --- Profile Configuration ---
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.avif",
	name: "Firefly",
	bio: "Hello, I'm Firefly.",
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/CuteLeaf",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};

// --- Comment Configuration (Giscus) ---
export const commentConfig: CommentConfig = {
	type: "giscus",
	giscus: {
		repo: "CuteLeaf/Firefly",
		repoId: "R_kgD2gfdFGd",
		category: "General",
		categoryId: "DIC_kwDOKy9HOc4CegmW",
		mapping: "title",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "1",
		inputPosition: "top",
		lang: "es",
		loading: "lazy",
	},
};

// --- Navigation Bar Configuration ---
export const navBarConfig: NavBarConfig = {
	links: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About],
};

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// --- Sidebar Configuration ---
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	enable: true,
	position: "left",
	showRightSidebarOnPostPage: false,
	leftComponents: [
		{
			type: "categories",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			responsive: {
				collapseThreshold: 5,
			},
		},
		{
			type: "tags",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			responsive: {
				collapseThreshold: 20,
			},
		},
		{
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			showOnNonPostPage: false,
		},
	],
	rightComponents: [],
	mobileBottomComponents: [
		{
			type: "categories",
			enable: true,
			showOnPostPage: true,
			responsive: {
				collapseThreshold: 5,
			},
		},
		{
			type: "tags",
			enable: true,
			showOnPostPage: true,
			responsive: {
				collapseThreshold: 20,
			},
		},
	],
};

// --- Background/Wallpaper Configuration ---
export const backgroundWallpaper: BackgroundWallpaperConfig = {
	mode: "banner",
	switchable: true,
	src: {
		desktop: ["assets/images/DesktopWallpaper/d1.avif"],
		mobile: ["assets/images/MobileWallpaper/m1.avif"],
	},
	banner: {
		position: "0% 20%",
		homeText: {
			enable: true,
			switchable: true,
			title: "Lovely firefly!",
			titleSize: "3.8rem",
			subtitle: ["Exploring the digital world."],
			subtitleSize: "1.5rem",
			typewriter: {
				enable: true,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
		},
		credit: {
			enable: false,
			text: "",
			url: "",
		},
		navbar: {
			transparentMode: "semifull",
			enableBlur: true,
			blur: 3,
		},
		waves: {
			enable: false,
			switchable: false,
		},
	},
	overlay: {
		zIndex: -1,
		opacity: 0.8,
		blur: 1,
	},
};

// --- Expressive Code Configuration ---
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	darkTheme: "one-dark-pro",
	lightTheme: "one-light",
	pluginCollapsible: {
		enable: true,
		lineThreshold: 15,
		previewLines: 8,
		defaultCollapsed: true,
	},
};

// --- License Configuration ---
export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// --- Footer Configuration ---
export const footerConfig: FooterConfig = {
	enable: false, // Set to true if you want to use src/config/FooterConfig.html
};

// --- Cover Image Configuration ---
export const coverImageConfig: CoverImageConfig = {
	enableInPost: true,
	randomCoverImage: {
		enable: false,
		apis: [],
		fallback: "assets/images/cover.avif",
		showLoading: false,
	},
};
