---
title: Funciones Extendidas de Markdown
published: 1970-01-01
updated: 1970-01-01
description: "Conoce las funciones de Markdown en Firefly"
image: ""
tags: [demostración, ejemplo, Markdown, Firefly]
category: "Ejemplo de artículo"
draft: false
---

## Tarjeta de repositorio de GitHub

Puedes añadir tarjetas dinámicas vinculadas a repositorios de GitHub. Al cargar la página, la información del repositorio se obtendrá de la API de GitHub.

::github{repo="CuteLeaf/Firefly"}

Usa el código `::github{repo="CuteLeaf/Firefly"}` para crear una tarjeta de repositorio de GitHub.

```markdown
::github{repo="CuteLeaf/Firefly"}
```

## Configuración de cuadros de advertencia (Admonitions)

Firefly utiliza el plugin [rehype-callouts](https://github.com/lin-stephanie/rehype-callouts), que admite tres estilos de temas para cuadros de advertencia: `GitHub`, `Obsidian` y `VitePress`. Puedes configurarlos en `src/config/siteConfig.ts`:

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  // ...
  rehypeCallouts: {
    // opciones: "github" | "obsidian" | "vitepress"
    theme: "github",
  },
  // ...
};
```

Nota: **Es necesario reiniciar el servidor de desarrollo después de cambiar la configuración para que los cambios surtan efecto.**

A continuación se muestra una lista de los tipos admitidos por cada tema. Cada tema tiene un estilo y una sintaxis diferente, por lo que puedes elegir el que más te guste.

### 1. Estilo de tema GitHub

Estos son los 5 tipos básicos admitidos oficialmente por GitHub.

![GitHub](./images/github.png)

**Sintaxis básica**

```markdown
> [!NOTE] NOTA
> Resalta información que el usuario debe tener en cuenta.

> [!TIP] CONSEJO
> Información opcional para ayudar al usuario a tener más éxito.

> [!IMPORTANT] IMPORTANTE
> Información crucial necesaria para el éxito del usuario.

> [!WARNING] ADVERTENCIA
> Contenido crítico que requiere atención inmediata.

> [!CAUTION] PRECAUCIÓN
> Consecuencias potenciales negativas de una acción.

> [!NOTE] Título personalizado
> Este es un ejemplo con un título personalizado.
```

---

### 2. Estilo de tema Obsidian

El estilo [Obsidian](https://obsidian.md/) admite una gran variedad de tipos y alias.

<details>
<summary>Haz clic para desplegar la lista de sintaxis de Obsidian</summary>

```markdown

> [!NOTE] NOTA
> Bloque de notas general.

> [!ABSTRACT] RESUMEN
> Resumen del artículo.

> [!SUMMARY] SUMARIO
> Sumario del artículo (igual que Abstract).

> [!TLDR] TLDR
> Demasiado largo para leer (igual que Abstract).

> [!INFO] INFORMACIÓN
> Proporciona información adicional.

> [!TODO] TAREA
> Tareas que deben completarse.

> [!TIP] CONSEJO
> Consejos o trucos útiles.

> [!HINT] SUGERENCIA
> Sugerencia (igual que Tip).

> [!IMPORTANT] IMPORTANTE
> Información importante (el estilo Obsidian suele usar iconos similares).

> [!SUCCESS] ÉXITO
> Operación exitosa.

> [!CHECK] VERIFICACIÓN
> Verificación superada (igual que Success).

> [!DONE] HECHO
> Completado (igual que Success).

> [!QUESTION] PREGUNTA
> Plantear una pregunta.

> [!HELP] AYUDA
> Buscar ayuda (igual que Question).

> [!FAQ] FAQ
> Preguntas frecuentes (igual que Question).

> [!WARNING] ADVERTENCIA
> Mensaje de advertencia.

> [!CAUTION] PRECAUCIÓN
> Notas de precaución (igual que Warning).

> [!ATTENTION] ATENCIÓN
> Llamar la atención (igual que Warning).

> [!FAILURE] FALLO
> Operación fallida.

> [!FAIL] ERROR
> Fallo (igual que Failure).

> [!MISSING] FALTANTE
> Contenido faltante (igual que Failure).

> [!DANGER] PELIGRO
> Advertencia de operación peligrosa.

> [!ERROR] ERROR
> Mensaje de error (igual que Danger).

> [!BUG] BUG
> Reportar defectos de software.

> [!EXAMPLE] EJEMPLO
> Mostrar un ejemplo.

> [!QUOTE] CITA
> Citar una frase.

> [!CITE] CITACIÓN
> Referencia (igual que Quote).

> [!NOTE] Título personalizado
> Este es un ejemplo con un título personalizado.
```
</details>

![Obsidian](./images/obsidian.png)

---

### 3. Estilo de tema VitePress

El estilo [VitePress](https://vitepress.dev/) ofrece un conjunto de estilos predeterminados modernos y planos. Actualmente solo incluye los **5 tipos** básicos consistentes con GitHub.

<details>
<summary>Haz clic para desplegar la lista de sintaxis de VitePress</summary>

```markdown
> [!NOTE] NOTA
> Corresponde al Note de GitHub.

> [!TIP] CONSEJO
> Corresponde al Tip de GitHub.

> [!IMPORTANT] IMPORTANTE
> Corresponde al Important de GitHub.

> [!WARNING] ADVERTENCIA
> Corresponde al Warning de GitHub.

> [!CAUTION] PRECAUCIÓN
> Corresponde al Caution de GitHub.

> [!TIP] Título personalizado
> El estilo VitePress también admite títulos personalizados.
```
</details>

![VitePress](./images/vitepress.png)

---

### 4. Sintaxis de estilo Docusaurus

Solo soporta la sintaxis, el estilo se mantiene igual que los tres temas anteriores.

<details>
<summary>Haz clic para desplegar la lista de sintaxis de Docusaurus</summary>

Soporta los siguientes tipos de cuadros de advertencia: `note` `tip` `important` `warning` `caution`

```markdown
:::note
Resalta información que el usuario debe tener en cuenta, incluso durante un escaneo rápido.
:::

:::tip
Información opcional para ayudar al usuario a tener más éxito.
:::

:::important
Información crucial necesaria para el éxito del usuario.
:::

:::warning
Contenido crítico que requiere atención inmediata del usuario debido a riesgos potenciales.
:::

:::caution
Consecuencias potenciales negativas de una acción.
:::

:::tip[Título personalizado]
Información opcional para ayudar al usuario a tener más éxito.
:::
```
 </details>

---

## Spoiler

Puedes añadir spoilers al texto. El texto también soporta la sintaxis **Markdown**.

El contenido :spoiler[ha sido ocultado **jaja**]!

```markdown
El contenido :spoiler[ha sido ocultado **jaja**]!
````