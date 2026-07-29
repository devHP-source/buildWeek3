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

let currentTracks = [];

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
    `${API_BASE_URL}/artist/${artistId}/top?limit=5`
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

    return;
  }

  tracks.forEach((track, index) => {
    const trackRow = createTrackRow(track, index);
    popularTracks.appendChild(trackRow);
  });
}

function createTrackRow(track, index) {
  const row = document.createElement("div");
  row.classList.add("track-row");

  row.innerHTML = `
    <span class="track-position">${index + 1}</span>

    <img
      class="track-cover"
      src="${track.album.cover_small}"
      alt="Copertina di ${track.title}"
    >

    <span class="track-title">
      ${track.title}
    </span>

    <span class="track-rank">
      ${formatNumber(track.rank)}
    </span>

    <span class="track-duration">
      ${formatDuration(track.duration)}
    </span>
  `;

  row.addEventListener("click", () => {
    selectTrack(track);
  });

  return row;
}

function selectTrack(track) {
  console.log("Brano selezionato:", track);

  /*
    Qui, successivamente, collegheremo il brano
    al player presente nella parte inferiore.
  */
}

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
  artistContent.classList.remove("d-none");
}

function showError(message) {
  loadingMessage.classList.add("d-none");
  artistContent.classList.add("d-none");
  errorMessage.textContent = message;
}