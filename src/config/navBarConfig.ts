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
      {
        name: "GitHub",
        url: "https://github.com/CuteLeaf/Firefly",
        external: true,
        icon: "fa7-brands:github",
      },
      {
        name: "Bilibili",
        url: "https://space.bilibili.com/38932988",
        external: true,
        icon: "fa7-brands:bilibili",
      },
    ],
  });

  // Enlaces de amigos
  links.push(LinkPreset.Friends);

  // Decide si añadir el libro de visitas según la configuración. Si pages.guestbook está desactivado en siteConfig, el libro de visitas no se mostrará en la barra de navegación.
  if (siteConfig.pages.guestbook) {
    links.push(LinkPreset.Guestbook);
  }

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

      // Decide si añadir el plan Bangumi según la configuración. Si pages.bangumi está desactivado en siteConfig, el plan Bangumi no se mostrará en la barra de navegación.
      ...(siteConfig.pages.bangumi ? [LinkPreset.Bangumi] : []),
    ],
  });

  // 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
  return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
  method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
