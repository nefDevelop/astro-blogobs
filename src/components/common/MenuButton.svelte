<!-- src/components/MenuButton.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition'; // Importar la transición fade de Svelte
  import Icon from './Icon.svelte'; // Usando el componente Icon.svelte de tu proyecto
  import DropdownPanel from './DropdownPanel.svelte'; // Usando el componente DropdownPanel.svelte de tu proyecto
  import DropdownItem from './DropdownItem.svelte'; // Usando el componente DropdownItem.svelte de tu proyecto

  interface Props {
    menuItems?: { label: string; href: string; }[]; // Hacemos la prop opcional si tiene un valor por defecto
  }

  // Definimos las props usando $props() de Svelte 5, con un valor por defecto
  const { menuItems = [
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Política de Privacidad', href: '/politica-privacidad' },
  ] }: Props = $props();

  let showMenu = false; // Esta es una variable de estado, no una prop
  let menuButton: HTMLButtonElement;
  let menuPanel: HTMLElement | undefined; // Tipo cambiado a HTMLElement | undefined para resolver el error de tipado

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function handleClickOutside(event: MouseEvent) {
    if (menuPanel && !menuPanel.contains(event.target as Node) &&
        menuButton && !menuButton.contains(event.target as Node)) {
      showMenu = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showMenu) {
      showMenu = false;
    }
  }

  // Función para cerrar el menú cuando se hace clic en un elemento
  function handleMenuItemClick() {
    showMenu = false;
  }

  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<div class="menu-wrapper">
  <button
    bind:this={menuButton}
    on:click={toggleMenu}
    aria-expanded={showMenu}
    aria-controls="footer-menu"
    class="menu-toggle-button"
  >
    Menú
    <!-- Usamos tu Icon.svelte con un icono de material-symbols -->
    <Icon icon={showMenu ? 'material-symbols:close' : 'material-symbols:menu'} class="menu-icon" />
  </button>

  {#if showMenu}
    <div class="menu-panel-container" transition:fade={{ duration: 150 }}> {""}
      <!-- Usamos tu DropdownPanel.svelte para el contenedor del menú -->
      <DropdownPanel bind:element={menuPanel} id="footer-menu" role="menu">
        {#each menuItems as item, i}
          <!-- Usamos tu DropdownItem.svelte para cada elemento del menú -->
          <DropdownItem href={item.href} isLast={i === menuItems.length - 1} onclick={handleMenuItemClick}>
            {item.label}
          </DropdownItem>
        {/each}
      </DropdownPanel>
    </div>
  {/if}
</div>

<style>
  .menu-wrapper {
    position: relative;
    display: inline-block;
  }

  .menu-toggle-button {
    background-color: var(--card-bg); /* Usar variable de tema */
    color: var(--text-color); /* Usar variable de tema */
    border: 1px solid var(--border-color); /* Usar variable de tema */
    padding: 10px 15px;
    border-radius: 8px; /* Ajustar a los radios de tu proyecto */
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease-in-out;
  }

  .menu-toggle-button:hover {
    background-color: var(--btn-plain-bg-hover);
    color: var(--primary);
    border-color: var(--primary);
  }

  .menu-toggle-button:active {
    transform: scale(0.98);
  }

  .menu-icon {
    font-size: 1.2em; /* Ajusta el tamaño del icono */
    color: currentColor; /* Para que el icono herede el color del botón */
  }

  .menu-panel-container {
    position: absolute;
    bottom: 100%; /* Posiciona el menú encima del botón */
    right: 0; /* Alinea el menú a la derecha del botón */
    min-width: 200px; /* Ancho mínimo para el menú */
    margin-bottom: 10px; /* Pequeño espacio entre el botón y el menú */
    z-index: 1000; /* Asegura que esté por encima de otros elementos */
  }

  /*
    Los estilos de DropdownPanel (float-panel) ya deberían manejar
    el sombreado, fondo, etc.
    Si necesitas sobrescribir algo, hazlo aquí.
  */
</style>