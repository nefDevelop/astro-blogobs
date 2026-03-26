<script>
  import { onMount, tick } from "svelte";
  import Icon from "../common/Icon.svelte";
  import { ghFetch, REPO_OWNER, REPO_NAME } from "./utils/github";
  import { parsePost, stringifyPost } from "./utils/parser";
  import { formatDate } from "./utils/formatter";

  let { githubToken, post = null, onPostSaved, onPostCancelled } = $props();

  // State para todos los campos Frontmatter
  let titleInput = $state("");
  let publishedInput = $state("");
  let updatedInput = $state("");
  let pinnedInput = $state(false);
  let descriptionInput = $state("");
  let imageInput = $state("");
  let tagsInput = $state("");
  let categoryInput = $state("");
  let langInput = $state("");
  let licenseNameInput = $state("");
  let licenseUrlInput = $state("");
  let authorInput = $state("");
  let sourceLinkInput = $state("");
  let draftInput = $state(false);
  let commentInput = $state(true);
  let inNavbarInput = $state(false);
  let iconInput = $state("");
  let slugInput = $state("");

  let filenameInput = $state("");
  let contentInput = $state("");
  let currentSha = $state(null);
  let isLoading = $state(false);
  let isSaving = $state(false);
  let isUploading = $state(false);
  let currentMode = $state("visual"); // visual, raw, preview
  let renderedHTML = $state("");

  $effect(() => {
    if (post) {
      filenameInput = post.name || "nuevo-post.md";
      currentSha = post.sha || null;
    }
  });

  onMount(async () => {
    // Carga marked dinámicamente si no está disponible
    if (!window.marked) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      script.onload = () => {
        // Cargar Highlight.js para colorear el código en la vista previa
        const hljsScript = document.createElement("script");
        hljsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
        hljsScript.onload = () => {
          const hljsCss = document.createElement("link");
          hljsCss.rel = "stylesheet";
          hljsCss.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
          document.head.appendChild(hljsCss);

          window.marked.setOptions({
            highlight: function (code, lang) {
              const language = window.hljs.getLanguage(lang) ? lang : "plaintext";
              return window.hljs.highlight(code, { language }).value;
            },
            breaks: true,
            gfm: true
          });
          if (currentMode === "preview") {
            renderedHTML = window.marked.parse(contentInput);
          }
        };
        document.head.appendChild(hljsScript);
      };
      document.head.appendChild(script);
    }
    if (post && githubToken) loadPost();
  });

  async function loadPost() {
    isLoading = true;
    try {
      const data = await ghFetch(`contents/${post.path}`, githubToken);
      currentSha = data.sha;
      const decoded = decodeURIComponent(escape(atob(data.content)));
      const parsed = parsePost(decoded);

      const fm = parsed.fm || {};
      titleInput = fm.title || "";
      publishedInput = fm.published
        ? new Date(fm.published).toISOString().split("T")[0]
        : "";
      updatedInput = fm.updated
        ? new Date(fm.updated).toISOString().split("T")[0]
        : "";
      pinnedInput = !!fm.pinned;
      descriptionInput = fm.description || "";
      imageInput = fm.image || "";
      tagsInput = Array.isArray(fm.tags) ? fm.tags.join(", ") : fm.tags || "";
      categoryInput = fm.category || "";
      langInput = fm.lang || "";
      licenseNameInput = fm.licenseName || "";
      licenseUrlInput = fm.licenseUrl || "";
      authorInput = fm.author || "";
      sourceLinkInput = fm.sourceLink || "";
      draftInput = !!fm.draft;
      commentInput = fm.comment !== undefined ? fm.comment : true;
      inNavbarInput = !!fm.inNavbar;
      iconInput = fm.icon || "";
      slugInput = fm.slug || "";

      contentInput = parsed.content;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (currentMode === "preview" && window.marked) {
      renderedHTML = window.marked.parse(contentInput);
    }
  });

  async function handleSave() {
    if (!titleInput.trim()) {
      alert("Por favor, ingresa un título. Astro lo requiere.");
      return;
    }
    if (!publishedInput) {
      alert("Por favor, selecciona una fecha de publicación.");
      return;
    }

    isSaving = true;
    const finalFM = {
      title: titleInput.trim(),
      published: publishedInput,
      updated: updatedInput || undefined,
      pinned: pinnedInput || undefined,
      description: descriptionInput.trim(),
      image: imageInput.trim() || undefined,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      category: categoryInput.trim(),
      lang: langInput.trim() || undefined,
      licenseName: licenseNameInput.trim() || undefined,
      licenseUrl: licenseUrlInput.trim() || undefined,
      author: authorInput.trim() || undefined,
      sourceLink: sourceLinkInput.trim() || undefined,
      draft: draftInput || undefined,
      comment: commentInput,
      inNavbar: inNavbarInput || undefined,
      icon: iconInput.trim() || undefined,
      slug: slugInput.trim() || undefined,
    };

    const finalContent = stringifyPost(finalFM, contentInput);
    try {
      const targetPath = post
        ? post.path
        : `src/content/posts/${filenameInput.endsWith(".md") ? filenameInput : filenameInput + ".md"}`;
      await ghFetch(`contents/${targetPath}`, githubToken, {
        method: "PUT",
        body: JSON.stringify({
          message: `CMS: Save ${titleInput}`,
          content: btoa(unescape(encodeURIComponent(finalContent))),
          sha: currentSha || undefined,
        }),
      });
      alert("Guardado con éxito");
      onPostSaved();
    } catch (err) {
      alert(err.message);
    } finally {
      isSaving = false;
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Content = e.target.result.split(',')[1];
      // Sanitizar nombre y añadir marca de tiempo para evitar duplicados
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
      const fileName = `${Date.now()}-${cleanName}`;
      const imagePath = `public/assets/images/${fileName}`;

      try {
        isUploading = true;
        await ghFetch(`contents/${imagePath}`, githubToken, {
          method: "PUT",
          body: JSON.stringify({
            message: `CMS: Subida de imagen ${fileName}`,
            content: base64Content,
          }),
        });

        const el = document.getElementById("post-content");
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const snip = `\n!${file.name}\n`;
        contentInput = contentInput.substring(0, start) + snip + contentInput.substring(end);
        tick().then(() => { el.focus(); el.setSelectionRange(start + snip.length, start + snip.length); });
      } catch(err) {
        alert("Error subiendo imagen: " + err.message);
      } finally {
        isUploading = false;
        event.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

  function handleToolbar(type) {
    const el = document.getElementById("post-content");
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = contentInput.substring(start, end);
    let snip = "";

    switch (type) {
      case "bold":
        snip = `**${sel || "negrita"}**`;
        break;
      case "italic":
        snip = `*${sel || "cursiva"}*`;
        break;
      case "h1":
        snip = `\n# ${sel || "Título 1"}\n`;
        break;
      case "h2":
        snip = `\n## ${sel || "Título 2"}\n`;
        break;
      case "h3":
        snip = `\n### ${sel || "Título 3"}\n`;
        break;
      case "link":
        snip = `[${sel || "texto"}](https://...)`;
        break;
      case "list-ul":
        snip = `\n- ${sel || "elemento"}`;
        break;
      case "list-ol":
        snip = `\n1. ${sel || "elemento"}`;
        break;
      case "quote":
        snip = `\n> ${sel || "cita"}`;
        break;
      case "code":
        snip = sel.includes("\n")
          ? `\n\`\`\`javascript\n${sel}\n\`\`\`\n`
          : `\`${sel || "código"}\``;
        break;
      case "hr":
        snip = `\n---\n`;
        break;
    }

    contentInput =
      contentInput.substring(0, start) + snip + contentInput.substring(end);
    tick().then(() => {
      el.focus();
      el.setSelectionRange(start, start + snip.length);
    });
  }
</script>

<div class="cms-editor-wrapper">
  <header class="cms-editor-header">
    <div class="cms-header-inner">
      <div class="cms-header-left">
        <h2 class="cms-editor-title">
          {post ? "Editar Entrada" : "Nueva Entrada"}
        </h2>
        <div class="cms-mode-tabs">
          <button
            class:active={currentMode === "visual"}
            onclick={() => (currentMode = "visual")}>Ajustes</button
          >
          <button
            class:active={currentMode === "raw"}
            onclick={() => (currentMode = "raw")}>Editor</button
          >
          <button
            class:active={currentMode === "preview"}
            onclick={() => (currentMode = "preview")}>Preview</button
          >
        </div>
      </div>
      <div class="cms-header-actions">
        <button class="cms-btn-ghost" onclick={onPostCancelled}>Cancelar</button
        >
        <button class="cms-btn-primary" onclick={handleSave} disabled={isSaving}
          >Guardar</button
        >
      </div>
    </div>
  </header>

  <main class="cms-editor-content cms-container">
    <div
      class="cms-editor-layout-grid"
      class:is-full-width={currentMode !== "visual"}
    >
      {#if currentMode === "visual"}
        <section class="cms-metadata-panel">
          <div class="cms-panel-card">
            <h3 class="cms-panel-title">Información Básica</h3>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-filename"
                >Nombre del archivo</label
              >
              <input
                type="text"
                id="cms-filename"
                bind:value={filenameInput}
                class="cms-input"
                placeholder="mi-post.md"
              />
            </div>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-title">Título</label>
              <input
                type="text"
                id="cms-title"
                bind:value={titleInput}
                class="cms-input"
              />
            </div>
            <div class="cms-form-row">
              <div class="cms-form-group">
                <label class="cms-label" for="cms-date">Fecha Pub.</label>
                <input
                  type="date"
                  id="cms-date"
                  bind:value={publishedInput}
                  class="cms-input"
                />
              </div>
              <div class="cms-form-group">
                <label class="cms-label" for="cms-update">Fecha Act.</label>
                <input
                  type="date"
                  id="cms-update"
                  bind:value={updatedInput}
                  class="cms-input"
                />
              </div>
            </div>
            <div class="cms-form-row">
              <div class="cms-form-group">
                <label class="cms-label" for="cms-category">Categoría</label>
                <input
                  type="text"
                  id="cms-category"
                  bind:value={categoryInput}
                  class="cms-input"
                />
              </div>
              <div class="cms-form-group">
                <label class="cms-label" for="cms-lang">Idioma (es-ES)</label>
                <input
                  type="text"
                  id="cms-lang"
                  bind:value={langInput}
                  class="cms-input"
                />
              </div>
            </div>

            <h3 class="cms-panel-title mt-4">Contenido y SEO</h3>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-description">Descripción</label>
              <textarea
                id="cms-description"
                bind:value={descriptionInput}
                class="cms-textarea"
                rows="3"
              ></textarea>
            </div>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-tags">Etiquetas</label>
              <input
                type="text"
                id="cms-tags"
                bind:value={tagsInput}
                class="cms-input"
              />
            </div>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-icon">Icono (Ej. material-symbols:star)</label>
              <input
                type="text"
                id="cms-icon"
                bind:value={iconInput}
                class="cms-input"
              />
            </div>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-image">Imagen Portada</label>
              <input
                type="text"
                id="cms-image"
                bind:value={imageInput}
                class="cms-input"
                placeholder="/assets/img.jpg"
              />
            </div>
            <div class="cms-form-group">
              <label class="cms-label" for="cms-slug">Slug Personalizado</label>
              <input
                type="text"
                id="cms-slug"
                bind:value={slugInput}
                class="cms-input"
              />
            </div>

            <h3 class="cms-panel-title mt-4">Avanzado y Licencia</h3>
            <div class="cms-form-row">
              <div class="cms-form-group">
                <label class="cms-label" for="cms-author">Autor</label>
                <input
                  type="text"
                  id="cms-author"
                  bind:value={authorInput}
                  class="cms-input"
                />
              </div>
              <div class="cms-form-group">
                <label class="cms-label" for="cms-source">Fuente (Link)</label>
                <input
                  type="text"
                  id="cms-source"
                  bind:value={sourceLinkInput}
                  class="cms-input"
                />
              </div>
            </div>
            <div class="cms-form-row">
              <div class="cms-form-group">
                <label class="cms-label" for="cms-lic-name">Licencia</label>
                <input
                  type="text"
                  id="cms-lic-name"
                  bind:value={licenseNameInput}
                  class="cms-input"
                />
              </div>
              <div class="cms-form-group">
                <label class="cms-label" for="cms-lic-url">URL Licencia</label>
                <input
                  type="text"
                  id="cms-lic-url"
                  bind:value={licenseUrlInput}
                  class="cms-input"
                />
              </div>
            </div>
            <div class="cms-checkbox-group">
              <label class="cms-check-label"
                ><input type="checkbox" bind:checked={draftInput} /> Borrador</label
              >
              <label class="cms-check-label"
                ><input type="checkbox" bind:checked={pinnedInput} /> Fijar arriba</label
              >
              <label class="cms-check-label"
                ><input type="checkbox" bind:checked={commentInput} /> Comentarios</label
              >
              <label class="cms-check-label"
                ><input type="checkbox" bind:checked={inNavbarInput} /> Mostrar en Menú</label
              >
            </div>
          </div>
        </section>
      {/if}

      <section class="cms-main-area">
        {#if currentMode !== "preview"}
          <div class="cms-editor-container">
            <div class="cms-editor-toolbar">
              <button onclick={() => handleToolbar("h1")} title="Título 1">
                <Icon icon="material-symbols:format-h1-rounded" />
              </button>
              <button onclick={() => handleToolbar("h2")} title="Título 2">
                <Icon icon="material-symbols:format-h2-rounded" />
              </button>
              <button onclick={() => handleToolbar("h3")} title="Título 3">
                <Icon icon="material-symbols:format-h3-rounded" />
              </button>
              <div class="cms-toolbar-divider"></div>
              <button onclick={() => handleToolbar("bold")} title="Negrita">
                <Icon icon="material-symbols:format-bold-rounded" />
              </button>
              <button onclick={() => handleToolbar("italic")} title="Cursiva">
                <Icon icon="material-symbols:format-italic-rounded" />
              </button>
              <button onclick={() => handleToolbar("quote")} title="Cita">
                <Icon icon="material-symbols:format-quote-rounded" />
              </button>
              <div class="cms-toolbar-divider"></div>
              <button
                onclick={() => handleToolbar("list-ul")}
                title="Lista puntos"
              >
                <Icon icon="material-symbols:format-list-bulleted-rounded" />
              </button>
              <button
                onclick={() => handleToolbar("list-ol")}
                title="Lista números"
              >
                <Icon icon="material-symbols:format-list-numbered-rounded" />
              </button>
              <div class="cms-toolbar-divider"></div>
              <button onclick={() => handleToolbar("link")} title="Enlace">
                <Icon icon="material-symbols:link-rounded" />
              </button>
              <button onclick={() => document.getElementById('cms-image-upload').click()} title="Subir Imagen" disabled={isUploading}>
                {#if isUploading}
                  <Icon icon="svg-spinners:ring-resize" />
                {:else}
                  <Icon icon="material-symbols:image-outline" />
                {/if}
              </button>
              <button onclick={() => handleToolbar("code")} title="Código">
                <Icon icon="material-symbols:code-rounded" />
              </button>
              <button onclick={() => handleToolbar("hr")} title="Separador">
                <Icon icon="material-symbols:horizontal-rule-rounded" />
              </button>
            </div>
            <input type="file" id="cms-image-upload" accept="image/*" style="display: none;" onchange={handleImageUpload} />
            <textarea
              id="post-content"
              bind:value={contentInput}
              class="cms-main-textarea"
            ></textarea>
          </div>
        {:else}
          <div class="flex w-full rounded-(--radius-large) overflow-hidden relative">
            <div class="card-base z-10 px-6 md:px-9 pt-6 pb-8 relative w-full">
              <div class="relative mb-6">
                <h1 class="transition w-full block font-bold text-3xl md:text-[2.25rem]/[2.75rem] text-black/90 dark:text-white/90 md:before:w-1 before:h-5 before:rounded-md before:bg-(--primary) before:absolute before:top-3 before:-left-4.5">
                  {titleInput || "Sin título"}
                </h1>
              </div>
              <div class="markdown-content">
                {@html renderedHTML}
              </div>
            </div>
          </div>
        {/if}
      </section>
    </div>
  </main>
</div>

<style>
  .cms-panel-title {
    font-size: 0.85rem;
    font-weight: 800;
    border-bottom: 1px solid var(--line-divider);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    color: var(--primary);
  }
  .cms-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }
  .cms-check-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: 600;
  }
  .mt-4 {
    margin-top: 1.5rem;
  }

  /* Mode Tabs */
  .cms-mode-tabs {
    display: flex;
    background: var(--btn-regular-bg);
    padding: 0.25rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-divider);
    margin-left: 1.5rem;
  }
  .cms-mode-tabs button {
    padding: 0.4rem 1rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    font-weight: 600;
    transition: 0.2s;
  }
  .cms-mode-tabs button.active {
    background: var(--card-bg);
    color: var(--primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  /* Toolbar */
  .cms-editor-toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--toolbar-bg);
    border-bottom: 1px solid var(--line-divider);
  }
  .cms-editor-toolbar button {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-bg);
    border: 1px solid var(--line-divider);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    transition: 0.2s;
    font-size: 1.2rem;
  }
  .cms-editor-toolbar button:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--btn-regular-bg);
  }

  .cms-toolbar-divider {
    width: 1px;
    height: 1.5rem;
    background: var(--line-divider);
    align-self: center;
    margin: 0 0.25rem;
  }

  .cms-header-left {
    display: flex;
    align-items: center;
  }
  .cms-header-actions {
    display: flex;
    gap: 0.75rem;
  }
  .cms-editor-title {
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0;
  }

  /* Estilos para simular el blog en la vista previa */
  :global(.cms-editor-content .markdown-content pre) {
    background-color: #282c34 !important;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  :global(.cms-editor-content .markdown-content p > code) {
    background-color: var(--btn-regular-bg);
    color: var(--primary);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.85em;
  }
  :global(.cms-editor-content .markdown-content blockquote) {
    border-left: 4px solid var(--primary);
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    background-color: var(--btn-regular-bg);
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.5rem 0;
  }

  /* Estilos tipográficos base (Listas, Tablas, Encabezados) para la vista previa */
  :global(.cms-editor-content .markdown-content h1),
  :global(.cms-editor-content .markdown-content h2),
  :global(.cms-editor-content .markdown-content h3),
  :global(.cms-editor-content .markdown-content h4),
  :global(.cms-editor-content .markdown-content h5),
  :global(.cms-editor-content .markdown-content h6) {
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  :global(.cms-editor-content .markdown-content h1) { font-size: 2.25rem; }
  :global(.cms-editor-content .markdown-content h2) { font-size: 1.75rem; border-bottom: 1px dashed var(--line-divider); padding-bottom: 0.5rem; }
  :global(.cms-editor-content .markdown-content h3) { font-size: 1.5rem; }
  :global(.cms-editor-content .markdown-content h4) { font-size: 1.25rem; }
  
  :global(.cms-editor-content .markdown-content p) {
    margin-bottom: 1.25rem;
    line-height: 1.75;
  }
  :global(.cms-editor-content .markdown-content ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }
  :global(.cms-editor-content .markdown-content ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }
  :global(.cms-editor-content .markdown-content li) {
    margin-bottom: 0.5rem;
  }
  :global(.cms-editor-content .markdown-content table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  :global(.cms-editor-content .markdown-content th),
  :global(.cms-editor-content .markdown-content td) {
    border: 1px solid var(--line-divider);
    padding: 0.75rem;
  }
  :global(.cms-editor-content .markdown-content th) {
    background-color: var(--btn-regular-bg);
    font-weight: 700;
  }
  :global(.cms-editor-content .markdown-content a) {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :global(.cms-editor-content .markdown-content img) {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 1.5rem auto;
    display: block;
  }
  :global(.cms-editor-content .markdown-content hr) {
    border: 0;
    border-top: 2px dashed var(--line-divider);
    margin: 2rem 0;
  }
</style>
