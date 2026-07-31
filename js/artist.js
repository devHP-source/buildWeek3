const API_BASE_URL =
  "https://striveschool-api.herokuapp.com/api/deezer";

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

// Ne scarichiamo 10 ma ne mostriamo 5: "Visualizza altro" rivela gli altri
// senza dover rifare una richiesta.
const TRACKS_PREVIEW = 5;

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

  try {
    const [artist, tracksResponse] = await Promise.all([
      fetchArtist(artistId),
      fetchArtistTopTracks(artistId)
    ]);

    currentTracks = tracksResponse.data || [];

    renderArtist(artist);
    renderTracks(currentTracks);
    showArtistContent();
  } catch (error) {
    console.error("Errore durante il caricamento:", error);

    showError(
      "Non è stato possibile caricare l'artista. Controlla la console."
    );
  }
}

async function fetchArtist(artistId) {
  const response = await fetch(
    `${API_BASE_URL}/artist/${artistId}`
  );

  if (!response.ok) {
    throw new Error(
      `Errore artista: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

async function fetchArtistTopTracks(artistId) {
  const response = await fetch(
    `${API_BASE_URL}/artist/${artistId}/top?limit=10`
  );

  if (!response.ok) {
    throw new Error(
      `Errore brani: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
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

  // Se non c'è nulla da rivelare nascondiamo il pulsante,
  // invece di lasciarlo visibile e inerte.
  if (tracks.length <= TRACKS_PREVIEW) {
    showMoreTracks.classList.add("d-none");

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

function formatNumber(number) {
  if (typeof number !== "number") {
    return "0";
  }

  return number.toLocaleString("it-IT");
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

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