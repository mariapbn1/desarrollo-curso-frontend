import type { Movie } from '../models/movie.model';

export const MOVIE_IMAGE_FALLBACK = 'assets/img/movie-fallback.svg';

const withLocalImages = (movie: Omit<Movie, 'poster' | 'banner' | 'photos' | 'fallback'>): Movie => ({
  ...movie,
  poster: MOVIE_IMAGE_FALLBACK,
  banner: MOVIE_IMAGE_FALLBACK,
  photos: [MOVIE_IMAGE_FALLBACK, MOVIE_IMAGE_FALLBACK, MOVIE_IMAGE_FALLBACK],
  fallback: MOVIE_IMAGE_FALLBACK,
});

export const MOVIES: Movie[] = [
  {
    "id": 2026001,
    "title": "El Diablo Viste a la Moda 2",
    "releaseDate": "2026-05-01",
    "genre": "Comedia / Drama",
    "rating": 7.1,
    "rentalPrice": 9500,
    "format": "VHS / Digital",
    "stock": 5,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Nuevo",
      "Top renta",
      "Disponible"
    ],
    "synopsis": "Miranda Priestly vuelve a moverse entre crisis editoriales y poder en la industria de la moda, mientras viejas alianzas se tensan en una nueva etapa de Runway.",
    "review": "La secuela recupera el filo elegante de sus personajes y apuesta mas por el choque generacional que por repetir formulas. Funciona mejor cuando deja que su reparto veterano domine la escena.",
    "actors": [
      "Meryl Streep",
      "Anne Hathaway",
      "Emily Blunt",
      "Stanley Tucci"
    ],
    "year": 2026
  },
  {
    "id": 2026002,
    "title": "Michael",
    "releaseDate": "2026-04-24",
    "genre": "Musical / Drama",
    "rating": 6.9,
    "rentalPrice": 9000,
    "format": "VHS / Digital",
    "stock": 4,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Nuevo",
      "VHS",
      "Top renta"
    ],
    "synopsis": "La pelicula recorre distintos momentos de la vida y carrera de Michael Jackson, desde sus primeros años hasta su consolidacion como estrella global.",
    "review": "El proyecto apuesta por la escala del espectaculo y por una interpretacion central muy observada. Su mayor interes esta en como intenta equilibrar homenaje, musica y biografia.",
    "actors": [
      "Jaafar Jackson",
      "Colman Domingo",
      "Nia Long",
      "Miles Teller"
    ],
    "year": 2026
  },
  {
    "id": 2026003,
    "title": "Super Mario Galaxy: la pelicula",
    "releaseDate": "2026-04-01",
    "genre": "Animacion / Aventura / Familiar",
    "rating": 7.4,
    "rentalPrice": 9500,
    "format": "Blu-ray",
    "stock": 6,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Nuevo",
      "Disponible",
      "Familiar"
    ],
    "synopsis": "Mario, Luigi y sus aliados se embarcan en una nueva aventura espacial inspirada en el universo Galaxy, con Rosalina y nuevas amenazas en el centro del viaje.",
    "review": "La pelicula amplifica la escala del mundo de Mario y lleva la accion hacia un terreno mas cosmico. Mantiene el tono familiar mientras abre espacio para personajes nuevos y escenarios mas ambiciosos.",
    "actors": [
      "Chris Pratt",
      "Anya Taylor-Joy",
      "Charlie Day",
      "Brie Larson"
    ],
    "year": 2026
  },
  {
    "id": 696506,
    "title": "Mickey 17",
    "releaseDate": "2025-02-28",
    "genre": "Ciencia ficcion",
    "rating": 6.8,
    "rentalPrice": 8500,
    "format": "VHS",
    "stock": 3,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Disponible"
    ],
    "synopsis": "Mickey Barnes acepta un trabajo extremo como trabajador reemplazable en una colonia espacial y descubre el costo real de ser desechable.",
    "review": "Bong Joon-ho mezcla satira, ciencia ficcion y absurdo con una identidad muy clara. Es una pelicula rara a proposito, mas interesada en las ideas que en la comodidad.",
    "actors": [
      "Robert Pattinson",
      "Naomi Ackie",
      "Steven Yeun",
      "Mark Ruffalo"
    ],
    "year": 2025
  },
  {
    "id": 822119,
    "title": "Captain America: Brave New World",
    "releaseDate": "2025-02-12",
    "genre": "Accion",
    "rating": 6,
    "rentalPrice": 8500,
    "format": "Digital",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Nuevo",
      "Disponible"
    ],
    "synopsis": "Sam Wilson queda atrapado en un conflicto internacional mientras intenta descubrir la mente detras de una conspiracion de alto nivel.",
    "review": "La pelicula se apoya en el tono politico del personaje y en la presencia de Anthony Mackie. Funciona mejor cuando se mueve como thriller que cuando busca pura grandilocuencia.",
    "actors": [
      "Anthony Mackie",
      "Harrison Ford",
      "Danny Ramirez",
      "Shira Haas"
    ],
    "year": 2025
  },
  {
    "id": 426063,
    "title": "Nosferatu",
    "releaseDate": "2024-12-25",
    "genre": "Terror",
    "rating": 6.9,
    "rentalPrice": 8000,
    "format": "VHS",
    "stock": 0,
    "available": false,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Terror",
      "Agotada"
    ],
    "synopsis": "Una joven atormentada y un vampiro obsesionado quedan unidos en una historia gotica marcada por deseo, miedo y fatalidad.",
    "review": "Robert Eggers lleva su gusto por la textura y la atmosfera al terreno del horror clasico. Todo respira oscuridad, ceremonia y una incomodidad muy calculada.",
    "actors": [
      "Lily-Rose Depp",
      "Nicholas Hoult",
      "Bill Skarsgard",
      "Willem Dafoe"
    ],
    "year": 2024
  },
  {
    "id": 762509,
    "title": "Mufasa: The Lion King",
    "releaseDate": "2024-12-18",
    "genre": "Animacion",
    "rating": 7.4,
    "rentalPrice": 8500,
    "format": "DVD",
    "stock": 4,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Familiar",
      "Disponible"
    ],
    "synopsis": "La historia retrocede para mostrar como Mufasa paso de ser un cachorro perdido a convertirse en una figura central del reino.",
    "review": "Su mayor valor esta en ampliar la mitologia con un tono de aventura familiar. No siempre sorprende, pero sabe mantener el impulso emocional del universo.",
    "actors": [
      "Aaron Pierre",
      "Kelvin Harrison Jr.",
      "Tiffany Boone",
      "Mads Mikkelsen"
    ],
    "year": 2024
  },
  {
    "id": 558449,
    "title": "Gladiator II",
    "releaseDate": "2024-11-05",
    "genre": "Accion",
    "rating": 6.8,
    "rentalPrice": 8000,
    "format": "Blu-ray",
    "stock": 3,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Accion",
      "Disponible"
    ],
    "synopsis": "Lucius regresa al Coliseo en un nuevo capitulo de poder, venganza y supervivencia dentro del imperio romano.",
    "review": "Ridley Scott vuelve a la arena con una secuela mas turbulenta que solemne. Tiene ambicion visual y un gusto claro por el exceso del espectaculo.",
    "actors": [
      "Paul Mescal",
      "Pedro Pascal",
      "Connie Nielsen",
      "Denzel Washington"
    ],
    "year": 2024
  },
  {
    "id": 845781,
    "title": "Red One",
    "releaseDate": "2024-10-31",
    "genre": "Aventura",
    "rating": 7,
    "rentalPrice": 7500,
    "format": "Digital",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Aventura",
      "Disponible"
    ],
    "synopsis": "Tras el secuestro de Santa Claus, el jefe de seguridad del Polo Norte y un rastreador de reputacion dudosa deben unir fuerzas para rescatarlo.",
    "review": "Es una fantasia de accion ligera y consciente de su absurdo. Cuando abraza por completo su tono jugueton, encuentra su mejor energia.",
    "actors": [
      "Dwayne Johnson",
      "Chris Evans",
      "Lucy Liu",
      "J.K. Simmons"
    ],
    "year": 2024
  },
  {
    "id": 1241982,
    "title": "Moana 2",
    "releaseDate": "2024-11-21",
    "genre": "Animacion",
    "rating": 7,
    "rentalPrice": 8500,
    "format": "DVD",
    "stock": 5,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Familiar",
      "Disponible"
    ],
    "synopsis": "Moana recibe una nueva llamada del oceano y emprende un viaje mas peligroso junto a Maui y una tripulacion inesperada.",
    "review": "La secuela conserva el espiritu aventurero y la dimension familiar del original. Su mayor fortaleza esta en el movimiento constante y su energia luminosa.",
    "actors": [
      "Auli'i Cravalho",
      "Dwayne Johnson",
      "Rose Matafeo",
      "Hualalai Chung"
    ],
    "year": 2024
  },
  {
    "id": 912649,
    "title": "Venom: The Last Dance",
    "releaseDate": "2024-10-22",
    "genre": "Ciencia ficcion",
    "rating": 6.8,
    "rentalPrice": 8000,
    "format": "Blu-ray",
    "stock": 3,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Ciencia ficcion",
      "Disponible"
    ],
    "synopsis": "Eddie Brock y Venom huyen de amenazas de ambos mundos mientras se acercan a una decision final que cambiara su relacion para siempre.",
    "review": "La pelicula insiste en el caos de buddy movie extraterrestre que define la saga. No siempre es refinada, pero sabe capitalizar la extrana quimica de su duo central.",
    "actors": [
      "Tom Hardy",
      "Chiwetel Ejiofor",
      "Juno Temple",
      "Rhys Ifans"
    ],
    "year": 2024
  },
  {
    "id": 1184918,
    "title": "The Wild Robot",
    "releaseDate": "2024-09-12",
    "genre": "Animacion",
    "rating": 8.4,
    "rentalPrice": 8500,
    "format": "Digital",
    "stock": 6,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Top renta",
      "Familiar",
      "Disponible"
    ],
    "synopsis": "Tras un naufragio, un robot inteligente queda varado en una isla desierta y aprende a convivir con animales mientras cuida a una cria huerfana.",
    "review": "Su sensibilidad visual y emocional la vuelven una de las animaciones mas solidas del ano. La pelicula encuentra belleza sin sacrificar claridad narrativa.",
    "actors": [
      "Lupita Nyong'o",
      "Pedro Pascal",
      "Kit Connor",
      "Bill Nighy"
    ],
    "year": 2024
  },
  {
    "id": 933260,
    "title": "The Substance",
    "releaseDate": "2024-09-07",
    "genre": "Terror",
    "rating": 7.1,
    "rentalPrice": 8000,
    "format": "VHS",
    "stock": 0,
    "available": false,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Terror",
      "Agotada"
    ],
    "synopsis": "Una celebridad en decadencia recurre a una sustancia experimental que genera una version mas joven y aparentemente perfecta de si misma.",
    "review": "Es grotesca, satirica y muy directa en lo que quiere atacar. Coralie Fargeat prefiere incomodar antes que suavizar, y esa decision le da personalidad.",
    "actors": [
      "Demi Moore",
      "Margaret Qualley",
      "Dennis Quaid",
      "Hugo Diego Garcia"
    ],
    "year": 2024
  },
  {
    "id": 945961,
    "title": "Alien: Romulus",
    "releaseDate": "2024-08-13",
    "genre": "Terror",
    "rating": 7.2,
    "rentalPrice": 8000,
    "format": "Blu-ray",
    "stock": 3,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Terror",
      "Disponible"
    ],
    "synopsis": "Un grupo de jovenes colonos explora una estacion espacial abandonada y termina frente a una amenaza biologica letal.",
    "review": "Fede Alvarez apuesta por tension fisica, espacios cerrados y una violencia seca. El resultado dialoga con la saga sin depender solo de la nostalgia.",
    "actors": [
      "Cailee Spaeny",
      "David Jonsson",
      "Archie Renaux",
      "Isabela Merced"
    ],
    "year": 2024
  },
  {
    "id": 533535,
    "title": "Deadpool & Wolverine",
    "releaseDate": "2024-07-26",
    "genre": "Accion",
    "rating": 7.8,
    "rentalPrice": 8500,
    "format": "Blu-ray",
    "stock": 4,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Top renta",
      "Disponible"
    ],
    "synopsis": "Wade Wilson vuelve a la accion cuando una crisis multiversal lo obliga a trabajar con un Logan mucho menos dispuesto de lo ideal.",
    "review": "La pelicula entiende el valor del choque entre sus dos protagonistas y lo explota con entusiasmo. Es ruidosa, autoconsciente y bastante mejor cuando se concentra en su dupla.",
    "actors": [
      "Ryan Reynolds",
      "Hugh Jackman",
      "Emma Corrin",
      "Dafne Keen"
    ],
    "year": 2024
  },
  {
    "id": 1022789,
    "title": "Inside Out 2",
    "releaseDate": "2024-06-11",
    "genre": "Animacion",
    "rating": 7.7,
    "rentalPrice": 8500,
    "format": "DVD",
    "stock": 5,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Familiar",
      "Top renta",
      "Disponible"
    ],
    "synopsis": "Riley entra en la adolescencia y sus emociones deben adaptarse a nuevas visitantes que alteran por completo el equilibrio interno.",
    "review": "Pixar retoma una idea potentisima y la mueve hacia una etapa distinta de la vida. Su mejor acierto es convertir la ansiedad en un conflicto entendible sin perder ligereza.",
    "actors": [
      "Amy Poehler",
      "Maya Hawke",
      "Ayo Edebiri",
      "Kensington Tallman"
    ],
    "year": 2024
  },
  {
    "id": 653346,
    "title": "Kingdom of the Planet of the Apes",
    "releaseDate": "2024-05-08",
    "genre": "Ciencia ficcion",
    "rating": 7.1,
    "rentalPrice": 8000,
    "format": "Digital",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Ciencia ficcion",
      "Disponible"
    ],
    "synopsis": "Generaciones despues de Cesar, un joven simio emprende un viaje que pondra en juego el futuro de humanos y simios por igual.",
    "review": "Wes Ball abre una nueva etapa con sentido de escala y una mirada mas aventurera. No busca copiar la trilogia anterior y eso le permite respirar mejor.",
    "actors": [
      "Owen Teague",
      "Freya Allan",
      "Kevin Durand",
      "Peter Macon"
    ],
    "year": 2024
  },
  {
    "id": 786892,
    "title": "Furiosa: A Mad Max Saga",
    "releaseDate": "2024-05-22",
    "genre": "Accion",
    "rating": 7.5,
    "rentalPrice": 8500,
    "format": "Blu-ray",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Accion",
      "Top renta"
    ],
    "synopsis": "La joven Furiosa es arrancada de su hogar y sobrevive en medio de una guerra brutal entre lideres del desierto.",
    "review": "George Miller vuelve a convertir el movimiento en narracion pura. Aunque tiene otra energia que Fury Road, conserva una fuerza visual dificil de ignorar.",
    "actors": [
      "Anya Taylor-Joy",
      "Chris Hemsworth",
      "Tom Burke",
      "Alyla Browne"
    ],
    "year": 2024
  },
  {
    "id": 929590,
    "title": "Civil War",
    "releaseDate": "2024-04-10",
    "genre": "Thriller",
    "rating": 7,
    "rentalPrice": 7500,
    "format": "Digital",
    "stock": 0,
    "available": false,
    "rentalTime": "48 horas",
    "tags": [
      "Thriller",
      "Agotada"
    ],
    "synopsis": "En unos Estados Unidos fracturados, un grupo de periodistas atraviesa el pais para documentar el colapso antes de que sea demasiado tarde.",
    "review": "Alex Garland usa la guerra como lente para hablar de imagen, distancia y deshumanizacion. Es una pelicula seca, inquieta y mas observadora que explicativa.",
    "actors": [
      "Kirsten Dunst",
      "Cailee Spaeny",
      "Wagner Moura",
      "Stephen McKinley Henderson"
    ],
    "year": 2024
  },
  {
    "id": 693134,
    "title": "Dune: Part Two",
    "releaseDate": "2024-02-27",
    "genre": "Ciencia ficcion",
    "rating": 8.2,
    "rentalPrice": 9000,
    "format": "Blu-ray",
    "stock": 4,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Top renta",
      "Ciencia ficcion",
      "Disponible"
    ],
    "synopsis": "Paul Atreides se une a Chani y a los Fremen mientras abraza un destino que podria cambiar para siempre el equilibrio del universo.",
    "review": "Denis Villeneuve eleva la escala sin perder tension emocional. Es una secuela ambiciosa, visualmente poderosa y mucho mas agresiva en su conflicto politico y espiritual.",
    "actors": [
      "Timothee Chalamet",
      "Zendaya",
      "Rebecca Ferguson",
      "Javier Bardem"
    ],
    "year": 2024
  },
  {
    "id": 872585,
    "title": "Oppenheimer",
    "releaseDate": "2023-07-19",
    "genre": "Drama",
    "rating": 8.2,
    "rentalPrice": 8000,
    "format": "Blu-ray",
    "stock": 3,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Top renta",
      "Disponible"
    ],
    "synopsis": "La historia sigue a J. Robert Oppenheimer durante el desarrollo del Proyecto Manhattan y las consecuencias morales de crear la bomba atomica.",
    "review": "Christopher Nolan construye un drama historico tenso y absorbente. Su montaje rapido y el peso de las actuaciones convierten una biografia en una experiencia casi operatica.",
    "actors": [
      "Cillian Murphy",
      "Emily Blunt",
      "Robert Downey Jr.",
      "Matt Damon"
    ],
    "year": 2023
  },
  {
    "id": 569094,
    "title": "Spider-Man: Across the Spider-Verse",
    "releaseDate": "2023-05-31",
    "genre": "Animacion",
    "rating": 8.4,
    "rentalPrice": 8000,
    "format": "Digital",
    "stock": 4,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Top renta",
      "Animacion"
    ],
    "synopsis": "Miles Morales se reencuentra con Gwen Stacy y termina atrapado en un conflicto multiversal con una sociedad de Spider-People.",
    "review": "Su animacion cambia de estilo con una libertad impresionante y aun asi mantiene claridad narrativa. Es un blockbuster vibrante que no teme ser emocional ni extrano.",
    "actors": [
      "Shameik Moore",
      "Hailee Steinfeld",
      "Oscar Isaac",
      "Brian Tyree Henry"
    ],
    "year": 2023
  },
  {
    "id": 603692,
    "title": "John Wick: Chapter 4",
    "releaseDate": "2023-03-22",
    "genre": "Accion",
    "rating": 7.7,
    "rentalPrice": 8000,
    "format": "DVD",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Accion",
      "Disponible"
    ],
    "synopsis": "John Wick descubre una via para derrotar a la Alta Mesa, pero antes debe enfrentarse a enemigos cada vez mas poderosos en ciudades de todo el mundo.",
    "review": "La saga alcanza aqui su version mas grandiosa. Chad Stahelski convierte cada combate en una pieza coreografica enorme, estilizada y sorprendentemente elegante.",
    "actors": [
      "Keanu Reeves",
      "Donnie Yen",
      "Bill Skarsgard",
      "Ian McShane"
    ],
    "year": 2023
  },
  {
    "id": 545611,
    "title": "Everything Everywhere All at Once",
    "releaseDate": "2022-03-24",
    "genre": "Aventura",
    "rating": 7.8,
    "rentalPrice": 7500,
    "format": "Digital",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Top renta",
      "Disponible"
    ],
    "synopsis": "Evelyn Wang descubre que debe conectarse con versiones alternativas de si misma para enfrentar una amenaza que atraviesa multiples universos.",
    "review": "Los Daniels mezclan caos, humor absurdo y una sensibilidad familiar muy sincera. Debajo de su energia desbordada hay una pelicula sorprendentemente afectuosa.",
    "actors": [
      "Michelle Yeoh",
      "Ke Huy Quan",
      "Stephanie Hsu",
      "Jamie Lee Curtis"
    ],
    "year": 2022
  },
  {
    "id": 414906,
    "title": "The Batman",
    "releaseDate": "2022-03-01",
    "genre": "Crimen",
    "rating": 8.1,
    "rentalPrice": 8000,
    "format": "VHS",
    "stock": 0,
    "available": false,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Clasico",
      "Agotada"
    ],
    "synopsis": "En su segundo ano como vigilante, Bruce Wayne investiga una red de corrupcion en Gotham mientras sigue el rastro del Acertijo.",
    "review": "Matt Reeves apuesta por un noir oscuro y lluvioso que se toma su tiempo para respirar. El resultado es un Batman detective, obsesivo y con una identidad visual muy marcada.",
    "actors": [
      "Robert Pattinson",
      "Zoe Kravitz",
      "Paul Dano",
      "Jeffrey Wright"
    ],
    "year": 2022
  },
  {
    "id": 496243,
    "title": "Parasite",
    "releaseDate": "2019-05-30",
    "genre": "Thriller",
    "rating": 8.5,
    "rentalPrice": 7500,
    "format": "DVD",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "Clasico",
      "Top renta"
    ],
    "synopsis": "La familia Kim se infiltra poco a poco en la casa de una familia rica, pero una cadena de secretos altera por completo la relacion entre ambas.",
    "review": "Bong Joon-ho cambia de tono con una precision admirable y convierte la lucha de clases en un thriller feroz, ironico y sorprendentemente divertido.",
    "actors": [
      "Song Kang-ho",
      "Choi Woo-shik",
      "Park So-dam",
      "Cho Yeo-jeong"
    ],
    "year": 2019
  },
  {
    "id": 475557,
    "title": "Joker",
    "releaseDate": "2019-10-01",
    "genre": "Drama",
    "rating": 8.1,
    "rentalPrice": 7500,
    "format": "VHS",
    "stock": 0,
    "available": false,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Clasico",
      "Agotada"
    ],
    "synopsis": "Arthur Fleck, un comediante frustrado y socialmente aislado, cae en una espiral de violencia que termina por transformarlo en el Joker.",
    "review": "La pelicula funciona mejor como retrato de deterioro que como historia de origen clasica. Joaquin Phoenix sostiene casi todo con una interpretacion fisica y perturbadora.",
    "actors": [
      "Joaquin Phoenix",
      "Robert De Niro",
      "Zazie Beetz",
      "Frances Conroy"
    ],
    "year": 2019
  },
  {
    "id": 335984,
    "title": "Blade Runner 2049",
    "releaseDate": "2017-10-04",
    "genre": "Ciencia ficcion",
    "rating": 7.6,
    "rentalPrice": 7500,
    "format": "VHS / Digital",
    "stock": 2,
    "available": true,
    "rentalTime": "48 horas",
    "tags": [
      "VHS",
      "Clasico",
      "Disponible"
    ],
    "synopsis": "Un blade runner descubre un secreto enterrado desde hace decadas y esa pista lo empuja a buscar a Rick Deckard, desaparecido desde hace años.",
    "review": "Villeneuve expande el universo original con una calma hipnotica. Su fotografia y su diseno sonoro dominan la experiencia sin descuidar la melancolia del relato.",
    "actors": [
      "Ryan Gosling",
      "Harrison Ford",
      "Ana de Armas",
      "Robin Wright"
    ],
    "year": 2017
  },
  {
    "id": 157336,
    "title": "Interstellar",
    "releaseDate": "2014-11-05",
    "genre": "Ciencia ficcion",
    "rating": 8.4,
    "rentalPrice": 7500,
    "format": "Blu-ray",
    "stock": 3,
    "available": true,
    "rentalTime": "72 horas",
    "tags": [
      "Clasico",
      "Top renta",
      "Disponible"
    ],
    "synopsis": "Cuando la Tierra entra en crisis, un ex piloto de la NASA se une a una mision para atravesar un agujero de gusano y buscar un nuevo hogar para la humanidad.",
    "review": "Interstellar mezcla ideas cientificas enormes con un nucleo emocional muy humano. Su apuesta sentimental divide opiniones, pero la escala y la imaginacion siguen impresionando.",
    "actors": [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine"
    ],
    "year": 2014
  }
]
  .map((movie) => withLocalImages(movie));
