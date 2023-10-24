const global = {
  currentPage: window.location.pathname, // Get the current page URL path
  api: {
    apiKey: "f55051ccda6c9cf3ffe5ad9a09868743", // TMDB API key
    apiUrl: "https://api.themoviedb.org/3/", // TMDB API base URL
  },
};

// Function to fetch data from the TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner(); // Show loading spinner

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner(); // Hide loading spinner

  return data;
}

// Function to display the loading spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

// Function to hide the loading spinner
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Function to highlight the active navigation link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active"); // Add 'active' class to the current page's link
    }
  });
}

// Function to display the Movies page hero slider
async function displayMoviesHeroSlider() {
  const { results } = await fetchAPIData("trending/movie/day");

  results.forEach((movie) => {
    const backdropPath = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;

    const div = document.createElement("div");

    div.classList.add("swiper-slide");
    div.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 50%, transparent 100%), url(${backdropPath})`;

    div.innerHTML = `
    <div class="width-control">
        <h2 class="title">${movie.title}</h2>
        <div class="rating-releaseDate">
            <div class="rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half"></i> ${movie.vote_average.toFixed(
                  1
                )} / 10
            </div>
            <p class="releaseDate"><span>Release Date</span> : ${formatReleaseDate(
              movie.release_date
            )}</p>
        </div>
        <div class="overview">
           ${movie.overview}
        </div>
        <div class="view-details">
            <a class="btn" href="movie-details.html?id=${
              movie.id
            }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
        </div>
    </div>
    `;
    document.querySelector(".hero-section .swiper-wrapper").appendChild(div);
  });

  const swiper = new Swiper(".swiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
}
// Function to display the Shows Page hero slider
async function displayShowsHeroSlider() {
  const { results } = await fetchAPIData("trending/tv/day");

  results.forEach((show) => {
    const backdropPath = `https://image.tmdb.org/t/p/original/${show.backdrop_path}`;

    const div = document.createElement("div");

    div.classList.add("swiper-slide");
    div.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 50%, transparent 100%), url(${backdropPath})`;

    div.innerHTML = `
    <div class="width-control">
        <h2 class="title">${show.name}</h2>
        <div class="rating-releaseDate">
            <div class="rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half"></i> ${show.vote_average.toFixed(
                  1
                )} / 10
            </div>
            <p class="releaseDate"><span>First Air Date</span> : ${formatReleaseDate(
              show.first_air_date
            )}</p>
        </div>
        <div class="overview">
           ${show.overview}
        </div>
        <div class="view-details">
            <a class="btn" href="show-details.html?id=${
              show.id
            }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
        </div>
    </div>
    `;
    document.querySelector(".hero-section .swiper-wrapper").appendChild(div);
  });

  const swiper = new Swiper(".swiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
}

// Function to display a slider with five slides per view
async function fiveSlidePerViewSlider(endpoint, appendPoint) {
  const { results } = await fetchAPIData(endpoint);

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? ` <img src="http://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
        : `<img src="./Images/No image-Cinimatica.png" alt="${movie.title}"></img>`
    }
    </a>
    <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
    </h4>
    `;

    document.querySelector(appendPoint).appendChild(div);
  });

  const swiper = new Swiper(".swiper-2", {
    slidesPerView: 5,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
}

// Function to display the top-rated movies slider
async function displayTopRatedMoviesSlider() {
  fiveSlidePerViewSlider("movie/top_rated", ".top-rated .swiper-wrapper");
}
// Function to display the top-rated shows slider
async function displayTopRatedShowsSlider() {
  fiveSlidePerViewSlider("tv/top_rated", ".top-rated .swiper-wrapper");
}

// Function to display the popular movies slider
async function displayPopularMoviesSlider() {
  fiveSlidePerViewSlider("movie/popular", ".popular .swiper-wrapper");
}

// Function to display the popular shows slider
async function displayPopularShowsSlider() {
  fiveSlidePerViewSlider("tv/popular", ".popular .swiper-wrapper");
}

// Function to display the Airing Today slider
async function displayAiringTodaySlider() {
  fiveSlidePerViewSlider("tv/on_the_air", ".airing .swiper-wrapper");
}

// Function to display the vertical slider on Movies page
async function displayMoviesVerticalSlider() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.style.background = `linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`;
    div.setAttribute("data-movie-id", movie.id);
    div.innerHTML = `
    <div class="card">
    <h5 class="card-title">${movie.title.toUpperCase()}</h5>
    <p class="releaseDate">Release : ${formatReleaseDate(movie.release_date)}
    </p>
    </div>   
    `;
    document.querySelector(".grid .swiper-wrapper").appendChild(div);
  });

  const swiper = new Swiper(".swiper-3", {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    direction: "vertical",
  });

  swiper.on("slideChange", function () {
    const activeIndex = swiper.activeIndex;
    const activeSlide = swiper.slides[activeIndex];
    const movieId = activeSlide.getAttribute("data-movie-id");

    updateMovieDetails(movieId);
  });

  const initialSlide = swiper.slides[swiper.activeIndex];
  const initialMovieId = initialSlide.getAttribute("data-movie-id");
  updateMovieDetails(initialMovieId);
}

// Function to display the vertical slider on Tv shows page
async function displayShowsVerticalSlider() {
  const { results } = await fetchAPIData("tv/airing_today");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.style.background = `linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${show.poster_path})`;
    div.setAttribute("data-show-id", show.id);
    div.innerHTML = `
    <div class="card">
    <h5 class="card-title">${show.name.toUpperCase()}</h5>
    <p class="releaseDate">First Air Date : ${formatReleaseDate(
      show.first_air_date
    )}
    </p>
    </div>   
    `;
    document.querySelector(".grid .swiper-wrapper").appendChild(div);
  });

  const swiper = new Swiper(".swiper-3", {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    direction: "vertical",
  });

  swiper.on("slideChange", function () {
    const activeIndex = swiper.activeIndex;
    const activeSlide = swiper.slides[activeIndex];
    const showId = activeSlide.getAttribute("data-show-id");

    updateShowDetails(showId);
  });

  const initialSlide = swiper.slides[swiper.activeIndex];
  const initialshowId = initialSlide.getAttribute("data-show-id");
  updateShowDetails(initialshowId);
}

// Function to update movie details
async function updateMovieDetails(movieId) {
  const movieDetails = await fetchMovieDetails(movieId);
  displayMovieDetails(movieDetails);
}

// Function to update show details
async function updateShowDetails(showId) {
  const showDetails = await fetchShowDetails(showId);
  displayShowDetails(showDetails);
}

// Function to fetch movie details from the TMDB API
async function fetchMovieDetails(movieId) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );

  return response.json();
}

// Function to fetch show details from the TMDB API
async function fetchShowDetails(showId) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}tv/${showId}?api_key=${API_KEY}&language=en-US`
  );

  return response.json();
}

async function displayLatestMovie() {
  const data = await fetchAPIData("movie/now_playing");
  data.results.sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );

  const latestMovie = data.results[0];
  console.log(latestMovie);

  const latestSectionEl = document.querySelector(".latest-movie");

  latestSectionEl.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 100%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${latestMovie.poster_path})`;

  latestSectionEl.innerHTML = `
  <div class="latest-overview">
            <h2 class="title">${latestMovie.title}</h2>
            <div class="rating-releaseDate">
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star-half"></i> ${
                      latestMovie.vote_average
                    } / 10
                </div>
                <p class="releaseDate"><span>Release Date</span> ${formatReleaseDate(
                  latestMovie.release_date
                )}</p>
            </div>
            <div class="overview">
                ${latestMovie.overview}
            </div>
            <div class="view-details">
                <a class="btn" href="movie-details.html?id=${
                  latestMovie.id
                }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
            </div>

        </div>
        <div class="latest-img">
        ${
          latestMovie.poster_path
            ? ` <img src="http://image.tmdb.org/t/p/original${latestMovie.backdrop_path}" alt="${latestMovie.title}">`
            : `<img src="./Images/No image-Cinimatica.png" alt="${latestMovie.title}"></img>`
        }
        </div>
  `;
}

// Function to display movie details
function displayMovieDetails(movieDetails) {
  const contentOverview = document.querySelector(".content-overview");

  contentOverview.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 70%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${movieDetails.backdrop_path})`;
  contentOverview.style.backgroundRepeat = "no-repeat";
  contentOverview.style.backgroundSize = "cover";
  contentOverview.style.backgroundPosition = "center";
  contentOverview.style.transition = "background 1s ease-in-out";

  contentOverview.innerHTML = `
  <h2 class="title">${movieDetails.title}</h2>
  <div class="rating-releaseDate">
      <div class="rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star-half"></i> ${movieDetails.vote_average.toFixed(
            1
          )} / 10
      </div>
      <p class="releaseDate"><span>Release Date</span> : ${formatReleaseDate(
        movieDetails.release_date
      )}</p>
  </div>
  <div class="overview">
      ${movieDetails.overview}
  </div>
  <div class="view-details">
      <a class="btn" href="movie-details.html?id=${
        movieDetails.id
      }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
  </div>
  `;
}

// Function to display Show details
function displayShowDetails(showDetails) {
  const contentOverview = document.querySelector(".content-overview");

  contentOverview.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 70%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${showDetails.backdrop_path})`;
  contentOverview.style.backgroundRepeat = "no-repeat";
  contentOverview.style.backgroundSize = "cover";
  contentOverview.style.backgroundPosition = "center";
  contentOverview.style.transition = "background 1s ease-in-out";

  contentOverview.innerHTML = `
  <h2 class="title">${showDetails.name}</h2>
  <div class="rating-releaseDate">
      <div class="rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star-half"></i> ${showDetails.vote_average.toFixed(
            1
          )} / 10
      </div>
      <p class="releaseDate"><span>First Air Date</span> : ${formatReleaseDate(
        showDetails.first_air_date
      )}</p>
  </div>
  <div class="overview">
      ${showDetails.overview}
  </div>
  <div class="view-details">
      <a class="btn" href="show-details.html?id=${
        showDetails.id
      }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
  </div>
  `;
}

// Function to format the release date
function formatReleaseDate(dateString) {
  let date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  date = date.toLocaleDateString("default", options);
  return date;
}

// Initialize the application
function init() {
  switch (global.currentPage) {
    case "/index.html":
      displayTopRatedMoviesSlider();
      displayPopularMoviesSlider();
      displayMoviesHeroSlider();
      displayMoviesVerticalSlider();
      displayLatestMovie();
      break;
    case "/shows.html":
      displayShowsHeroSlider();
      displayPopularShowsSlider();
      displayTopRatedShowsSlider();
      displayAiringTodaySlider();
      displayShowsVerticalSlider();
      break;
    case "/movies.html":
      break;
    case "/search.html":
      break;
  }

  highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
