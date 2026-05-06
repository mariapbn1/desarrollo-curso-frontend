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
├── index.html                  Catálogo principal
├── movie-detail.html           Detalle de cada película
├── README.md
├── assets/
│   └── img/                    Contiene las imágenes y el logo del proyecto
│       ├── logo-m.png
│       └── movie-fallback.svg
├── css/
│   └── styles.css              Hoja de estilos del proyecto
└── js/
    ├── data.js                 Contiene los datos de las películas
    ├── detail.js               Lógica específica para la página de detalle
    ├── main.js                 Lógica principal de la aplicación
    └── storage.js              Gestión de favoritos y comentarios (usa LocalStorage)
```

## Como ejecutar

1. Acceda al directorio del proyecto.
2. Abra el archivo llamado index.html.
3. Proceda a ejecutarlo directamente en su navegador web.


## Nota

El proyecto es completamente _frontend_. La persistencia de datos (películas favoritas y comentarios) se maneja a través de _LocalStorage_, lo que garantiza la funcionalidad del sitio sin requerir un _backend_ ni depender de una base de datos o servidor.

## Autor

- Nombre: `María Paula Bermudez Niño`
