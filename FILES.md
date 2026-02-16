## Project Structure Overview

This project is an Astro blog theme called Firefly. It is highly configurable and comes with many features.

-   **`src/`**: Contains all the source code for the blog.
-   **`public/`**: Contains static assets that are copied directly to the build output.
-   **`astro.config.mjs`**: The main Astro configuration file.
-   **`package.json`**: Defines project dependencies and scripts.
-   **`tsconfig.json`**: TypeScript configuration.

## `src` Directory Breakdown

### `src/assets`

Contains static assets like images that are processed by Astro.

-   `images/`: Contains images used in the blog, such as avatars, wallpapers, etc.

### `src/components`

This directory contains all the reusable components of the application, organized by function. The `README.md` in this folder provides a good overview.

-   **`analytics/`**: Components for integrating analytics services.
    -   `GoogleAnalytics.astro`: Integrates Google Analytics.
    -   `MicrosoftClarity.astro`: Integrates Microsoft Clarity.
-   **`comment/`**: Components for different comment systems.
    -   `index.astro`: Main component that selects the comment system based on configuration.
    -   `Artalk.astro`, `Disqus.astro`, `Giscus.astro`, `Twikoo.astro`, `Waline.astro`: Integration components for each comment system.
-   **`common/`**: Common, reusable UI components.
    -   `ButtonLink.astro`, `ButtonTag.astro`: Styled button components.
    -   `Pagination.astro`, `ClientPagination.astro`: Components for handling pagination.
    -   `Icon.svelte`: A component for displaying icons.
    -   And many others for UI elements like dropdowns, images, etc.
-   **`controls/`**: Components for user interaction and page navigation.
    -   `BackToTop.astro`, `BackToHome.astro`: Navigation buttons.
    -   `Search.svelte`: The search component.
    -   `LightDarkSwitch.svelte`, `WallpaperSwitch.svelte`: Theme and appearance controls.
-   **`features/`**: Components for global features and effects.
    -   `SakuraEffect.astro`: A sakura (cherry blossom) falling effect.
    -   `TypewriterText.astro`: A typewriter animation effect for text.
    -   `FancyboxManager.astro`: Manages the Fancybox image viewer.
-   **`layout/`**: Components responsible for the page layout structure.
    -   `Navbar.astro`, `Footer.astro`, `SideBar.astro`: Main layout components.
    -   `PostCard.astro`, `PostPage.astro`: Components for displaying blog posts.
-   **`misc/`**: Miscellaneous utility components.
    -   `License.astro`: Displays license information.
    -   `SharePoster.svelte`: Generates a shareable poster for posts.
-   **`pages/`**: Components used on specific pages.
-   **`widget/`**: Components used in the sidebar.
    -   `Profile.astro`: Displays author profile.
    -   `Categories.astro`, `Tags.astro`: Display post categories and tags.
    -   `Calendar.astro`, `SiteStats.astro`: A calendar and site statistics widgets.

### `src/config`

This directory contains all the configuration files for the theme. This is where you can customize most of the blog's features.

-   `siteConfig.ts`: The main site configuration (title, description, theme color, etc.).
-   `commentConfig.ts`: Configuration for the various comment systems.
-   `navBarConfig.ts`, `footerConfig.ts`, `sidebarConfig.ts`: Configuration for layout components.
-   `backgroundWallpaper.ts`: Configuration for the complex wallpaper and banner system.
-   And many other files for configuring specific features.

### `src/constants`

Contains constant values used throughout the application.

-   `constants.ts`: Defines constants like page size, theme modes, banner dimensions, etc.
-   `icon.ts`, `icons.ts`: Defines icons used in the UI.
-   `link-presets.ts`: Presets for navigation bar links.

### `src/content`

This is where the actual content of your blog lives, managed by Astro's content collections.

-   `posts/`: Contains your blog posts in Markdown (`.md` or `.mdx`) format.
-   `spec/`: Seems to be for special pages.

### `src/i18n`

Contains files for internationalization (i18n) and translation.

-   `i18nKey.ts`: An enum of all the translation keys.
-   `translation.ts`: The main translation function.
-   `languages/`: Contains the translation files for each language (e.g., `en.ts`, `es.ts`).

### `src/layouts`

Contains the main layout components that define the overall HTML structure of the pages.

-   `Layout.astro`: The base layout, including `<head>`, `<body>`, and global scripts/styles.
-   `MainGridLayout.astro`: The main grid layout for the blog, which assembles the navbar, sidebar, content area, and footer.

### `src/pages`

This directory is responsible for creating the pages and routes of your site.

-   `[...page].astro`: The main page for displaying the list of blog posts with pagination.
-   `posts/[...slug].astro`: The template for individual blog posts.
-   `about.astro`, `archive.astro`, `friends.astro`, etc.: Templates for other static pages.
-   `api/`: For any API endpoints.
-   `rss.xml.ts`: Generates the RSS feed for the blog.

### `src/plugins`

Contains Remark and Rehype plugins used for processing Markdown content.

-   `rehype-figure.mjs`: Converts images with alt text into `<figure>` elements with `<figcaption>`.
-   `remark-reading-time.mjs`: Calculates the reading time for posts.
-   And others for features like Mermaid diagrams, email protection, etc.

### `src/styles`

Contains all the styling for the blog.

-   `main.css`: The main stylesheet, imports all others.
-   `variables.styl`: Defines CSS variables (colors, sizes, etc.) using Stylus.
-   `navbar.css`, `layout-styles.css`, etc.: Styles for specific components.
-   `markdown.css`: Styles for the content of blog posts.

### `src/types`

Contains TypeScript type definitions used throughout the project.

-   `config.ts`: Defines the types for all the configuration objects.


### `src/utils`

Contains utility functions that are used in various parts of the application.

-   `content-utils.ts`: Functions for fetching, sorting, and processing blog posts.
-   `date-utils.ts`: Functions for formatting dates.
-   `url-utils.ts`: Functions for creating URLs for posts, tags, etc.
-   And many others for handling images, layout, navigation, etc.