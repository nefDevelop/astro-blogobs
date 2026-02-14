/**
 * Gestor de carga de iconos
 * Responsable de manejar la visualización del estado de carga de los iconos
 */

export function initIconLoader() {
  // Inicializa un contenedor de icono individual
  function initContainer(container: Element) {
    if (container.hasAttribute("data-icon-initialized")) return;
    container.setAttribute("data-icon-initialized", "true");

    const loadingIndicator = container.querySelector("[data-loading-indicator]") as HTMLElement;
    const iconElement = container.querySelector("[data-icon-element]") as HTMLElement;
    const iconName = iconElement?.getAttribute("icon");

    if (!loadingIndicator || !iconElement) return;

    // Comprueba si el icono ya está cargado
    function checkIconLoaded() {
      const hasContent = iconElement.shadowRoot && iconElement.shadowRoot.children.length > 0;

      if (hasContent) {
        showIcon();
        return true;
      }
      return false;
    }

    // Muestra el icono, oculta el indicador de carga
    function showIcon() {
      loadingIndicator.style.display = "none";
      iconElement.classList.remove("opacity-0");
      iconElement.classList.add("opacity-100");
    }

    // Muestra el indicador de carga, oculta el icono
    function showLoading() {
      loadingIndicator.style.display = "inline-flex";
      iconElement.classList.remove("opacity-100");
      iconElement.classList.add("opacity-0");
    }

    // Estado inicial
    showLoading();

    // Escucha el evento de carga del icono
    iconElement.addEventListener("load", () => {
      showIcon();
    });

    // Escucha el error de carga del icono
    iconElement.addEventListener("error", () => {
      // Mantiene la visualización del fallback
      if (iconName) {
        console.warn(`Error al cargar el icono: ${iconName}`);
      }
    });

    // Usa MutationObserver para escuchar los cambios en el shadow DOM
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => {
        if (checkIconLoaded()) {
          observer.disconnect();
        }
      });

      // 监听iconify-icon元素的变化
      observer.observe(iconElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      // 设置超时，避免无限等待
      setTimeout(() => {
        observer.disconnect();
        if (!checkIconLoaded()) {
          // console.warn(`Icon load timeout: ${iconName}`);
        }
      }, 5000);
    }

    // 立即检查一次（可能已经加载完成）
    setTimeout(() => {
      checkIconLoaded();
    }, 100);
  }

  // 初始化页面上现有的图标
  document.querySelectorAll("[data-icon-container]").forEach(initContainer);

  // 监听新添加的图标
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.hasAttribute?.("data-icon-container")) {
              initContainer(el);
            } else {
              el.querySelectorAll("[data-icon-container]").forEach(initContainer);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
