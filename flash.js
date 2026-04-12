// 1. THE ADDRESS BOOK
// Create a variable to hold the Kitsu URL string.
// Create an empty Array [] called 'myVault' to store saved anime.

// 2. THE FETCHER (The Engine)
// Write an 'async' function. Inside:
// - Create a 'response' variable and 'await' a fetch to your URL.
// - Create a 'data' variable and 'await' the response.json().
// - Take that data and send it to your 'Painter' function below.

// 3. THE PAINTER (Displaying Cards)
// Write a function that takes 'animeList' as a parameter.
// - Find your HTML grid ID.
// - Clear the grid (grid.innerHTML = "").
// - Use .forEach() to loop through the list.
// - For each anime, create a <div>.
// - Set the div's .innerHTML to show the Title and Image.
// - Create an "Add" button and give it an Event Listener.
// - Put the div into the grid (appendChild).

// 4. THE VAULT LOGIC (Saving/Deleting)
// Write a function to 'addToVault'.
// - It should .push() the anime into your 'myVault' array.
// - Then call a function to refresh the Watchlist on the screen.

// Write a function to 'removeFromVault'.
// - Use .filter() to keep everything EXCEPT the one you clicked.
// - Refresh the screen.

const KITSU_URL = "https://kitsu.io/api/edge/trending/anime";

let myVault = [];

async function getTrending() {
    const response = await fetch(KITSU_URL);
    const dataSet = await response.json();
    const animeArray = dataSet.data;
    renderAnimeCards(animeArray);
}

getTrending();

// (a.) GET THE TRENDING ANIMES
function renderAnimeCards(animes) {
    const grid = document.getElementById('anime-render-grid');
    grid.innerHTML = '';

    animes.forEach(anime => {
        const title = anime.attributes.canonicalTitle;
        const poster = anime.attributes.posterImage.medium;
        const rating = anime.attributes.averageRating || "N/A";

        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <h3>${title}</h3>
            <p>Rating: ⭐${rating}</p>
            <button class="add-btn">Add to Vault</button>
        `;
        grid.appendChild(card);

        const addBtn = card.querySelector('.add-btn');
        addBtn.addEventListener('click', () => addToVault(anime));
    });
}

// (b.) SEARCH FOR ANY ANIME
async function searchAnime(query) {
    try {
        const SEARCH_URL = `https://kitsu.io/api/edge/anime?filter[text]=${query}`;
        const response = await fetch(SEARCH_URL);
        const dataSet = await response.json();
        
        // We reuse your rendering function to update the grid!
        renderAnimeCards(dataSet.data); 
    } catch (error) {
        console.error("Search failed:", error);
    }
}

// [ii.] Target the search imput/button.
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

// Logic for clicking the magnifying glass icon
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) searchAnime(query);
});

// Logic for hitting 'Enter' while typing
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query) searchAnime(query);
    }
});

// (c.) ADD ANIME (POST simulation)
function addToVault(anime) {
    // Check if it's already in there so we don't have duplicates
    const exists = myVault.find(item => item.id === anime.id);
    if (!exists) {
        myVault.push(anime);
        console.log("Vault Updated:", myVault);
        // This is where you'd call a function to show the list in your 'My Watchlist' section
    }
}

// (d.) REMOVE ANIME (DELETE simulation)
function removeFromVault(id) {
    // Keep every anime EXCEPT the one with this ID
    myVault = myVault.filter(item => item.id !== id);
    renderVault();
}

// (e.) DISPLAY THE VAULT/WATCHLIST
function renderVault() {
    const vaultList = document.getElementById('vault-list');
    vaultList.innerHTML = ''; // Clear the old list

    myVault.forEach(item => {
        const vaultItem = document.createElement('div');
        vaultItem.className = 'vault-card'; // Give it a specific class for CSS
        vaultItem.innerHTML = `
            <h4>${item.attributes.canonicalTitle}</h4>
            <button onclick="removeFromVault('${item.id}')">Remove</button>
        `;
        vaultList.appendChild(vaultItem);
    });
}