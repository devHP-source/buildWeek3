const endpoint = 'https://striveschool-api.herokuapp.com/api/deezer/search?q={query}'
//const endpointAlbum = 'https://striveschool-api.herokuapp.com/api/deezer/album/'
//const albumId = 256250622 //PROVA PER TROVARE DATI REALI


/* //FETCH MUSIC PER CAPIRE STRUTTURA
const getMusic = async()=>{
    try{
        const result = await fetch('https://striveschool-api.herokuapp.com/api/deezer/search?q=Metallica')
        const data = await result.json()
        console.log(data)
    }
    catch(error){
        console.log(error)
    }
}
getMusic()  
 */


//FETCH ALBUM SPECIFICO
const getAlbum = async(albumId)=>{
    try {
        const result = await fetch(`${endpointAlbum}${albumId}`)
        const data = await result.json()
        return(data)
    } catch (error) {
        console.log(error)
    }
}
//getAlbum(albumId) 