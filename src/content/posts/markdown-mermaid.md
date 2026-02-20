---
title: Gráficos Mermaid en Markdown
published: 1970-01-01
pinned: false
description: Un ejemplo sencillo de un artículo de blog con Mermaid en Markdown.
tags: [Markdown, Blog, Mermaid, Firefly]
category: Ejemplo de artículo
draft: false
---
# Guía completa de gráficos Mermaid en Markdown

Este artículo demuestra cómo usar Mermaid en documentos Markdown para crear diversos gráficos complejos, incluyendo diagramas de flujo, diagramas de secuencia, diagramas de Gantt, diagramas de clases y diagramas de estado.

## Ejemplo de diagrama de flujo

Los diagramas de flujo son excelentes para representar procesos o pasos de un algoritmo.

```mermaid
graph TD
    A[Inicio] --> B{Comprobación de condición}
    B -->|Sí| C[Paso de procesamiento 1]
    B -->|No| D[Paso de procesamiento 2]
    C --> E[Subproceso]
    D --> E
    subgraph E [Detalles del subproceso]
        E1[Subpaso 1] --> E2[Subpaso 2]
        E2 --> E3[Subpaso 3]
    end
    E --> F{Otra decisión}
    F -->|Opción 1| G[Resultado 1]
    F -->|Opción 2| H[Resultado 2]
    F -->|Opción 3| I[Resultado 3]
    G --> J[Fin]
    H --> J
    I --> J
```

## Ejemplo de diagrama de secuencia

Los diagramas de secuencia muestran la interacción entre objetos a lo largo del tiempo.

```mermaid
sequenceDiagram
    participant User as Usuario
    participant WebApp as Aplicación Web
    participant Server as Servidor
    participant Database as Base de Datos

    User->>WebApp: Enviar solicitud de inicio de sesión
    WebApp->>Server: Enviar solicitud de autenticación
    Server->>Database: Consultar credenciales de usuario
    Database-->>Server: Devolver datos de usuario
    Server-->>WebApp: Devolver resultado de autenticación
    
    alt Autenticación exitosa
        WebApp->>User: Mostrar página de bienvenida
        WebApp->>Server: Solicitar datos de usuario
        Server->>Database: Obtener preferencias de usuario
        Database-->>Server: Devolver configuración de preferencias
        Server-->>WebApp: Devolver datos de usuario
        WebApp->>User: Cargar interfaz personalizada
    else Autenticación fallida
        WebApp->>User: Mostrar mensaje de error
        WebApp->>User: Sugerir reintentar
    end
```

## Ejemplo de diagrama de Gantt

Los diagramas de Gantt son ideales para mostrar el progreso y el cronograma de un proyecto.

```mermaid
gantt
    title Cronograma del proyecto de desarrollo web
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d
    
    section Fase de diseño
    Análisis de requisitos      :a1, 2023-10-01, 7d
    Diseño de UI                 :a2, after a1, 10d
    Creación de prototipos        :a3, after a2, 5d
    
    section Fase de desarrollo
    Desarrollo frontend      :b1, 2023-10-20, 15d
    Desarrollo backend       :b2, after a2, 18d
    Diseño de base de datos           :b3, after a1, 12d
    
    section Fase de pruebas
    Pruebas unitarias              :c1, after b1, 8d
    Pruebas de integración       :c2, after b2, 10d
    Pruebas de aceptación de usuario   :c3, after c2, 7d
    
    section Despliegue
    Despliegue en producción     :d1, after c3, 3d
    Lanzamiento                    :milestone, after d1, 0d
```

## Ejemplo de diagrama de clases

Los diagramas de clases muestran la estructura estática del sistema, incluyendo clases, atributos, métodos y sus relaciones.

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : Escribe
    User "1" -- "*" Comment : Publica
    Article "1" -- "*" Comment : Tiene
    Article "1" -- "*" Category : Pertenece a
```

## Ejemplo de diagrama de estado

Los diagramas de estado muestran la secuencia de estados por los que pasa un objeto durante su ciclo de vida.

```mermaid
stateDiagram-v2
    [*] --> Borrador
    
    Borrador --> EnRevisión : Enviar
    EnRevisión --> Borrador : Rechazar
    EnRevisión --> Aprobado : Aprobar
    Aprobado --> Publicado : Publicar
    Publicado --> Archivado : Archivar
    Publicado --> Borrador : Retirar
    
    state Publicado {
        [*] --> Activo
        Activo --> Oculto : Ocultar temporalmente
        Oculto --> Activo : Restaurar
        Activo --> [*]
        Oculto --> [*]
    }
    
    Archivado --> [*]
```

## Ejemplo de gráfico de tarta

Los gráficos de tarta son ideales para mostrar proporciones y datos porcentuales.

```mermaid
pie title Análisis de fuentes de tráfico web
    "Motores de búsqueda" : 45.6
    "Acceso directo" : 30.1
    "Redes sociales" : 15.3
    "Enlaces de referencia" : 6.4
    "Otras fuentes" : 2.6
```

## Resumen

Mermaid es una herramienta poderosa para crear diversos tipos de gráficos en documentos Markdown. Este artículo ha demostrado cómo usar diagramas de flujo, diagramas de secuencia, diagramas de Gantt, diagramas de clases, diagramas de estado y gráficos de tarta. Estos gráficos pueden ayudarte a expresar conceptos, procesos y estructuras de datos complejos de manera más clara.

Para usar Mermaid, simplemente especifica el lenguaje mermaid en un bloque de código y usa una sintaxis de texto concisa para describir el gráfico. Mermaid convertirá automáticamente estas descripciones en hermosos gráficos visuales.

¡Intenta usar gráficos Mermaid en tu próximo artículo técnico de blog o documento de proyecto: harán que tu contenido sea más profesional y fácil de entender!