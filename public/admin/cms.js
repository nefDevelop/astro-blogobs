const REPO_OWNER = 'nefDevelop';
const REPO_NAME = 'astro-blogobs';
const POSTS_PATH = 'src/content/posts';

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const tplList = document.getElementById('tpl-list');
    const tplEditor = document.getElementById('tpl-editor');
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnNewPost = document.getElementById('btn-new-post');
    const btnLogout = document.getElementById('btn-logout');
    const loginOverlay = document.getElementById('login-overlay');
    const btnLogin = document.getElementById('btn-login');
    const githubTokenInput = document.getElementById('github-token');
    const navActions = document.getElementById('nav-actions');

    let githubToken = localStorage.getItem('github_pat');

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
                alert('Token inválido o expirado. Por favor, inicia sesión de nuevo.');
                btnLogout.click();
            }
            throw new Error(`GitHub API Error: ${res.statusText}`);
        }
        return res.json();
    }

    // --- CMS Logic ---
    async function showDashboard() {
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" class="text-(--primary) text-4xl"></iconify-icon></div>';

        try {
            const files = await ghFetch(POSTS_PATH);
            const mdFiles = files.filter(f => f.name.endsWith('.md') || f.name.endsWith('.mdx'));

            contentArea.innerHTML = '';
            const listNode = tplList.content.cloneNode(true);
            const grid = listNode.querySelector('div');

            if (mdFiles.length === 0) {
                grid.innerHTML = '<p class="col-span-full text-center py-10 opacity-50 text-lg">No se encontraron artículos.</p>';
            }

            mdFiles.forEach(file => {
                const card = document.createElement('div');
                card.className = 'cms-card group';
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-xs font-bold uppercase tracking-wider text-(--primary) bg-(--primary)/10 px-2 py-1 rounded">Post</span>
                        <span class="text-xs opacity-50 font-mono">${file.name}</span>
                    </div>
                    <h3 class="text-lg font-bold group-hover:text-(--primary) transition-colors">${file.name.replace(/\.mdx?$/, '')}</h3>
                    <div class="mt-4 flex items-center gap-2 opacity-40 text-[10px]">
                        <iconify-icon icon="material-symbols:edit-document-outline"></iconify-icon>
                        <span>Click para editar</span>
                    </div>
                `;
                card.onclick = () => showEditor(file);
                grid.appendChild(card);
            });

            contentArea.appendChild(listNode);
        } catch (err) {
            contentArea.innerHTML = `<div class="text-red-500 text-center py-10">Error al cargar posts: ${err.message}</div>`;
        }
    }

    async function showEditor(file = null) {
        contentArea.innerHTML = '<div class="flex justify-center py-20"><iconify-icon icon="svg-spinners:ring-resize" class="text-(--primary) text-4xl"></iconify-icon></div>';

        try {
            let content = '';
            let sha = '';

            if (file) {
                const data = await ghFetch(file.path);
                content = atob(data.content.replace(/\n/g, ''));
                sha = data.sha;
            }

            contentArea.innerHTML = '';
            const editorNode = tplEditor.content.cloneNode(true);
            const titleInput = editorNode.getElementById('post-title');
            const contentInput = editorNode.getElementById('post-content');
            const saveBtn = editorNode.querySelector('.btn-save');
            const cancelBtn = editorNode.querySelector('.btn-cancel');

            // Add Delete Button if editing
            if (file) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'px-4 py-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all';
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.onclick = async () => {
                    if (!confirm('¿Estás seguro de que quieres eliminar este post? Esta acción es irreversible.')) return;

                    deleteBtn.disabled = true;
                    deleteBtn.innerHTML = '<iconify-icon icon="svg-spinners:ring-resize" class="mr-2"></iconify-icon> Eliminando...';

                    try {
                        await ghFetch(file.path, {
                            method: 'DELETE',
                            body: JSON.stringify({
                                message: `CMS: Delete ${file.name}`,
                                sha: sha
                            })
                        });
                        alert('¡Eliminado con éxito!');
                        showDashboard();
                    } catch (err) {
                        alert(`Error al eliminar: ${err.message}`);
                        deleteBtn.disabled = false;
                        deleteBtn.textContent = 'Eliminar';
                    }
                };
                editorNode.querySelector('.flex.gap-2').prepend(deleteBtn);
            }

            if (file) {
                titleInput.value = file.name;
                titleInput.disabled = true;
                contentInput.value = content;
            } else {
                titleInput.placeholder = 'nombre-del-archivo.md';
                contentInput.value = '---\ntitle: Nuevo Post\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: \n---\n\nEscribe aquí...';
            }

            cancelBtn.onclick = showDashboard;

            saveBtn.onclick = async () => {
                const newContent = contentInput.value;
                const path = file ? file.path : `${POSTS_PATH}/${titleInput.value.trim()}.md`;

                saveBtn.disabled = true;
                saveBtn.innerHTML = '<iconify-icon icon="svg-spinners:ring-resize" class="mr-2"></iconify-icon> Guardando...';

                try {
                    await ghFetch(path, {
                        method: 'PUT',
                        body: JSON.stringify({
                            message: `CMS: ${file ? 'Update' : 'Create'} ${titleInput.value}`,
                            content: btoa(unescape(encodeURIComponent(newContent))),
                            sha: sha || undefined
                        })
                    });
                    alert('¡Guardado con éxito!');
                    showDashboard();
                } catch (err) {
                    alert(`Error al guardar: ${err.message}`);
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Guardar';
                }
            };

            contentArea.appendChild(editorNode);
        } catch (err) {
            contentArea.innerHTML = `<div class="text-red-500 text-center py-10">Error al abrir editor: ${err.message}</div>`;
        }
    }

    btnDashboard.onclick = showDashboard;
    btnNewPost.onclick = () => showEditor();

    checkAuth();
});
