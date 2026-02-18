<script lang="ts">
/**
 * 公共下拉面板组件 (Svelte 5 版本)
 * 用于壁纸切换、亮暗色切换等下拉面板
 */
import type { Snippet } from "svelte";

interface Props {
	class?: string;
	children?: Snippet;
	element?: HTMLElement; // Añadido para la prop bindable 'element'
	id?: string; // Re-añadido 'id' a Props
	role?: string; // Re-añadido 'role' a Props
}

let { class: className = "", children, element = $bindable(), id, role }: Props = $props();
const actualRole = $derived(role ?? "none"); // Manejar el valor por defecto de role aquí y hacerlo reactivo
</script>

<div bind:this={element} class={`float-panel ${className}`.trim()} id={id} role={actualRole}>
	{#if children}
		{@render children()}
	{/if}
</div>
