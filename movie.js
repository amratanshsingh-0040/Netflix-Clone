const API_KEY = "db98ef37f98fdceb034eb3c3bdb6f6de";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieId = new URLSearchParams(
    window.location.search
).get("id");

let currentMovie = null;

// Load Movie Details
async function loadMovieDetails() {

    try {

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
        );

        const movie = await response.json();

        currentMovie = movie;

        document.getElementById(
            "moviePoster"
        ).src = IMG_URL + movie.poster_path;

        document.getElementById(
            "movieTitle"
        ).textContent = movie.title;

        document.getElementById(
            "movieRating"
        ).textContent = `⭐ ${movie.vote_average}`;

        document.getElementById(
            "movieReleaseDate"
        ).textContent = movie.release_date;

        document.getElementById(
            "movieRuntime"
        ).textContent = `${movie.runtime} mins`;

        document.getElementById(
            "movieOverview"
        ).textContent = movie.overview;

    } catch (error) {

        console.error(
            "Failed to load movie details",
            error
        );
    }
}

// Load Cast
async function loadCast() {

    try {

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );

        const data = await response.json();

        const castGrid =
            document.getElementById("castGrid");

        castGrid.innerHTML = "";

        data.cast
            .slice(0, 8)
            .forEach(actor => {

                if (!actor.profile_path) return;

                const card =
                    document.createElement("div");

                card.classList.add(
                    "cast-card"
                );

                card.innerHTML = `
                    <img
                        src="${IMG_URL + actor.profile_path}"
                        alt="${actor.name}"
                    >

                    <h4>
                        ${actor.name}
                    </h4>
                `;

                castGrid.appendChild(card);
            });

    } catch (error) {

        console.error(
            "Failed to load cast",
            error
        );
    }
}

// Add To Watchlist
document
    .getElementById("watchlistBtn")
    .addEventListener("click", () => {

        if (!currentMovie) return;

        let watchlist =
            JSON.parse(
                localStorage.getItem(
                    "watchlist"
                )
            ) || [];

        const exists =
            watchlist.find(
                item =>
                    item.id === currentMovie.id
            );

        if (!exists) {

            watchlist.push(
                currentMovie
            );

            localStorage.setItem(
                "watchlist",
                JSON.stringify(
                    watchlist
                )
            );

            alert(
                "Added To Watchlist"
            );

        } else {

            alert(
                "Already In Watchlist"
            );
        }
    });

// Watch Trailer
document
    .getElementById("trailerBtn")
    .addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
                    );

                const data =
                    await response.json();

                const trailer =
                    data.results.find(
                        video =>
                            video.type ===
                            "Trailer"
                    );

                if (trailer) {

                    window.open(
                        `https://www.youtube.com/watch?v=${trailer.key}`,
                        "_blank"
                    );

                } else {

                    alert(
                        "Trailer Not Available"
                    );
                }

            } catch (error) {

                console.error(
                    "Trailer Error",
                    error
                );
            }
        }
    );

// Initialize
loadMovieDetails();
loadCast();
