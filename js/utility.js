/*
  Funzioni condivise da tutte le pagine (homepage, album, artista).
  Va caricato PRIMA degli altri script.
*/

const searchEndpoint = 'https://striveschool-api.herokuapp.com/api/deezer/search?q='
const albumEndpoint = 'https://striveschool-api.herokuapp.com/api/deezer/album/'
const artistEndpoint = 'https://striveschool-api.herokuapp.com/api/deezer/artist/'

const getMusic = async (query) => { // Cerca brani per parola chiave, usata dalla homepage
    try {
        const response = await fetch(`${searchEndpoint}${encodeURIComponent(query)}`)

        if (!response.ok) {
            console.log(`Errore ricerca: ${response.status} ${response.statusText}`)
            return null
        }

        return await response.json()
    }
    catch (error) {
        console.log(error)
        return null
    }
}


const getAlbum = async (albumId) => {
    try {
        const response = await fetch(`${albumEndpoint}${albumId}`)

        if (!response.ok) {
            console.log(`Errore album: ${response.status} ${response.statusText}`)
            return null
        }

        const album = await response.json()

        if (album.error) {
            console.log(`Errore album: ${album.error.message}`)
            return null
        }
        return album
    }
    catch (error) {
        console.log(error)
        return null
    }
}


const getArtist = async (artistId) => {
    try {
        const response = await fetch(`${artistEndpoint}${artistId}`)

        if (!response.ok) {
            console.log(`Errore artista: ${response.status} ${response.statusText}`)
            return null
        }

        const artist = await response.json()

        if (artist.error) {
            console.log(`Errore artista: ${artist.error.message}`)
            return null
        }

        return artist
    }
    catch (error) {
        console.log(error)
        return null
    }
}

const getArtistTopTracks = async (artistId, limit) => { // I brani piu ascoltati di un artista
    try {
        const response = await fetch(`${artistEndpoint}${artistId}/top?limit=${limit}`)

        if (!response.ok) {
            console.log(`Errore brani: ${response.status} ${response.statusText}`)
            return null
        }

        return await response.json()
    }
    catch (error) {
        console.log(error)
        return null
    }
}


const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
                                                               /* padStart() */
    return `${minutes}:${seconds.toString().padStart(2, '0')}` // https://www.w3schools.com/Jsref/jsref_string_padstart.asp
}

const formatNumber = (number) => { // Separatore delle migliaia per il numero di riproduzioni
    if (typeof number !== 'number') {
        return '0'
    }

    return number.toLocaleString('it-IT')
}
