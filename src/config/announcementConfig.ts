import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  // 公告标题
  title: "Anuciandose",

  // 公告内容
  content: "Este es el priomero anuncio",

  // 是否允许用户关闭公告
  closable: true,

  link: {
    enable: true,
    text: "Anuncio ",
    url: "/about/",
    external: false,
  },
};
