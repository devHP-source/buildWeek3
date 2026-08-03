/* Pagina "Sfoglia tutto": griglia di categorie */

const browseGrid = document.getElementById('browse-grid')

/*
  Le tinte vivono in search.css come classi .category-color-1 ... -24.
  Qui scorriamo solo i numeri: essendo 24 e non un multiplo del numero di
  colonne, due tessere vicine non ricevono mai lo stesso colore
*/
const totalCategoryColors = 24

const categoryNames = [
    'Music', 'Podcast', 'Live Events', 'Made for You',
    'New Releases', 'Sanremo Festival', 'Hip-hop', 'Pop',
    'Indie', 'Charts', 'Podcast Charts', 'Podcast New releases',
    'Video Podcasts', 'Rock', 'RADAR', 'EQUAL',
    'Mood', 'Discover', 'Dance/Electronic', 'Trending',
    'Fresh Finds', 'Mixed By', 'R&B', 'Latin',
    'In the car', 'Workout Music', 'Party', 'Gaming',
    'Decades', 'Chill', 'Love', 'Songwriters',
    'K-pop', 'Jazz', 'Student', 'Focus',
    'Anime', 'At Home', 'Sleep', 'Classical',
    'Folk & Acoustic', 'Soul', 'Country', 'TV & Films',
    'Netflix', 'Cooking & Dining', 'Travel', 'Punk',
    'Metal', 'Alternative', 'Instrumental', 'Ambient',
    'Blues', 'Caribbean', 'Nature & Noise', 'Afro',
    'Reggae', 'Funk & Disco', 'Spotify Singles', 'GLOW',
    'Wellness', 'Children & Family', 'Arab', 'Tastemakers',
]


const createCategoryCard = (name, index) => {
    const card = document.createElement('article')

    // Il colore arriva da una classe, cosi resta tutto dentro search.css
    card.classList.add('category-card', `category-color-${(index % totalCategoryColors) + 1}`)

    const title = document.createElement('h3')
    title.classList.add('category-card-title')
    title.textContent = name

    card.appendChild(title)

    return card
}


const displayCategories = () => {
    if (!browseGrid) {
        return
    }

    browseGrid.innerHTML = ''

    categoryNames.forEach((name, index) => {
        browseGrid.appendChild(createCategoryCard(name, index))
    })
}

displayCategories()