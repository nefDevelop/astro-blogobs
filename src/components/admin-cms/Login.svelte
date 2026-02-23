<script>
    let { onLoginSuccess } = $props();
    let githubTokenInput = $state("");

    function handleLogin() {
        const token = githubTokenInput.trim();
        if (token) {
            localStorage.setItem("github_pat", token);
            if (onLoginSuccess) onLoginSuccess({ token });
        }
    }
</script>

<div
    id="login-overlay"
    class="fixed inset-0 z-100 flex items-center justify-center p-4"
>
    <div class="float-panel p-9 max-w-md w-full text-center onload-animation">
        <iconify-icon
            icon="material-symbols:lock-person-outline-rounded"
            style="font-size: 3.75rem; color: var(--primary); margin-bottom: 1rem;"
        ></iconify-icon>
        <h1 class="text-2xl font-bold mb-2">Acceso al Sistema</h1>
        <p class="text-sm opacity-70 mb-8">
            Gestiona el contenido de tu blog directamente desde GitHub.
        </p>

        <div class="flex flex-col gap-4 text-left">
            <div>
                <label class="cms-label" for="github-token-input"
                    >GitHub Token</label
                >
                <input
                    type="password"
                    id="github-token-input"
                    bind:value={githubTokenInput}
                    placeholder="ghp_xxxxxxxxxxxx"
                    class="cms-input"
                />
            </div>
            <button
                onclick={handleLogin}
                class="btn-regular w-full py-3"
                style="background: var(--primary); color: white; border: none;"
            >
                Iniciar Sesión
            </button>
        </div>
        <p class="mt-8 text-xs opacity-50 italic">
            Tus datos se guardan solo en tu navegador.
        </p>
    </div>
</div>

<style>
    /* Replicated styles from public/admin/index.html and cms.css */
    .fixed {
        position: fixed;
    }
    .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .z-100 {
        z-index: 100;
    }
    .flex {
        display: flex;
    }
    .items-center {
        align-items: center;
    }
    .justify-center {
        justify-content: center;
    }
    .p-4 {
        padding: 1rem;
    }
    .float-panel {
        background: var(
            --float-panel-bg,
            #2d3748
        ); /* Example dark mode background */
        border-radius: 0.5rem;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .max-w-md {
        max-width: 28rem; /* 448px */
    }
    .w-full {
        width: 100%;
    }
    .text-center {
        text-align: center;
    }
    .onload-animation {
        /* Assuming this refers to some animation, not directly implemented here */
    }
    .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }
    .font-bold {
        font-weight: 700;
    }
    .mb-2 {
        margin-bottom: 0.5rem;
    }
    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
    .opacity-70 {
        opacity: 0.7;
    }
    .mb-8 {
        margin-bottom: 2rem;
    }
    .flex-col {
        flex-direction: column;
    }
    .gap-4 {
        gap: 1rem;
    }
    .text-left {
        text-align: left;
    }
    .cms-label {
        display: block;
        font-size: 0.75rem; /* text-xs */
        font-weight: 700; /* font-bold */
        text-transform: uppercase;
        opacity: 0.7;
        margin-bottom: 0.5rem;
    }
    .cms-input {
        width: 100%;
        padding: 0.75rem 1rem; /* p-3 px-4 */
        border: 1px solid var(--border-color, #4a5568); /* Example border */
        border-radius: 0.375rem; /* rounded-md */
        background: var(
            --input-bg,
            #2d3748
        ); /* Example dark mode input background */
        color: var(--text-primary, #e2e8f0); /* Example dark mode text color */
        font-size: 1rem;
        outline: none;
    }
    .cms-input:focus {
        border-color: var(--primary, #63b3ed); /* Example focus border color */
        box-shadow: 0 0 0 1px var(--primary, #63b3ed);
    }
    .btn-regular {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition:
            background-color 0.2s,
            box-shadow 0.2s;
    }
    .btn-regular:hover {
        filter: brightness(1.1);
    }
    .mt-8 {
        margin-top: 2rem;
    }
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }
    .opacity-50 {
        opacity: 0.5;
    }
    .italic {
        font-style: italic;
    }

    /* Custom properties, assuming they are defined in cms.css or global styles */
    :root {
        --primary: #63b3ed; /* Example value */
        --float-panel-bg: #2d3748;
        --border-color: #4a5568;
        --input-bg: #2d3748;
        --text-primary: #e2e8f0;
    }
</style>
