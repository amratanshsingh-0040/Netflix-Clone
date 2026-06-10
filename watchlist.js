const IMG_URL = "https://image.tmdb.org/t/p/w500";

const watchlistGrid =
document.getElementById("watchlistGrid");

const emptyState =
document.getElementById("emptyState");

// Load Watchlist
function loadWatchlist() {

```
const watchlist =
    JSON.parse(
        localStorage.getItem("watchlist")
    ) || [];

watchlistGrid.innerHTML = "";

if (watchlist.length === 0) {

    emptyState.style.display = "block";

    return;
}

emptyState.style.display = "none";

watchlist.forEach(movie => {

    const card =
        document.createElement("div");

    card.classList.add(
        "watchlist-card"
    );

    card.innerHTML = `
        <img
            src="${IMG_URL + movie.poster_path}"
            alt="${movie.title}"
        >

        <div class="watchlist-info">

            <h3>${movie.title}</h3>

            <p>
                ⭐ ${movie.vote_average}
            </p>

            <div class="watchlist-actions">

                <button
                    class="details-btn"
                    onclick="openMovie(${movie.id})"
                >
                    Details
                </button>

                <button
                    class="remove-btn"
                    onclick="removeMovie(${movie.id})"
                >
                    Remove
                </button>

            </div>

        </div>
    `;

    watchlistGrid.appendChild(card);
});
```

}

// Open Movie Details
function openMovie(id) {

```
window.location.href =
    `movie.html?id=${id}`;
```

}

// Remove Movie
function removeMovie(id) {

```
let watchlist =
    JSON.parse(
        localStorage.getItem("watchlist")
    ) || [];

watchlist =
    watchlist.filter(
        movie => movie.id !== id
    );

localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
);

loadWatchlist();
```

}

// Clear Entire Watchlist (Optional)
function clearWatchlist() {

```
const confirmDelete =
    confirm(
        "Clear entire watchlist?"
    );

if (confirmDelete) {

    localStorage.removeItem(
        "watchlist"
    );

    loadWatchlist();
}
```

}

// Load On Page Start
loadWatchlist();