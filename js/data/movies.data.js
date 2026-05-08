/**
 * Módulo de gestión de recursos visuales para el catálogo de películas.
 * Proporciona utilidades para normalizar URLs de imágenes provenientes de 
 * proveedores externos (TMDB, Wikipedia).
 */
(function () {
  function buildTmdbImage(path) {
    /**
   * Construye la URL completa para una imagen alojada en TMDB.
   * @param {string} path - Ruta relativa de la imagen (ej. "/ejemplo.jpg").
   * @returns {string} URL absoluta del recurso.
   */
    return "https://image.tmdb.org/t/p/original" + path;
  }

  function buildWikiImage(path) {
    /**
   * Construye la URL completa para una imagen alojada en Wikimedia Commons.
   * @param {string} path - Ruta relativa del archivo en los servidores de Wikipedia.
   * @returns {string} URL absoluta del recurso.
   */
    return "https://upload.wikimedia.org" + path; 
  }

  function createGallery(posterPath, bannerPath) {
    /**
   * Genera una colección de URLs para la interfaz de galería.
   * Crea un conjunto estandarizado de imágenes compuesto por banners y posters.
   * @param {string} posterPath - Ruta del póster vertical.
   * @param {string} bannerPath - Ruta de la imagen de fondo o horizontal.
   * @returns {string[]} Lista de URLs para renderizar en componentes de slider o galería.
   */
    return [
      buildTmdbImage(bannerPath),
      buildTmdbImage(posterPath),
      buildTmdbImage(bannerPath),
    ];
  }

  /**
   * Colección maestra de películas de la plataforma.
   * Este array contiene todas las películas disponibles en la plataforma, 
   * con información detallada que se utiliza para alimentar al sitio web.
   */
  var MOVIES = [
    {
      id: 2026001,
      title: "El Diablo Viste a la Moda 2",
      releaseDate: "2026-05-01",
      genre: "Comedia / Drama",
      rating: 7.1,
      rentalPrice: 9500,
      format: "VHS / Digital",
      stock: 5,
      available: true,
      rentalTime: "48 horas",
      tags: ["Nuevo", "Top renta", "Disponible"],
      poster: buildWikiImage("/wikipedia/en/thumb/9/97/The_Devil_Wears_Prada_2_%28film_poster%29.png/500px-The_Devil_Wears_Prada_2_%28film_poster%29.png"),
      banner: buildWikiImage("/wikipedia/en/thumb/9/97/The_Devil_Wears_Prada_2_%28film_poster%29.png/500px-The_Devil_Wears_Prada_2_%28film_poster%29.png"),
      synopsis:
        "Miranda Priestly vuelve a moverse entre crisis editoriales y poder en la industria de la moda, mientras viejas alianzas se tensan en una nueva etapa de Runway.",
      review:
        "La secuela recupera el filo elegante de sus personajes y apuesta mas por el choque generacional que por repetir formulas. Funciona mejor cuando deja que su reparto veterano domine la escena.",
      actors: ["Meryl Streep", "Anne Hathaway", "Emily Blunt", "Stanley Tucci"],
      photos: [
        buildWikiImage("/wikipedia/en/thumb/9/97/The_Devil_Wears_Prada_2_%28film_poster%29.png/500px-The_Devil_Wears_Prada_2_%28film_poster%29.png"),
        buildWikiImage("/wikipedia/en/thumb/9/97/The_Devil_Wears_Prada_2_%28film_poster%29.png/500px-The_Devil_Wears_Prada_2_%28film_poster%29.png"),
        buildWikiImage("/wikipedia/en/thumb/9/97/The_Devil_Wears_Prada_2_%28film_poster%29.png/500px-The_Devil_Wears_Prada_2_%28film_poster%29.png"),
      ],
    },
    {
      id: 2026002,
      title: "Michael",
      releaseDate: "2026-04-24",
      genre: "Musical / Drama",
      rating: 6.9,
      rentalPrice: 9000,
      format: "VHS / Digital",
      stock: 4,
      available: true,
      rentalTime: "48 horas",
      tags: ["Nuevo", "VHS", "Top renta"],
      poster: buildWikiImage("/wikipedia/en/thumb/3/37/Michael_%282026_film_poster%29.png/500px-Michael_%282026_film_poster%29.png"),
      banner: buildWikiImage("/wikipedia/en/thumb/3/37/Michael_%282026_film_poster%29.png/500px-Michael_%282026_film_poster%29.png"),
      synopsis:
        "La pelicula recorre distintos momentos de la vida y carrera de Michael Jackson, desde sus primeros años hasta su consolidacion como estrella global.",
      review:
        "El proyecto apuesta por la escala del espectaculo y por una interpretacion central muy observada. Su mayor interes esta en como intenta equilibrar homenaje, musica y biografia.",
      actors: ["Jaafar Jackson", "Colman Domingo", "Nia Long", "Miles Teller"],
      photos: [
        buildWikiImage("/wikipedia/en/thumb/3/37/Michael_%282026_film_poster%29.png/500px-Michael_%282026_film_poster%29.png"),
        buildWikiImage("/wikipedia/en/thumb/3/37/Michael_%282026_film_poster%29.png/500px-Michael_%282026_film_poster%29.png"),
        buildWikiImage("/wikipedia/en/thumb/3/37/Michael_%282026_film_poster%29.png/500px-Michael_%282026_film_poster%29.png"),
      ],
    },
    {
      id: 2026003,
      title: "Super Mario Galaxy: la pelicula",
      releaseDate: "2026-04-01",
      genre: "Animacion / Aventura / Familiar",
      rating: 7.4,
      rentalPrice: 9500,
      format: "Blu-ray",
      stock: 6,
      available: true,
      rentalTime: "72 horas",
      tags: ["Nuevo", "Disponible", "Familiar"],
      poster: "https://www.mariowiki.com/images/d/d5/The_Super_Mario_Galaxy_Movie_Poster_9.jpg?67764=",
      banner: "https://www.mariowiki.com/images/d/d5/The_Super_Mario_Galaxy_Movie_Poster_9.jpg?67764=",
      synopsis:
        "Mario, Luigi y sus aliados se embarcan en una nueva aventura espacial inspirada en el universo Galaxy, con Rosalina y nuevas amenazas en el centro del viaje.",
      review:
        "La pelicula amplifica la escala del mundo de Mario y lleva la accion hacia un terreno mas cosmico. Mantiene el tono familiar mientras abre espacio para personajes nuevos y escenarios mas ambiciosos.",
      actors: ["Chris Pratt", "Anya Taylor-Joy", "Charlie Day", "Brie Larson"],
      photos: [
        "https://www.mariowiki.com/images/d/d5/The_Super_Mario_Galaxy_Movie_Poster_9.jpg?67764=",
        "https://www.mariowiki.com/images/d/d5/The_Super_Mario_Galaxy_Movie_Poster_9.jpg?67764=",
        "https://www.mariowiki.com/images/d/d5/The_Super_Mario_Galaxy_Movie_Poster_9.jpg?67764=",
      ],
    },
    {
      id: 696506,
      title: "Mickey 17",
      releaseDate: "2025-02-28",
      genre: "Ciencia ficcion",
      rating: 6.8,
      rentalPrice: 8500,
      format: "VHS",
      stock: 3,
      available: true,
      rentalTime: "48 horas",
      tags: ["VHS", "Disponible"],
      poster: buildWikiImage("/wikipedia/en/thumb/2/2d/Mickey_17_film_poster.png/500px-Mickey_17_film_poster.png"),
      banner: buildTmdbImage("/9PRKAdrDvAdCfg3EcApLTfzGsEt.jpg"),
      synopsis:
        "Mickey Barnes acepta un trabajo extremo como trabajador reemplazable en una colonia espacial y descubre el costo real de ser desechable.",
      review:
        "Bong Joon-ho mezcla satira, ciencia ficcion y absurdo con una identidad muy clara. Es una pelicula rara a proposito, mas interesada en las ideas que en la comodidad.",
      actors: ["Robert Pattinson", "Naomi Ackie", "Steven Yeun", "Mark Ruffalo"],
      photos: [
        buildTmdbImage("/9PRKAdrDvAdCfg3EcApLTfzGsEt.jpg"),
        buildWikiImage("/wikipedia/en/thumb/2/2d/Mickey_17_film_poster.png/500px-Mickey_17_film_poster.png"),
        buildTmdbImage("/9PRKAdrDvAdCfg3EcApLTfzGsEt.jpg"),
      ],
    },
    {
      id: 822119,
      title: "Captain America: Brave New World",
      releaseDate: "2025-02-12",
      genre: "Accion",
      rating: 6.0,
      rentalPrice: 8500,
      format: "Digital",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Nuevo", "Disponible"],
      poster: buildTmdbImage("/wDRXmiAEJdhNIcuetM4016fOCx8.jpg"),
      banner: buildTmdbImage("/8eifdha9GQeZAkexgtD45546XKx.jpg"),
      synopsis:
        "Sam Wilson queda atrapado en un conflicto internacional mientras intenta descubrir la mente detras de una conspiracion de alto nivel.",
      review:
        "La pelicula se apoya en el tono politico del personaje y en la presencia de Anthony Mackie. Funciona mejor cuando se mueve como thriller que cuando busca pura grandilocuencia.",
      actors: ["Anthony Mackie", "Harrison Ford", "Danny Ramirez", "Shira Haas"],
      photos: createGallery("/wDRXmiAEJdhNIcuetM4016fOCx8.jpg", "/8eifdha9GQeZAkexgtD45546XKx.jpg"),
    },
    {
      id: 426063,
      title: "Nosferatu",
      releaseDate: "2024-12-25",
      genre: "Terror",
      rating: 6.9,
      rentalPrice: 8000,
      format: "VHS",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["VHS", "Terror", "Disponible"],
      poster: buildTmdbImage("/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg"),
      banner: buildTmdbImage("/uWOJbarUXfVf6B4o0368dh138eR.jpg"),
      synopsis:
        "Una joven atormentada y un vampiro obsesionado quedan unidos en una historia gotica marcada por deseo, miedo y fatalidad.",
      review:
        "Robert Eggers lleva su gusto por la textura y la atmosfera al terreno del horror clasico. Todo respira oscuridad, ceremonia y una incomodidad muy calculada.",
      actors: ["Lily-Rose Depp", "Nicholas Hoult", "Bill Skarsgard", "Willem Dafoe"],
      photos: createGallery("/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg", "/uWOJbarUXfVf6B4o0368dh138eR.jpg"),
    },
    {
      id: 762509,
      title: "Mufasa: The Lion King",
      releaseDate: "2024-12-18",
      genre: "Animacion",
      rating: 7.4,
      rentalPrice: 8500,
      format: "DVD",
      stock: 4,
      available: true,
      rentalTime: "72 horas",
      tags: ["Familiar", "Disponible"],
      poster: buildWikiImage("/wikipedia/en/thumb/0/0b/Mufasa_The_Lion_King_Movie_2024.jpeg/500px-Mufasa_The_Lion_King_Movie_2024.jpeg"),
      banner: buildTmdbImage("/1w8kutrRucTd3wIYyu5QlUDMiG1.jpg"),
      synopsis:
        "La historia retrocede para mostrar como Mufasa paso de ser un cachorro perdido a convertirse en una figura central del reino.",
      review:
        "Su mayor valor esta en ampliar la mitologia con un tono de aventura familiar. No siempre sorprende, pero sabe mantener el impulso emocional del universo.",
      actors: ["Aaron Pierre", "Kelvin Harrison Jr.", "Tiffany Boone", "Mads Mikkelsen"],
      photos: [
        buildTmdbImage("/1w8kutrRucTd3wIYyu5QlUDMiG1.jpg"),
        buildWikiImage("/wikipedia/en/thumb/0/0b/Mufasa_The_Lion_King_Movie_2024.jpeg/500px-Mufasa_The_Lion_King_Movie_2024.jpeg"),
        buildTmdbImage("/1w8kutrRucTd3wIYyu5QlUDMiG1.jpg"),
      ],
    },
    {
      id: 558449,
      title: "Gladiator II",
      releaseDate: "2024-11-05",
      genre: "Accion",
      rating: 6.8,
      rentalPrice: 8000,
      format: "Blu-ray",
      stock: 3,
      available: true,
      rentalTime: "48 horas",
      tags: ["Accion", "Disponible"],
      poster: buildTmdbImage("/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg"),
      banner: buildTmdbImage("/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg"),
      synopsis:
        "Lucius regresa al Coliseo en un nuevo capitulo de poder, venganza y supervivencia dentro del imperio romano.",
      review:
        "Ridley Scott vuelve a la arena con una secuela mas turbulenta que solemne. Tiene ambicion visual y un gusto claro por el exceso del espectaculo.",
      actors: ["Paul Mescal", "Pedro Pascal", "Connie Nielsen", "Denzel Washington"],
      photos: createGallery("/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg", "/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg"),
    },
    {
      id: 845781,
      title: "Red One",
      releaseDate: "2024-10-31",
      genre: "Aventura",
      rating: 7.0,
      rentalPrice: 7500,
      format: "Digital",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Aventura", "Disponible"],
      poster: buildTmdbImage("/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg"),
      banner: buildTmdbImage("/cjEcqdRdPQJhYre3HUAc5538Gk8.jpg"),
      synopsis:
        "Tras el secuestro de Santa Claus, el jefe de seguridad del Polo Norte y un rastreador de reputacion dudosa deben unir fuerzas para rescatarlo.",
      review:
        "Es una fantasia de accion ligera y consciente de su absurdo. Cuando abraza por completo su tono jugueton, encuentra su mejor energia.",
      actors: ["Dwayne Johnson", "Chris Evans", "Lucy Liu", "J.K. Simmons"],
      photos: createGallery("/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg", "/cjEcqdRdPQJhYre3HUAc5538Gk8.jpg"),
    },
    {
      id: 1241982,
      title: "Moana 2",
      releaseDate: "2024-11-21",
      genre: "Animacion",
      rating: 7.0,
      rentalPrice: 8500,
      format: "DVD",
      stock: 5,
      available: true,
      rentalTime: "72 horas",
      tags: ["Familiar", "Disponible"],
      poster: buildTmdbImage("/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg"),
      banner: buildTmdbImage("/vYqt6kb4lcF8wwqsMMaULkP9OEn.jpg"),
      synopsis:
        "Moana recibe una nueva llamada del oceano y emprende un viaje mas peligroso junto a Maui y una tripulacion inesperada.",
      review:
        "La secuela conserva el espiritu aventurero y la dimension familiar del original. Su mayor fortaleza esta en el movimiento constante y su energia luminosa.",
      actors: ["Auli'i Cravalho", "Dwayne Johnson", "Rose Matafeo", "Hualalai Chung"],
      photos: createGallery("/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg", "/vYqt6kb4lcF8wwqsMMaULkP9OEn.jpg"),
    },
    {
      id: 912649,
      title: "Venom: The Last Dance",
      releaseDate: "2024-10-22",
      genre: "Ciencia ficcion",
      rating: 6.8,
      rentalPrice: 8000,
      format: "Blu-ray",
      stock: 3,
      available: true,
      rentalTime: "48 horas",
      tags: ["Ciencia ficcion", "Disponible"],
      poster: buildTmdbImage("/aosm8NMQ3UyoBVpSxyimorCQykC.jpg"),
      banner: buildTmdbImage("/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg"),
      synopsis:
        "Eddie Brock y Venom huyen de amenazas de ambos mundos mientras se acercan a una decision final que cambiara su relacion para siempre.",
      review:
        "La pelicula insiste en el caos de buddy movie extraterrestre que define la saga. No siempre es refinada, pero sabe capitalizar la extrana quimica de su duo central.",
      actors: ["Tom Hardy", "Chiwetel Ejiofor", "Juno Temple", "Rhys Ifans"],
      photos: createGallery("/aosm8NMQ3UyoBVpSxyimorCQykC.jpg", "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg"),
    },
    {
      id: 1184918,
      title: "The Wild Robot",
      releaseDate: "2024-09-12",
      genre: "Animacion",
      rating: 8.4,
      rentalPrice: 8500,
      format: "Digital",
      stock: 6,
      available: true,
      rentalTime: "72 horas",
      tags: ["Top renta", "Familiar", "Disponible"],
      poster: buildTmdbImage("/9w0Vh9eizfBXrcomiaFWTIPdboo.jpg"),
      banner: buildTmdbImage("/1pmXyN3sKeYoUhu5VBZiDU4BX21.jpg"),
      synopsis:
        "Tras un naufragio, un robot inteligente queda varado en una isla desierta y aprende a convivir con animales mientras cuida a una cria huerfana.",
      review:
        "Su sensibilidad visual y emocional la vuelven una de las animaciones mas solidas del ano. La pelicula encuentra belleza sin sacrificar claridad narrativa.",
      actors: ["Lupita Nyong'o", "Pedro Pascal", "Kit Connor", "Bill Nighy"],
      photos: createGallery("/9w0Vh9eizfBXrcomiaFWTIPdboo.jpg", "/1pmXyN3sKeYoUhu5VBZiDU4BX21.jpg"),
    },
    {
      id: 933260,
      title: "The Substance",
      releaseDate: "2024-09-07",
      genre: "Terror",
      rating: 7.1,
      rentalPrice: 8000,
      format: "VHS",
      stock: 1,
      available: true,
      rentalTime: "48 horas",
      tags: ["VHS", "Terror", "Top renta"],
      poster: buildTmdbImage("/lqoMzCcZYEFK729d6qzt349fB4o.jpg"),
      banner: buildTmdbImage("/7h6TqPB3ESmjuVbxCxAeB1c9OB1.jpg"),
      synopsis:
        "Una celebridad en decadencia recurre a una sustancia experimental que genera una version mas joven y aparentemente perfecta de si misma.",
      review:
        "Es grotesca, satirica y muy directa en lo que quiere atacar. Coralie Fargeat prefiere incomodar antes que suavizar, y esa decision le da personalidad.",
      actors: ["Demi Moore", "Margaret Qualley", "Dennis Quaid", "Hugo Diego Garcia"],
      photos: createGallery("/lqoMzCcZYEFK729d6qzt349fB4o.jpg", "/7h6TqPB3ESmjuVbxCxAeB1c9OB1.jpg"),
    },
    {
      id: 945961,
      title: "Alien: Romulus",
      releaseDate: "2024-08-13",
      genre: "Terror",
      rating: 7.2,
      rentalPrice: 8000,
      format: "Blu-ray",
      stock: 3,
      available: true,
      rentalTime: "48 horas",
      tags: ["Terror", "Disponible"],
      poster: buildTmdbImage("/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg"),
      banner: buildTmdbImage("/eP4RZSHliWu6lPT5WQyHr5ZZKuC.jpg"),
      synopsis:
        "Un grupo de jovenes colonos explora una estacion espacial abandonada y termina frente a una amenaza biologica letal.",
      review:
        "Fede Alvarez apuesta por tension fisica, espacios cerrados y una violencia seca. El resultado dialoga con la saga sin depender solo de la nostalgia.",
      actors: ["Cailee Spaeny", "David Jonsson", "Archie Renaux", "Isabela Merced"],
      photos: createGallery("/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg", "/eP4RZSHliWu6lPT5WQyHr5ZZKuC.jpg"),
    },
    {
      id: 533535,
      title: "Deadpool & Wolverine",
      releaseDate: "2024-07-26",
      genre: "Accion",
      rating: 7.8,
      rentalPrice: 8500,
      format: "Blu-ray",
      stock: 4,
      available: true,
      rentalTime: "48 horas",
      tags: ["Top renta", "Disponible"],
      poster: buildTmdbImage("/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"),
      banner: buildTmdbImage("/dvBCdCohwWbsP5qAaglOXagDMtk.jpg"),
      synopsis:
        "Wade Wilson vuelve a la accion cuando una crisis multiversal lo obliga a trabajar con un Logan mucho menos dispuesto de lo ideal.",
      review:
        "La pelicula entiende el valor del choque entre sus dos protagonistas y lo explota con entusiasmo. Es ruidosa, autoconsciente y bastante mejor cuando se concentra en su dupla.",
      actors: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Dafne Keen"],
      photos: createGallery("/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", "/dvBCdCohwWbsP5qAaglOXagDMtk.jpg"),
    },
    {
      id: 1022789,
      title: "Inside Out 2",
      releaseDate: "2024-06-11",
      genre: "Animacion",
      rating: 7.7,
      rentalPrice: 8500,
      format: "DVD",
      stock: 5,
      available: true,
      rentalTime: "72 horas",
      tags: ["Familiar", "Top renta", "Disponible"],
      poster: buildTmdbImage("/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg"),
      banner: buildTmdbImage("/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg"),
      synopsis:
        "Riley entra en la adolescencia y sus emociones deben adaptarse a nuevas visitantes que alteran por completo el equilibrio interno.",
      review:
        "Pixar retoma una idea potentisima y la mueve hacia una etapa distinta de la vida. Su mejor acierto es convertir la ansiedad en un conflicto entendible sin perder ligereza.",
      actors: ["Amy Poehler", "Maya Hawke", "Ayo Edebiri", "Kensington Tallman"],
      photos: createGallery("/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", "/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg"),
    },
    {
      id: 653346,
      title: "Kingdom of the Planet of the Apes",
      releaseDate: "2024-05-08",
      genre: "Ciencia ficcion",
      rating: 7.1,
      rentalPrice: 8000,
      format: "Digital",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Ciencia ficcion", "Disponible"],
      poster: buildTmdbImage("/4925wPllJdQmHd1RxbZ62ZekaW3.jpg"),
      banner: buildTmdbImage("/iHYh4cdO8ylA3W0dUxTDVdyJ5G9.jpg"),
      synopsis:
        "Generaciones despues de Cesar, un joven simio emprende un viaje que pondra en juego el futuro de humanos y simios por igual.",
      review:
        "Wes Ball abre una nueva etapa con sentido de escala y una mirada mas aventurera. No busca copiar la trilogia anterior y eso le permite respirar mejor.",
      actors: ["Owen Teague", "Freya Allan", "Kevin Durand", "Peter Macon"],
      photos: createGallery("/4925wPllJdQmHd1RxbZ62ZekaW3.jpg", "/iHYh4cdO8ylA3W0dUxTDVdyJ5G9.jpg"),
    },
    {
      id: 786892,
      title: "Furiosa: A Mad Max Saga",
      releaseDate: "2024-05-22",
      genre: "Accion",
      rating: 7.5,
      rentalPrice: 8500,
      format: "Blu-ray",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Accion", "Top renta"],
      poster: buildTmdbImage("/hbxqFdWXHeLIJfagMMhVG5SV5tb.jpg"),
      banner: buildTmdbImage("/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg"),
      synopsis:
        "La joven Furiosa es arrancada de su hogar y sobrevive en medio de una guerra brutal entre lideres del desierto.",
      review:
        "George Miller vuelve a convertir el movimiento en narracion pura. Aunque tiene otra energia que Fury Road, conserva una fuerza visual dificil de ignorar.",
      actors: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke", "Alyla Browne"],
      photos: createGallery("/hbxqFdWXHeLIJfagMMhVG5SV5tb.jpg", "/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg"),
    },
    {
      id: 929590,
      title: "Civil War",
      releaseDate: "2024-04-10",
      genre: "Thriller",
      rating: 7.0,
      rentalPrice: 7500,
      format: "Digital",
      stock: 1,
      available: true,
      rentalTime: "48 horas",
      tags: ["Thriller", "Disponible"],
      poster: buildTmdbImage("/4V06xpCUesnzXvkQav1q3RRlwxh.jpg"),
      banner: buildTmdbImage("/t2SXZ7KLriaLyf5QT8Iar6fSOGp.jpg"),
      synopsis:
        "En unos Estados Unidos fracturados, un grupo de periodistas atraviesa el pais para documentar el colapso antes de que sea demasiado tarde.",
      review:
        "Alex Garland usa la guerra como lente para hablar de imagen, distancia y deshumanizacion. Es una pelicula seca, inquieta y mas observadora que explicativa.",
      actors: ["Kirsten Dunst", "Cailee Spaeny", "Wagner Moura", "Stephen McKinley Henderson"],
      photos: createGallery("/4V06xpCUesnzXvkQav1q3RRlwxh.jpg", "/t2SXZ7KLriaLyf5QT8Iar6fSOGp.jpg"),
    },
    {
      id: 693134,
      title: "Dune: Part Two",
      releaseDate: "2024-02-27",
      genre: "Ciencia ficcion",
      rating: 8.2,
      rentalPrice: 9000,
      format: "Blu-ray",
      stock: 4,
      available: true,
      rentalTime: "72 horas",
      tags: ["Top renta", "Ciencia ficcion", "Disponible"],
      poster: buildTmdbImage("/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg"),
      banner: buildTmdbImage("/rRBD8ORo9y34tYkAQJVbn4Ml6tu.jpg"),
      synopsis:
        "Paul Atreides se une a Chani y a los Fremen mientras abraza un destino que podria cambiar para siempre el equilibrio del universo.",
      review:
        "Denis Villeneuve eleva la escala sin perder tension emocional. Es una secuela ambiciosa, visualmente poderosa y mucho mas agresiva en su conflicto politico y espiritual.",
      actors: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
      photos: createGallery("/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg", "/rRBD8ORo9y34tYkAQJVbn4Ml6tu.jpg"),
    },
    {
      id: 872585,
      title: "Oppenheimer",
      releaseDate: "2023-07-19",
      genre: "Drama",
      rating: 8.2,
      rentalPrice: 8000,
      format: "Blu-ray",
      stock: 3,
      available: true,
      rentalTime: "72 horas",
      tags: ["Top renta", "Disponible"],
      poster: buildTmdbImage("/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
      banner: buildTmdbImage("/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg"),
      synopsis:
        "La historia sigue a J. Robert Oppenheimer durante el desarrollo del Proyecto Manhattan y las consecuencias morales de crear la bomba atomica.",
      review:
        "Christopher Nolan construye un drama historico tenso y absorbente. Su montaje rapido y el peso de las actuaciones convierten una biografia en una experiencia casi operatica.",
      actors: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr.", "Matt Damon"],
      photos: createGallery("/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg"),
    },
    {
      id: 569094,
      title: "Spider-Man: Across the Spider-Verse",
      releaseDate: "2023-05-31",
      genre: "Animacion",
      rating: 8.4,
      rentalPrice: 8000,
      format: "Digital",
      stock: 4,
      available: true,
      rentalTime: "72 horas",
      tags: ["Top renta", "Animacion"],
      poster: buildTmdbImage("/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"),
      banner: buildTmdbImage("/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg"),
      synopsis:
        "Miles Morales se reencuentra con Gwen Stacy y termina atrapado en un conflicto multiversal con una sociedad de Spider-People.",
      review:
        "Su animacion cambia de estilo con una libertad impresionante y aun asi mantiene claridad narrativa. Es un blockbuster vibrante que no teme ser emocional ni extrano.",
      actors: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Brian Tyree Henry"],
      photos: createGallery("/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", "/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg"),
    },
    {
      id: 603692,
      title: "John Wick: Chapter 4",
      releaseDate: "2023-03-22",
      genre: "Accion",
      rating: 7.7,
      rentalPrice: 8000,
      format: "DVD",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Accion", "Disponible"],
      poster: buildTmdbImage("/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg"),
      banner: buildTmdbImage("/h8gHn0OzBoaefsYseUByqsmEDMY.jpg"),
      synopsis:
        "John Wick descubre una via para derrotar a la Alta Mesa, pero antes debe enfrentarse a enemigos cada vez mas poderosos en ciudades de todo el mundo.",
      review:
        "La saga alcanza aqui su version mas grandiosa. Chad Stahelski convierte cada combate en una pieza coreografica enorme, estilizada y sorprendentemente elegante.",
      actors: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgard", "Ian McShane"],
      photos: createGallery("/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", "/h8gHn0OzBoaefsYseUByqsmEDMY.jpg"),
    },
    {
      id: 545611,
      title: "Everything Everywhere All at Once",
      releaseDate: "2022-03-24",
      genre: "Aventura",
      rating: 7.8,
      rentalPrice: 7500,
      format: "Digital",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Top renta", "Disponible"],
      poster: buildTmdbImage("/iN3vKCuOGRdZ9Cn3yRGCyMlaiST.jpg"),
      banner: buildTmdbImage("/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg"),
      synopsis:
        "Evelyn Wang descubre que debe conectarse con versiones alternativas de si misma para enfrentar una amenaza que atraviesa multiples universos.",
      review:
        "Los Daniels mezclan caos, humor absurdo y una sensibilidad familiar muy sincera. Debajo de su energia desbordada hay una pelicula sorprendentemente afectuosa.",
      actors: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu", "Jamie Lee Curtis"],
      photos: createGallery("/iN3vKCuOGRdZ9Cn3yRGCyMlaiST.jpg", "/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg"),
    },
    {
      id: 414906,
      title: "The Batman",
      releaseDate: "2022-03-01",
      genre: "Crimen",
      rating: 8.1,
      rentalPrice: 8000,
      format: "VHS",
      stock: 1,
      available: true,
      rentalTime: "48 horas",
      tags: ["VHS", "Clasico"],
      poster: buildTmdbImage("/74xTEgt7R36Fpooo50r9T25onhq.jpg"),
      banner: buildTmdbImage("/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"),
      synopsis:
        "En su segundo ano como vigilante, Bruce Wayne investiga una red de corrupcion en Gotham mientras sigue el rastro del Acertijo.",
      review:
        "Matt Reeves apuesta por un noir oscuro y lluvioso que se toma su tiempo para respirar. El resultado es un Batman detective, obsesivo y con una identidad visual muy marcada.",
      actors: ["Robert Pattinson", "Zoe Kravitz", "Paul Dano", "Jeffrey Wright"],
      photos: createGallery("/74xTEgt7R36Fpooo50r9T25onhq.jpg", "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"),
    },
    {
      id: 496243,
      title: "Parasite",
      releaseDate: "2019-05-30",
      genre: "Thriller",
      rating: 8.5,
      rentalPrice: 7500,
      format: "DVD",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["Clasico", "Top renta"],
      poster: buildTmdbImage("/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"),
      banner: buildTmdbImage("/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg"),
      synopsis:
        "La familia Kim se infiltra poco a poco en la casa de una familia rica, pero una cadena de secretos altera por completo la relacion entre ambas.",
      review:
        "Bong Joon-ho cambia de tono con una precision admirable y convierte la lucha de clases en un thriller feroz, ironico y sorprendentemente divertido.",
      actors: ["Song Kang-ho", "Choi Woo-shik", "Park So-dam", "Cho Yeo-jeong"],
      photos: createGallery("/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg"),
    },
    {
      id: 475557,
      title: "Joker",
      releaseDate: "2019-10-01",
      genre: "Drama",
      rating: 8.1,
      rentalPrice: 7500,
      format: "VHS",
      stock: 0,
      available: false,
      rentalTime: "48 horas",
      tags: ["VHS", "Clasico"],
      poster: buildTmdbImage("/tWjJ3ILjsbTwKgXxEv48QAbYZ19.jpg"),
      banner: buildTmdbImage("/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg"),
      synopsis:
        "Arthur Fleck, un comediante frustrado y socialmente aislado, cae en una espiral de violencia que termina por transformarlo en el Joker.",
      review:
        "La pelicula funciona mejor como retrato de deterioro que como historia de origen clasica. Joaquin Phoenix sostiene casi todo con una interpretacion fisica y perturbadora.",
      actors: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz", "Frances Conroy"],
      photos: createGallery("/tWjJ3ILjsbTwKgXxEv48QAbYZ19.jpg", "/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg"),
    },
    {
      id: 335984,
      title: "Blade Runner 2049",
      releaseDate: "2017-10-04",
      genre: "Ciencia ficcion",
      rating: 7.6,
      rentalPrice: 7500,
      format: "VHS / Digital",
      stock: 2,
      available: true,
      rentalTime: "48 horas",
      tags: ["VHS", "Clasico", "Disponible"],
      poster: buildTmdbImage("/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"),
      banner: buildTmdbImage("/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg"),
      synopsis:
        "Un blade runner descubre un secreto enterrado desde hace decadas y esa pista lo empuja a buscar a Rick Deckard, desaparecido desde hace años.",
      review:
        "Villeneuve expande el universo original con una calma hipnotica. Su fotografia y su diseno sonoro dominan la experiencia sin descuidar la melancolia del relato.",
      actors: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Robin Wright"],
      photos: createGallery("/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", "/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg"),
    },
    {
      id: 157336,
      title: "Interstellar",
      releaseDate: "2014-11-05",
      genre: "Ciencia ficcion",
      rating: 8.4,
      rentalPrice: 7500,
      format: "Blu-ray",
      stock: 3,
      available: true,
      rentalTime: "72 horas",
      tags: ["Clasico", "Top renta", "Disponible"],
      poster: buildTmdbImage("/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"),
      banner: buildTmdbImage("/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"),
      synopsis:
        "Cuando la Tierra entra en crisis, un ex piloto de la NASA se une a una mision para atravesar un agujero de gusano y buscar un nuevo hogar para la humanidad.",
      review:
        "Interstellar mezcla ideas cientificas enormes con un nucleo emocional muy humano. Su apuesta sentimental divide opiniones, pero la escala y la imaginacion siguen impresionando.",
      actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
      photos: createGallery("/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"),
    },
  ];

  window.MOVIES = MOVIES;
})();



