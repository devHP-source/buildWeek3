const params = new URLSearchParams(window.location.search)
const albumId = params.get('id')
const albumCover = document.getElementById('album-cover')
const titleElement = document.querySelector('.album-title')
const albumArtist = document.querySelector('#album-artist')
const tracklistContainer = document.getElementById('tracklist-container');
const artistAvatar = document.getElementById('artist-avatar')
const mainContent = document.getElementById('main-content')
const albumYear = document.getElementById('album-year')
const albumTrackCount = document.getElementById('album-track-count')
const albumDuration = document.getElementById('album-duration')


const showAlbumError = (message) => { // se il caricamente fallisce, mostra
    mainContent.innerHTML = `
        <div class="container text-center py-5">
            <p class="fs-5">${message}</p>
            <a href="../homepage/index.html" class="text-white">Torna alla homepage</a>
        </div>` // questo messaggio
}


// FETCH PRINCIPALE
const loadAlbumPage = async () => {
    if (!albumId) {
        console.log(`Nell'indirizzo della pagina manca l'ID dell'album.`)
        showAlbumError(`Nell'indirizzo della pagina manca l'ID dell'album.`)
        return
    }

    // getAlbum() sta in utility.js e registra in console il motivo preciso
    const album = await getAlbum(albumId)

    if (!album) {
        showAlbumError(`Non è stato possibile caricare l'album.`)
        return
    }

    displayAlbumHeader(album)
    displayTracklist(album.tracks.data)
}


// POPOLA ALBUM HEADER
const displayAlbumHeader = (album) => {
    albumCover.src = album.cover_xl
    albumCover.alt = album.title

    titleElement.innerText = album.title
    albumArtist.innerText = album.artist.name
    albumArtist.href = `../artist/artist.html?id=${album.artist.id}`

    artistAvatar.src = album.artist.picture_small
    artistAvatar.alt = album.artist.name

    albumYear.innerText = (album.release_date || '').slice(0, 4)     // release_date arriva come "2001-03-07" ma ci serve solo l'anno
    albumTrackCount.innerText = `${album.nb_tracks} ${album.nb_tracks === 1 ? 'brano' : 'brani'}`
    albumDuration.innerText = formatAlbumDuration(album.duration)

    document.title = `${album.title} | Spotify Clone`
}


// formatDuration() e formatNumber() arrivano da utility.js
const formatAlbumDuration = (totalSeconds) => { // Durata totale dell'album, in questo formato "53 min 20 sec"
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes} min ${seconds} sec.`
}


// POPOLA TRACKLIST
const displayTracklist = (tracks) => {
    tracklistContainer.innerHTML = ''

    tracks.forEach((track, index) => {
        const row = document.createElement('div')
        row.classList.add('row','align-items-center','text-dimmed','small','py-2','border-bottom','border-dark')

        const colIndex = document.createElement('div')
        colIndex.classList.add('col-auto','d-none','d-md-block','track-number')
        colIndex.innerText = index + 1

        const colInfo = document.createElement('div')
        colInfo.classList.add('col-6')

        const titleDiv = document.createElement('div')
        titleDiv.classList.add('text-white','fw-semibold','fs-6')
        titleDiv.innerText = track.title

        const artistDiv = document.createElement('div')
        artistDiv.classList.add('text-dimmed')
        artistDiv.innerText = track.artist.name

        colInfo.appendChild(titleDiv)
        colInfo.appendChild(artistDiv)

        const colRank = document.createElement('div')
        colRank.classList.add('col-4','text-end','d-none','d-md-block','pe-5')
        colRank.innerText = formatNumber(track.rank)

        const colDuration = document.createElement('div')
        colDuration.classList.add('col','text-end','d-none','d-md-block','duration')
        colDuration.innerText = formatDuration(track.duration)

        const colMobileMenu = document.createElement('div')
        colMobileMenu.classList.add('col-auto','d-md-none')

        row.append(colIndex, colInfo, colRank, colDuration, colMobileMenu)
        tracklistContainer.appendChild(row)

    })
}

loadAlbumPage()