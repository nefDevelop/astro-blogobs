---
title: Guía rápida de uso de Firefly
published: 1970-01-02
pinned: true
description: "Cómo utilizar la plantilla de blog Firefly."
image: "./cover.webp"
tags: ["Firefly", "Blog", "Markdown", "Guía de uso"]
category: Guía del blog
draft: false
---

Esta plantilla de blog está construida basándose en [Astro](https://astro.build/). Para cualquier contenido no mencionado en esta guía, puedes encontrar respuestas en la [documentación de Astro](https://docs.astro.build/)

## Front-matter de los artículos

```yaml
---
title: Mi primera entrada del blog
published: 2023-09-09
description: Esta es la primera entrada de mi nuevo blog con Astro.
image: ./cover.jpg
tags: [Frontend, Desarrollo]
category: Desarrollo Frontend
draft: false
---
```

| Propiedad     | Descripción                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | Título del artículo.                                                                                                                                                                                      |
| `published`   | Fecha de publicación del artículo.                                                                                                                                                                          |
| `updated`     | Fecha de actualización del artículo. Si no se establece, se usará la fecha de publicación por defecto.                                                                                                        |
| `pinned`      | Indica si este artículo debe fijarse en la parte superior de la lista de artículos.                                                                                                                           |
| `description` | Descripción corta del artículo. Aparece en la página de inicio.                                                                                                                                            |
| `image`       | Ruta de la imagen de portada del artículo.<br/>1. Empieza por `http://` o `https://`: usa una imagen de red<br/>2. Empieza por `/`: imagen en el directorio `public`<br/>3. Sin prefijo: ruta relativa al archivo markdown |
| `tags`        | Etiquetas del artículo.                                                                                                                                                                                     |
| `category`    | Categoría del artículo.                                                                                                                                                                                     |
| `lang`        | Código de idioma del artículo (ej. `es-ES`). Solo se establece si el idioma es diferente al predeterminado del sitio.                                                                                         |
| `licenseName` | Nombre de la licencia del contenido del artículo.                                                                                                                                                           |
| `licenseUrl`  | Enlace a la licencia del contenido del artículo.                                                                                                                                                           |
| `author`      | Autor del artículo.                                                                                                                                                                                         |
| `sourceLink`  | Enlace a la fuente original o referencia del contenido del artículo.                                                                                                                                       |
| `draft`       | Si este artículo es un borrador, no se mostrará.                                                                                                                                                            |
| `comment`     | Indica si se habilita la función de comentarios para este artículo. Por defecto es `true`.                                                                                                                    |
| `slug`        | Ruta URL personalizada del artículo. Si no se establece, se usará el nombre del archivo como URL.                                                                                                             |

## Ubicación de los archivos de artículos

Tus archivos de artículos deben colocarse en el directorio `src/content/posts/`. También puedes crear subdirectorios para organizar mejor tus artículos y recursos.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## URL personalizada del artículo (Slug)

### ¿Qué es un Slug?

Un Slug es la parte personalizada de la ruta URL del artículo. Si no estableces un slug, el sistema utilizará el nombre del archivo como URL.

### Ejemplos de uso de Slug

#### Ejemplo 1: Usar el nombre del archivo como URL
```yaml
---
title: Mi primera entrada del blog
published: 2023-09-09
---
```
Archivo: `src/content/posts/mi-primera-entrada-del-blog.md`

URL: `/posts/mi-primera-entrada-del-blog`

#### Ejemplo 2: Slug personalizado
```yaml
---
title: Mi primera entrada del blog
published: 2023-09-09
slug: hola-mundo
---
```
Archivo: `src/content/posts/mi-primera-entrada-del-blog.md`

URL: `/posts/hola-mundo`

#### Ejemplo 3: Archivo con nombre en otro idioma usando Slug
```yaml
---
title: Cómo usar el tema de blog Firefly
published: 2023-09-09
slug: como-usar-el-tema-de-blog-firefly
---
```
Archivo: `src/content/posts/如何使用Firefly博客主题.md`

URL: `/posts/como-usar-el-tema-de-blog-firefly`

### Sugerencias para el uso de Slugs

1. **Usa inglés y guiones**: `mi-increible-post` en lugar de `mi increible post`
2. **Mantenlo conciso**: evita slugs excesivamente largos
3. **Sé descriptivo**: deja que la URL refleje el contenido del artículo
4. **Evita caracteres especiales**: usa solo letras, números y guiones
5. **Manten la consistencia**: usa patrones de nombres similares en todo el blog

### Notas importantes

- Una vez que un Slug se establece y publica, se recomienda no cambiarlo a la ligera para evitar afectar al SEO y a los enlaces existentes.
- Si varios artículos usan el mismo slug, el último artículo sobrescribirá al anterior.
- El Slug por defecto se convertirá automáticamente a minúsculas.