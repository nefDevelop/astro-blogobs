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
  let slugInput = $state("");

  let filenameInput = $state("");
  let contentInput = $state("");
  let currentSha = $state(null);
  let isLoading = $state(false);
  let isSaving = $state(false);
  let currentMode = $state("visual"); // visual, raw, preview
  let renderedHTML = $state("");

  $effect(() => {
    if (post) {
      filenameInput = post.name || "nuevo-post.md";
      currentSha = post.sha || null;
    }
  });

  onMount(() => {
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

  function handleToolbar(type) {
    const el = document.getElementById("post-content");
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = contentInput.substring(start, end);
    let snip =
      type === "bold"
        ? `**${sel || "negrita"}**`
        : type === "italic"
          ? `*${sel || "cursiva"}*`
          : type === "h2"
            ? `\n## ${sel || "Título"}\n`
            : `[${sel || "texto"}](https://...)`;
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
            </div>
          </div>
        </section>
      {/if}

      <section class="cms-main-area">
        {#if currentMode !== "preview"}
          <div class="cms-editor-container">
            <div class="cms-editor-toolbar">
              <button onclick={() => handleToolbar("bold")} title="Negrita">
                <Icon icon="material-symbols:format-bold-rounded" />
              </button>
              <button onclick={() => handleToolbar("italic")} title="Cursiva">
                <Icon icon="material-symbols:format-italic-rounded" />
              </button>
              <button onclick={() => handleToolbar("h2")} title="Título">
                <Icon icon="material-symbols:format-h2-rounded" />
              </button>
              <button onclick={() => handleToolbar("link")} title="Enlace">
                <Icon icon="material-symbols:link-rounded" />
              </button>
            </div>
            <textarea
              id="post-content"
              bind:value={contentInput}
              class="cms-main-textarea"
            ></textarea>
          </div>
        {:else}
          <div class="cms-preview-container markdown-content">
            <h1 class="preview-title">{titleInput}</h1>
            {@html renderedHTML}
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
</style>
