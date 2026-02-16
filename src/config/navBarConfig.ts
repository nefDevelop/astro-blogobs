import { LinkPreset, type NavBarConfig, type NavBarLink, type NavBarSearchConfig, NavBarSearchMethod } from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
// Genera dinámicamente la configuración de la barra de navegación según los interruptores de página
const getDynamicNavBarConfig = (): NavBarConfig => {
  // Enlaces básicos de la barra de navegación
  const links: (NavBarLink | LinkPreset)[] = [
    // Página de inicio
    LinkPreset.Home,

    // Archivo
    LinkPreset.Archive,
  ];

  // Enlaces de la barra de navegación personalizados, y admite menús de varios niveles
  links.push({
    name: "Enlaces",
    url: "/links/",
    icon: "material-symbols:link",

    // 子菜单
    children: [
      // Submenú
      {
        name: "GitHub",
        url: "https://github.com/CuteLeaf/Firefly",
        external: true,
        icon: "fa7-brands:github",
      },
    ],
  });

  // Enlaces de amigos
  links.push(LinkPreset.Friends);


  // Acerca de y sus submenús
  links.push({
    name: "Acerca de",
    url: "/content/",
    icon: "material-symbols:info",
    children: [
      // Decide si añadir el patrocinador según la configuración. Si pages.sponsor está desactivado en siteConfig, el patrocinador no se mostrará en la barra de navegación.
      ...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []),

      // Página Acerca de
      LinkPreset.About,

    ],
  });

  // Solo devuelve los enlaces, otras configuraciones relacionadas con la búsqueda de navegación se exportan de forma independiente en constantes de nivel superior del módulo.
  return { links } as NavBarConfig;
};

// Configuración de búsqueda de navegación
export const navBarSearchConfig: NavBarSearchConfig = {
  method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
