# Descripción de los archivos de configuración

Este directorio contiene todos los archivos de configuración del tema Firefly, diseñados de forma modular, donde cada archivo es responsable de un módulo de función específico.

## 📁 Estructura del archivo de configuración

```
src/config/
├── index.ts              # Archivo de índice de configuración - Exportación unificada
├── siteConfig.ts         # Configuración básica del sitio
├── backgroundWallpaper.ts # Configuración del fondo de pantalla
├── profileConfig.ts      # Configuración del perfil de usuario
├── musicConfig.ts        # Configuración del reproductor de música
├── sakuraConfig.ts       # Configuración del efecto de cerezo
├── commentConfig.ts      # Configuración del sistema de comentarios
├── announcementConfig.ts # Configuración de anuncios
├── licenseConfig.ts      # Configuración de licencias
├── footerConfig.ts       # Configuración del pie de página
├── expressiveCodeConfig.ts # Configuración de resaltado de código
├── fontConfig.ts         # Configuración de fuentes
├── sidebarConfig.ts      # Configuración de la barra lateral
├── navBarConfig.ts       # Configuración de la barra de navegación
├── pioConfig.ts          # Configuración del modelo Pio
├── adConfig.ts           # Configuración de anuncios
├── friendsConfig.ts      # Configuración de enlaces de amigos
├── sponsorConfig.ts      # Configuración de patrocinio
├── coverImageConfig.ts   # Configuración de la imagen de portada
└── README.md             # Este archivo
```

## 🚀 Modo de uso

### Recomendado: Usar el índice de configuración (importación unificada)

```typescript
import { siteConfig, profileConfig } from "../config";
```

### Importar configuraciones individuales directamente

```typescript
import { siteConfig } from "../config/siteConfig";
import { profileConfig } from "../config/profileConfig";
```

## 📋 Lista de archivos de configuración

- `siteConfig.ts` - Configuración básica del sitio (título, descripción, color del tema, etc.)
- `backgroundWallpaper.ts` - Configuración del fondo de pantalla (modo de fondo, imágenes, texto del banner, etc.)
- `profileConfig.ts` - Configuración del perfil de usuario (avatar, nombre, enlaces sociales, etc.)
- `musicConfig.ts` - Configuración del reproductor de música (compatible con música local y API de Meting)
- `sakuraConfig.ts` - Configuración del efecto de cerezo (cantidad, velocidad, tamaño, etc.)
- `commentConfig.ts` - Configuración del sistema de comentarios (comentarios de Twikoo y estadísticas de visitas a artículos)
- `announcementConfig.ts` - Configuración de anuncios (título, contenido, enlaces, etc.)
- `licenseConfig.ts` - Configuración de licencias (licencia CC, etc.)
- `footerConfig.ts` - Configuración del pie de página (inyección de HTML, etc.)
- `expressiveCodeConfig.ts` - Configuración de resaltado de código (temas, etc.)
- `fontConfig.ts` - Configuración de fuentes (familia de fuentes, tamaño, etc.)
- `sidebarConfig.ts` - Configuración de la barra lateral (diseño de componentes, etc.)
- `navBarConfig.ts` - Configuración de la barra de navegación (enlaces, estilos, etc.)
- `pioConfig.ts` - Configuración del modelo Pio (Spine, Live2D, etc.)
- `adConfig.ts` - Configuración de anuncios (configuración de espacios publicitarios, etc.)
- `friendsConfig.ts` - Configuración de enlaces de amigos (lista de enlaces de amigos, etc.)
- `sponsorConfig.ts` - Configuración de patrocinio (métodos de patrocinio, códigos QR, etc.)
- `coverImageConfig.ts` - Configuración de la imagen de portada (lista de imágenes de portada aleatorias, etc.)

```

```
