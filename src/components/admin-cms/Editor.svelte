<script>
  import { onMount, tick } from "svelte";
  import { ghFetch, REPO_OWNER, REPO_NAME } from "./utils/github";
  import { parsePost, stringifyPost } from "./utils/parser";
  import { marked } from "marked";

  let {
    githubToken,
    post = null,
    onPostSaved,
    onPostCancelled,
    onPostDeleted,
  } = $props();

  // State
  let filenameInput = $state("");
  let titleInput = $state("");
  let publishedInput = $state("");
  let categoryInput = $state("");
  let descriptionInput = $state("");
  let tagsInput = $state("");
  let contentInput = $state("");
  let currentSha = $state(null);
  let isLoading = $state(false);
  let isSaving = $state(false);
  let errorMessage = $state("");
  let currentMode = $state("visual");
  let renderedPreview = $state("");

  // Sync state with props
  $effect(() => {
    if (post) {
      filenameInput = post.name || "nuevo-post.md";
      titleInput = post.fm?.title || "";
      publishedInput = post.fm?.published
        ? new Date(post.fm.published).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      categoryInput = post.fm?.category || "";
      descriptionInput = post.fm?.description || "";
      tagsInput = Array.isArray(post.fm?.tags)
        ? post.fm.tags.join(", ")
        : post.fm?.tags || "";
      currentSha = post.sha || null;
    } else {
      filenameInput = "nuevo-post.md";
      titleInput = "";
      publishedInput = new Date().toISOString().split("T")[0];
      categoryInput = "";
      descriptionInput = "";
      tagsInput = "";
      contentInput = "";
      currentSha = null;
    }
  });

  const pathMap = {
    posts: "src/content/posts",
    pages: "src/content/spec",
    projects: "src/content/projects",
    events: "src/content/events",
  };

  let currentContentType = $derived.by(() => {
    if (post && post.path) {
      return (
        Object.keys(pathMap).find((key) =>
          post.path.startsWith(pathMap[key]),
        ) || "posts"
      );
    }
    return "posts";
  });

  onMount(() => {
    const renderer = new marked.Renderer();
    renderer.code = (code, infostring) => {
      const lang = (infostring || "").match(/\S*/)[0];
      const meta = (infostring || "").replace(lang, "").trim();
      const title =
        meta.match(/title="([^"]*)"/)?.[1] ||
        meta.match(/title=([^ ]*)/)?.[1] ||
        "";
      return `<div class="code-frame"><div class="code-header"><span class="code-title">${title || "Código"}</span><span class="code-lang">${lang || "text"}</span></div><pre><code class="language-${lang}">${code}</code></pre></div>`;
    };
    marked.setOptions({ renderer });

    if (post && githubToken) {
      loadPost();
    }
  });

  async function loadPost() {
    isLoading = true;
    try {
      const data = await ghFetch(`contents/${post.path}`, githubToken);
      currentSha = data.sha;
      const decoded = decodeURIComponent(escape(atob(data.content)));
      const parsed = parsePost(decoded);
      titleInput = parsed.fm.title || "";
      publishedInput = parsed.fm.published
        ? new Date(parsed.fm.published).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      categoryInput = parsed.fm.category || "";
      descriptionInput = parsed.fm.description || "";
      tagsInput = Array.isArray(parsed.fm.tags)
        ? parsed.fm.tags.join(", ")
        : parsed.fm.tags || "";
      contentInput = parsed.content;
    } catch (err) {
      console.error("Error loading post:", err);
      errorMessage = `Error cargando el post: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (currentMode === "preview") {
      updatePreview();
    }
  });

  function updatePreview() {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    let html = `<div class="preview-header"><h1 class="preview-title">${titleInput || "Sin Título"}</h1><div class="preview-meta"><span>${publishedInput}</span> / <span>${categoryInput}</span>${tags.length ? ` / <span>${tags.join(", ")}</span>` : ""}</div></div>`;
    let contentHtml = marked.parse(contentInput || "");
    contentHtml = contentHtml.replace(
      /:::(\w+)\n([\s\S]*?)\n:::/g,
      (match, type, inner) => {
        const icon =
          {
            note: "info-rounded",
            tip: "lightbulb-rounded",
            warning: "warning-rounded",
            important: "priority-high-rounded",
            caution: "error-rounded",
          }[type] || "info-rounded";
        return `<div class="admonition ${type}"><div class="admonition-title"><iconify-icon icon="material-symbols:${icon}"></iconify-icon> ${marked.parse(inner || "")}</div></div>`;
      },
    );
    renderedPreview =
      html + `<div class="markdown-preview custom-md">${contentHtml}</div>`;
  }

  function handleToolbarButtonClick(type) {
    const textarea = document.getElementById("post-content");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = contentInput.substring(start, end);
    let snippet = "";

    switch (type) {
      case "bold":
        snippet = `**${selection || "texto en negrita"}**`;
        break;
      case "italic":
        snippet = `*${selection || "texto en cursiva"}*`;
        break;
      case "strikethrough":
        snippet = `~~${selection || "texto tachado"}~~`;
        break;
      case "code-inline":
        snippet = `\`${selection || "código"}\``;
        break;
      case "heading":
        snippet = `\n## ${selection || "Título"}\n`;
        break;
      case "blockquote":
        snippet = `\n> ${selection || "Cita"}\n`;
        break;
      case "ul":
        snippet = `\n- ${selection || "Elemento de lista"}\n`;
        break;
      case "ol":
        snippet = `\n1. ${selection || "Elemento de lista"}\n`;
        break;
      case "link":
        snippet = `[${selection || "Enlace"}](https://ejemplo.com)`;
        break;
      case "image":
        snippet = `![${selection || "Alt Text"}](https://ejemplo.com/imagen.jpg)`;
        break;
      case "hr":
        snippet = `\n---\n`;
        break;
      case "github":
        snippet = `\n::github{user="${REPO_OWNER}" repo="${REPO_NAME}"}\n`;
        break;
      default:
        snippet = `\n:::${type}\n${selection || "Escribe aquí..."}\n:::\n`;
        break;
    }

    contentInput =
      contentInput.substring(0, start) + snippet + contentInput.substring(end);

    tick().then(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + snippet.length);
    });
  }

  async function handleSave() {
    isSaving = true;
    errorMessage = "";
    const finalFM = {
      title: titleInput.trim(),
      published: publishedInput,
      category: categoryInput.trim(),
      description: descriptionInput.trim(),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };
    const finalContent = stringifyPost(finalFM, contentInput);
    const filename = filenameInput.trim();
    const collectionPath = pathMap[currentContentType];
    const targetPath = post
      ? post.path
      : `${collectionPath}/${filename.endsWith(".md") ? filename : filename + ".md"}`;

    try {
      await ghFetch(`contents/${targetPath}`, githubToken, {
        method: "PUT",
        body: JSON.stringify({
          message: `CMS: ${post ? "Update" : "Create"} ${filename}`,
          content: btoa(unescape(encodeURIComponent(finalContent))),
          sha: currentSha || undefined,
        }),
      });
      alert("¡Post guardado con éxito!");
      if (onPostSaved) onPostSaved();
    } catch (err) {
      console.error("Error saving post:", err);
      errorMessage = `Error al guardar el post: ${err.message}`;
      alert(errorMessage);
    } finally {
      isSaving = false;
    }
  }

  async function handleDelete() {
    if (!post || !post.path) return;
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${titleInput || post.name}"?`,
      )
    )
      return;

    isSaving = true;
    try {
      await ghFetch(`contents/${post.path}`, githubToken, {
        method: "DELETE",
        body: JSON.stringify({
          message: `CMS: Delete ${post.name}`,
          sha: currentSha,
        }),
      });
      alert("¡Post eliminado con éxito!");
      if (onPostDeleted) onPostDeleted();
      else if (onPostSaved) onPostSaved();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(`Error al eliminar: ${err.message}`);
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="editor-main-wrapper onload-animation mx-auto max-w-7xl">
  <div class="editor-header sticky z-40 py-4">
    <div class="flex items-center gap-6">
      <h2 class="section-header text-xl">Editor {post ? "Post" : "Nuevo"}</h2>
      <div class="editor-mode-toggle">
        <button
          onclick={() => (currentMode = "visual")}
          class="btn-plain px-4 py-1.5 text-xs font-bold"
          class:active-tab={currentMode === "visual"}>Config</button
        >
        <button
          onclick={() => (currentMode = "raw")}
          class="btn-plain px-4 py-1.5 text-xs font-bold"
          class:active-tab={currentMode === "raw"}>Markdown</button
        >
        <button
          onclick={() => (currentMode = "preview")}
          class="btn-plain px-4 py-1.5 text-xs font-bold"
          class:active-tab={currentMode === "preview"}>Preview</button
        >
      </div>
    </div>
    <div class="flex gap-2">
      <button
        onclick={onPostCancelled}
        class="btn-plain px-5 py-2 text-sm font-bold border rounded-lg"
        >Cancelar</button
      >
      {#if post}
        <button
          onclick={handleDelete}
          class="btn-plain px-3 py-2 text-sm font-bold border rounded-lg"
          style="color: #ef4444;"
          title="Eliminar publicación"
          disabled={isSaving}
        >
          <iconify-icon
            icon="material-symbols:delete-outline-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
      {/if}
      <button onclick={handleSave} class="btn-regular" disabled={isSaving}>
        {#if isSaving}
          <iconify-icon icon="svg-spinners:ring-resize" class="mr-2"
          ></iconify-icon> Guardando...
        {:else}
          Guardar Cambios
        {/if}
      </button>
    </div>
  </div>

  {#if errorMessage}
    <div class="float-panel p-4 text-center text-red-500 mb-4">
      <p>{errorMessage}</p>
    </div>
  {/if}

  <div class="cms-grid-12 items-start">
    <div
      class="fm-panel cms-col-4"
      class:hidden={currentMode === "raw" || currentMode === "preview"}
    >
      <div class="float-panel space-y-6">
        <div class="contrast-header px-6 py-4">
          <h3
            class="section-header text-sm tracking-widest uppercase opacity-80"
          >
            Metadata
          </h3>
        </div>
        <div class="flex flex-col gap-6 p-6 pt-0">
          <div>
            <label class="cms-label" for="filename-input"
              >Nombre del archivo</label
            >
            <input
              type="text"
              id="filename-input"
              bind:value={filenameInput}
              class="cms-input font-mono"
            />
          </div>
          <div>
            <label class="cms-label" for="title-input">Título del Post</label>
            <input
              type="text"
              id="title-input"
              bind:value={titleInput}
              class="cms-input"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="cms-label" for="published-input">Fecha</label>
              <input
                type="date"
                id="published-input"
                bind:value={publishedInput}
                class="cms-input"
              />
            </div>
            <div>
              <label class="cms-label" for="category-input">Categoría</label>
              <input
                type="text"
                id="category-input"
                bind:value={categoryInput}
                class="cms-input"
              />
            </div>
          </div>
          <div>
            <label class="cms-label" for="description-input"
              >Descripción / Extracto</label
            >
            <textarea
              id="description-input"
              bind:value={descriptionInput}
              rows="5"
              class="cms-textarea text-sm"
            ></textarea>
          </div>
          <div>
            <label class="cms-label" for="tags-input">Tags (coma)</label>
            <input
              type="text"
              id="tags-input"
              bind:value={tagsInput}
              class="cms-input"
              placeholder="astro, blog, tutorial"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="content-panel"
      class:cms-col-12={currentMode === "raw" || currentMode === "preview"}
      class:cms-col-8={currentMode === "visual"}
    >
      <div
        class="markdown-container float-panel flex flex-col overflow-hidden"
        class:hidden={currentMode === "preview"}
      >
        <div class="cms-toolbar contrast-header">
          <button
            onclick={() => handleToolbarButtonClick("bold")}
            class="toolbar-btn"
            title="Negrita"
            ><iconify-icon icon="material-symbols:format-bold" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("italic")}
            class="toolbar-btn"
            title="Cursiva"
            ><iconify-icon icon="material-symbols:format-italic" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("strikethrough")}
            class="toolbar-btn"
            title="Tachado"
            ><iconify-icon
              icon="material-symbols:format-strikethrough"
              class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("code-inline")}
            class="toolbar-btn"
            title="Código en línea"
            ><iconify-icon icon="material-symbols:code" class="text-xl"
            ></iconify-icon></button
          >
          <div class="toolbar-divider"></div>
          <button
            onclick={() => handleToolbarButtonClick("heading")}
            class="toolbar-btn"
            title="Encabezado"
            ><iconify-icon icon="material-symbols:format-size" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("blockquote")}
            class="toolbar-btn"
            title="Cita"
            ><iconify-icon icon="material-symbols:format-quote" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("ul")}
            class="toolbar-btn"
            title="Lista sin ordenar"
            ><iconify-icon
              icon="material-symbols:format-list-bulleted"
              class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("ol")}
            class="toolbar-btn"
            title="Lista ordenada"
            ><iconify-icon
              icon="material-symbols:format-list-numbered"
              class="text-xl"
            ></iconify-icon></button
          >
          <div class="toolbar-divider"></div>
          <button
            onclick={() => handleToolbarButtonClick("link")}
            class="toolbar-btn"
            title="Enlace"
            ><iconify-icon icon="material-symbols:add-link" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("image")}
            class="toolbar-btn"
            title="Imagen"
            ><iconify-icon icon="material-symbols:image" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("hr")}
            class="toolbar-btn"
            title="Línea horizontal"
            ><iconify-icon
              icon="material-symbols:horizontal-rule"
              class="text-xl"
            ></iconify-icon></button
          >
          <div class="toolbar-divider"></div>
          <button
            onclick={() => handleToolbarButtonClick("note")}
            class="toolbar-btn"
            title="Nota"
            ><iconify-icon icon="material-symbols:info-rounded" class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("tip")}
            class="toolbar-btn"
            title="Tip"
            ><iconify-icon
              icon="material-symbols:lightbulb-rounded"
              class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("warning")}
            class="toolbar-btn"
            title="Aviso"
            ><iconify-icon
              icon="material-symbols:warning-rounded"
              class="text-xl"
            ></iconify-icon></button
          >
          <button
            onclick={() => handleToolbarButtonClick("important")}
            class="toolbar-btn"
            title="Importante"
            ><iconify-icon
              icon="material-symbols:priority-high-rounded"
              class="text-xl"
            ></iconify-icon></button
          >
          <div class="toolbar-divider"></div>
          <button
            onclick={() => handleToolbarButtonClick("github")}
            class="toolbar-btn"
            title="Repo"
            ><iconify-icon icon="fa7-brands:github" class="text-xl"
            ></iconify-icon></button
          >
        </div>
        <textarea
          id="post-content"
          bind:value={contentInput}
          class="flex-1 w-full p-9 font-mono text-sm leading-relaxed"
          placeholder="Escribe tu contenido aquí..."
        ></textarea>
      </div>

      <div
        class="preview-container float-panel overflow-y-auto p-9"
        class:hidden={currentMode !== "preview"}
      >
        <div class="preview-area">
          {@html renderedPreview}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .editor-main-wrapper {
    padding: 1.5rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .editor-header {
    background: var(--page-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    position: sticky;
    top: 4.5rem;
    z-index: 40;
    padding: 1rem 0;
    backdrop-filter: blur(8px);
  }

  .editor-mode-toggle {
    display: flex;
    background: var(--btn-regular-bg);
    padding: 4px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-divider);
  }

  /* Form Elements */
  /* Toolbar */
  .cms-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    padding: 0.4rem;
    background: var(--btn-regular-bg);
    border-bottom: 1px solid var(--line-divider);
  }

  .toolbar-btn {
    background: none;
    border: none;
    width: 2.25rem;
    height: 2.25rem;
    cursor: pointer;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all 0.2s;
  }

  .toolbar-btn:hover {
    background: var(--btn-plain-bg-hover);
    color: var(--primary);
  }

  .toolbar-divider {
    width: 1px;
    height: 1.25rem;
    background: var(--line-divider);
    margin: 0 0.5rem;
    align-self: center;
  }

  /* Editor Areas */
  .markdown-container,
  .preview-container {
    height: calc(100vh - 280px);
    min-height: 500px;
    background: var(--card-bg);
    overflow: hidden;
  }

  .preview-container {
    overflow-y: auto;
    padding: 2.25rem;
  }

  /* Buttons */
  .btn-plain {
    background: none;
    border: 1px solid var(--line-divider);
    cursor: pointer;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-weight: 600;
    transition: all 0.2s;
    font-size: 0.85rem;
  }

  .btn-plain:hover {
    background: var(--btn-plain-bg-hover);
    border-color: var(--primary);
  }

  .btn-plain.active-tab {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(var(--primary), 0.2);
  }

  .btn-regular {
    background: var(--primary);
    color: white;
    padding: 0.625rem 1.5rem;
    border-radius: var(--radius-lg);
    font-weight: 700;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(var(--primary), 0.3);
    transition: all 0.2s;
  }

  .btn-regular:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .btn-regular:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .hidden {
    display: none;
  }

  /* Space helpers */
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1.5rem;
  }
</style>
