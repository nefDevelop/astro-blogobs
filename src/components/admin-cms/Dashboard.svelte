<script>
  import { onMount } from "svelte";
  import { ghFetch } from "./utils/github";
  import { parsePost } from "./utils/parser";
  import { formatDate } from "./utils/formatter";

  let { githubToken, onEditPost, onNewPost } = $props();

  // CMS Configuration
  const pathMap = {
    posts: "src/content/posts",
    pages: "src/content/spec",
    projects: "src/content/projects",
    events: "src/content/events",
  };

  // State
  let allPostsData = $state([]);
  let currentContentType = $state("posts");
  let currentLayout = $state(localStorage.getItem("cms_layout") || "grid");
  let activeCategory = $state("all");
  let activeTag = $state("all");
  let searchTerm = $state("");
  let sortMode = $state("newest");
  let isLoading = $state(false);
  let errorMessage = $state("");
  let isSidebarOpen = $state(false);

  // Derived filtered results
  let filteredPosts = $derived.by(() => {
    if (currentContentType === "tags") {
      const tagCounts = {};
      allPostsData.forEach((p) => {
        const tags = Array.isArray(p.fm.tags)
          ? p.fm.tags
          : typeof p.fm.tags === "string"
            ? p.fm.tags.split(",").map((t) => t.trim())
            : [];
        tags.forEach((t) => {
          if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });
      return Object.entries(tagCounts)
        .filter(([tag]) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
          if (sortMode === "title") return a[0].localeCompare(b[0]);
          return b[1] - a[1]; // Default to most used
        });
    }

    let filtered = allPostsData.filter((p) => {
      const titleMatch = (p.fm.title || p.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        activeCategory === "all" ||
        (p.fm.category || "Sin categoría") === activeCategory;
      const tagsArray = Array.isArray(p.fm.tags)
        ? p.fm.tags
        : typeof p.fm.tags === "string"
          ? p.fm.tags.split(",").map((t) => t.trim())
          : [];
      const tagMatch = activeTag === "all" || tagsArray.includes(activeTag);
      return titleMatch && categoryMatch && tagMatch;
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

  // Derived aggregates
  let categories = $derived.by(() => {
    const cats = {};
    allPostsData.forEach((p) => {
      const cat = p.fm.category || "Sin categoría";
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return cats;
  });

  let tagsGlobal = $derived.by(() => {
    const tags = {};
    allPostsData.forEach((p) => {
      (p.fm.tags || []).forEach((t) => {
        tags[t] = (tags[t] || 0) + 1;
      });
    });
    return tags;
  });

  onMount(async () => {
    await loadContent(currentContentType);
  });

  async function loadContent(type, skipFilterReset = false) {
    isLoading = true;
    errorMessage = "";
    currentContentType = type;

    if (!skipFilterReset) {
      activeCategory = "all";
      activeTag = "all";
    }

    let mdFiles = [];
    const currentPath = pathMap[type];

    try {
      if (type === "tags") {
        const allResults = await Promise.all(
          Object.values(pathMap).map((path) =>
            ghFetch(`contents/${path}`, githubToken)
              .then((files) =>
                files.filter(
                  (f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"),
                ),
              )
              .catch(() => []),
          ),
        );
        mdFiles = allResults.flat();
      } else if (currentPath) {
        const files = await ghFetch(`contents/${currentPath}`, githubToken);
        mdFiles = files.filter(
          (f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"),
        );
      }

      allPostsData = await Promise.all(
        mdFiles.map(async (file) => {
          try {
            const data = await ghFetch(`contents/${file.path}`, githubToken);
            const decoded = decodeURIComponent(escape(atob(data.content)));
            const parsed = parsePost(decoded);
            return { ...file, fm: parsed.fm, sha: data.sha };
          } catch (e) {
            console.warn(`Error fetching/parsing file ${file.path}:`, e);
            return { ...file, fm: { title: file.name }, sha: null };
          }
        }),
      );
    } catch (err) {
      console.error("Error loading dashboard content:", err);
      errorMessage = `Error cargando contenido: ${err.message}`;
      allPostsData = [];
    } finally {
      isLoading = false;
    }
  }

  function updateLayoutUI(layout) {
    currentLayout = layout;
    localStorage.setItem("cms_layout", layout);
  }

  function handleCategoryClick(cat) {
    activeCategory = cat;
    activeTag = "all";
  }

  function handleTagClick(tag) {
    activeTag = tag;
    activeCategory = "all";
    if (currentContentType === "tags") {
      loadContent("posts", true);
    }
  }

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<div class="cms-dashboard-wrapper">
  <div
    class="sidebar-overlay"
    role="button"
    tabindex="-1"
    aria-label="Cerrar sidebar"
    class:open={isSidebarOpen}
    onclick={toggleSidebar}
    onkeydown={(e) => e.key === "Enter" && toggleSidebar()}
  ></div>

  <div id="dashboard" class="cms-container">
    <div
      class="flex items-center gap-6 mb-10 onload-animation mx-auto max-w-7xl"
    >
      <div class="cms-search-wrapper flex-1">
        <div class="cms-search-icon">
          <iconify-icon
            icon="material-symbols:search-rounded"
            style="font-size: 1.5rem;"
          ></iconify-icon>
        </div>
        <input
          type="text"
          bind:value={searchTerm}
          class="cms-input cms-search-input w-full"
          placeholder="Buscar publicaciones..."
        />
      </div>
      <div class="layout-toggle-container">
        <select bind:value={sortMode} class="cms-input cms-sort-select">
          <option value="newest">Recientes</option>
          <option value="oldest">Antiguos</option>
          <option value="title">A-Z</option>
        </select>
        <div class="cms-v-divider"></div>
        <button
          onclick={() => updateLayoutUI("grid")}
          class="layout-toggle-btn"
          class:active-tab={currentLayout === "grid"}
          title="Cuadrícula"
        >
          <iconify-icon
            icon="material-symbols:grid-view-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
        <button
          onclick={() => updateLayoutUI("list")}
          class="layout-toggle-btn"
          class:active-tab={currentLayout === "list"}
          title="Lista"
        >
          <iconify-icon
            icon="material-symbols:view-list-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
      </div>
    </div>

    <div class="dashboard-layout">
      <div class="sidebar-column flex flex-col gap-6">
        <aside class="cms-sidebar onload-animation">
          <div class="sidebar-section">
            <div class="sidebar-title">Contenido</div>
            <div id="main-nav" class="sidebar-list">
              {#each Object.keys(pathMap) as type}
                <div
                  class="sidebar-item"
                  role="button"
                  tabindex="0"
                  class:active={type === currentContentType}
                  onclick={() => loadContent(type)}
                  onkeydown={(e) => e.key === "Enter" && loadContent(type)}
                >
                  <iconify-icon
                    style="font-size: 1.5rem;"
                    icon="material-symbols:{type === 'posts'
                      ? 'article-outline-rounded'
                      : type === 'pages'
                        ? 'description-outline-rounded'
                        : type === 'projects'
                          ? 'rocket-launch-outline-rounded'
                          : type === 'events'
                            ? 'event-available-outline-rounded'
                            : 'tag-rounded'}"
                  ></iconify-icon>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
              {/each}
              <div
                class="sidebar-item"
                role="button"
                tabindex="0"
                class:active={currentContentType === "tags"}
                onclick={() => loadContent("tags")}
                onkeydown={(e) => e.key === "Enter" && loadContent("tags")}
              >
                <iconify-icon
                  icon="material-symbols:tag-rounded"
                  style="font-size: 1.5rem;"
                ></iconify-icon>
                <span>Etiquetas</span>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <div class="sidebar-title">Categorías</div>
            <div class="sidebar-list">
              <div
                class="sidebar-item"
                role="button"
                tabindex="0"
                class:active={activeCategory === "all"}
                onclick={() => handleCategoryClick("all")}
                onkeydown={(e) =>
                  e.key === "Enter" && handleCategoryClick("all")}
              >
                <iconify-icon
                  icon="material-symbols:list-alt-outline-rounded"
                  style="font-size: 1.5rem;"
                ></iconify-icon>
                <span>Todos</span>
                <span class="sidebar-count">{allPostsData.length}</span>
              </div>
              {#each Object.entries(categories).sort() as [cat, count]}
                <div
                  class="sidebar-item"
                  role="button"
                  tabindex="0"
                  class:active={activeCategory === cat}
                  onclick={() => handleCategoryClick(cat)}
                  onkeydown={(e) =>
                    e.key === "Enter" && handleCategoryClick(cat)}
                >
                  <iconify-icon
                    icon="material-symbols:folder-outline-rounded"
                    style="font-size: 1.5rem;"
                  ></iconify-icon>
                  <span>{cat}</span> <span class="sidebar-count">{count}</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="sidebar-section mt-6">
            <div class="sidebar-title">Etiquetas</div>
            <div class="tag-cloud-content flex flex-wrap gap-1.5 px-4 pb-2">
              {#each Object.entries(tagsGlobal).sort((a, b) => b[1] - a[1]) as [tag, count]}
                {@const counts = Object.values(tagsGlobal)}
                {@const min = counts.length ? Math.min(...counts) : 0}
                {@const max = counts.length ? Math.max(...counts) : 0}
                {@const size =
                  counts.length > 1
                    ? 0.7 + ((count - min) / (max - min)) * 0.4
                    : 0.85}
                <span
                  class="tag-chip scale-animation"
                  role="button"
                  tabindex="0"
                  class:active={activeTag === tag}
                  style="font-size: {size}rem; padding: 0.15rem 0.45rem;"
                  onclick={() => handleTagClick(tag)}
                  onkeydown={(e) => e.key === "Enter" && handleTagClick(tag)}
                  >{tag}</span
                >
              {/each}
            </div>
          </div>
        </aside>
      </div>

      <div
        class="posts-container"
        class:grid-mode={currentLayout === "grid"}
        class:list-mode={currentLayout === "list"}
      >
        {#if isLoading}
          <div class="col-span-full py-20 text-center">
            <iconify-icon
              icon="svg-spinners:ring-resize"
              style="color: var(--primary); font-size: 3rem;"
            ></iconify-icon>
          </div>
        {:else if errorMessage}
          <div class="col-span-full float-panel p-9 text-center text-red-500">
            <h2>Error de Dashboard</h2>
            <p>{errorMessage}</p>
          </div>
        {:else if filteredPosts.length === 0}
          <div class="col-span-full py-20 text-center opacity-50 italic">
            No se encontraron artículos.
          </div>
        {:else if currentContentType === "tags"}
          <div class="col-span-full cms-table-container onload-animation">
            <table class="cms-table">
              <thead>
                <tr>
                  <th style="width: 50px;"></th>
                  <th>Etiqueta</th>
                  <th>Uso</th>
                  <th style="text-align: right;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {#each filteredPosts as [tag, count], index (tag)}
                  <tr>
                    <td
                      ><iconify-icon
                        icon="material-symbols:tag-rounded"
                        class="tag-table-icon"
                      ></iconify-icon></td
                    >
                    <td class="font-bold">{tag}</td>
                    <td><span class="opacity-60">{count} artículos</span></td>
                    <td>
                      <div class="tag-table-actions">
                        <button
                          class="table-btn"
                          title="Ver artículos"
                          onclick={() => handleTagClick(tag)}
                        >
                          <iconify-icon
                            icon="material-symbols:visibility-outline-rounded"
                          ></iconify-icon>
                        </button>
                        <button
                          class="table-btn"
                          title="Editar etiqueta"
                          onclick={() =>
                            alert("Funcionalidad de edición en desarrollo")}
                        >
                          <iconify-icon
                            icon="material-symbols:edit-outline-rounded"
                          ></iconify-icon>
                        </button>
                        <button
                          class="table-btn delete"
                          title="Eliminar"
                          onclick={() =>
                            alert("Funcionalidad de eliminación en desarrollo")}
                        >
                          <iconify-icon
                            icon="material-symbols:delete-outline-rounded"
                          ></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div
            class="cms-grid-post-list"
            class:grid-mode={currentLayout === "grid"}
            class:list-mode={currentLayout === "list"}
          >
            {#each filteredPosts as post, index (post.path)}
              <div
                class="post-card-wrapper onload-animation"
                role="button"
                tabindex="0"
                style="animation-delay: {(index % 4) * 0.05}s;"
                onclick={() => onEditPost(post)}
                onkeydown={(e) => e.key === "Enter" && onEditPost(post)}
              >
                <h3 class="post-card-title">{post.fm.title || post.name}</h3>
                <div class="post-card-meta">
                  <div class="post-card-meta-item">
                    <iconify-icon
                      icon="material-symbols:calendar-today-outline-rounded"
                      class="post-card-meta-icon"
                    ></iconify-icon><span>{formatDate(post.fm.published)}</span>
                  </div>
                  <div class="post-card-meta-divider"></div>
                  <div class="post-card-meta-item">
                    <iconify-icon
                      icon="material-symbols:book-2-outline-rounded"
                      class="post-card-meta-icon"
                    ></iconify-icon><span
                      >{post.fm.category || "Sin categoría"}</span
                    >
                  </div>
                </div>
                <p class="post-card-description">
                  {post.fm.description || "Sin descripción."}
                </p>
                <div class="post-card-tags">
                  {#each Array.isArray(post.fm.tags) ? post.fm.tags : [] as tag}{/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
</style>
