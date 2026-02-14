import type { FriendLink, FriendsPageConfig } from "../types/config";

// Puedes escribir contenido personalizado debajo de la página de enlaces de amigos en src/content/spec/friends.md

// Configuración de la página de enlaces de amigos
export const friendsPageConfig: FriendsPageConfig = {
  // Número de columnas a mostrar: 2 o 3
  columns: 2, // Número de columnas a mostrar: 2 o 3
};

// Configuración de enlaces de amigos
export const friendsConfig: FriendLink[] = [
  {
    title: "Luciérnaga de Noche de Verano",
    imgurl: "https://q1.qlogo.cn/g?b=qq&nk=7618557&s=640",
    desc: "El fuego de las luciérnagas brilla desde la noche sin sueños, floreciendo en el mañana final.",
    siteurl: "https://blog.cuteleaf.cn",
    tags: ["Blog"], // Mantener en inglés ya que son etiquetas
    weight: 10, // Peso, cuanto mayor sea el número, antes se ordenará
    enabled: true, // Habilitado
  },
  {
    title: "Firefly Docs",
    imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
    desc: "Documentación de la plantilla del tema Firefly",
    siteurl: "https://docs-firefly.cuteleaf.cn",
    tags: ["Docs"], // Mantener en inglés ya que son etiquetas
    weight: 9,
    enabled: true,
  },
  {
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
    desc: "The web framework for content-driven websites. ⭐️ Star to support our work!",
    siteurl: "https://github.com/withastro/astro", // Mantener en inglés ya que es una URL
    tags: ["Framework"], // Mantener en inglés ya que son etiquetas
    weight: 8,
    enabled: true,
  },
];
// Obtener enlaces de amigos habilitados y ordenarlos por peso
export const getEnabledFriends = (): FriendLink[] => {
  return friendsConfig.filter((friend) => friend.enabled).sort((a, b) => b.weight - a.weight);
};
