// ================================================================
//  NOTICIAS — Club Atletico Maristas
//  Editado desde el panel de administracion — admin-server.js
//
//  La primera noticia aparece GRANDE (noticia principal).
//  Las siguientes aparecen como noticias secundarias.
//
//  Campos opcionales de video: `video` (mp4), `videoPoster`, `videoCaption`.
//  El player se muestra en un escenario 16:9 aunque el clip sea vertical.
// ================================================================

const NOTICIAS = [
  {
    titulo: "Dorada, campeón del Apertura 2026: sufrió, resistió y gritó campeón ante Dover",
    serie: "Dorada",
    fecha: "22 de agosto de 2026",
    resumen: "Bajo el sol del sábado, Dorada se consagró campeón del Torneo Apertura 2026 tras vencer 1-0 a Dover con un golazo de Aroca.<br><br>La final estuvo lejos de ser una fiesta: Dover apostó por un planteo basado en la pierna fuerte, faltas constantes, simulaciones y demoras para cortar el circuito de juego. Sin embargo, en medio del trámite friccionado y mañoso, apareció la jerarquía de Aroca para romper el cero con una definición exquisita.<br><br>Dorada atacó todo el partido, ahogando a Dover hasta el pitazo final. Una consagración sufrida y heroica que deja la copa en casa.",
    video: "videos/gol-campeonato.mp4",
    videoPoster: "videos/gol-campeonato-poster.jpg",
    videoCaption: "El gol de Aroca que valió el título, y el festejo del plantel.",
    imagen: "fotos/campeones/equipo campeon.jpeg",
    imagenes: [
      "fotos/campeones/equipo campeon.jpeg",
      "fotos/campeones/campeones copa 1.jpeg",
      "fotos/campeones/campeones copa 2.jpeg",
      "fotos/campeones/campeones copa 3.jpeg",
      "fotos/campeones/campeones copa 4.jpeg",
      "fotos/campeones/campeones copa 5.jpeg",
      "fotos/campeones/campeones celebracion.jpeg"
    ]
  }
];
