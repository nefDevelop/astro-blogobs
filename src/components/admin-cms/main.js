import { mount } from 'svelte';
import CmsApp from './CmsApp.svelte';

const targetElement = document.getElementById('cms-app-root');

if (targetElement) {
  mount(CmsApp, {
    target: targetElement,
    props: {}
  });
} else {
  console.error("No element with id 'cms-app-root' found to mount the Svelte CMS application.");
  // Fallback mount to body
  mount(CmsApp, {
    target: document.body,
    props: {}
  });
}