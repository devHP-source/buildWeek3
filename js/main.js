const homeContent = document.getElementById('main-content')

/*
  Le query sono nomi di artisti e non generi, la ricerca Deezer confronta i
  TITOLI dei brani, quindi cercare "rock" o "italia" e restituisce risultati
  CASUALI mentre un nome artista restituisce i suoi album veri
*/
const homeSections = [
  { title: 'Buonasera', query: 'maneskin', layout: 'tile', limit: 6 },
  { title: 'Altro di ciò che ti piace', query: 'queen', layout: 'card', limit: 5 },
]

// Album in evidenza mostrato nel banner in cima alla homepage (default)
const featuredAlbumId = 215835692


/*
  La ricerca restituisce i brani ma NON album, e più brani possono appartenere
  allo stesso album, teniamoci solo la prima occorrenza di ogni album
*/
const uniqueAlbums = (tracks, limit) => {
  const seen = []
  const albums = []

  tracks.forEach((track) => {
    if (!track.album || seen.includes(track.album.id)) {
      return
    }

    seen.push(track.album.id)

    albums.push({
      id: track.album.id,
      title: track.album.title,
      cover: track.album.cover_medium,
      artist: track.artist ? track.artist.name : '',
      artistId: track.artist ? track.artist.id : null,
    })
  })

  return albums.slice(0, limit)
}


const createTile = (album) => { // copertina piccola a sinistra, titolo accanto
  const link = document.createElement('a')
  link.classList.add('home-tile')
  link.href = `../album/album.html?id=${album.id}`

  const cover = document.createElement('img')
  cover.classList.add('home-tile-cover')
  cover.src = album.cover
  cover.alt = `Copertina di ${album.title}`

  const title = document.createElement('span')
  title.classList.add('home-tile-title')
  title.textContent = album.title

  link.append(cover, title)

  return link
}

const createCard = (album) => { // copertina sopra, titolo e artista sotto
  const card = document.createElement('article')
  card.classList.add('home-card')

  const albumLink = document.createElement('a')
  albumLink.classList.add('home-card-link')
  albumLink.href = `../album/album.html?id=${album.id}`

  const cover = document.createElement('img')
  cover.classList.add('home-card-cover')
  cover.src = album.cover
  cover.alt = `Copertina di ${album.title}`

  const title = document.createElement('div')
  title.classList.add('home-card-title')
  title.textContent = album.title

  albumLink.append(cover, title)
  card.appendChild(albumLink)

  // Senza id artista il nome resta testo semplice, non un link rotto
  if (album.artistId) {
    const artistLink = document.createElement('a')
    artistLink.classList.add('home-card-artist')
    artistLink.href = `../artist/artist.html?id=${album.artistId}`
    artistLink.textContent = album.artist

    card.appendChild(artistLink)

    return card
  }

  const artistName = document.createElement('div')
  artistName.classList.add('home-card-artist')
  artistName.textContent = album.artist

  card.appendChild(artistName)

  return card
}


// Banner dell'album in evidenza: copertina grande a sinistra, dati a destra
const createHero = (album) => {
  const hero = document.createElement('section')
  hero.classList.add('home-hero')

  const coverLink = document.createElement('a')
  coverLink.classList.add('home-hero-cover-link')
  coverLink.href = `../album/album.html?id=${album.id}`

  const cover = document.createElement('img')
  cover.classList.add('home-hero-cover')
  cover.src = album.cover_xl || album.cover_big
  cover.alt = `Copertina di ${album.title}`

  coverLink.appendChild(cover)

  const info = document.createElement('div')
  info.classList.add('home-hero-info')

  const label = document.createElement('p')
  label.classList.add('home-hero-label')
  label.textContent = 'ALBUM'

  const title = document.createElement('h1')
  title.classList.add('home-hero-title')
  title.textContent = album.title

  const artistLink = document.createElement('a')
  artistLink.classList.add('home-hero-artist')
  artistLink.href = `../artist/artist.html?id=${album.artist.id}`
  artistLink.textContent = album.artist.name

  const meta = document.createElement('p')
  meta.classList.add('home-hero-meta')
  meta.textContent = `${(album.release_date || '').slice(0, 4)} • ${album.nb_tracks} brani`

  const actions = document.createElement('div')
  actions.classList.add('home-hero-actions')

  const playLink = document.createElement('a')
  playLink.classList.add('home-hero-play')
  playLink.href = `../album/album.html?id=${album.id}`
  playLink.textContent = 'Play'

  const saveButton = document.createElement('button')
  saveButton.classList.add('home-hero-save')
  saveButton.type = 'button'
  saveButton.textContent = 'Salva'

  actions.append(playLink, saveButton)
  info.append(label, title, artistLink, meta, actions)
  hero.append(coverLink, info)

  return hero
}


const createSection = (section, albums) => {
  const wrapper = document.createElement('section')
  wrapper.classList.add('home-section')

  const heading = document.createElement('h2')
  heading.classList.add('home-section-title')
  heading.textContent = section.title

  wrapper.appendChild(heading)

  if (!albums.length) {
    const empty = document.createElement('p')
    empty.classList.add('home-section-empty')
    empty.textContent = 'Nessun contenuto disponibile al momento.'

    wrapper.appendChild(empty)

    return wrapper
  }

  const list = document.createElement('div')
  list.classList.add(section.layout === 'tile' ? 'home-tile-grid' : 'home-card-row')

  albums.forEach((album) => {
    list.appendChild(section.layout === 'tile' ? createTile(album) : createCard(album))
  })

  wrapper.appendChild(list)

  return wrapper
}


const showHomeMessage = (message) => {
  homeContent.innerHTML = ''

  const paragraph = document.createElement('p')
  paragraph.classList.add('home-message')
  paragraph.textContent = message

  homeContent.appendChild(paragraph)
}


const loadHomePage = async () => {
  showHomeMessage('Caricamento in corso...')

  try {
    const [featuredAlbum, ...results] = await Promise.all([
      getAlbum(featuredAlbumId),
      ...homeSections.map((section) => getMusic(section.query))
    ])


    const usable = results.filter((result) => result && Array.isArray(result.data))

    if (!usable.length) { // se nessuna sezione ha dati la pagina resterebbe vuota
      showHomeMessage('Non è stato possibile caricare i contenuti.') // senza spiegazione, quindi non gli diciamo l'errore
      return
    }

    homeContent.innerHTML = ''

    if (featuredAlbum) { // se il banner non arriva mostriamo comunque le sezioni
      homeContent.appendChild(createHero(featuredAlbum))
    }

    homeSections.forEach((section, index) => {
      const result = results[index]
      const tracks = result && Array.isArray(result.data) ? result.data : []

      homeContent.appendChild(createSection(section, uniqueAlbums(tracks, section.limit)))
    })
  }
  catch (error) {
    console.log(error)
    showHomeMessage('Non è stato possibile caricare i contenuti.')
  }
}

loadHomePage()