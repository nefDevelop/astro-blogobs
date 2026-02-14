import type { SiteConfig } from "@/types/config";
import { fontConfig } from "./fontConfig";

// 定义站点语言
// Código de idioma, por ejemplo: 'zh_CN', 'zh_TW', 'en', 'ja', 'ru'.
const SITE_LANG = "es";

export const siteConfig: SiteConfig = {
  // 站点标题
  // Título del sitio
  title: "Rain and Tea",

  // 站点副标题
  // Subtítulo del sitio
  subtitle: "Demo site",

  // 站点 URL
  // URL del sitio
  site_url: "https://firefly.cuteleaf.cn",

  // 站点描述
  // Descripción del sitio
  description: "Relax and chill",

  // 站点关键词
  // Palabras clave del sitio
  keywords: ["Firefly", "Fuwari", "Astro", "ACGN", "博客", "技术博客", "静态博客"],

  // 主题色
  // Color del tema
  themeColor: {
    // 主题色的默认色相，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
    // Tono predeterminado del color del tema, rango de 0 a 360. Por ejemplo: Rojo: 0, Cian: 200, Azul verdoso: 250, Rosa: 345
    hue: 165,
    // 是否对访问者隐藏主题色选择器
    // Si se oculta el selector de color del tema a los visitantes
    fixed: false,
    // 默认模式："light" 亮色，"dark" 暗色，"system" 跟随系统
    // Modo predeterminado: "light" claro, "dark" oscuro, "system" sigue al sistema
    defaultMode: "system",
  },

  // 网站Card样式配置
  // Configuración de estilo de la tarjeta del sitio web
  card: {
    // 是否开启卡片边框和阴影，开启后让网站更有立体感
    // Si se habilitan los bordes y sombras de las tarjetas, lo que le da al sitio web una sensación más tridimensional
    border: true,
  },

  // Favicon 配置
  // Configuración de Favicon
  favicon: [
    {
      // 图标文件路径
      // Ruta del archivo del icono
      src: "/favicon/favicon.ico",
      // 可选，指定主题 'light' | 'dark'
      // Opcional, especifica el tema 'light' | 'dark'
      // theme: "light",
      // 可选，图标大小
      // Opcional, tamaño del icono
      // sizes: "32x32",
    },
  ],

  // 导航栏配置
  // Configuración de la barra de navegación
  navbar: {
    // 导航栏Logo
    // Logo de la barra de navegación
    // 支持三种类型：
    // Soporta tres tipos:
    // 1. Astro图标库: { type: "icon", value: "material-symbols:home-pin-outline" }
    // 2. 本地图片（public目录，不优化）: { type: "image", value: "/assets/images/logo.webp", alt: "Logo" }
    // 3. 本地图片（src目录，自动优化但会增加构建时间，推荐）: { type: "image", value: "assets/images/logo.webp", alt: "Logo" }
    // 4. 网络图片: { type: "url", value: "https://example.com/logo.png", alt: "Logo" }
    logo: {
      type: "image",
      value: "assets/images/firefly.png",
      alt: "🍀",
    },
    // 导航栏标题
    // Título de la barra de navegación
    title: "Firefly",
    // 全宽导航栏，导航栏是否占满屏幕宽度，true：占满，false：不占满
    // Barra de navegación de ancho completo, si la barra de navegación ocupa todo el ancho de la pantalla, true: ocupa, false: no ocupa
    widthFull: false,
    // 导航栏图标和标题是否跟随主题色
    // Si el icono y el título de la barra de navegación siguen el color del tema
    followTheme: false,
  },

  // 站点开始日期，用于统计运行天数
  // Fecha de inicio del sitio, utilizada para contar los días de funcionamiento
  siteStartDate: "2025-01-01",

  // 站点时区（IANA 时区字符串），用于格式化bangumi、rss里的构建日期时间等等..
  // 示例："Asia/Shanghai", "UTC", 如果为空，则按照构建服务器的时区进行时区转换
  // Zona horaria del sitio (cadena de zona horaria IANA), utilizada para formatear la fecha y hora de construcción en bangumi, rss, etc.
  // Ejemplo: "Asia/Shanghai", "UTC". Si está vacío, la conversión de zona horaria se realizará según la zona horaria del servidor de compilación.
  timezone: "UTC",

  // 提醒框（Admonitions）配置，修改后需要重启开发服务器才能生效
  // 主题：'github' | 'obsidian' | 'vitepress'，每个主题风格和语法不同，可根据喜好选择
  // Configuración de cuadros de advertencia (Admonitions), los cambios requieren reiniciar el servidor de desarrollo para que surtan efecto
  // Temas: 'github' | 'obsidian' | 'vitepress', cada tema tiene un estilo y sintaxis diferentes, puedes elegir según tus preferencias
  rehypeCallouts: {
    theme: "obsidian",
  },

  // 文章页底部的"上次编辑时间"卡片开关
  // Interruptor de la tarjeta "Última edición" en la parte inferior de la página del artículo
  showLastModified: true,

  // 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
  // Umbral de caducidad del artículo (días), la tarjeta "Última edición" solo se mostrará si se supera este número de días
  outdatedThreshold: 30,

  // 是否开启分享海报生成功能
  // Si se habilita la función de generación de pósteres para compartir
  sharePoster: true,

  // OpenGraph图片功能,注意开启后要渲染很长时间，不建议本地调试的时候开启
  // Función de imagen OpenGraph, ten en cuenta que la renderización puede tardar mucho tiempo después de habilitarla, no se recomienda habilitarla durante la depuración local
  generateOgImages: false,

  // bangumi配置
  // Configuración de Bangumi
  bangumi: {
    // Bangumi用户ID
    // ID de usuario de Bangumi
    userId: "1143164",
  },

  // 页面开关配置 - 控制特定页面的访问权限，设为false会返回404
  // bangumi的数据为编译时获取的，所以不是实时数据，请配置bangumi.userId
  // Configuración de interruptores de página - controla los permisos de acceso a páginas específicas, establecer en false devolverá un 404
  // Los datos de bangumi se obtienen en tiempo de compilación, por lo que no son datos en tiempo real, por favor configura bangumi.userId
  pages: {
    // 赞助页面开关
    // Interruptor de la página de patrocinadores
    sponsor: true,
    // 留言板页面开关，需要配置评论系统
    // Interruptor de la página del libro de visitas, requiere configurar un sistema de comentarios
    guestbook: true,
    // 番组计划页面开关，含追番、游戏、书籍和音乐，dev调试时只获取一页数据，build才会获取全部数据
    // Interruptor de la página de planificación de animes/series (bangumi), incluye seguimiento de animes, juegos, libros y música. Durante la depuración (dev) solo se obtiene una página de datos, en la compilación (build) se obtienen todos los datos.
    bangumi: true,
  },

  // 文章列表布局配置
  // Configuración del diseño de la lista de artículos
  postListLayout: {
    // 默认布局模式："list" 列表模式（单列布局），"grid" 网格模式（多列布局）
    // Modo de diseño predeterminado: "list" modo de lista (diseño de una columna), "grid" modo de cuadrícula (diseño de varias columnas)
    defaultMode: "list",
    // 是否允许用户切换布局
    // Si se permite a los usuarios cambiar el diseño
    allowSwitch: true,
    // 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
    // Configuración del diseño de cuadrícula, solo efectivo cuando defaultMode es "grid" o se permite cambiar el diseño
    grid: {
      // 是否开启瀑布流布局，同时有封面图和无封面图的混合文章推荐开启
      // Si se habilita el diseño de mampostería (cascada), se recomienda habilitarlo para artículos mixtos con y sin imágenes de portada
      masonry: false,
      // 网格模式列数：2 或 3
      // 2列是默认模式，在任何侧边栏配置下均可生效
      // 3列模式仅在单侧边栏（或无侧边栏）时生效，
      // Número de columnas en modo cuadrícula: 2 o 3
      // 2 columnas es el modo predeterminado y funciona con cualquier configuración de barra lateral
      // El modo de 3 columnas solo es efectivo con una sola barra lateral (o sin barra lateral)
      columns: 3,
    },
  },

  // 分页配置
  // Configuración de paginación
  pagination: {
    // 每页显示的文章数量
    // Número de artículos a mostrar por página
    postsPerPage: 10,
  },

  // 统计分析
  // Análisis estadístico
  analytics: {
    // Google Analytics ID
    // ID de Google Analytics
    googleAnalyticsId: "",
    // Microsoft Clarity ID
    // ID de Microsoft Clarity
    microsoftClarityId: "",
  },

  // 图像优化及响应式配置
  // 图像优化压缩只保留avif或webp
  // 响应式图像是为在不同设备上提高性能而调整的图像。这些图像可以调整大小以适应其容器，并且可以根据访问者的屏幕尺寸和分辨率以不同的大小提供。
  // Astro 仅能对 src 目录下的图像进行优化，src 目录下的图像越多，构建时间会越长
  // Astro 图像文档 https://docs.astro.build/zh-cn/guides/images/
  // Configuración de optimización y respuesta de imágenes
  // La optimización y compresión de imágenes solo conserva avif o webp
  // Las imágenes responsivas son imágenes ajustadas para mejorar el rendimiento en diferentes dispositivos. Estas imágenes se pueden redimensionar para adaptarse a su contenedor y se pueden servir en diferentes tamaños según el tamaño de pantalla y la resolución del visitante.
  // Astro solo puede optimizar imágenes en el directorio src. Cuantas más imágenes haya en el directorio src, mayor será el tiempo de construcción.
  // Documentación de imágenes de Astro https://docs.astro.build/zh-cn/guides/images/
  imageOptimization: {
    // 输出图片格式
    // - "avif": 仅输出 AVIF 格式（最新技术，最小体积，目前兼容性较低）
    // - "webp": 仅输出 WebP 格式（体积适中，兼容性好）
    // - "both": 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
    // Formato de salida de la imagen
    // - "avif": Solo salida en formato AVIF (la tecnología más reciente, el tamaño más pequeño, actualmente con menor compatibilidad)
    // - "webp": Solo salida en formato WebP (tamaño moderado, buena compatibilidad)
    // - "both": Salida simultánea en AVIF y WebP (recomendado, el navegador selecciona automáticamente el mejor formato)
    formats: "webp",
    // 图片压缩质量 (1-100)，值越低体积越小但质量越差，推荐 70-85
    // Calidad de compresión de imagen (1-100), un valor más bajo resulta en un tamaño más pequeño pero peor calidad, se recomienda 70-85
    quality: 85,
  },

  // 字体配置
  // 在src/config/fontConfig.ts中配置具体字体
  // Configuración de fuentes
  // Configura las fuentes específicas en src/config/fontConfig.ts
  font: fontConfig,

  // 站点语言，在本配置文件顶部SITE_LANG定义
  // Idioma del sitio, definido en SITE_LANG en la parte superior de este archivo de configuración
  lang: SITE_LANG,
};
