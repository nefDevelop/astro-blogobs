# Mdobs - Tu Nuevo Tema de Astro

Este es el repositorio para el tema "Mdobs" de Astro. A continuación, se detallan las dependencias clave utilizadas en este proyecto y su propósito.

## Dependencias del Proyecto

### Core y Desarrollo

- **`astro`**: El framework principal para construir sitios web rápidos y modernos.
- **`@astrojs/check`**: Herramienta para verificar la configuración de Astro y TypeScript.
- **`typescript`**: Añade tipado estático a JavaScript, mejorando la robustez del código.
- **`@biomejs/biome`**: Un formateador y linter de código para mantener la calidad y consistencia.
- **`vite`**: El servidor de desarrollo y bundler que Astro utiliza internamente.
- **`pnpm`**: Gestor de paquetes utilizado en este proyecto.

### Contenido y Markdown

- **`@astrojs/mdx`**: Permite usar MDX (Markdown con componentes) en tus archivos.
- **`gray-matter`**: Para leer los metadatos (front matter) de los archivos Markdown.
- **`marked`**: Un analizador de Markdown a HTML.
- **`remark-math`**, **`rehype-katex`**, **`katex`**: Para renderizar expresiones matemáticas (LaTeX) en tu contenido.
- **`remark-directive`**, **`remark-directive-rehype`**: Para procesar directivas personalizadas en Markdown.
- **`rehype-autolink-headings`**, **`rehype-slug`**: Para añadir enlaces automáticos y IDs a los encabezados de tus artículos.
- **`rehype-callouts`**: Para crear bloques de información o advertencia estilizados.
- **`astro-expressive-code`**, **`@expressive-code/core`**, etc.: Para un resaltado de sintaxis de código avanzado y personalizable.

### Estilo y UI

- **`@astrojs/svelte`**: Integración para usar componentes Svelte en tu proyecto Astro.
- **`svelte`**: El framework de UI Svelte.
- **`tailwindcss`**, **`@tailwindcss/typography`**, **`@tailwindcss/vite`**: El framework CSS "utility-first" para estilizar tu sitio.
- **`postcss-import`**, **`postcss-nesting`**: Plugins de PostCSS para mejorar la escritura de CSS.
- **`@fontsource-variable/jetbrains-mono`**, **`@fontsource/roboto`**: Para importar fuentes web de forma optimizada.
- **`astro-icon`**, **`@iconify-json/*`**: Para usar iconos SVG de diversas colecciones.
- **`overlayscrollbars`**: Para barras de desplazamiento personalizadas.
- **`@fancyapps/ui`**, **`photoswipe`**: Para galerías de imágenes y lightboxes.

### Funcionalidad y Utilidades

- **`@astrojs/rss`**: Genera feeds RSS para tu blog.
- **`@astrojs/sitemap`**: Genera un archivo `sitemap.xml` para SEO.
- **`@swup/astro`**: Integración de Swup para transiciones de página suaves.
- **`dayjs`**: Una librería ligera para manipular fechas y horas.
- **`pagefind`**: Una herramienta de búsqueda estática para tu sitio.
- **`sharp`**: Un procesador de imágenes de alto rendimiento para optimización.
- **`qrcode`**: Para generar códigos QR.
- **`reading-time`**: Calcula el tiempo estimado de lectura de un texto.
- **`sanitize-html`**: Para limpiar y desinfectar HTML.
- **`satori`**: Para generar imágenes Open Graph dinámicamente.
- **`glob`**: Para encontrar archivos que coincidan con patrones. (Nota: Se recomienda actualizar a una versión más reciente de `glob` debido a vulnerabilidades en versiones antiguas).

## Features

- [ ] i18n
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

![Inspiración de diseño: tema Astro Ink](image.png)

GitHub Activity Widget: Optionally include a statically generated GitHub activity calendar on the homepage that (of course) matches the active color scheme perfectly.
Markdown Extensions: Admonitions, auto-generated TOC that sticks to the side on large screens, emoji shortcodes, KaTeX math, MDX, and reading time estimates. See the example site's Showing Off Blog Features post.
RSS Feed and Sitemap: Built-in support for RSS feeds and sitemap with no extra configuration.
Social Links: Easily include links to common developer platforms including GitHub, Mastodon, Twitter, LinkedIn and E-mail.
Responsive Design: Optimized for all devices from desktops to mobile phones. Built with Tailwind v4.
SEO Optimized: Boost your site's visibility with built-in SEO best practices and automatically generated social card images for every page via Satori.
Customizable Build: Powered by Astro, render as a static site (the default) or generate content dynamically.