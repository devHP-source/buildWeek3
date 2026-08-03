const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const artistContent = document.getElementById("artistContent");

const artistHero = document.getElementById("artistHero");
const artistName = document.getElementById("artistName");
const artistFans = document.getElementById("artistFans");
const popularTracks = document.getElementById("popularTracks");

const likedArtistImage = document.getElementById("likedArtistImage");
const likedArtistName = document.getElementById("likedArtistName");
const artistPlayButton = document.getElementById("artistPlayButton");
const followArtistButton = document.getElementById("followArtistButton");
const showMoreTracks = document.getElementById("showMoreTracks");

const playerCover = document.getElementById("playerCover");
const playerSongTitle = document.getElementById("playerSongTitle");
const playerArtistName = document.getElementById("playerArtistName");
const totalTime = document.getElementById("totalTime");

/*
Ne scarichiamo 10 ma ne mostriamo 5: "Visualizza altro" rivela gli altri
senza dover rifare una richiesta.
*/
const TRACKS_PREVIEW = 5;
const TRACKS_TO_FETCH = 10;

let currentTracks = [];
let tracksExpanded = false;

document.addEventListener("DOMContentLoaded", initArtistPage);

async function initArtistPage() {
  const parameters = new URLSearchParams(window.location.search);
  const artistId = parameters.get("id");

  if (!artistId) {
    showError("Nell'indirizzo della pagina manca l'ID dell'artista.");
    return;
  }

  // getArtist() e getArtistTopTracks() stanno in utility.js e restituiscono null quando la richiesta fallisce, registrando il motivo in console.
  const [artist, topTracks] = await Promise.all([
    getArtist(artistId),
    getArtistTopTracks(artistId, TRACKS_TO_FETCH)
  ]);

  if (!artist) {
    showError("Non è stato possibile caricare l'artista.");
    return;
  }

  currentTracks = topTracks && topTracks.data ? topTracks.data : [];

  try {
    renderArtist(artist);
    renderTracks(currentTracks);
    showArtistContent();
  } catch (error) {
    console.log(error);
    showError("Non è stato possibile mostrare l'artista.");
  }
}

function renderArtist(artist) {
  const artistPicture =
    artist.picture_xl ||
    artist.picture_big ||
    artist.picture_medium ||
    artist.picture;

  artistName.textContent = artist.name;

  artistFans.textContent =
    `${formatNumber(artist.nb_fan)} fan`;

  artistHero.style.backgroundImage =
    `url("${artistPicture}")`;

  likedArtistImage.src = artistPicture;
  likedArtistImage.alt = `Immagine di ${artist.name}`;
  likedArtistName.textContent = `Di ${artist.name}`;

  document.title = `${artist.name} | Spotify Clone`;
}

function renderTracks(tracks) {
  popularTracks.innerHTML = "";

  if (!tracks.length) {
    popularTracks.innerHTML =
      "<p>Nessun brano disponibile per questo artista.</p>";

    showMoreTracks.classList.add("d-none");

    return;
  }

  const visibleTracks = tracksExpanded
    ? tracks
    : tracks.slice(0, TRACKS_PREVIEW);

  visibleTracks.forEach((track, index) => {
    const trackRow = createTrackRow(track, index);
    popularTracks.appendChild(trackRow);
  });

  if (tracks.length <= TRACKS_PREVIEW) {
    showMoreTracks.classList.add("d-none"); // se non c'è nulla, nascondiamo il pulsante
    return;
  }

  showMoreTracks.classList.remove("d-none");

  showMoreTracks.textContent = tracksExpanded
    ? "Visualizza meno"
    : "Visualizza altro";
}

function createTrackRow(track, index) {
  const row = document.createElement("div");
  row.classList.add("track-row");

  /*
    Costruiamo prima la struttura vuota e poi inseriamo i dati con
    textContent / proprietà, siccome molti titoli Deezer contengono virgolette
    (es: 'The World Is Not Enough (da "The World Is Not Enough")')
    e, inte mostra dentro l'HTML e spezzerebbero gli attributi del tag
  */
  row.innerHTML = `
    <span class="track-position"></span>

    <img class="track-cover" alt="">

    <span class="track-title"></span>

    <span class="track-rank"></span>

    <span class="track-duration"></span>
  `;

  row.querySelector(".track-position").textContent = index + 1;

  const cover = row.querySelector(".track-cover");
  cover.src = track.album.cover_small;
  cover.alt = `Copertina di ${track.title}`;

  row.querySelector(".track-title").textContent = track.title;
  row.querySelector(".track-rank").textContent = formatNumber(track.rank);
  row.querySelector(".track-duration").textContent = formatDuration(track.duration);

  row.addEventListener("click", () => {
    selectTrack(track);
  });

  return row;
}

// Aggiorna solo la grafica del player in basso: non c'è riproduzione audio.
function selectTrack(track) {
  playerCover.src = track.album.cover_small;
  playerCover.alt = `Copertina di ${track.title}`;

  playerSongTitle.textContent = track.title;
  playerArtistName.textContent = track.artist.name;

  totalTime.textContent = formatDuration(track.duration);
}


artistPlayButton.addEventListener("click", () => {
  if (!currentTracks.length) {
    return;
  }

  selectTrack(currentTracks[0]);
});


followArtistButton.addEventListener("click", () => {
  const isFollowing = followArtistButton.classList.toggle("following");

  followArtistButton.textContent = isFollowing ? "Segui già" : "Segui";
});


showMoreTracks.addEventListener("click", () => {
  tracksExpanded = !tracksExpanded;

  renderTracks(currentTracks);
});

function showArtistContent() {
  loadingMessage.classList.add("d-none");
  errorMessage.textContent = "";
  errorMessage.classList.add("d-none");
  artistContent.classList.remove("d-none");
}

function showError(message) {
  loadingMessage.classList.add("d-none");
  artistContent.classList.add("d-none");
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}