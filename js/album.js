const params = new URLSearchParams(window.location.search)
const albumId = params.get('id')
const endpointAlbum = 'https://striveschool-api.herokuapp.com/api/deezer/album/'
//const albumId = 256250622 //PROVA PER TROVARE DATI REALI
const albumCover = document.getElementById('album-cover')
const titleElement = document.querySelector('.album-title')
const albumArtist = document.querySelector('#album-artist')
const tracklistContainer = document.getElementById('tracklist-container');
const artistAvatar = document.getElementById('artist-avatar')

// FETCH PRINCIPALE
const loadAlbumPage = async () => {
    try {
        const result = await fetch(`${endpointAlbum}${albumId}`)
        const data = await result.json()
        console.log(data)
        displayAlbumHeader(data)
        displayTracklist(data.tracks.data)

    }
    catch (error) {
        console.log(error)
    }
}


// POPOLA ALBUM HEADER
const displayAlbumHeader = (album) => {
    albumCover.src = album.cover_xl
    albumCover.alt = album.title

    titleElement.innerText = album.title
    albumArtist.innerText = album.artist.name

    artistAvatar.src = album.artist.picture_small
    artistAvatar.alt = album.artist.name
}


// POPOLA TRACKLIST
const displayTracklist = (tracks) => {
    tracklistContainer.innerHTML = ''

    tracks.forEach((track, index) => {
        const row = document.createElement('div')
        row.classList.add('row','align-items-center','text-muted','small','py-2','border-bottom','border-dark')

        const colIndex = document.createElement('div')
        colIndex.classList.add('col-auto','d-none','d-md-block','track-number')
        colIndex.innerText = index + 1

        const colInfo = document.createElement('div')
        colInfo.classList.add('col-6')

        const titleDiv = document.createElement('div')
        titleDiv.classList.add('text-white','fw-semibold','fs-6')
        titleDiv.innerText = track.title

        const artistDiv = document.createElement('div')
        artistDiv.classList.add('text-muted')
        artistDiv.innerText = track.artist.name

        colInfo.appendChild(titleDiv)
        colInfo.appendChild(artistDiv)

        const colRank = document.createElement('div')
        colRank.classList.add('col-4','text-end','d-none','d-md-block','pe-5')
        colRank.innerText = track.rank

        const colDuration = document.createElement('div')
        colDuration.classList.add('col','text-end','d-none','d-md-block','duration')
        colDuration.innerText = track.duration

        const colMobileMenu = document.createElement('div')
        colMobileMenu.classList.add('col-auto','d-md-none')

        row.append(colIndex, colInfo, colRank, colDuration, colMobileMenu)
        tracklistContainer.appendChild(row)

    })
}



loadAlbumPage()