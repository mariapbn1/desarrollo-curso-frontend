# Arquitectura base Angular

Este proyecto contiene la migracion Angular de MAPA VIDEO CLUB. El proyecto HTML, JS y Sass original vive en la raiz del repositorio y solo se usa como referencia durante la migracion.

## Capas

- `src/app/core/services`: servicios singleton para datos, autenticacion, favoritos, carrito, comentarios y WhatsApp.
- `src/app/models`: contratos TypeScript compartidos por servicios y componentes.
- `src/app/data`: espacio reservado para datos mock o adaptadores de datos de la migracion.
- `src/app/shared/components`: componentes reutilizables de UI.
- `src/app/pages`: componentes de pagina conectados al routing.

## Routing

- `/`: pagina de inicio.
- `/pelicula/:id`: detalle de pelicula.
- `/auth`: acceso/autenticacion.
- `/contacto`: contacto.
- `**`: redireccion a `/`.

## Alcance de este paso

Esta fase prepara la arquitectura base y deja la aplicacion compilable. No migra todavia la home completa, estilos completos, datos completos, carrito, favoritos, login, WhatsApp ni comentarios.

## Validacion

```bash
npm start
npm run build
npm test -- --watch=false
```
