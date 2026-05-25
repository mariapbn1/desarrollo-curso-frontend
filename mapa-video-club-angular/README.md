# MAPA VIDEO CLUB

MAPA VIDEO CLUB es una aplicacion frontend de videoclub retro/neon migrada a Angular desde el proyecto original HTML, JavaScript y Sass que se conserva en la raiz del repositorio como referencia.

La version Angular vive en `mapa-video-club-angular/` y centraliza el catalogo, detalle de peliculas, autenticacion local, favoritas, carrito simulado, contacto por WhatsApp y comentarios por pelicula.

## Tecnologias

- Angular
- TypeScript
- SCSS
- Angular Routing
- localStorage
- Vitest integrado con Angular CLI para pruebas

## Instalacion y ejecucion

```bash
npm install
npm start
```

La aplicacion se ejecuta por defecto en `http://localhost:4200/`.

## Build

```bash
npm run build
```

El build genera los artefactos en `dist/mapa-video-club-angular/`.

## Tests

```bash
npm test -- --watch=false
```

El proyecto incluye pruebas para servicios y componentes principales, incluyendo catalogo, autenticacion, favoritas, carrito, comentarios, WhatsApp, home, detalle y componentes reutilizables.

## Rutas

| Ruta | Vista |
| --- | --- |
| `/` | Home / catalogo |
| `/pelicula/:id` | Detalle de pelicula |
| `/auth` | Login y registro |
| `/contacto` | Pagina de contacto |
| `**` | Redireccion a home |

## Arquitectura Angular

```text
src/app/core/services      Servicios inyectables y logica de negocio
src/app/models             Interfaces y contratos de datos
src/app/data               Catalogo local de peliculas
src/app/shared/components  Componentes reutilizables
src/app/pages              Paginas principales con routing
src/assets                 Logos, iconos, fallback e imagenes locales
src/styles                 SCSS global, base, layout y componentes
```

## MVC o equivalente en Angular

Angular no usa MVC puro tradicional, pero el proyecto aplica una separacion equivalente:

**Modelo**

- `src/app/models`
- `src/app/data`
- Interfaces `Movie`, `User`, `CartItem`, `Comment`

**Vista**

- Templates HTML de componentes
- SCSS de componentes
- Paginas `home`, `movie-detail`, `auth` y `contact`

**Controlador / logica**

- Componentes TypeScript
- Servicios inyectables
- `MovieService`, `AuthService`, `FavoriteService`, `CartService`, `CommentService`, `WhatsappService`

## Componentes y modulo compartido

- `NavbarComponent`: navegacion principal, sesion, favoritas y carrito.
- `HeroComponent`: pelicula destacada de la home.
- `MovieCardComponent`: card reutilizable de pelicula.
- `FiltersBarComponent`: filtros de busqueda, genero, anio, rating y formato.
- `MovieCarouselComponent`: carrusel/listado horizontal de novedades y secciones.
- `FeaturedShelvesComponent`: secciones destacadas de top rentas y populares.
- `CartModalComponent`: modal de carrito y compra simulada.
- `WhatsappButtonComponent`: boton flotante y modal previo de contacto por WhatsApp.
- `HomeComponent`: pagina de inicio, filtros, destacadas y catalogo general.
- `MovieDetailComponent`: detalle completo de pelicula y comentarios.
- `AuthComponent`: login y registro local.
- `ContactComponent`: pagina de contacto.
- `SharedModule`: modulo compartido que agrupa componentes reutilizables para compatibilidad con la estructura Angular del proyecto.

## Servicios principales

- `MovieService`: consulta de catalogo, detalle, novedades, top rentas, populares y filtros.
- `AuthService`: registro, login, logout y sesion local.
- `FavoriteService`: favoritas separadas por usuario activo.
- `CartService`: carrito local, items enriquecidos, total y conteo.
- `CommentService`: comentarios persistentes por pelicula.
- `WhatsappService`: URL y apertura de contacto general por WhatsApp.

## Funcionalidades migradas

- Catalogo dinamico de peliculas.
- Filtros por busqueda, genero, anio, rating y formato.
- Detalle de pelicula con poster, banner, datos, actores, tags y galeria.
- Login y registro local.
- Validacion de usuario duplicado.
- Favoritas por usuario.
- Carrito simulado.
- Compra simulada.
- Bloqueo de compra sin sesion.
- Contacto general por WhatsApp.
- Pagina de contacto.
- Comentarios por pelicula.
- Persistencia con `localStorage`.

## localStorage

| Clave | Uso |
| --- | --- |
| `mapaVideoClubUsers` | Usuarios registrados |
| `mapaVideoClubSession` | Sesion activa |
| `mapaVideoClubFavorites` | Favoritas por correo de usuario |
| `mapaVideoClubCart` | Carrito simulado |
| `mapaVideoClubComments` | Comentarios por pelicula |
| `mapaVideoClubCheckoutIntent` | Intencion de compra cuando no hay sesion |

## Requisitos de Fase 3

- Migracion del proyecto a Angular.
- Arquitectura MVC o equivalente aplicada con modelos, vistas, componentes y servicios.
- Uso de Angular, TypeScript y SCSS.
- Componentes reutilizables y paginas principales.
- Routing para home, detalle, auth y contacto.
- Pagina de inicio funcional.
- Pagina de contacto funcional.
- Tests para servicios y componentes.
- Documentacion tecnica en README.
- Commits sugeridos con Conventional Commits, por ejemplo: `feat: migrar home a angular`, `fix: corregir filtros de catalogo`, `docs: documentar fase 3 angular`.
