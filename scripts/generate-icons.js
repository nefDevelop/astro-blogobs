/**
 * Script de preprocesamiento de iconos
 * Escanea automáticamente los iconos utilizados en los componentes de Svelte durante la compilación y genera datos SVG en línea
 *
 * Uso: node scripts/generate-icons.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from "@iconify/utils";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const OUTPUT_FILE = join(SRC_DIR, "constants", "icons.ts");

// Conjuntos de iconos soportados y sus nombres de paquete
const ICON_SETS = {
  "material-symbols": "@iconify-json/material-symbols",
  "fa7-solid": "@iconify-json/fa7-solid",
  "fa7-brands": "@iconify-json/fa7-brands",
  "fa7-regular": "@iconify-json/fa7-regular",
  mdi: "@iconify-json/mdi",
  "simple-icons": "@iconify-json/simple-icons",
  "svg-spinners": "@iconify-json/svg-spinners",
};

// Caché de datos del conjunto de iconos
const iconSetCache = new Map();

/**
 * Obtener recursivamente todos los archivos de un directorio
 */
function getAllFiles(dir, extensions = [".svelte"]) {
  const files = [];

  function walk(currentDir) {
    const items = readdirSync(currentDir);
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Omitir node_modules y directorios ocultos
        if (!item.startsWith(".") && item !== "node_modules") {
          walk(fullPath);
        }
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Extraer nombres de iconos del contenido del archivo
 */
function extractIconNames(content) {
  const icons = new Set();

  // Coincidir con varios patrones de uso de iconos
  const patterns = [
    // icon="xxx:yyy" o icon='xxx:yyy'
    /icon=["']([a-z0-9-]+:[a-z0-9-]+)["']/gi,
    // icon={`xxx:yyy`}
    /icon=\{[`"']([a-z0-9-]+:[a-z0-9-]+)[`"']\}/gi,
    // getIconSvg("xxx:yyy") o getIconSvg('xxx:yyy')
    /getIconSvg\(["']([a-z0-9-]+:[a-z0-9-]+)["']\)/gi,
    // hasIcon("xxx:yyy")
    /hasIcon\(["']([a-z0-9-]+:[a-z0-9-]+)["']\)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      icons.add(match[1]);
    }
  }

  return icons;
}

/**
 * Cargar datos del conjunto de iconos
 */
async function loadIconSet(prefix) {
  if (iconSetCache.has(prefix)) {
    return iconSetCache.get(prefix);
  }

  const packageName = ICON_SETS[prefix];
  if (!packageName) {
    console.warn(`⚠️  Conjunto de iconos desconocido: ${prefix}`);
    return null;
  }

  try {
    // Importar dinámicamente el JSON del conjunto de iconos
    const iconSetPath = join(ROOT_DIR, "node_modules", packageName, "icons.json");
    const data = JSON.parse(readFileSync(iconSetPath, "utf-8"));
    iconSetCache.set(prefix, data);
    return data;
  } catch (error) {
    console.warn(`⚠️  No se pudo cargar el conjunto de iconos ${packageName}: ${error.message}`);
    return null;
  }
}

/**
 * Obtener el SVG de un solo icono
 */
async function getIconSvg(iconName) {
  const [prefix, name] = iconName.split(":");
  if (!prefix || !name) {
    console.warn(`⚠️  Nombre de icono no válido: ${iconName}`);
    return null;
  }

  const iconSet = await loadIconSet(prefix);
  if (!iconSet) {
    return null;
  }

  const iconData = getIconData(iconSet, name);
  if (!iconData) {
    console.warn(`⚠️  Icono no encontrado: ${iconName}`);
    return null;
  }

  // Convertir a SVG
  const renderData = iconToSVG(iconData, {
    height: "1em",
    width: "1em",
  });

  let svg = iconToHTML(replaceIDs(renderData.body), renderData.attributes);

  // Asegurar la compatibilidad con currentColor
  if (!svg.includes("currentColor")) {
    svg = svg.replace("<svg", '<svg fill="currentColor"');
  }

  return svg;
}

/**
 * Genera el archivo icons.ts
 */
function generateIconsFile(iconsMap) {
  const iconEntries = Array.from(iconsMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, svg]) => `\t"${name}":\n\t\t'${svg.replace(/'/g, "\\'")}'`)
    .join(",\n");

  const content = `/**
 * Archivo de datos de iconos generado automáticamente
 * Generado por scripts/generate-icons.js durante la compilación
 * Por favor, no edites este archivo manualmente
 */

const iconSvgData: Record<string, string> = {
${iconEntries}
};
	
/**
 * Obtiene el HTML SVG en línea para un nombre de icono en formato Iconify
 * @param iconName Nombre del icono, por ejemplo "material-symbols:search"
 * @returns Cadena HTML SVG
 */
export function getIconSvg(iconName: string): string {
	return iconSvgData[iconName] || "";
}

/**
 * 检查图标是否可用
 * Comprueba si un icono está disponible
 */
export function hasIcon(iconName: string): boolean {
	return iconName in iconSvgData;
}
/**
 * Obtiene todos los nombres de iconos disponibles
 */
export function getAvailableIcons(): string[] {
	return Object.keys(iconSvgData);
}

export default iconSvgData;
`;

  return content;
}

/**
 * 主函数
 */
async function main() {
  console.log("🔍 Escaneando el uso de iconos en los archivos fuente...\n");

  // 获取所有源文件
  const files = getAllFiles(SRC_DIR);
  console.log(`📁 Se encontraron ${files.length} archivos fuente\n`);

  // 收集所有使用的图标
  const allIcons = new Set();

  for (const file of files) {
    // 跳过 icons.ts 文件本身
    if (file.endsWith("icons.ts")) continue;

    const content = readFileSync(file, "utf-8");
    const icons = extractIconNames(content);

    for (const icon of icons) {
      allIcons.add(icon);
    }
  }

  console.log(`🎨 Se descubrieron ${allIcons.size} iconos diferentes:\n`);

  // 按图标集分组显示
  const iconsBySet = {};
  for (const icon of allIcons) {
    const [prefix] = icon.split(":");
    if (!iconsBySet[prefix]) {
      iconsBySet[prefix] = [];
    }
    iconsBySet[prefix].push(icon);
  }

  for (const [prefix, icons] of Object.entries(iconsBySet)) {
    console.log(`   ${prefix}: ${icons.length} iconos`);
  }
  console.log("");

  // 获取所有图标的 SVG
  const iconsMap = new Map();
  let successCount = 0;
  let failCount = 0;

  for (const iconName of allIcons) {
    const svg = await getIconSvg(iconName);
    if (svg) {
      iconsMap.set(iconName, svg);
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`✅ Se cargaron ${successCount} iconos correctamente`);
  if (failCount > 0) {
    console.log(`❌ Fallaron ${failCount} iconos`);
  }

  // 生成输出文件
  const output = generateIconsFile(iconsMap);
  writeFileSync(OUTPUT_FILE, output, "utf-8");

  console.log(`\n📝 Generado: ${OUTPUT_FILE}`);
  console.log(`📦 Tamaño del archivo: ${(Buffer.byteLength(output, "utf-8") / 1024).toFixed(2)} KB\n`);
}

main().catch(console.error);
