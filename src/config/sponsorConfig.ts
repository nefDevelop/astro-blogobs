import type { SponsorConfig } from "../types/config";

export const sponsorConfig: SponsorConfig = {
  // Título de la página, si se deja en blanco se usará la traducción de i18n
  title: "", // Título de la página, si se deja en blanco se usará la traducción de i18n

  // Texto de descripción de la página, si se deja en blanco se usará la traducción de i18n
  description: "", // Texto de descripción de la página, si se deja en blanco se usará la traducción de i18n

  // Descripción del uso del patrocinio
  usage:
    "Tu patrocinio se utilizará para el mantenimiento del servidor, la creación de contenido y el desarrollo de funciones, ayudándome a seguir ofreciendo contenido de calidad.",

  // Mostrar lista de patrocinadores
  showSponsorsList: true,

  // Mostrar botón de patrocinio en la parte inferior de la página de detalles del artículo
  showButtonInPost: true,

  // Lista de métodos de patrocinio
  methods: [
    {
      name: "Alipay",
      icon: "fa7-brands:alipay",
      // Ruta de la imagen del código QR de pago (debe estar en el directorio public)
      qrCode: "/assets/images/sponsor/alipay.png", // Ruta de la imagen del código QR de pago (debe estar en el directorio public)
      link: "",
      description: "Escanea con Alipay para patrocinar",
      enabled: true,
    },
    {
      name: "WeChat",
      icon: "fa7-brands:weixin", // Mantener en inglés ya que es un identificador de icono
      qrCode: "/assets/images/sponsor/wechat.png",
      link: "",
      description: "Escanea con WeChat para patrocinar",
      enabled: true,
    },
    {
      name: "ko-fi",
      icon: "simple-icons:kofi", // Mantener en inglés ya que es un identificador de icono
      qrCode: "",
      link: "https://ko-fi.com/cuteleaf", // Mantener en inglés ya que es un identificador
      description: "Buy a Coffee for Firefly",
      enabled: true,
    },
    {
      name: "Aifadian",
      icon: "simple-icons:afdian", // Mantener en inglés ya que es un identificador de icono
      qrCode: "",
      link: "https://afdian.com/a/cuteleaf",
      description: "Patrocina a través de Aifadian",
      enabled: true,
    },
  ],

  // Lista de patrocinadores (opcional)
  sponsors: [
    // Ejemplo: Patrocinador con nombre real
    {
      name: "Xiaye", // Mantener el nombre propio
      amount: "¥50",
      date: "2025-10-01",
      message: "¡Gracias por compartir!",
    },

    // Ejemplo: Patrocinador anónimo
    {
      name: "Usuario anónimo",
      amount: "¥20",
      date: "2025-10-01",
    },
  ],
};
