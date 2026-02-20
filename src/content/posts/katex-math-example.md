---
title: Ejemplo de fórmulas matemáticas KaTeX
published: 1970-01-02
description: Demostración del soporte para fórmulas matemáticas KaTeX en el tema Firefly, incluyendo fórmulas en línea, de bloque y símbolos matemáticos complejos.
tags: [KaTeX, Math, Ejemplo]
category: Ejemplo de artículo
draft: false
image: api
---

Este artículo muestra el soporte de renderizado para fórmulas matemáticas KaTeX en el tema [Firefly](https://github.com/CuteLeaf/Firefly).

## Fórmulas en línea (Inline)

Las fórmulas en línea se envuelven con un solo símbolo `$`.

Por ejemplo: La identidad de Euler $e^{i\pi} + 1 = 0$ es una de las fórmulas más bellas de las matemáticas.

La ecuación de equivalencia entre masa y energía $E = mc^2$ también es muy conocida.

## Fórmulas de bloque (Block)

Las fórmulas de bloque se envuelven con dos símbolos `$$` y se muestran centradas.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Ejemplos complejos

### Matrices (Matrices)

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
\alpha & \beta \\
\gamma & \delta
\end{pmatrix} =
\begin{pmatrix}
a\alpha + b\gamma & a\beta + b\delta \\
c\alpha + d\gamma & c\beta + d\delta
\end{pmatrix}
$$

### Límites y sumatorios (Limits and Sums)

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

### Ecuaciones de Maxwell (Maxwell's Equations)

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### Ecuaciones químicas (Chemical Equations)

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## Más símbolos

| Símbolo | Código | Resultado |
| :--- | :--- | :--- |
| Alfa | `\alpha` | $\alpha$ |
| Beta | `\beta` | $\beta$ |
| Gamma | `\Gamma` | $\Gamma$ |
| Pi | `\pi` | $\pi$ |
| Infinito | `\infty` | $\infty$ |
| Flecha derecha | `\rightarrow` | $\rightarrow$ |
| Parcial | `\partial` | $\partial$ |

Para más sintaxis de KaTeX, consulta [KaTeX Supported Functions](https://katex.org/docs/supported.html).

