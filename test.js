const global = {
  currentPage: window.location.pathname,
  api: {
    apiKey: "f55051ccda6c9cf3ffe5ad9a09868743",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

async function testSlider() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}movie/now_playing?api_key=${API_KEY}&language=en-US`
  );

  const { results } = await response.json();

  hideSpinner();

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    const options = { year: "numeric", month: "long", day: "numeric" };

    div.style.background = `linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`;
    div.setAttribute("data-movie-id", movie.id);
    div.innerHTML = `
    <div class="card">
    <h5 class="card-title">${movie.title.toUpperCase()}</h5>

    <p class="releaseDate">Release : ${new Date(
      movie.release_date
    ).toLocaleDateString("default", options)}</p>
    </div>   
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);
  });

  const swiper = new Swiper(".swiper-1", {
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
    const middleSlide = swiper.slides[activeIndex];
    const movieId = middleSlide.getAttribute("data-movie-id");

    updateMovieDetails(movieId);
  });
}

async function updateMovieDetails(movieId) {
  const movieDetails = await fetchMovieDetails(movieId);

  displayMovieDetails(movieDetails);
}

async function fetchMovieDetails(movieId) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );

  return await response.json();
}

function displayMovieDetails(movieDetails) {
  const contentOverview = document.querySelector(".content-overview");
  console.log(movieDetails);
  contentOverview.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 50%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${movieDetails.backdrop_path})`;

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
      }"><i class="fa-solid fa-play"></i> &nbsp;View
          Details</a>
  </div>
  `;
}

function formatReleaseDate(dateString) {
  let date = new Date(dateString);
  console.log(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  date = date.toLocaleDateString("default", options);

  return date;
}

testSlider();

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
