const params = new URLSearchParams(window.location.search)
const albumId = params.get('id')
const endpointAlbum = 'https://striveschool-api.herokuapp.com/api/deezer/album/'
//const albumId = 256250622 //PROVA PER TROVARE DATI REALI


const loadAlbumPage = async () => {
    try {
        const result = await fetch(`${endpointAlbum}${albumId}`)
        const data = await result.json()
        console.log(data)

    }
    catch (error) {
        console.log(error)
    }
}
loadAlbumPage()
