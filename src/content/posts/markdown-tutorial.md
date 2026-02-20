---
title: Tutorial de Markdown
published: 2026-02-16
pinned: false
description: Un ejemplo conciso de un blog con Markdown.
tags: [Ejemplo de artículo]
category: Ejemplo de artículo
licenseName: "Sin licencia"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
draft: false

---

Este es un ejemplo que muestra cómo escribir archivos Markdown. Este documento resume la sintaxis principal y las extensiones comunes (GFM).

- [Elementos a nivel de bloque](#block-elements)
    - [Párrafos y saltos de línea](#paragraphs-and-line-breaks)
    - [Encabezados](#headers)
    - [Citas](#blockquotes)
    - [Listas](#lists)
    - [Bloques de código](#code-blocks)
    - [Reglas horizontales](#horizontal-rules)
    - [Tablas](#table)
- [Elementos en línea](#span-elements)
    - [Enlaces](#links)
    - [Énfasis](#emphasis)
    - [Código en línea](#code)
    - [Imágenes](#images)
    - [Tachado](#strikethrough)
- [Miscelánea](#miscellaneous)
    - [Autolatino](#automatic-links)
    - [Escapes con barra invertida](#backslash-escapes)
- [HTML en línea](#inline-html)

<a id="block-elements"></a>
## Elementos a nivel de bloque

<a id="paragraphs-and-line-breaks"></a>
### Párrafos y saltos de línea

#### Párrafos

Etiqueta HTML: `<p>`

Usa una o más líneas en blanco para separar párrafos. (Las líneas que solo contienen **espacios** o **tabulaciones** también se consideran líneas en blanco).

Código:

    Esto estará
    en línea.

    Este es el segundo párrafo.

Vista previa:

---

Esto estará
en línea.

Este es el segundo párrafo.

---

#### 换行

HTML 标签：`<br />`

在行末添加**两个或更多空格**来产生换行。

代码：

    This will be not
    inline.

预览：

---

This will be not  
inline.

---

<a id="headers"></a>
### 标题

Markdown 支持两种标题样式：Setext 与 atx。

#### Setext

Etiquetas HTML: `<h1>`, `<h2>`

Usa **signos de igual (=)** para `<h1>` y **guiones (-)** para `<h2>`. Puedes usar cualquier cantidad de ellos subrayando el texto.

Código:

    Este es un H1
    =============
    Este es un H2
    -------------

Vista previa:

---

# Este es un H1

## Este es un H2

---

#### atx

Etiquetas HTML: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

Usa de 1 a 6 **almohadillas (#)** al principio de la línea, correspondiendo de `<h1>` a `<h6>`.

Código:

    # Este es un H1
    ## Este es un H2
    ###### Este es un H6

Vista previa:

---

# Este es un H1

## Este es un H2

###### Este es un H6

---

Opcional: puedes "cerrar" los encabezados atx al final de la línea. La cantidad de almohadillas al final **no tiene que coincidir** con las del principio.

Código:

    # Este es un H1 #
    ## Este es un H2 ##
    ### Este es un H3 ######

Vista previa:

---

# Este es un H1

## Este es un H2

### Este es un H3

---

<a id="blockquotes"></a>
### Citas

Etiqueta HTML: `<blockquote>`

Markdown usa el estilo de correo electrónico **>** como símbolo de cita. Se ve mejor si lo pones al principio de cada línea cuando cambias de línea manualmente.

Código:

    > Esta es una cita con dos párrafos. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

Vista previa:

---

> Esta es una cita con dos párrafos. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown permite ser "perezoso": en un párrafo con saltos de línea manuales, solo necesitas poner el > al principio de la primera línea.

Código:

    > Esta es una cita con dos párrafos. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

Vista previa:

---

> Esta es una cita con dos párrafos. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Las citas pueden anidarse (una cita dentro de otra cita) aumentando el número de símbolos >.

Código:

    > Este es el primer nivel de la cita.
    >
    > > Esta es una cita anidada.
    >
    > Volvemos al primer nivel.

Vista previa:

---

> Este es el primer nivel de la cita.
>
> > Esta es una cita anidada.
>
> Volvemos al primer nivel.

---

Las citas pueden contener otros elementos de Markdown, incluyendo encabezados, listas y bloques de código.

Código:

    > ## Este es un encabezado.
    >
    > 1.   Este es el primer elemento de la lista.
    > 2.   Este es el segundo elemento de la lista.
    >
    > Aquí tienes algo de código de ejemplo:
    >
    >     return shell_exec("echo $input | $markdown_script");

Vista previa:

---

> ## Este es un encabezado.
>
> 1.  Este es el primer elemento de la lista.
> 2.  Este es el segundo elemento de la lista.
>
> Aquí tienes algo de código de ejemplo:
>
>     return shell_exec("echo $input | $markdown_script");

---

<a id="lists"></a>
### Listas

Markdown soporta listas ordenadas (números) y desordenadas (viñetas).

#### Listas desordenadas

Etiqueta HTML: `<ul>`

Las listas desordenadas pueden usar **asteriscos (\*)**, **signos de más (+)** o **guiones (-)**.

Código:

    *   Rojo
    *   Verde
    *   Azul

Vista previa:

---

- Rojo
- Verde
- Azul

---

Es equivalente a:

Código:

    +   Rojo
    +   Verde
    +   Azul

O:

Código:

    -   Rojo
    -   Verde
    -   Azul

#### Listas ordenadas

Etiqueta HTML: `<ol>`

Las listas ordenadas usan números seguidos de un punto:

Código:

    1.  Pájaro
    2.  McHale
    3.  Parish

Vista previa:

---

1.  Pájaro
2.  McHale
3.  Parish

---

Nota: Situaciones como esta pueden "activar accidentalmente" una lista ordenada:

Código:

    1986. Que gran temporada.

Vista previa:

---

1986. Que gran temporada.

---

Puedes usar la **barra invertida (\\)** para escapar el punto:

Código:

    1986\. Que gran temporada.

Vista previa:

---

1986\. Que gran temporada.

---

#### 列表中的缩进内容

##### 列表项里的引用

在列表项内放置引用，需要将 > 符号整体缩进：

代码：

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

预览：

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### 列表项里的代码块

在列表项内放置代码块，需要缩进两层——**8 个空格**或**两个 Tab**：

代码：

    *   A list item with a code block:

            <code goes here>

预览：

---

- A list item with a code block:

      <code goes here>

---

##### 嵌套列表

代码：

    * A
      * A1
      * A2
    * B
    * C

预览：

---

- A
  - A1
  - A2
- B
- C

---

<a id="code-blocks"></a>
### Bloques de código

Etiqueta HTML: `<pre>`

Para crear un bloque de código, sangra cada línea al menos **4 espacios** o **1 tabulación**.

Código:

    Este es un párrafo normal:

        Este es un bloque de código.

Vista previa:

---

Este es un párrafo normal:

    Este es un bloque de código.

---

El bloque de código continuará hasta que encuentre una línea sin sangría (o el final del documento).

Dentro de un bloque de código, los símbolos **& (ampersand)** y los corchetes angulares **(< >)** se convierten automáticamente en entidades HTML.

Código:

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

Vista previa:

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

Los "bloques de código cercados" y el "resaltado de sintaxis" que se mencionan a continuación son extensiones de la sintaxis, pero también puedes usarlos para escribir bloques de código.

#### Bloques de código cercados

Usa pares de comillas invertidas (como se muestra a continuación) para rodear el código; así no necesitarás la sangría de cuatro espacios.

Código:

    Aquí tienes un ejemplo:

    ```
    function test() {
      console.log("¿notas la línea en blanco antes de esta función?");
    }
    ```

Vista previa:

---

Aquí tienes un ejemplo:

```
function test() {
  console.log("¿notas la línea en blanco antes de esta función?");
}
```

---

#### Resaltado de sintaxis

Al añadir un identificador de lenguaje opcional después de las comillas invertidas de apertura, puedes habilitar el resaltado de sintaxis (consulta la lista de lenguajes soportados).

Código:

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

Vista previa:

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

<a id="horizontal-rules"></a>
### Divisores (Reglas horizontales)

Etiqueta HTML: `<hr />`
Coloca **tres o más guiones (-), asteriscos (\*) o guiones bajos (\_)** en una sola línea. Se permiten espacios entre los símbolos.

Código:

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

Vista previa:

---

---

---

---

---

---

---

---

<a id="table"></a>
### Tablas

Etiqueta HTML: `<table>`

Esta es una extensión de la sintaxis.

Usa **barras verticales (|)** para separar las columnas, **guiones (-)** para separar el encabezado y **dos puntos (:)** para especificar la alineación.

Las **barras verticales (|)** a ambos lados y la alineación son opcionales. Cuando se usan para separar el encabezado, se necesitan al menos **3 guiones** por columna.

Código:

```
| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
|aaa        |bbb     |ccc      |
|ddd        |eee     |fff      |

 A | B
---|---
123|456


A |B
--|--
12|45
```

Vista previa:

---

| Izquierda | Centro | Derecha |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

<a id="span-elements"></a>
## Elementos en línea

<a id="links"></a>
### Enlaces

Etiqueta HTML: `<a>`

Markdown admite dos estilos de enlaces: enlaces en línea y enlaces de referencia.

#### Enlaces en línea

Formato de enlace en línea: `[texto](URL "título")`

El título es opcional.

Código:

    Este es [un ejemplo](http://example.com/ "Título") de enlace en línea.

    [Este enlace](http://example.net/) no tiene atributo de título.

Vista previa:

---

Este es [un ejemplo](http://example.com/ "Título") de enlace en línea.

[Este enlace](http://example.net/) no tiene atributo de título.

---

Si haces referencia a un recurso local en el mismo sitio, puedes usar una ruta relativa:

Código:

    Consulta mi página [Acerca de](/about/) para más detalles.

Vista previa:

---

Consulta mi página [Acerca de](/about/) para más detalles.

---

#### Enlaces de referencia

Puedes definir referencias de enlaces previamente. Formato de definición: `[id]: URL "título"`

El título también es opcional. Al hacer referencia, usa: `[texto][id]`

Código:

    [id]: http://example.com/  "Título opcional aquí"
    Este es [un ejemplo][id] de enlace de estilo de referencia.

Vista previa:

---

[id]: http://example.com/ "Título opcional aquí"

Este es [un ejemplo][id] de enlace de estilo de referencia.

---

Explicación:

- Corchetes que contienen el identificador del enlace (**no distingue entre mayúsculas y minúsculas**, puede estar sangrado con hasta tres espacios a la izquierda);
- Seguido de dos puntos;
- Luego uno o más espacios (o tabulación);
- Luego la URL del enlace;
- La URL puede estar opcionalmente rodeada por corchetes angulares;
- Opcionalmente seguido del atributo de título, rodeado por comillas o paréntesis.

Las siguientes tres definiciones son equivalentes:

Código:

    [foo]: http://example.com/  "Título opcional aquí"
    [foo]: http://example.com/  'Título opcional aquí'
    [foo]: http://example.com/  (Título opcional aquí)
    [foo]: <http://example.com/>  "Título opcional aquí"

Si usas corchetes vacíos, el propio texto del enlace se usará como nombre.

Código:

    [Google]: http://google.com/
    [Google][]

Vista previa:

---

[Google]: http://google.com/

[Google][]

---

<a id="emphasis"></a>
### Énfasis

Etiquetas HTML: `<em>`, `<strong>`

Markdown usa **asteriscos (\*)** o **guiones bajos (\_)** para indicar énfasis. **Un separador** corresponde a `<em>`; **dos separadores** corresponden a `<strong>`.

Código:

    *asteriscos simples*

    _guiones bajos simples_

    **asteriscos dobles**

    __guiones bajos dobles__

Vista previa:

---

_asteriscos simples_

_guiones bajos simples_

**asteriscos dobles**

**guiones bajos dobles**

---

Pero si hay espacios a ambos lados, se tratará como caracteres normales en lugar de sintaxis de énfasis.

Puedes usar la barra invertida para escapar los caracteres:

Código:

    \*este texto está rodeado por asteriscos literales\*

Vista previa:

---

\*este texto está rodeado por asteriscos literales\*

---

<a id="code"></a>
### Código en línea

Etiqueta HTML: `<code>`

Rodéalo con **comillas invertidas (`)**.

Código:

    Usa la función `printf()`.

Vista previa:

---

Usa la función `printf()`.

---

Si necesitas incluir un carácter de comilla invertida dentro del código en línea, puedes usar **múltiples comillas invertidas** como delimitadores:

Código:

    ``Aquí hay una comilla invertida literal (`) .``

Vista previa:

---

``Aquí hay una comilla invertida literal (`) .``

---

Los delimitadores a ambos lados del código en línea pueden incluir espacios (uno al principio y otro al final), lo cual es conveniente para colocar caracteres de comilla invertida al inicio o al final del código:

Código:

    Una sola comilla invertida en un tramo de código: `` ` ``

    Una cadena delimitada por comillas invertidas en un tramo de código: `` `foo` ``

Vista previa:

---

Una sola comilla invertida en un tramo de código: `` ` ``

Una cadena delimitada por comillas invertidas en un tramo de código: `` `foo` ``

---

<a id="images"></a>
### Imágenes

Etiqueta HTML: `<img />`

La sintaxis de las imágenes en Markdown es similar a la de los enlaces, admitiendo estilos en línea y de referencia.

#### Imágenes en línea

Sintaxis de imagen en línea: `![texto alternativo](URL "título")`

El título es opcional.

Código:

    ![Texto alternativo](/ruta/a/la/img.jpg)

    ![Texto alternativo](/ruta/a/la/img.jpg "Título opcional")

Vista previa:

---

![Texto alternativo](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Texto alternativo](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Título opcional")

---

Explicación:

- Un signo de exclamación !;
- Seguido de corchetes, donde se coloca el texto alternativo de la imagen;
- Luego paréntesis, que contienen la URL/ruta de la imagen y un título opcional (entre comillas).

#### Imágenes de referencia

Sintaxis de imagen de referencia: `![texto alternativo][id]`

Código:

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Atributo de título opcional"
    ![Texto alternativo][img id]

Vista previa:

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Atributo de título opcional"

![Texto alternativo][img id]

---

<a id="strikethrough"></a>
### Tachado

Etiqueta HTML: `<del>`

Esta es una extensión de la sintaxis.

GFM añade la sintaxis de tachado.

Código:

```
~~Texto incorrecto.~~
```

Vista previa:

---

~~Texto incorrecto.~~

---

<a id="miscellaneous"></a>
## Miscelánea

<a id="automatic-links"></a>
### Enlaces automáticos

Markdown admite una forma conveniente de crear "enlaces automáticos" (URL y direcciones de correo electrónico): simplemente envuélvelos con corchetes angulares.

Código:

    <http://example.com/>

    <correo@example.com>

Vista previa:

---

<http://example.com/>

<correo@example.com>

---

GFM reconocerá automáticamente las URL estándar y las convertirá en enlaces.

Código:

```
https://github.com/emn178/markdown
```

Vista previa:

---

https://github.com/emn178/markdown

---

<a id="backslash-escapes"></a>
### Escapes con barra invertida

Markdown permite usar la barra invertida para escapar aquellos caracteres especiales utilizados en la sintaxis de Markdown, haciéndolos aparecer literalmente.

Código:

    \*asteriscos literales\*

Vista previa:

---

\*asteriscos literales\*

---

Los siguientes caracteres se pueden mostrar literalmente mediante el escape con barra invertida:

Código:

    \   barra invertida
    `   comilla invertida
    *   asterisco
    _   guion bajo
    {}  llaves
    []  corchetes
    ()  paréntesis
    #   almohadilla
    +   signo de más
    -   signo de menos (guion)
    .   punto
    !   signo de exclamación

<a id="inline-html"></a>
## HTML en línea

Para las etiquetas que no están cubiertas por la sintaxis de Markdown, simplemente usa HTML nativo. No es necesario declarar especialmente el cambio de Markdown a HTML, simplemente escribe las etiquetas directamente.

Código:

    Este es un párrafo regular.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    Este es otro párrafo regular.

Vista previa:

---

Este es un párrafo regular.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

Este es otro párrafo regular.

---

Ten en cuenta que: dentro de las **etiquetas HTML a nivel de bloque**, no se procesará la sintaxis de Markdown.

A diferencia de las etiquetas a nivel de bloque, dentro de las **etiquetas a nivel de línea** sí se procesará la sintaxis de Markdown.

Código:

    <span>**Funciona**</span>

    <div>
        **No funciona**
    </div>

Vista previa:

---

<span>**Funciona**</span>

<div>
  **No funciona**
</div>
***