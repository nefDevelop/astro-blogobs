<script>
  import { onMount } from "svelte";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import Editor from "./Editor.svelte";

  let githubToken = $state(null);
  let isLoggedIn = $state(false);
  let currentView = $state("dashboard");
  let postToEdit = $state(null);
  const siteTitle = "Rain and Tea";

  onMount(() => {
    const storedToken = localStorage.getItem("github_pat");
    if (storedToken) {
      githubToken = storedToken;
      isLoggedIn = true;
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      const path = params.get("path");
      if (view === "editor" && path) {
        currentView = "editor";
        postToEdit = { path, name: path.split('/').pop() };
      }
    } else {
      currentView = "login";
    }

    window.onpopstate = (event) => {
      if (event.state) {
        currentView = event.state.view;
        postToEdit = event.state.post;
      } else {
        currentView = "dashboard";
        postToEdit = null;
      }
    };
  });

  function updateHistory(view, post = null) {
    const url = new URL(window.location);
    if (view === "dashboard") {
      url.searchParams.delete("view");
      url.searchParams.delete("path");
    } else {
      url.searchParams.set("view", view);
      if (post) url.searchParams.set("path", post.path);
    }
    // Usamos snapshot para evitar el error de clonación de Proxy
    window.history.pushState({ view, post: post ? $state.snapshot(post) : null }, "", url);
  }

  function handleLoginSuccess(data) {
    githubToken = data.token;
    isLoggedIn = true;
    currentView = "dashboard";
    updateHistory("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("github_pat");
    githubToken = null;
    isLoggedIn = false;
    currentView = "login";
    window.history.pushState({}, "", window.location.pathname);
  }

  function handleEditPost(post) {
    postToEdit = post;
    currentView = "editor";
    updateHistory("editor", post);
  }

  function handleNewPost() {
    postToEdit = null;
    currentView = "editor";
    updateHistory("editor");
  }

  function handleDashboardClick() {
    currentView = "dashboard";
    postToEdit = null;
    updateHistory("dashboard");
  }
</script>

<header id="navbar">
  <div class="nav-inner">
    <button type="button" onclick={handleDashboardClick} class="btn-plain scale-animation rounded-lg h-13 px-5 font-bold">
      <div class="flex flex-row items-center text-xl dark:text-white text-black">
        <iconify-icon icon="material-symbols:eco-outline" class="text-[2rem] mb-1 mr-2"></iconify-icon>
        {siteTitle}
      </div>
    </button>

    {#if isLoggedIn}
      <div class="flex relative items-center gap-2">
        <button onclick={handleDashboardClick} class="cms-btn-icon" title="Dashboard">
          <iconify-icon icon="material-symbols:dashboard-outline-rounded"></iconify-icon>
        </button>
        <button onclick={handleNewPost} class="cms-btn-icon" title="Nuevo Post">
          <iconify-icon icon="material-symbols:add-circle-outline-rounded"></iconify-icon>
        </button>
        <button onclick={handleLogout} class="cms-btn-icon" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2);" title="Cerrar Sesión">
          <iconify-icon icon="material-symbols:logout-rounded"></iconify-icon>
        </button>
      </div>
    {/if}
  </div>
</header>

<main>
  {#if !isLoggedIn}
    <Login onLoginSuccess={handleLoginSuccess} />
  {:else if currentView === "dashboard"}
    <Dashboard {githubToken} onEditPost={handleEditPost} onNewPost={handleNewPost} />
  {:else if currentView === "editor"}
    <Editor {githubToken} post={postToEdit} onPostSaved={handleDashboardClick} onPostCancelled={handleDashboardClick} />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    padding-top: 4.5rem;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
