import { sidebarLayoutConfig } from "@/config";

export interface ResponsiveSidebarConfig {
  isBothSidebars: boolean;
  hasLeftComponents: boolean;
  hasRightComponents: boolean;
  mobileShowSidebar: boolean;
  tabletShowSidebar: boolean;
  desktopShowSidebar: boolean;
}

/**
 * 获取响应式侧边栏配置
 *
 * Configuración de la barra lateral responsiva
 *
 * Diseño responsivo (codificado):
 * - 768px y menos: Oculta la barra lateral, muestra mobileBottomComponents en la parte inferior.
 * - 769px-1279px: Muestra la barra lateral izquierda, oculta la barra lateral derecha.
 * - 1280px y más: Muestra la barra lateral según la configuración de posición.
 */
export function getResponsiveSidebarConfig(): ResponsiveSidebarConfig {
  const isBothSidebars = sidebarLayoutConfig.enable && sidebarLayoutConfig.position === "both";

  const hasLeftComponents = sidebarLayoutConfig.enable && sidebarLayoutConfig.leftComponents.some((comp) => comp.enable);
  // Cuando la posición es 'left', los componentes de la derecha no participan en el cálculo del diseño (incluso si están habilitados, serán ocultados por CSS).
  const hasRightComponents =
    sidebarLayoutConfig.enable &&
    sidebarLayoutConfig.position === "both" &&
    sidebarLayoutConfig.rightComponents.some((comp) => comp.enable);

  // El diseño responsivo es manejado por CSS, aquí solo se usa para determinar si hay componentes.
  // 768px y menos no muestra la barra lateral
  const mobileShowSidebar = false; // 768px及以下不显示侧边栏
  const tabletShowSidebar = sidebarLayoutConfig.enable; // 769px及以上显示
  const desktopShowSidebar = sidebarLayoutConfig.enable; // 1280px及以上显示

  return {
    isBothSidebars,
    hasLeftComponents,
    hasRightComponents,
    mobileShowSidebar,
    tabletShowSidebar,
    desktopShowSidebar,
  };
}

/**
 * 生成网格列数CSS类
 *
 * Genera clases CSS para el número de columnas de la cuadrícula
 *
 * Diseño responsivo:
 * - 768px y menos: Diseño de una columna (grid-cols-1), oculta la barra lateral, muestra los componentes inferiores.
 * - 769px-1279px: Diseño de 2 columnas (barra lateral izquierda + contenido), oculta la barra lateral derecha.
 * - 1280px y más: Diseño de 3 o 2 columnas (dependiendo de si hay barra lateral derecha).
 */
export function generateGridClasses(config: ResponsiveSidebarConfig): {
  gridCols: string;
} {
  let gridCols = "grid-cols-1";

  if (config.isBothSidebars && config.hasLeftComponents && config.hasRightComponents) {
    // 双侧边栏: 1280px+显示左+中+右，769-1279px显示左+中，768-以下单列
    gridCols = "grid-cols-1 md:grid-cols-[17.5rem_1fr] xl:grid-cols-[17.5rem_1fr_17.5rem]";
  } else if (config.hasLeftComponents && !config.hasRightComponents) {
    // 仅左侧边栏: 769px+显示左+中，768-以下单列
    gridCols = "grid-cols-1 md:grid-cols-[17.5rem_1fr]";
  } else if (!config.hasLeftComponents && config.hasRightComponents) {
    // 仅右侧边栏: 1200px+显示中+右，769-1199px显示中，768-以下单列
    gridCols = "grid-cols-1 xl:grid-cols-[1fr_17.5rem]";
  }

  return { gridCols };
}

/**
 * Genera clases CSS para el contenedor de la barra lateral
 */
export function generateSidebarClasses(): string {
  const classes = [
    "mb-4", // Margen inferior
    // 768px及以下隐藏，769px及以上显示
    "hidden",
    "md:block",
    "md:col-span-1",
    "md:max-w-70",
    "md:row-start-1",
    "md:row-end-2",
    "md:col-start-1",
    "onload-animation",
  ];

  return classes.join(" ");
}

/**
 * Genera clases CSS para la barra lateral derecha
 */
export function generateRightSidebarClasses(): string {
  const classes = [
    "mb-4", // Margen inferior
    // 1280px以下隐藏，1280px及以上显示
    "hidden",
    "xl:block",
    "xl:row-start-1",
    "xl:row-end-2",
    "xl:col-span-1",
    "xl:max-w-70",
    "onload-animation", // Animación al cargar
    "xl:col-start-3", // La barra lateral derecha está en la tercera columna.
  ];

  return classes.join(" ");
}

/**
 * Genera clases CSS para el área de contenido principal
 */
export function generateMainContentClasses(config: ResponsiveSidebarConfig): string {
  const classes = [
    "transition-main", // Transición principal
    // 768px及以下: 单列布局
    "col-span-1",
  ];

  if (config.isBothSidebars && config.hasLeftComponents && config.hasRightComponents) {
    // 769-1199px: Izquierda + Centro, 1200px+: Izquierda + Centro + Derecha
    classes.push("md:col-span-1");
    classes.push("md:col-start-2");
    classes.push("xl:col-span-1");
    classes.push("xl:col-start-2");
    classes.push("xl:col-end-3");
  } else if (config.hasLeftComponents && !config.hasRightComponents) {
    // 769px+: Izquierda + Centro
    classes.push("md:col-span-1");
    classes.push("md:col-start-2");
  } else if (!config.hasLeftComponents && config.hasRightComponents) {
    // 1200px+: Centro + Derecha
    classes.push("xl:col-span-1");
    classes.push("xl:col-start-1");
  } else {
    classes.push("col-span-1");
  }

  classes.push("min-w-0");
  classes.push("overflow-hidden"); // Oculta el desbordamiento
  // Retorna las clases CSS unidas por un espacio.
  return classes.join(" ");
}
