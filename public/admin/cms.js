document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const tplList = document.getElementById('tpl-list');
    const tplEditor = document.getElementById('tpl-editor');
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnNewPost = document.getElementById('btn-new-post');

    // Mock Data (In a real scenario, this would come from GitHub API)
    const mockPosts = [
        { title: 'Tutorial de Markdown', category: 'Guía', date: '2026-02-16', tags: ['Markdown', 'Blog'] },
        { title: 'Sistema de Firefly', category: 'Blog', date: '2026-02-21', tags: ['Diseño', 'Firefly'] },
        { title: 'Ejemplo de KaTeX', category: 'Math', date: '1970-01-02', tags: ['KaTeX', 'Math'] }
    ];

    function showDashboard() {
        contentArea.innerHTML = '';
        const listNode = tplList.content.cloneNode(true);
        const grid = listNode.querySelector('div');

        mockPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'cms-card group';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <span class="text-xs font-bold uppercase tracking-wider text-(--primary) bg-(--primary)/10 px-2 py-1 rounded">${post.category}</span>
                    <span class="text-xs opacity-50 font-mono">${post.date}</span>
                </div>
                <h3 class="text-lg font-bold group-hover:text-(--primary) transition-colors">${post.title}</h3>
                <div class="mt-4 flex flex-wrap gap-2">
                    ${post.tags.map(tag => `<span class="text-[10px] bg-[var(--btn-regular-bg)] px-2 py-0.5 rounded-full">#${tag}</span>`).join('')}
                </div>
            `;
            card.onclick = () => showEditor(post);
            grid.appendChild(card);
        });

        contentArea.appendChild(listNode);
    }

    function showEditor(post = null) {
        contentArea.innerHTML = '';
        const editorNode = tplEditor.content.cloneNode(true);

        if (post) {
            editorNode.getElementById('post-title').value = post.title;
            editorNode.getElementById('post-category').value = post.category;
            editorNode.getElementById('post-tags').value = post.tags.join(', ');
            editorNode.getElementById('post-content').value = `# ${post.title}\n\nContenido de ejemplo para edición...`;
        }

        editorNode.querySelector('.btn-cancel').onclick = showDashboard;
        editorNode.querySelector('.btn-save').onclick = () => {
            alert('¡Guardado simulado! En el futuro, esto enviará un commit a GitHub.');
            showDashboard();
        };

        contentArea.appendChild(editorNode);
    }

    btnDashboard.onclick = showDashboard;
    btnNewPost.onclick = () => showEditor();

    // Initial load
    setTimeout(showDashboard, 500); // Simulate network delay
});
