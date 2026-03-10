<script>
  import { onMount } from "svelte";
  import Icon from "../common/Icon.svelte";
  import { ghFetch } from "./utils/github";
  import { parsePost } from "./utils/parser";
  import { formatDate } from "./utils/formatter";

  let { githubToken, onEditPost, onNewPost } = $props();

  const pathMap = {
    posts: "src/content/posts",
    pages: "src/content/spec",
    projects: "src/content/projects",
    events: "src/content/events",
  };

  let allPostsData = $state([]);
  let currentContentType = $state("posts");
  let currentLayout = $state(localStorage.getItem("cms_layout") || "grid");
  let activeCategory = $state("all");
  let searchTerm = $state("");
  let sortMode = $state("newest");
  let isLoading = $state(false);

  let filteredPosts = $derived.by(() => {
    let filtered = allPostsData.filter((p) => {
      const titleMatch = (p.fm.title || p.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        activeCategory === "all" ||
        (p.fm.category || "Sin categoría") === activeCategory;
      return titleMatch && categoryMatch;
    });
    if (sortMode === "newest")
      filtered.sort(
        (a, b) => new Date(b.fm.published || 0) - new Date(a.fm.published || 0),
      );
    else if (sortMode === "oldest")
      filtered.sort(
        (a, b) => new Date(a.fm.published || 0) - new Date(b.fm.published || 0),
      );
    else if (sortMode === "title")
      filtered.sort((a, b) =>
        (a.fm.title || a.name).localeCompare(b.fm.title || b.name),
      );
    return filtered;
  });

  let categories = $derived.by(() => {
    const cats = {};
    allPostsData.forEach((p) => {
      const cat = p.fm.category || "Sin categoría";
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return cats;
  });

  onMount(() => {
    loadContent(currentContentType);
  });

  async function loadContent(type) {
    isLoading = true;
    currentContentType = type;
    try {
      const files = await ghFetch(`contents/${pathMap[type]}`, githubToken);
      const mdFiles = files.filter(
        (f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"),
      );
      allPostsData = await Promise.all(
        mdFiles.map(async (file) => {
          try {
            const data = await ghFetch(`contents/${file.path}`, githubToken);
            const decoded = decodeURIComponent(escape(atob(data.content)));
            const parsed = parsePost(decoded);
            return { ...file, fm: parsed.fm, sha: data.sha };
          } catch (e) {
            return { ...file, fm: { title: file.name }, sha: null };
          }
        }),
      );
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  function updateLayoutUI(layout) {
    currentLayout = layout;
    localStorage.setItem("cms_layout", layout);
  }
</script>

<div class="cms-dashboard-wrapper">
  <div class="cms-container">
    <!-- Top Bar mejorada y alineada -->
    <header class="cms-top-bar">
      <div class="cms-top-bar-left">
        <div class="cms-search-box">
          <Icon icon="material-symbols:search-rounded" />
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Buscar publicaciones..."
          />
        </div>

        <div class="cms-view-switcher">
          <button
            class:active={currentLayout === "grid"}
            onclick={() => updateLayoutUI("grid")}
            title="Cuadrícula"
          >
            <Icon icon="material-symbols:grid-view-rounded" />
          </button>
          <button
            class:active={currentLayout === "list"}
            onclick={() => updateLayoutUI("list")}
            title="Lista"
          >
            <Icon icon="material-symbols:view-list-rounded" />
          </button>
        </div>
      </div>

      <div class="cms-top-bar-right">
        <select bind:value={sortMode} class="cms-select">
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="title">Título (A-Z)</option>
        </select>
        <button class="cms-btn-primary" onclick={onNewPost}>
          <Icon icon="material-symbols:add-rounded" /> Nuevo Post
        </button>
      </div>
    </header>

    <div class="cms-main-layout">
      <!-- Sidebar robusto -->
      <aside class="cms-sidebar">
        <nav class="cms-nav-group">
          <div class="cms-nav-title">Contenido</div>
          {#each Object.keys(pathMap) as type}
            <button
              class="cms-nav-item"
              class:active={type === currentContentType}
              onclick={() => loadContent(type)}
            >
              <span class="cms-nav-label"
                >{type.charAt(0).toUpperCase() + type.slice(1)}</span
              >
            </button>
          {/each}
        </nav>

        <nav class="cms-nav-group">
          <div class="cms-nav-title">Categorías</div>
          <button
            class="cms-nav-item"
            class:active={activeCategory === "all"}
            onclick={() => (activeCategory = "all")}
          >
            <span class="cms-nav-label">Todas</span>
            <span class="cms-nav-count">{allPostsData.length}</span>
          </button>
          {#each Object.entries(categories) as [cat, count]}
            <button
              class="cms-nav-item"
              class:active={activeCategory === cat}
              onclick={() => (activeCategory = cat)}
            >
              <span class="cms-nav-label">{cat}</span>
              <span class="cms-nav-count">{count}</span>
            </button>
          {/each}
        </nav>
      </aside>

      <!-- Área de contenido con grid corregido -->
      <main class="cms-content">
        {#if isLoading}
          <div class="cms-loading-container">
            <Icon icon="svg-spinners:ring-resize" />
            <p>Cargando contenido...</p>
          </div>
        {:else if filteredPosts.length === 0}
          <div class="cms-empty-state">
            <Icon icon="material-symbols:search-off-rounded" />
            <p>No se encontraron publicaciones.</p>
          </div>
        {:else}
          <div class="cms-post-list-{currentLayout}">
            {#each filteredPosts as post}
              <div
                class="cms-post-card"
                onclick={() => onEditPost(post)}
                onkeydown={(e) =>
                  (e.key === "Enter" || e.key === " ") && onEditPost(post)}
                role="button"
                tabindex="0"
              >
                <div class="cms-post-card-header">
                  <h3 class="cms-post-card-title">
                    {post.fm.title || post.name}
                  </h3>
                  <div class="cms-post-card-meta">
                    <span class="cms-post-date"
                      >{formatDate(post.fm.published)}</span
                    >
                    <span class="cms-post-dot">·</span>
                    <span class="cms-post-category"
                      >{post.fm.category || "Sin categoría"}</span
                    >
                  </div>
                </div>
                {#if currentLayout === "grid"}
                  <p class="cms-post-card-desc">
                    {post.fm.description || "Sin descripción disponible."}
                  </p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<style>
  .cms-dashboard-wrapper {
    background: var(--page-bg);
    min-height: calc(100vh - 4.5rem);
  }

  .cms-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
    background: var(--card-bg);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-large);
    border: 1px solid var(--line-divider);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  }

  .cms-top-bar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  .cms-top-bar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .cms-search-box {
    flex: 1;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--btn-regular-bg);
    padding: 0 1.25rem;
    height: 2.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-divider);
  }

  .cms-search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    width: 100%;
    font-size: 0.9rem;
  }

  .cms-view-switcher {
    display: flex;
    background: var(--btn-regular-bg);
    padding: 0.25rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-divider);
  }

  .cms-view-switcher button {
    width: 2.5rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.2s;
    font-size: 1.2rem;
  }

  .cms-view-switcher button.active {
    background: var(--card-bg);
    color: var(--primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .cms-select {
    background: var(--btn-regular-bg);
    border: 1px solid var(--line-divider);
    padding: 0 1rem;
    height: 2.75rem;
    border-radius: var(--radius-lg);
    color: inherit;
    outline: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .cms-main-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  .cms-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: sticky;
    top: 6.5rem;
  }

  .cms-nav-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .cms-nav-title {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.4;
    padding: 0.5rem 1rem;
  }

  .cms-nav-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-lg);
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .cms-nav-item:hover {
    background: var(--btn-regular-bg);
  }
  .cms-nav-item.active {
    background: var(--primary);
    color: white;
  }

  .cms-nav-count {
    font-size: 0.75rem;
    opacity: 0.6;
    background: var(--btn-regular-bg);
    padding: 0.1rem 0.5rem;
    border-radius: 20px;
  }
  .active .cms-nav-count {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    color: white;
  }

  .cms-post-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  .cms-post-list-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cms-post-card {
    background: var(--card-bg);
    border: 1px solid var(--line-divider);
    border-radius: var(--radius-large);
    padding: 1.75rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cms-post-list-list .cms-post-card {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
  }

  .cms-post-card:hover {
    border-color: var(--primary);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  }

  .cms-post-card-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.3;
  }
  .cms-post-card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: 0.5rem;
  }
  .cms-post-card-desc {
    font-size: 0.9rem;
    opacity: 0.7;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cms-loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rem 0;
    gap: 1.5rem;
    color: var(--primary);
    font-size: 3rem;
  }
  .cms-loading-container p {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.6;
  }

  .cms-empty-state {
    text-align: center;
    padding: 8rem 0;
    opacity: 0.4;
  }
  .cms-empty-state :global(.inline-icon) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 1100px) {
    .cms-main-layout {
      grid-template-columns: 1fr;
    }
    .cms-sidebar {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>
