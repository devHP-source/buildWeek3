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
  const link = document.createElement('a')
  link.classList.add('home-card')
  link.href = `../album/album.html?id=${album.id}`

  const cover = document.createElement('img')
  cover.classList.add('home-card-cover')
  cover.src = album.cover
  cover.alt = `Copertina di ${album.title}`

  const title = document.createElement('div')
  title.classList.add('home-card-title')
  title.textContent = album.title

  const artist = document.createElement('div')
  artist.classList.add('home-card-artist')
  artist.textContent = album.artist

  link.append(cover, title, artist)

  return link
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
    const results = await Promise.all(
      homeSections.map((section) => getMusic(section.query))
    )


    const usable = results.filter((result) => result && Array.isArray(result.data))

    if (!usable.length) { // se nessuna sezione ha dati la pagina resterebbe vuota
      showHomeMessage('Non è stato possibile caricare i contenuti.') // senza spiegazione, quindi non gli diciamo l'errore
      return
    }

    homeContent.innerHTML = ''

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