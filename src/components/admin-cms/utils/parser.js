// src/components/admin-cms/utils/parser.js
import jsyaml from 'js-yaml'; // Will be available after user installs via pnpm

/**
 * Parses raw Markdown content, extracting YAML frontmatter and the main content.
 * @param {string} raw - The raw Markdown string.
 * @returns {{fm: object, content: string}} - An object containing frontmatter (fm) and content.
 */
export function parsePost(raw) {
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
        console.error("Error parsing post:", e);
        return { fm: {}, content: raw };
    }
}

/**
 * Stringifies frontmatter and content back into a Markdown string with YAML frontmatter.
 * @param {object} fm - The frontmatter object.
 * @param {string} content - The main Markdown content.
 * @returns {string} - The combined Markdown string.
 */
export function stringifyPost(fm, content) {
    const yamlStr = jsyaml.dump(fm).trim();
    return `---
${yamlStr}
---

${content}`;
}
