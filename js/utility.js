const searchEndpoint = 'https://striveschool-api.herokuapp.com/api/deezer/search?q='
const albumEndpoint = 'https://striveschool-api.herokuapp.com/api/deezer/album/'
//const albumId = 256250622 //PROVA PER TROVARE DATI REALI


 //FETCH MUSIC PER CAPIRE STRUTTURA
const getMusic = async(query = 'Metallica')=>{
    try{
        const result = await fetch(`${searchEndpoint}${encodeURIComponent(query)}`)
        const data = await result.json()
        return(data)
    }
    catch(error){
        console.log(error)
    }
}
//getMusic()



//FETCH ALBUM SPECIFICO
const getAlbum = async(albumId)=>{
    try {
        const result = await fetch(`${albumEndpoint}${albumId}`)
        const data = await result.json()
        return(data)
    } catch (error) {
        console.log(error)
    }
}
//getAlbum(albumId)