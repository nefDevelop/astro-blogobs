/**
 * Clase de utilidad para la Tabla de Contenidos (TOC)
 * Lógica compartida para SidebarTOC y FloatingTOC
 */

export interface TOCConfig {
  contentId: string;
  indicatorId: string;
  maxLevel?: number;
  scrollOffset?: number;
}

export class TOCManager {
  private tocItems: HTMLElement[] = [];
  private observer: IntersectionObserver | null = null;
  private minDepth = 10;
  private maxLevel: number;
  private scrollTimeout: number | null = null;
  private contentId: string;
  private indicatorId: string;
  private scrollOffset: number;

  constructor(config: TOCConfig) {
    this.contentId = config.contentId;
    this.indicatorId = config.indicatorId;
    this.maxLevel = config.maxLevel || 3;
    this.scrollOffset = config.scrollOffset || 80;
  }

  /**
   * Busca el contenedor del contenido del artículo
   */
  private getContentContainer(): Element | null {
    return document.querySelector(".custom-md") || document.querySelector(".prose") || document.querySelector(".markdown-content");
  }

  /**
   * Busca todos los encabezados
   */
  private getAllHeadings(): NodeListOf<HTMLElement> {
    const contentContainer = this.getContentContainer();
    if (contentContainer) {
      return contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");
    }
    return document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  }

  /**
   * Calcula la profundidad mínima
   */
  private calculateMinDepth(headings: NodeListOf<HTMLElement>): number {
    let minDepth = 10;
    headings.forEach((heading) => {
      const depth = Number.parseInt(heading.tagName.charAt(1), 10);
      minDepth = Math.min(minDepth, depth);
    });
    return minDepth;
  }

  /**
   * Filtra los encabezados
   */
  private filterHeadings(headings: NodeListOf<HTMLElement>): HTMLElement[] {
    return Array.from(headings).filter((heading) => {
      const depth = Number.parseInt(heading.tagName.charAt(1), 10);
      return depth < this.minDepth + this.maxLevel;
    });
  }

  /**
   * Genera el contenido de la insignia
   */
  private generateBadgeContent(depth: number, heading1Count: number): string {
    if (depth === this.minDepth) {
      return heading1Count.toString();
    }
    if (depth === this.minDepth + 1) {
      return '<div class="transition w-2 h-2 rounded-[0.1875rem] bg-[--toc-badge-bg]"></div>';
    }
    return '<div class="transition w-1.5 h-1.5 rounded-xs bg-black/5 dark:bg-white/10"></div>';
  }

  /**
   * Genera el HTML de la TOC
   */
  public generateTOCHTML(): string {
    const headings = this.getAllHeadings();

    if (headings.length === 0) {
      // Si no hay encabezados, muestra un mensaje.
      return '<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>Esta página no tiene tabla de contenidos.</p></div>';
    }

    this.minDepth = this.calculateMinDepth(headings);
    const filteredHeadings = this.filterHeadings(headings);

    if (filteredHeadings.length === 0) {
      // Si no hay encabezados filtrados, muestra un mensaje.
      return '<div class="text-center py-8 text-gray-500 dark:text-gray-400"><p>Esta página no tiene tabla de contenidos.</p></div>';
    }

    let tocHTML = "";
    let heading1Count = 1;

    filteredHeadings.forEach((heading) => {
      const depth = Number.parseInt(heading.tagName.charAt(1), 10);
      const depthClass =
        depth === this.minDepth
          ? "" // Sin sangría para el nivel mínimo
          : depth === this.minDepth + 1
            ? "pl-4" // Sangría para el siguiente nivel
            : "pl-8"; // Sangría para niveles más profundos

      if (!heading.id) {
        return;
      }

      const badgeContent = this.generateBadgeContent(depth, heading1Count);
      if (depth === this.minDepth) {
        heading1Count++;
      }

      let headingText = (heading.textContent || "") // Obtiene el texto del encabezado, elimina los '#' y recorta los espacios.
        .replace(/#+\s*$/, "")
        .trim();

      // Fallback para texto vacío (ej. subtítulo dinámico)
      if (!headingText) {
        const dataSubtitles = heading.getAttribute("data-subtitles");
        if (dataSubtitles) {
          try {
            const subtitles = JSON.parse(dataSubtitles);
            headingText = Array.isArray(subtitles) ? subtitles[0] : subtitles;
          } catch {
            // ignore
          }
        }
      }

      if (!headingText) {
        headingText = heading.id === "banner-subtitle" ? "Banner Subtitle" : heading.id || "Heading"; // Si el texto sigue vacío, usa el ID o un texto predeterminado.
      }

      tocHTML += `
        <a 
          href="#${heading.id}" 
          class="px-2 flex gap-2 relative transition w-full min-h-9 rounded-xl hover:bg-(--toc-btn-hover) active:bg-(--toc-btn-active) py-2 ${depthClass}"
          data-heading-id="${heading.id}" // ID del encabezado para referencia
          aria-label="${headingText}"
        >
          <div class="transition w-5 h-5 shrink-0 rounded-lg text-xs flex items-center justify-center font-bold ${depth === this.minDepth ? "bg-(--toc-badge-bg) text-(--btn-content)" : ""}">
            ${badgeContent}
          </div>
          <div class="transition text-sm ${depth <= this.minDepth + 1 ? "text-50" : "text-30"} flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">${headingText}</div>
        </a>
      `;
    });

    tocHTML += `<div id="${this.indicatorId}" style="opacity: 0;" class="-z-10 absolute bg-[--toc-btn-hover] left-0 right-0 rounded-xl transition-all"></div>`;

    return tocHTML;
  }

  /**
   * Actualiza el contenido de la TOC
   */
  public updateTOCContent(): void {
    const tocContent = document.getElementById(this.contentId);
    if (!tocContent) return;

    tocContent.innerHTML = this.generateTOCHTML();
    this.tocItems = Array.from(document.querySelectorAll(`#${this.contentId} a`));
  }

  /**
   * Obtiene los IDs de los encabezados visibles
   */
  private getVisibleHeadingIds(): string[] {
    const headings = this.getAllHeadings();
    const visibleHeadingIds: string[] = [];

    headings.forEach((heading) => {
      if (heading.id) {
        const rect = heading.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          visibleHeadingIds.push(heading.id);
        }
      }
    });

    // Si no hay encabezados visibles, selecciona el encabezado más cercano a la parte superior de la pantalla.
    if (visibleHeadingIds.length === 0 && headings.length > 0) {
      let closestHeading: string | null = null;
      let minDistance = Number.POSITIVE_INFINITY;

      headings.forEach((heading) => {
        if (heading.id) {
          const rect = heading.getBoundingClientRect();
          const distance = Math.abs(rect.top);

          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = heading.id;
          }
        }
      });

      if (closestHeading) {
        visibleHeadingIds.push(closestHeading);
      }
    }

    return visibleHeadingIds;
  }

  /**
   * Actualiza el estado activo
   */
  public updateActiveState(): void {
    if (!this.tocItems || this.tocItems.length === 0) return; // Si no hay elementos de TOC, retorna.

    // 移除所有活动状态
    this.tocItems.forEach((item) => {
      item.classList.remove("visible");
    });

    const visibleHeadingIds = this.getVisibleHeadingIds();
    // Encuentra los elementos de la TOC correspondientes y añade el estado activo.
    const activeItems = this.tocItems.filter((item) => {
      const headingId = item.dataset.headingId;
      return headingId && visibleHeadingIds.includes(headingId);
    });

    // 添加活动状态
    activeItems.forEach((item) => {
      item.classList.add("visible");
    });

    // Actualiza el indicador de actividad.
    this.updateActiveIndicator(activeItems);
  }

  /**
   * Actualiza el indicador de actividad
   */
  private updateActiveIndicator(activeItems: HTMLElement[]): void {
    const indicator = document.getElementById(this.indicatorId); // Obtiene el elemento indicador.
    if (!indicator || !this.tocItems.length) return;

    if (activeItems.length === 0) {
      indicator.style.opacity = "0";
      return;
    }

    const tocContent = document.getElementById(this.contentId);
    if (!tocContent) return;

    const contentRect = tocContent.getBoundingClientRect();
    const firstActive = activeItems[0];
    const lastActive = activeItems[activeItems.length - 1];

    const firstRect = firstActive.getBoundingClientRect();
    const lastRect = lastActive.getBoundingClientRect();

    const top = firstRect.top - contentRect.top;
    const height = lastRect.bottom - firstRect.top;

    indicator.style.top = `${top}px`; // Establece la posición superior del indicador.
    indicator.style.height = `${height}px`; // Establece la altura del indicador.
    indicator.style.opacity = "1"; // Hace visible el indicador.

    // Desplazamiento automático al elemento activo.
    if (firstActive) {
      this.scrollToActiveItem(firstActive);
    }
  }

  /**
   * Desplaza al elemento activo
   */
  private scrollToActiveItem(activeItem: HTMLElement): void {
    if (!activeItem) return;

    const tocContainer = document.querySelector(`#${this.contentId}`)?.closest(".toc-scroll-container");
    if (!tocContainer) return;

    // Limpia el temporizador anterior.
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Usa un mecanismo de throttling.
    this.scrollTimeout = window.setTimeout(() => {
      const containerRect = tocContainer.getBoundingClientRect(); // Obtiene las dimensiones del contenedor.
      const itemRect = activeItem.getBoundingClientRect();

      // 只在元素不在可视区域时才滚动
      const isVisible = itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom;

      if (!isVisible) {
        const itemOffsetTop = (activeItem as HTMLElement).offsetTop;
        const containerHeight = tocContainer.clientHeight;
        const itemHeight = activeItem.clientHeight;
        // Calcula la posición de desplazamiento objetivo, centrando el elemento.
        const targetScroll = itemOffsetTop - containerHeight / 2 + itemHeight / 2;

        tocContainer.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }, 100);
  }

  /**
   * Maneja el evento de clic
   */
  public handleClick(event: Event): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLAnchorElement;
    const id = decodeURIComponent(target.getAttribute("href")?.substring(1) || "");
    const targetElement = document.getElementById(id);

    if (targetElement) {
      const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - this.scrollOffset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  }

  /**
   * Configura el IntersectionObserver
   */
  public setupObserver(): void {
    const headings = this.getAllHeadings();

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      () => {
        this.updateActiveState();
      },
      {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      },
    );

    headings.forEach((heading) => {
      if (heading.id) {
        this.observer?.observe(heading);
      }
    });
  }

  /**
   * Vincula los eventos de clic
   */
  public bindClickEvents(): void {
    this.tocItems.forEach((item) => {
      item.addEventListener("click", this.handleClick.bind(this));
    });
  }

  /**
   * Limpia
   */
  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
  }

  /**
   * Inicializa
   */
  public init(): void {
    this.updateTOCContent();
    this.bindClickEvents();
    this.setupObserver();
    this.updateActiveState();
  }
}

/**
 * Comprueba si es una página de artículo
 */
export function isPostPage(): boolean {
  return window.location.pathname.includes("/posts/");
}
