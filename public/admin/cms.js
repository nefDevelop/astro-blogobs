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
            showDashboard();
        } else {
            loginOverlay.classList.remove('hidden');
            navActions.classList.add('hidden');
            contentArea.innerHTML = '';
        }
    }

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

    // --- Dashboard Logic ---
    async function showDashboard(contentType = 'posts') {
        currentContentType = contentType;
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" style="color: var(--primary); font-size: 3rem;"></iconify-icon></div>';

        const currentPath = pathMap[contentType] || pathMap.posts;
        let mdFiles = [];

        try {
            const files = await ghFetch(currentPath);
            mdFiles = files.filter(f => f.name.endsWith('.md') || f.name.endsWith('.mdx'));
        } catch (err) {
            // Treat 404 (missing folder) as an empty list instead of a fatal error
            console.warn(`Could not fetch ${contentType} from ${currentPath}:`, err.message);
            mdFiles = [];
        }

        try {

            contentArea.innerHTML = '';
            const listNode = tplList.content.cloneNode(true);
            const grid = listNode.querySelector('#posts-grid');
            const searchInput = listNode.querySelector('#dashboard-search');
            const sortSelect = listNode.querySelector('#dashboard-sort');
            const postsContainer = listNode.querySelector('#posts-container');
            const viewGridBtn = listNode.querySelector('#view-grid');
            const viewListBtn = listNode.querySelector('#view-list');
            const sidebarCategories = listNode.querySelector('#sidebar-categories');
            const sidebarTags = listNode.querySelector('#sidebar-tags');
            const mainNavItems = listNode.querySelectorAll('#main-nav .sidebar-item');

            // Mobile Sidebar
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

            let activeCategory = 'all';
            let activeTag = 'all';

            // Set active main nav
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

            // Load Metadata for all posts
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

            function formatDate(dateStr) {
                if (!dateStr) return 'Sin fecha';
                const date = new Date(dateStr);
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }

            function updateSidebar() {
                const categories = {};
                const tags = {};
                allPostsData.forEach(p => {
                    const cat = p.fm.category || 'Sin categoría';
                    categories[cat] = (categories[cat] || 0) + 1;
                    (p.fm.tags || []).forEach(t => {
                        tags[t] = (tags[t] || 0) + 1;
                    });
                });

                // Categories
                sidebarCategories.innerHTML = `<div class="sidebar-item ${activeCategory === 'all' ? 'active' : ''}" data-cat="all"><iconify-icon icon="material-symbols:list-alt-outline"></iconify-icon><span>Todos</span> <span class="sidebar-count">${allPostsData.length}</span></div>`;
                Object.entries(categories).sort().forEach(([cat, count]) => {
                    sidebarCategories.innerHTML += `<div class="sidebar-item ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}"><iconify-icon icon="material-symbols:folder-outline"></iconify-icon><span>${cat}</span> <span class="sidebar-count">${count}</span></div>`;
                });

                // Tags
                sidebarTags.innerHTML = `<div class="sidebar-item ${activeTag === 'all' ? 'active' : ''}" data-tag="all" style="font-size: 0.7rem;"><iconify-icon icon="material-symbols:label-outline"></iconify-icon><span>#Todos</span></div>`;
                Object.entries(tags).sort().forEach(([tag, count]) => {
                    sidebarTags.innerHTML += `<div class="sidebar-item ${activeTag === tag ? 'active' : ''}" data-tag="${tag}" style="font-size: 0.7rem;"><iconify-icon icon="material-symbols:label-outline"></iconify-icon><span>#${tag}</span></div>`;
                });

                sidebarCategories.querySelectorAll('.sidebar-item').forEach(btn => {
                    btn.onclick = () => {
                        activeCategory = btn.dataset.cat;
                        activeTag = 'all';
                        updateSidebar();
                        renderFilteredList();
                    };
                });
                sidebarTags.querySelectorAll('.sidebar-item').forEach(btn => {
                    btn.onclick = () => {
                        activeTag = btn.dataset.tag;
                        activeCategory = 'all';
                        updateSidebar();
                        renderFilteredList();
                    };
                });
            }

            function renderFilteredList() {
                const query = searchInput.value.toLowerCase();
                const sortMode = sortSelect.value;

                let filtered = allPostsData.filter(p => {
                    const matchesSearch = (p.fm.title || p.name).toLowerCase().includes(query) || (p.fm.category || '').toLowerCase().includes(query);
                    const matchesCat = activeCategory === 'all' || (p.fm.category || 'Sin categoría') === activeCategory;
                    const matchesTag = activeTag === 'all' || (p.fm.tags || []).includes(activeTag);
                    return matchesSearch && matchesCat && matchesTag;
                });

                if (sortMode === 'newest') filtered.sort((a, b) => new Date(b.fm.published || 0) - new Date(a.fm.published || 0));
                else if (sortMode === 'oldest') filtered.sort((a, b) => new Date(a.fm.published || 0) - new Date(b.fm.published || 0));
                else if (sortMode === 'title') filtered.sort((a, b) => (a.fm.title || a.name).localeCompare(b.fm.title || b.name));

                grid.innerHTML = '';
                if (filtered.length === 0) {
                    grid.innerHTML = '<div class="col-span-full py-20 text-center opacity-50 italic">No se encontraron artículos en esta sección.</div>';
                    return;
                }

                filtered.forEach((post, index) => {
                    const card = document.createElement('div');
                    card.className = `post-card-wrapper onload-animation`;
                    card.style.animationDelay = `${(index % 4) * 0.05}s`;

                    const tags = Array.isArray(post.fm.tags) ? post.fm.tags : [];
                    const category = post.fm.category || 'Sin categoría';

                    card.innerHTML = `
                        <h3 class="post-card-title">${post.fm.title || post.name}</h3>
                        <div class="post-card-meta">
                            <div class="post-card-meta-item">
                                <iconify-icon icon="material-symbols:calendar-today-outline-rounded" class="post-card-meta-icon"></iconify-icon>
                                <span>${formatDate(post.fm.published)}</span>
                            </div>
                            <div class="post-card-meta-divider"></div>
                            <div class="post-card-meta-item">
                                <iconify-icon icon="material-symbols:book-2-outline-rounded" class="post-card-meta-icon"></iconify-icon>
                                <span>${category}</span>
                            </div>
                        </div>
                        <p class="post-card-description">${post.fm.description || 'Sin descripción disponible.'}</p>
                        <div class="post-card-tags">
                            <iconify-icon icon="material-symbols:tag-rounded" class="text-lg opacity-40 mr-1"></iconify-icon>
                            ${tags.map(t => `<span class="tag-chip scale-animation">#${t}</span>`).join('')}
                        </div>
                    `;
                    card.onclick = (e) => {
                        if (e.target.closest('.scale-animation')) return;
                        showEditor(post);
                    };
                    grid.appendChild(card);
                });
            }

            viewGridBtn.onclick = () => {
                postsContainer.classList.replace('list-mode', 'grid-mode');
                viewGridBtn.classList.add('active-tab');
                viewListBtn.classList.remove('active-tab');
            };
            viewListBtn.onclick = () => {
                postsContainer.classList.replace('grid-mode', 'list-mode');
                viewListBtn.classList.add('active-tab');
                viewGridBtn.classList.remove('active-tab');
            };

            const btnNewInDashboard = listNode.querySelector('#btn-new-post');
            if (btnNewInDashboard) {
                btnNewInDashboard.onclick = () => showEditor();
            }

            searchInput.oninput = renderFilteredList;
            if (sortSelect) sortSelect.onchange = renderFilteredList;

            updateSidebar();
            renderFilteredList();
            contentArea.appendChild(listNode);
        } catch (err) {
            contentArea.innerHTML = `<div class="float-panel p-9 text-center" style="color: #ef4444;"><h2 class="font-bold mb-2">Error de Dashboard</h2><p class="text-sm">${err.message}</p></div>`;
        }
    }

    // --- Editor Logic ---
    async function showEditor(postInit = null) {
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" style="color: var(--primary); font-size: 3rem;"></iconify-icon></div>';

        let fm = postInit ? postInit.fm : {};
        let content = '';
        let sha = postInit ? postInit.sha : null;
        let originalPath = postInit ? postInit.path : null;

        try {
            if (postInit && !postInit.sha) {
                // Fetch content if not already in cache (should be there from dashboard)
                const data = await ghFetch(postInit.path);
                sha = data.sha;
                const decoded = decodeURIComponent(escape(atob(data.content)));
                const parsed = parsePost(decoded);
                fm = parsed.fm;
                content = parsed.content;
            } else if (postInit) {
                // Content needs to be refetched to get the raw body properly
                const data = await ghFetch(postInit.path);
                const parsed = parsePost(decodeURIComponent(escape(atob(data.content))));
                content = parsed.content;
            }

            contentArea.innerHTML = '';
            const editorNode = tplEditor.content.cloneNode(true);
            const editor = editorNode.querySelector('div');

            // Selectors
            const filenameInput = editor.querySelector('#post-filename');
            const titleInput = editor.querySelector('#fm-title');
            const publishedInput = editor.querySelector('#fm-published');
            const categoryInput = editor.querySelector('#fm-category');
            const descriptionInput = editor.querySelector('#fm-description');
            const tagsInput = editor.querySelector('#fm-tags');
            const contentInput = editor.querySelector('#post-content');

            const modeVisual = editor.querySelector('#mode-visual');
            const modeRaw = editor.querySelector('#mode-raw');
            const modePreview = editor.querySelector('#mode-preview');
            const fmPanel = editor.querySelector('#fm-panel');
            const markdownContainer = editor.querySelector('#markdown-container');
            const previewContainer = editor.querySelector('#preview-container');
            const previewArea = editor.querySelector('#preview-area');
            const saveBtn = editor.querySelector('#btn-save');
            const cancelBtn = editor.querySelector('#btn-cancel');

            // Populate
            filenameInput.value = postInit ? postInit.name : 'nuevo-post.md';
            titleInput.value = fm.title || '';
            publishedInput.value = fm.published ? new Date(fm.published).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            categoryInput.value = fm.category || '';
            descriptionInput.value = fm.description || '';
            tagsInput.value = Array.isArray(fm.tags) ? fm.tags.join(', ') : (fm.tags || '');
            contentInput.value = content;

            // --- Preview Logic ---
            function updatePreview() {
                const raw = contentInput.value;
                const title = titleInput.value.trim() || 'Sin Título';
                const date = publishedInput.value ? new Date(publishedInput.value).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha';
                const category = categoryInput.value.trim() || 'Sin categoría';
                const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);

                // Header section for preview (matching blog's post detail)
                let html = `
                    <div class="preview-header">
                        <div class="preview-title-wrapper">
                            <h1 class="preview-title">${title}</h1>
                        </div>
                        <div class="preview-meta">
                            <span class="preview-meta-item">
                                <iconify-icon icon="material-symbols:calendar-today-outline-rounded"></iconify-icon>
                                ${date}
                            </span>
                            <span class="preview-meta-divider">/</span>
                            <span class="preview-meta-item">
                                <iconify-icon icon="material-symbols:book-2-outline-rounded"></iconify-icon>
                                ${category}
                            </span>
                            ${tags.length > 0 ? `
                                <span class="preview-meta-divider">/</span>
                                <span class="preview-meta-item">
                                    <iconify-icon icon="material-symbols:tag-rounded"></iconify-icon>
                                    ${tags.join(', ')}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `;

                // Content parsing
                let contentHtml = marked.parse(raw);
                contentHtml = contentHtml.replace(/:::(\w+)\n([\s\S]*?)\n:::/g, (match, type, inner) => {
                    const icon = { note: 'info-outline-rounded', tip: 'lightbulb-outline-rounded', warning: 'warning-amber-outline-rounded', important: 'priority-high-rounded', caution: 'dangerous-outline-rounded' }[type] || 'info-outline-rounded';
                    return `<div class="admonition ${type}"><div class="admonition-title"><iconify-icon icon="material-symbols:${icon}"></iconify-icon> ${type}</div>${marked.parse(inner)}</div>`;
                });

                previewArea.innerHTML = html + `<div class="markdown-preview">${contentHtml}</div>`;
            }

            // Tabs
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

            // Toolbar
            editor.querySelector('.cms-toolbar').addEventListener('click', (e) => {
                const btn = e.target.closest('.toolbar-btn');
                if (!btn) return;
                const type = btn.dataset.type;
                let snippet = type === 'github' ? '\n::github{repo="user/repo"}\n' : `\n:::${type}\nEscribe aquí...\n:::\n`;
                const start = contentInput.selectionStart, end = contentInput.selectionEnd;
                contentInput.value = contentInput.value.substring(0, start) + snippet + contentInput.value.substring(end);
                contentInput.focus();
            });

            cancelBtn.onclick = showDashboard;

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
            contentArea.innerHTML = `<div class="float-panel p-9 text-center" style="color: #ef4444;"><h2 class="font-bold mb-2">Error Editor</h2><p class="text-sm">${err.message}</p></div>`;
        }
    }

    btnDashboard.onclick = showDashboard;
    btnDashboardLogo.onclick = (e) => { e.preventDefault(); showDashboard(); };
    btnNewPost.onclick = () => showEditor();

    checkAuth();
});
