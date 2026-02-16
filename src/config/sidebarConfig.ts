import type { SidebarLayoutConfig } from "../types/config";

/**
 * Configuración del diseño de la barra lateral
 * Configuración del diseño de la barra lateral
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  // Habilitar la función de la barra lateral
  enable: true,

  // Posición de la barra lateral: left=izquierda, both=ambos lados
  // Cuando se habilita la barra lateral doble, los componentes del lado derecho se ocultarán cuando el ancho sea inferior a 1280px.
  position: "both", // Mantener en inglés ya que es un identificador

  // Cuando se usa una barra lateral izquierda única, ¿mostrar la barra lateral derecha en la página de detalles del artículo?
  // Si se habilita esto cuando la posición es "left", la página de detalles del artículo mostrará barras laterales dobles, mientras que la página de inicio y otras páginas mantendrán una barra lateral izquierda única.
  // Esto es útil para escenarios en los que solo se desea una barra lateral izquierda, pero se desea una barra lateral derecha para componentes como el índice en la página de detalles del artículo.
  showRightSidebarOnPostPage: true,

  // Lista de configuración de componentes de la barra lateral izquierda
  // El orden de renderizado de los componentes depende completamente de su orden en el array de configuración, pero los componentes "top" se renderizarán antes que los componentes "sticky".
  // type: Tipo de componente
  // enable: Habilitar este componente
  // position: Posición del componente: "top" fijo en la parte superior, "sticky" posicionamiento pegajoso (se desplazará con la página)
  // showOnPostPage: Mostrar este componente en la página de detalles del artículo
  // showOnNonPostPage: Mostrar este componente en páginas que no son de detalles del artículo (se muestra en todas las páginas excepto en la de detalles del artículo)
  // configId: ID de configuración del componente (actualmente solo utilizado por los componentes de publicidad), utilizado para distinguir diferentes configuraciones de publicidad.
  // responsive: Configuración responsiva (disponible para algunos componentes, se puede usar para establecer los parámetros necesarios para ciertos componentes).
  leftComponents: [
    {
      // Tipo de componente: Componente de perfil de usuario
      type: "profile", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "top", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
    {
      // Tipo de componente: Componente de anuncio
      type: "announcement", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: false,
      // Posición del componente
      position: "top", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
    {
      // Tipo de componente: Componente de categorías
      type: "categories", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // Configuración responsiva
      responsive: {
        // Umbral de colapso: se colapsa automáticamente cuando el número de categorías supera los 5
        collapseThreshold: 5,
      },
    },
    {
      // Tipo de componente: Componente de etiquetas
      type: "tags", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // Configuración responsiva
      responsive: {
        // Umbral de colapso: se colapsa automáticamente cuando el número de etiquetas supera los 20
        collapseThreshold: 20,
      },
    },
    {
      // Tipo de componente: Componente de barra de publicidad 1
      type: "advertisement", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: false,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // ID de configuración: usar la primera configuración de publicidad
      configId: "ad1",
    },
  ],

  // Lista de configuración de componentes de la barra lateral derecha
  rightComponents: [
    {
      // Lista de configuración de componentes de la barra lateral derecha
      // Tipo de componente: Componente de estadísticas del sitio
      type: "stats", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "top", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
    {
      // Tipo de componente: Componente de calendario
      type: "calendar", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: false,
    },
    {
      // Tipo de componente: Componente de índice de la barra lateral (solo se muestra en la página de detalles del artículo)
      type: "sidebarToc", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // Mostrar en páginas que no son de detalles del artículo
      showOnNonPostPage: false,
    },
    {
      // Tipo de componente: Componente de barra de publicidad 2
      type: "advertisement", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: false,
      // Posición del componente
      position: "sticky", // Mantener en inglés ya que es un identificador
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // ID de configuración: usar la segunda configuración de publicidad
      configId: "ad2",
    },
  ],

  // Lista de configuración de componentes inferiores para móviles
  // Estos componentes solo se muestran en la parte inferior de la página en dispositivos móviles (<768px), independientemente de la configuración de las barras laterales izquierda y derecha.
  mobileBottomComponents: [
    // Lista de configuración de componentes inferiores para móviles
    {
      // Tipo de componente: Componente de perfil de usuario
      type: "profile", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
    {
      // Tipo de componente: Componente de anuncio
      type: "announcement", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: false,
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
    {
      // Tipo de componente: Componente de categorías
      type: "categories", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // Configuración responsiva
      responsive: {
        // Umbral de colapso: se colapsa automáticamente cuando el número de categorías supera los 5
        collapseThreshold: 5,
      },
    },
    {
      // Tipo de componente: Componente de etiquetas
      type: "tags", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
      // Configuración responsiva
      responsive: {
        // Umbral de colapso: se colapsa automáticamente cuando el número de etiquetas supera los 20
        collapseThreshold: 20,
      },
    },
    {
      // Tipo de componente: Componente de estadísticas del sitio
      type: "stats", // Mantener en inglés ya que es un identificador
      // Habilitar este componente
      enable: true,
      // Mostrar en la página de detalles del artículo
      showOnPostPage: true,
    },
  ],
};
