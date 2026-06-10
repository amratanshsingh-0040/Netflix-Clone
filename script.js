const API_KEY = "PASTE_YOUR_REAL_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const trendingMovies = document.getElementById("trendingMovies");
const popularMovies = document.getElementById("popularMovies");
const topRatedMovies = document.getElementById("topRatedMovies");
const upcomingMovies = document.getElementById("upcomingMovies");
const searchResults = document.getElementById("searchResults");

const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("bannerTitle");
const bannerDescription = document.getElementById("bannerDescription");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loader = document.getElementById("loader");

let currentPage = 1;
let isLoading = false;

console.log("Netflix Clone Started");

// Loader
function showLoader() {
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    if (loader) loader.style.display = "none";
}

// Fetch Movies
async function fetchMovies(url) {

    try {

        showLoader();

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();

        hideLoader();

        return data.results || [];

    } catch (error) {

        console.error("Fetch Error:", error);

        hideLoader();

        return [];
    }
}

// Create Movie Card
function createMovieCard(movie) {

    const card = document.createElement("div");

    card.classList.add("movie-card");

    card.innerHTML = `
        <img
            src="${IMG_URL}${movie.poster_path}"
            alt="${movie.title}"
        >

        <div class="movie-info">
            <h4>${movie.title}</h4>
            <p class="movie-rating">
                ⭐ ${movie.vote_average.toFixed(1)}
            </p>
        </div>
    `;

    card.addEventListener("click", () => {

        window.location.href =
            `movie.html?id=${movie.id}`;

    });

    return card;
}

// Render Movies
function renderMovies(movies, container) {

    if (!container) return;

    container.innerHTML = "";

    if (!movies.length) {

        container.innerHTML =
            "<p>No movies found</p>";

        return;
    }

    movies.forEach(movie => {

        if (movie.poster_path) {

            container.appendChild(
                createMovieCard(movie)
            );
        }
    });
}

// Append Movies
function appendMovies(movies, container) {

    if (!container) return;

    movies.forEach(movie => {

        if (movie.poster_path) {

            container.appendChild(
                createMovieCard(movie)
            );
        }
    });
}

// Banner
function setBanner(movie) {

    if (!movie) return;

    banner.style.backgroundImage =
        `url(${IMG_URL}${movie.backdrop_path})`;

    bannerTitle.textContent =
        movie.title;

    bannerDescription.textContent =
        movie.overview ||
        "No description available.";
}

// Load Home Page
async function loadHomePage() {

    const trending = await fetchMovies(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );

    renderMovies(
        trending,
        trendingMovies
    );

    if (trending.length) {

        const randomMovie =
            trending[
                Math.floor(
                    Math.random() *
                    trending.length
                )
            ];

        setBanner(randomMovie);
    }

    const popular = await fetchMovies(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );

    renderMovies(
        popular,
        popularMovies
    );

    const topRated = await fetchMovies(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
    );

    renderMovies(
        topRated,
        topRatedMovies
    );

    const upcoming = await fetchMovies(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
    );

    renderMovies(
        upcoming,
        upcomingMovies
    );
}

// Search Movies
async function searchMovies(query) {

    if (!query.trim()) return;

    const movies = await fetchMovies(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    renderMovies(
        movies,
        searchResults
    );

    searchResults.scrollIntoView({
        behavior: "smooth"
    });
}

// Search Button
if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchMovies(
                searchInput.value
            );
        }
    );
}

// Enter Key Search
if (searchInput) {

    searchInput.addEventListener(
        "keypress",
        (e) => {

            if (e.key === "Enter") {

                searchMovies(
                    searchInput.value
                );
            }
        }
    );
}

// Genre Filters
const genreButtons =
    document.querySelectorAll(
        ".genre-btn"
    );

genreButtons.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            const genreId =
                button.dataset.genre;

            const movies =
                await fetchMovies(
                    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
                );

            renderMovies(
                movies,
                searchResults
            );

            searchResults.scrollIntoView({
                behavior: "smooth"
            });
        }
    );
});

// Infinite Scroll
window.addEventListener(
    "scroll",
    async () => {

        if (isLoading) return;

        if (
            window.innerHeight +
            window.scrollY >=
            document.body.offsetHeight - 400
        ) {

            isLoading = true;

            currentPage++;

            const movies =
                await fetchMovies(
                    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`
                );

            appendMovies(
                movies,
                popularMovies
            );

            isLoading = false;
        }
    }
);

// Initialize
loadHomePage();