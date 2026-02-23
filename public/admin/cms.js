const REPO_OWNER = 'nefDevelop';
const REPO_NAME = 'astro-blogobs';
const POSTS_PATH = 'src/content/posts';

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const tplList = document.getElementById('tpl-list');
    const tplEditor = document.getElementById('tpl-editor');
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnDashboardLogo = document.getElementById('btn-dashboard-logo');
    const btnNewPost = document.getElementById('btn-new-post');
    const btnLogout = document.getElementById('btn-logout');
    const loginOverlay = document.getElementById('login-overlay');
    const btnLogin = document.getElementById('btn-login');
    const githubTokenInput = document.getElementById('github-token');
    const navActions = document.getElementById('nav-actions');

    let githubToken = localStorage.getItem('github_pat');
    let allPostsData = []; // Local cache for filtering/sorting
    let currentContentType = 'posts';
    let currentLayout = localStorage.getItem('cms_layout') || 'grid';
    let activeCategory = 'all';
    let activeTag = 'all';

    const pathMap = {
        posts: 'src/content/posts',
        pages: 'src/content/spec',
        projects: 'src/content/projects',
        events: 'src/content/events'
    };

    // --- Authentication ---
    function checkAuth() {
        if (githubToken) {
            loginOverlay.classList.add('hidden');
            navActions.classList.remove('hidden');
            handleRouting();
        } else {
            loginOverlay.classList.remove('hidden');
            navActions.classList.add('hidden');
            contentArea.innerHTML = '';
        }
    }

    function handleRouting() {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') || 'dashboard';
        const type = params.get('type') || 'posts';
        const path = params.get('path');

        if (view === 'editor' && path) {
            // If we have a path, we might need to fetch the post first or find it in cache
            // For simplicity, if it's in allPostsData, we use it, otherwise show empty editor or fetch
            const post = allPostsData.find(p => p.path === path);
            if (post) showEditor(post, true);
            else showEditor(null, true); // New post or not in cache
        } else {
            showDashboard(type, false, true);
        }
    }

    window.onpopstate = () => handleRouting();

    btnLogin.onclick = () => {
        const token = githubTokenInput.value.trim();
        if (token) {
            localStorage.setItem('github_pat', token);
            githubToken = token;
            checkAuth();
        }
    };

    btnLogout.onclick = () => {
        localStorage.removeItem('github_pat');
        githubToken = null;
        checkAuth();
    };

    // --- GitHub API Helpers ---
    async function ghFetch(path, options = {}) {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!res.ok) {
            if (res.status === 401) {
                alert('Sesión expirada. Por favor re-ingresa tu token.');
                btnLogout.click();
            }
            throw new Error(`GitHub API Error: ${res.statusText}`);
        }
        return res.json();
    }

    // --- Markdown & YAML Logic ---
    function parsePost(raw) {
        try {
            if (raw.startsWith('---')) {
                const parts = raw.split('---');
                if (parts.length >= 3) {
                    const yamlStr = parts[1];
                    const content = parts.slice(2).join('---').trim();
                    const fm = jsyaml.load(yamlStr) || {};
                    return { fm, content };
                }
            }
            return { fm: {}, content: raw };
        } catch (e) {
            return { fm: {}, content: raw };
        }
    }

    function stringifyPost(fm, content) {
        const yamlStr = jsyaml.dump(fm).trim();
        return `---\n${yamlStr}\n---\n\n${content}`;
    }

    // --- Helper Functions ---
    function formatDate(dateStr) {
        if (!dateStr) return 'Sin fecha';
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function updateLayoutUI(layout) {
        currentLayout = layout;
        localStorage.setItem('cms_layout', layout);
        const container = document.getElementById('posts-container');
        const gridBtn = document.getElementById('view-grid');
        const listBtn = document.getElementById('view-list');

        if (container) {
            container.classList.remove('grid-mode', 'list-mode');
            container.classList.add(`${layout}-mode`);
        }
        if (gridBtn) gridBtn.classList.toggle('active-tab', layout === 'grid');
        if (listBtn) listBtn.classList.toggle('active-tab', layout === 'list');
    }

    // --- Dashboard Logic ---
    async function showDashboard(contentType = 'posts', skipFilterReset = false, fromHistory = false) {
        if (!fromHistory) {
            const url = new URL(window.location);
            url.searchParams.set('view', 'dashboard');
            url.searchParams.set('type', contentType);
            url.searchParams.delete('path');
            history.pushState({}, '', url);
        }
        currentContentType = contentType;
        if (!skipFilterReset) {
            activeCategory = 'all';
            activeTag = 'all';
        }
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" style="color: var(--primary); font-size: 3rem;"></iconify-icon></div>';

        const currentPath = pathMap[contentType];
        let mdFiles = [];

        try {
            if (contentType === 'tags') {
                const allResults = await Promise.all(Object.values(pathMap).map(path =>
                    ghFetch(path).then(files => files.filter(f => f.name.endsWith('.md') || f.name.endsWith('.mdx'))).catch(() => [])
                ));
                mdFiles = allResults.flat();
            } else if (currentPath) {
                const files = await ghFetch(currentPath);
                mdFiles = files.filter(f => f.name.endsWith('.md') || f.name.endsWith('.mdx'));
            }
        } catch (err) {
            console.warn(`Could not fetch ${contentType}:`, err.message);
            mdFiles = [];
        }

        try {
            contentArea.innerHTML = '';
            const listNode = tplList.content.cloneNode(true);
            const grid = listNode.querySelector('#posts-grid');
            const searchInput = listNode.querySelector('#dashboard-search');
            const sortSelect = listNode.querySelector('#dashboard-sort');
            const sidebarCategories = listNode.querySelector('#sidebar-categories');
            const sidebarTags = listNode.querySelector('#sidebar-tags');
            const mainNavItems = listNode.querySelectorAll('#main-nav .sidebar-item');
            const sidebarToggle = listNode.querySelector('#sidebar-toggle');
            const sidebar = listNode.querySelector('#cms-sidebar');
            const sidebarOverlay = listNode.querySelector('#sidebar-overlay');

            sidebarToggle.onclick = () => {
                sidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('open');
            };
            sidebarOverlay.onclick = () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('open');
            };

            mainNavItems.forEach(item => {
                const type = item.dataset.type;
                item.classList.toggle('active', type === contentType);
                item.onclick = () => {
                    if (sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        sidebarOverlay.classList.remove('open');
                    }
                    showDashboard(type);
                };
            });

            // Load Metadata
            allPostsData = await Promise.all(mdFiles.map(async (file) => {
                try {
                    const data = await ghFetch(file.path);
                    const decoded = decodeURIComponent(escape(atob(data.content)));
                    const parsed = parsePost(decoded);
                    return { ...file, fm: parsed.fm, sha: data.sha };
                } catch (e) {
                    return { ...file, fm: { title: file.name }, sha: null };
                }
            }));

            function updateSidebar() {
                const categories = {};
                const tagsGlobal = {};
                allPostsData.forEach(p => {
                    const cat = p.fm.category || 'Sin categoría';
                    categories[cat] = (categories[cat] || 0) + 1;
                    (p.fm.tags || []).forEach(t => {
                        tagsGlobal[t] = (tagsGlobal[t] || 0) + 1;
                    });
                });

                sidebarCategories.innerHTML = `<div class="sidebar-item ${activeCategory === 'all' ? 'active' : ''}" data-cat="all"><iconify-icon icon="material-symbols:list-alt-outline-rounded"></iconify-icon><span>Todos</span> <span class="sidebar-count">${allPostsData.length}</span></div>`;
                Object.entries(categories).sort().forEach(([cat, count]) => {
                    sidebarCategories.innerHTML += `<div class="sidebar-item ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}"><iconify-icon icon="material-symbols:folder-outline-rounded"></iconify-icon><span>${cat}</span> <span class="sidebar-count">${count}</span></div>`;
                });

                sidebarTags.innerHTML = '';
                const counts = Object.values(tagsGlobal);
                const min = Math.min(...counts), max = Math.max(...counts);

                Object.entries(tagsGlobal).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
                    // Usage-based sizing (0.7rem to 1.1rem)
                    const size = counts.length > 1 ? (0.7 + (count - min) / (max - min) * 0.4) : 0.85;
                    const opacity = counts.length > 1 ? (0.5 + (count - min) / (max - min) * 0.5) : 0.8;

                    const span = document.createElement('span');
                    span.className = `tag-chip scale-animation ${activeTag === tag ? 'active' : ''}`;
                    span.style.fontSize = `${size}rem`;
                    span.style.opacity = opacity;
                    span.innerHTML = tag;
                    span.onclick = () => {
                        activeTag = tag;
                        activeCategory = 'all';
                        if (currentContentType === 'tags') showDashboard('posts', true);
                        else { updateSidebar(); renderFilteredList(); }
                    };
                    sidebarTags.appendChild(span);
                });

                sidebarCategories.querySelectorAll('.sidebar-item').forEach(btn => {
                    btn.onclick = () => {
                        activeCategory = btn.dataset.cat;
                        activeTag = 'all';
                        if (currentContentType === 'tags') showDashboard('posts', true);
                        else { updateSidebar(); renderFilteredList(); }
                    };
                });
            }

            function renderFilteredList() {
                const query = searchInput.value.toLowerCase();
                const sortMode = sortSelect.value;
                const gridElem = document.getElementById('posts-grid');

                if (currentContentType === 'tags') {
                    const tagCounts = {};
                    allPostsData.forEach(p => {
                        (p.fm.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
                    });
                    const filteredTags = Object.entries(tagCounts)
                        .filter(([tag]) => tag.toLowerCase().includes(query))
                        .sort((a, b) => b[1] - a[1]);

                    gridElem.innerHTML = `
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
                                    ${filteredTags.map(([tag, count]) => `
                                        <tr>
                                            <td><iconify-icon icon="material-symbols:tag-rounded" class="tag-table-icon"></iconify-icon></td>
                                            <td class="font-bold">${tag}</td>
                                            <td><span class="opacity-60">${count} artículos</span></td>
                                            <td>
                                                <div class="tag-table-actions">
                                                    <button class="table-btn" title="Ver artículos" onclick="window.cms_filterByTag('${tag}')">
                                                        <iconify-icon icon="material-symbols:visibility-outline-rounded"></iconify-icon>
                                                    </button>
                                                    <button class="table-btn" title="Editar etiqueta" onclick="alert('Funcionalidad de edición en desarrollo')">
                                                        <iconify-icon icon="material-symbols:edit-outline-rounded"></iconify-icon>
                                                    </button>
                                                    <button class="table-btn delete" title="Eliminar" onclick="alert('Funcionalidad de eliminación en desarrollo')">
                                                        <iconify-icon icon="material-symbols:delete-outline-rounded"></iconify-icon>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                    return;
                }

                let filtered = allPostsData.filter(p => {
                    const matchesSearch = (p.fm.title || p.name).toLowerCase().includes(query);
                    const matchesCat = activeCategory === 'all' || (p.fm.category || 'Sin categoría') === activeCategory;
                    const matchesTag = activeTag === 'all' || (p.fm.tags || []).includes(activeTag);
                    return matchesSearch && matchesCat && matchesTag;
                });

                if (sortMode === 'newest') filtered.sort((a, b) => new Date(b.fm.published || 0) - new Date(a.fm.published || 0));
                else if (sortMode === 'oldest') filtered.sort((a, b) => new Date(a.fm.published || 0) - new Date(b.fm.published || 0));
                else if (sortMode === 'title') filtered.sort((a, b) => (a.fm.title || a.name).localeCompare(b.fm.title || b.name));

                gridElem.innerHTML = '';
                if (filtered.length === 0) {
                    gridElem.innerHTML = '<div class="col-span-full py-20 text-center opacity-50 italic">No se encontraron artículos.</div>';
                    return;
                }

                filtered.forEach((post, index) => {
                    const card = document.createElement('div');
                    card.className = `post-card-wrapper onload-animation`;
                    card.style.animationDelay = `${(index % 4) * 0.05}s`;
                    const tags = Array.isArray(post.fm.tags) ? post.fm.tags : [];
                    card.innerHTML = `
                        <h3 class="post-card-title">${post.fm.title || post.name}</h3>
                        <div class="post-card-meta">
                            <div class="post-card-meta-item"><iconify-icon icon="material-symbols:calendar-today-outline-rounded" class="post-card-meta-icon"></iconify-icon><span>${formatDate(post.fm.published)}</span></div>
                            <div class="post-card-meta-divider"></div>
                            <div class="post-card-meta-item"><iconify-icon icon="material-symbols:book-2-outline-rounded" class="post-card-meta-icon"></iconify-icon><span>${post.fm.category || 'Sin categoría'}</span></div>
                        </div>
                        <p class="post-card-description">${post.fm.description || 'Sin descripción.'}</p>
                        <div class="post-card-tags"><iconify-icon icon="material-symbols:tag-rounded" class="text-lg opacity-40 mr-1"></iconify-icon>${tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>
                    `;
                    card.onclick = (e) => { if (!e.target.closest('.tag-chip')) showEditor(post); };
                    gridElem.appendChild(card);
                });
            }

            contentArea.appendChild(listNode);

            // Re-select elements from DOM for better events
            const viewGridBtn = document.getElementById('view-grid');
            const viewListBtn = document.getElementById('view-list');
            const searchInputDOM = document.getElementById('dashboard-search');
            const sortSelectDOM = document.getElementById('dashboard-sort');

            viewGridBtn.onclick = () => updateLayoutUI('grid');
            viewListBtn.onclick = () => updateLayoutUI('list');
            searchInputDOM.oninput = renderFilteredList;
            if (sortSelectDOM) sortSelectDOM.onchange = renderFilteredList;

            updateLayoutUI(currentLayout);
            updateSidebar();
            renderFilteredList();

        } catch (err) {
            contentArea.innerHTML = `<div class="float-panel p-9 text-center text-red-500"><h2>Error de Dashboard</h2><p>${err.message}</p></div>`;
        }
    }

    // --- Editor Logic ---
    async function showEditor(postInit = null, fromHistory = false) {
        if (!fromHistory) {
            const url = new URL(window.location);
            url.searchParams.set('view', 'editor');
            if (postInit) url.searchParams.set('path', postInit.path);
            else url.searchParams.delete('path');
            history.pushState({}, '', url);
        }
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" style="color: var(--primary); font-size: 3rem;"></iconify-icon></div>';

        let fm = postInit ? postInit.fm : {};
        let content = '';
        let sha = postInit ? postInit.sha : null;
        let originalPath = postInit ? postInit.path : null;

        try {
            if (postInit) {
                const data = await ghFetch(postInit.path);
                sha = data.sha;
                const parsed = parsePost(decodeURIComponent(escape(atob(data.content))));
                fm = parsed.fm;
                content = parsed.content;
            }

            contentArea.innerHTML = '';
            const editorNode = tplEditor.content.cloneNode(true);
            const editor = editorNode.querySelector('div');

            const filenameInput = editor.querySelector('#post-filename');
            const titleInput = editor.querySelector('#fm-title');
            const publishedInput = editor.querySelector('#fm-published');
            const categoryInput = editor.querySelector('#fm-category');
            const descriptionInput = editor.querySelector('#fm-description');
            const tagsInput = editor.querySelector('#fm-tags');
            const contentInput = editor.querySelector('#post-content');
            const previewArea = editor.querySelector('#preview-area');
            const saveBtn = editor.querySelector('#btn-save');
            const cancelBtn = editor.querySelector('#btn-cancel');

            filenameInput.value = postInit ? postInit.name : 'nuevo-post.md';
            titleInput.value = fm.title || '';
            publishedInput.value = fm.published ? new Date(fm.published).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            categoryInput.value = fm.category || '';
            descriptionInput.value = fm.description || '';
            tagsInput.value = Array.isArray(fm.tags) ? fm.tags.join(', ') : (fm.tags || '');
            contentInput.value = content;

            const renderer = new marked.Renderer();
            renderer.code = (code, infostring) => {
                const lang = (infostring || '').match(/\S*/)[0];
                const meta = (infostring || '').replace(lang, '').trim();
                const title = meta.match(/title="([^"]*)"/)?.[1] || meta.match(/title=([^ ]*)/)?.[1] || '';
                return `<div class="code-frame"><div class="code-header"><span class="code-title">${title || 'Código'}</span><span class="code-lang">${lang || 'text'}</span></div><pre><code class="language-${lang}">${code}</code></pre></div>`;
            };
            marked.setOptions({ renderer });

            function updatePreview() {
                const raw = contentInput.value;
                const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
                let html = `<div class="preview-header"><h1 class="preview-title">${titleInput.value || 'Sin Título'}</h1><div class="preview-meta"><span>${publishedInput.value}</span> / <span>${categoryInput.value}</span>${tags.length ? ` / <span>${tags.join(', ')}</span>` : ''}</div></div>`;
                let contentHtml = marked.parse(raw);
                contentHtml = contentHtml.replace(/:::(\w+)\n([\s\S]*?)\n:::/g, (match, type, inner) => {
                    const icon = { note: 'info-rounded', tip: 'lightbulb-rounded', warning: 'warning-rounded', important: 'priority-high-rounded', caution: 'error-rounded' }[type] || 'info-rounded';
                    return `<div class="admonition ${type}"><div class="admonition-title"><iconify-icon icon="material-symbols:${icon}"></iconify-icon> ${type}</div>${marked.parse(inner)}</div>`;
                });
                previewArea.innerHTML = html + `<div class="markdown-preview custom-md">${contentHtml}</div>`;
            }

            editor.querySelectorAll('.toolbar-btn').forEach(btn => {
                btn.onclick = () => {
                    const type = btn.dataset.type;
                    const snippet = type === 'github' ? '\n::github{repo="user/repo"}\n' : `\n:::${type}\nEscribe aquí...\n:::\n`;
                    const start = contentInput.selectionStart;
                    contentInput.value = contentInput.value.substring(0, start) + snippet + contentInput.value.substring(contentInput.selectionEnd);
                    contentInput.focus();
                };
            });

            const modeVisual = editor.querySelector('#mode-visual');
            const modeRaw = editor.querySelector('#mode-raw');
            const modePreview = editor.querySelector('#mode-preview');
            const fmPanel = editor.querySelector('#fm-panel');
            const markdownContainer = editor.querySelector('#markdown-container');
            const previewContainer = editor.querySelector('#preview-container');

            function setTab(mode) {
                [modeVisual, modeRaw, modePreview].forEach(btn => btn.classList.remove('active-tab'));
                markdownContainer.classList.add('hidden');
                previewContainer.classList.add('hidden');
                fmPanel.classList.add('hidden');

                if (mode === 'visual') {
                    modeVisual.classList.add('active-tab');
                    fmPanel.classList.remove('hidden');
                    markdownContainer.classList.remove('hidden');
                    contentInput.closest('.md-col-span-8').classList.replace('md-col-span-12', 'md-col-span-8');
                } else if (mode === 'raw') {
                    modeRaw.classList.add('active-tab');
                    markdownContainer.classList.remove('hidden');
                    contentInput.closest('.md-col-span-8, .md-col-span-12').classList.replace('md-col-span-8', 'md-col-span-12');
                } else if (mode === 'preview') {
                    modePreview.classList.add('active-tab');
                    previewContainer.classList.remove('hidden');
                    contentInput.closest('.md-col-span-8, .md-col-span-12').classList.replace('md-col-span-8', 'md-col-span-12');
                    updatePreview();
                }
            }

            modeVisual.onclick = () => setTab('visual');
            modeRaw.onclick = () => setTab('raw');
            modePreview.onclick = () => setTab('preview');

            cancelBtn.onclick = () => showDashboard();

            saveBtn.onclick = async () => {
                const finalFM = {
                    title: titleInput.value.trim(),
                    published: publishedInput.value,
                    category: categoryInput.value.trim(),
                    description: descriptionInput.value.trim(),
                    tags: tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
                };
                const finalContent = stringifyPost(finalFM, contentInput.value);
                const filename = filenameInput.value.trim();
                const collectionPath = pathMap[currentContentType] || 'src/content/posts';
                const path = postInit ? postInit.path : `${collectionPath}/${filename.endsWith('.md') ? filename : filename + '.md'}`;

                saveBtn.disabled = true;
                saveBtn.innerHTML = '<iconify-icon icon="svg-spinners:ring-resize" class="mr-2"></iconify-icon> Guardando...';

                try {
                    await ghFetch(path, {
                        method: 'PUT',
                        body: JSON.stringify({
                            message: `CMS: ${postInit ? 'Update' : 'Create'} ${filename}`,
                            content: btoa(unescape(encodeURIComponent(finalContent))),
                            sha: sha || undefined
                        })
                    });
                    alert('¡Post guardado con éxito!');
                    showDashboard();
                } catch (err) {
                    alert(`Error: ${err.message}`);
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = 'Guardar Cambios';
                }
            };

            contentArea.appendChild(editorNode);
        } catch (err) {
            contentArea.innerHTML = `<div class="float-panel p-9 text-center text-red-500"><h2>Error Editor</h2><p>${err.message}</p></div>`;
        }
    }

    btnDashboard.onclick = () => showDashboard();
    btnDashboardLogo.onclick = (e) => { e.preventDefault(); showDashboard(); };
    btnNewPost.onclick = () => showEditor();

    window.cms_filterByTag = (tag) => {
        activeTag = tag;
        activeCategory = 'all';
        showDashboard('posts', true);
    };

    checkAuth();
});
