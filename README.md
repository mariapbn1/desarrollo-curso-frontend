# MAPA VIDEO CLUB - Fase 3 Angular

Este repositorio contiene dos versiones del proyecto:

- Proyecto original HTML/JavaScript/Sass en la raiz del repositorio.
- Proyecto migrado a Angular en `./mapa-video-club-angular`.

El proyecto original se conserva como referencia de migracion. La entrega de la Fase 3 Angular debe revisarse y ejecutarse desde `mapa-video-club-angular/`.

## Ejecutar version Angular

```bash
cd mapa-video-club-angular
npm install
npm start
```

La aplicacion abre por defecto en `http://localhost:4200/`.

La documentacion tecnica completa de la migracion, rutas, arquitectura, servicios, componentes, persistencia y tests esta en:

```text
mapa-video-club-angular/README.md
```

---

# MAPA CINEMA

MAPA CINEMA es un proyecto frontend que consiste en un sitio web responsive diseñado como un catálogo visual de películas.


## Características Principales:

La plataforma ofrece a los usuarios una experiencia completa que les permite:

- **Explorar Títulos:** Navegar por un listado general de películas en la página principal.
- **Búsqueda y Filtrado:** Buscar películas por nombre y aplicar diversos filtros para refinar los resultados.
- **Visualizar Detalles:** Acceder a una vista específica de detalle para ver información ampliada de cada película.
- **Funcionalidades Interactivas:** Marcar títulos como favoritos y dejar comentarios sobre las películas.

## Tecnologías Utilizadas:
### Front-end:
- HTML5.
- CSS3.
- JavaScript.
- Bootstrap 5.

### Almacenamiento (Sin Backend):
- LocalStorage

## Estructura del proyecto:

```bash
.
├── .gitignore          Archivos y configuraciones ignoradas por Git
├── auth.html           Login y registro de usuarios
├── index.html          Página principal y catálogo del videoclub
├── movie-detail.html   Vista de detalle de cada película
├── README.md           
├── assets/
│   └── img/                               Imágenes, logos e íconos del proyecto
│       ├── icon-cart-neon.png             Ícono de carrito del navbar
│       ├── icon-favorite-neon.png         Ícono de favoritas del navbar
│       ├── icon-user-neon.png             Ícono de usuario del navbar
│       ├── logo-m.png                     Logo anterior del proyecto
│       ├── logo-mapa-video-club.png       Logo principal de MAPA VIDEO CLUB
│       ├── logo-mapa-video-club-icon.png  Ícono/favicon del sitio
│       ├── movie-fallback.svg             Imagen de respaldo para películas
│       └── icons/
│           └── icon-whatsapp-neon.png     Ícono del botón flotante de WhatsApp
├── css/
│   └── styles.css                     CSS compilado desde Sass
├── scss/
│   ├── main.scss                      Archivo principal de Sass
│   ├── abstracts/                     Variables, mixins y funciones Sass
│   ├── base/                          Estilos globales y tipografía
│   ├── components/                    Componentes reutilizables del sitio
│   ├── layout/                        Navbar, hero, secciones y footer
│   └── pages/                         Estilos específicos por página
└── js/
    ├── config/                        Configuración local del proyecto
    │   ├── app.config.example.js      Ejemplo para configurar variables locales
    │   └── app.config.js              Configuración local ignorada por Git
    ├── core/                          Helpers y utilidades base
    │   ├── cart.modal.js              Manejo visual del modal de carrito
    │   ├── helpers.js                 Funciones reutilizables
    │   └── storage.js                 Lectura y escritura base en LocalStorage
    ├── data/
    │   └── movies.data.js             Datos locales del catálogo de películas
    ├── pages/                         Lógica específica de cada vista
    │   ├── auth.page.js               Eventos de login y registro
    │   ├── detail.page.js             Vista de detalle de película
    │   └── home.page.js               Home, catálogo, filtros y secciones
    └── services/                      Servicios de datos y funcionalidades
        ├── auth.service.js            Usuarios y sesión local
        ├── cart.service.js            Carrito de renta simulado
        ├── comment.service.js         Comentarios por película
        ├── favorite.service.js        Favoritas por usuario
        ├── movie.service.js           Consultas del catálogo
        └── whatsapp.service.js        Contacto general por WhatsApp
```

## Como ejecutar

1. Acceda al directorio del proyecto.
2. Abra el archivo llamado index.html.
3. Proceda a ejecutarlo directamente en su navegador web.


## Nota

El proyecto es completamente _frontend_. La persistencia de datos (películas favoritas y comentarios) se maneja a través de _LocalStorage_, lo que garantiza la funcionalidad del sitio sin requerir un _backend_ ni depender de una base de datos o servidor.

## Autor

- Nombre: `María Paula Bermudez Niño`
