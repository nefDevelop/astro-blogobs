<script>
  import { onMount } from "svelte";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
  import Editor from "./Editor.svelte";
  import { ghFetch } from "./utils/github";

  let githubToken = $state(null);
  let isLoggedIn = $state(false);
  let currentView = $state("dashboard");
  let postToEdit = $state(null);
  const siteTitle = "Rain and Tea"; // Matches the blog title

  onMount(() => {
    const storedToken = localStorage.getItem("github_pat");
    if (storedToken) {
      githubToken = storedToken;
      isLoggedIn = true;
      console.log("Token found, logged in.");
      currentView = "dashboard";
    } else {
      console.log("No token found, showing login.");
      currentView = "login";
    }
  });

  function handleLoginSuccess(data) {
    githubToken = data.token;
    isLoggedIn = true;
    currentView = "dashboard";
    console.log("Login successful.");
  }

  function handleLogout() {
    localStorage.removeItem("github_pat");
    githubToken = null;
    isLoggedIn = false;
    currentView = "login";
    console.log("Logged out.");
  }

  function handleEditPost(post) {
    postToEdit = post;
    currentView = "editor";
  }

  function handleNewPost() {
    postToEdit = null;
    currentView = "editor";
  }

  function handleDashboardClick() {
    currentView = "dashboard";
    postToEdit = null;
  }
</script>

<header id="navbar" class="z-50" style="--navbar-glass-blur: 20px;">
  <div
    class="h-18 mx-auto flex items-center px-4 justify-between max-w-[1200px] nav-inner"
  >
    <button
      type="button"
      onclick={(e) => {
        handleDashboardClick();
      }}
      class="btn-plain scale-animation rounded-lg h-13 px-5 font-bold active:scale-95"
    >
      <div
        class="flex flex-row items-center text-md dark:text-white text-black"
      >
        <iconify-icon
          icon="material-symbols:eco-outline"
          class="text-[1.75rem] mb-1 mr-2"
        ></iconify-icon>
        {siteTitle}
      </div>
    </button>

    {#if isLoggedIn}
      <div class="flex relative items-center gap-1">
        <button
          onclick={handleDashboardClick}
          class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
          title="Dashboard"
        >
          <iconify-icon
            icon="material-symbols:dashboard-outline-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
        <button
          onclick={handleNewPost}
          class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
          title="Nuevo Post"
        >
          <iconify-icon
            icon="material-symbols:add-circle-outline-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
        <button
          onclick={handleLogout}
          class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
          style="color: #ef4444;"
          title="Cerrar Sesión"
        >
          <iconify-icon
            icon="material-symbols:logout-rounded"
            style="font-size: 1.25rem;"
          ></iconify-icon>
        </button>
      </div>
    {/if}
  </div>
</header>

<main>
  {#if !isLoggedIn}
    <Login onLoginSuccess={handleLoginSuccess} />
  {:else if currentView === "dashboard"}
    <Dashboard
      {githubToken}
      onEditPost={(post) => handleEditPost(post)}
      onNewPost={handleNewPost}
    />
  {:else if currentView === "editor"}
    <Editor
      {githubToken}
      post={postToEdit}
      onPostSaved={handleDashboardClick}
      onPostCancelled={handleDashboardClick}
    />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    padding-top: 4.5rem; /* Matches header h-18 */
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
