import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
  // Avatar
  // Las rutas de imagen admiten tres formatos:
  // 1. Directorio public (comienza con "/", no optimizado): "/assets/images/avatar.webp"
  // 2. Directorio src (no comienza con "/", optimizado automáticamente pero aumenta el tiempo de construcción, recomendado): "assets/images/avatar.webp"
  // 3. URL remota: "https://example.com/avatar.jpg"
  avatar: "assets/images/avatar.avif",

  // Nombre
  name: "Firefly",

  // Firma personal
  bio: "Hello, I'm Firefly.",

  // Configuración de enlaces
  // Conjuntos de iconos preinstalados: fa7-brands, fa7-regular, fa7-solid, material-symbols, simple-icons
  // Visita https://icones.js.org/ para obtener los códigos de los iconos.
  // Si quieres usar un conjunto de iconos que aún no está incluido, necesitarás instalarlo:
  // `pnpm add @iconify-json/<icon-set-name>`
  // Cuando showName es true, se muestran el icono y el nombre; cuando es false, solo se muestra el icono.
  links: [
    {
      name: "Bilibli",
      icon: "fa7-brands:bilibili",
      url: "https://space.bilibili.com/38932988",
      showName: false,
    },
    {
      name: "GitHub",
      icon: "fa7-brands:github",
      url: "https://github.com/CuteLeaf",
      showName: false,
    },
    {
      name: "Email",
      icon: "fa7-solid:envelope",
      url: "mailto:xiaye@msn.com",
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
