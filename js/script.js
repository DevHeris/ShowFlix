// Global constants and variables
const global = {
  currentPage: window.location.pathname, // Get the current page URL path
  api: {
    apiKey: "f55051ccda6c9cf3ffe5ad9a09868743", // TMDB API key
    apiUrl: "https://api.themoviedb.org/3/", // TMDB API base URL
  },
};

// Function to fetch data from the TMDB API
async function fetchAPIData(endpoint) {
  // Retrieve API key and URL from global object
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  // Show loading spinner
  showSpinner();

  // Fetch data from the specified TMDB API endpoint
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  // Parse the response data as JSON
  const data = await response.json();

  // Hide loading spinner
  hideSpinner();

  // Return the fetched data
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
  // Get all navigation links
  const navLinks = document.querySelectorAll(".nav-link");

  // Loop through each link
  navLinks.forEach((link) => {
    // Check if the link's href matches the current page's URL
    if (link.getAttribute("href") === global.currentPage) {
      // Add 'active' class to the current page's link
      link.classList.add("active");
    }
  });
}

// Function to format the release date
function formatDate(dateString) {
  let date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  date = date.toLocaleDateString("default", options);

  return date;
}

// Function to display the hero slider (Movies or Shows)
async function displayHeroSlider(endpoint, titleKey, dateKey, urlKey) {
  // Fetch data from the specified TMDB API endpoint
  const { results } = await fetchAPIData(endpoint);

  // Loop through each item in the retrieved data
  results.forEach((item) => {
    // Create a new slider item
    const backdropPath = `https://image.tmdb.org/t/p/original/${item.backdrop_path}`;
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    // Set background image and item details
    div.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 50%, transparent 100%), url(${backdropPath})`;
    div.innerHTML = `
    <div class="width-control">
        <h2 class="title">${item[titleKey]}</h2>
        <div class="rating-releaseDate">
            <div class="rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half"></i> ${item.vote_average.toFixed(
                  1
                )} / 10
            </div>
            <p class="releaseDate"><span>${
              dateKey === "release_date" ? "Release Date" : "First Air Date"
            }</span> : ${formatDate(item[dateKey])}</p>
        </div>
        <div class="overview">
           ${item.overview}
        </div>
        <div class="view-details">
            <a class="btn" href="${urlKey}.html?id=${
      item.id
    }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
        </div>
    </div>
    `;

    // Append the item to the slider
    document.querySelector(".hero-section .swiper-wrapper").appendChild(div);
  });

  // Initialize a slider using the Swiper library
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

// Function to display a slider with multiple slides per view (Movies or Shows)
async function displaySlider(endpoint, titleKey, urlKey, slideSelector) {
  // Fetch data from the specified TMDB API endpoint
  const { results } = await fetchAPIData(endpoint);

  // Loop through each item in the retrieved data
  results.forEach((item) => {
    // Create a new slider item
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    // Set the item's details and poster image
    div.innerHTML = `
    <a href="${urlKey}.html?id=${item.id}">
    ${
      item.poster_path
        ? ` <img src="http://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item[titleKey]}">`
        : `<img src="./Images/No image-Cinimatica.png" alt="${item[titleKey]}"></img>`
    }
    </a>
    <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${item.vote_average.toFixed(
      1
    )} / 10
    </h4>
    `;

    // Append the item to the slider
    document.querySelector(slideSelector).appendChild(div);
  });

  // Initialize a slider using the Swiper library
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

async function displayVerticalSlider(
  endpoint,
  idKey,
  titleKey,
  dateKey,
  backdropKey,
  urlKey,
  type
) {
  // Fetch data from the specified TMDB API endpoint
  const { results } = await fetchAPIData(endpoint);

  // Loop through each item in the retrieved data
  results.forEach((item) => {
    // Create a new slider item
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    // Set the item's background image and details
    if (item[backdropKey]) {
      div.style.background = `linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${item[backdropKey]})`;
    } else {
      div.style.background = `linear-gradient(to top, rgba(0, 0, 0, 0.8) 30%, transparent 100%)`;
    }

    // Set a data attribute with the item's ID
    div.setAttribute(`data-${idKey}`, item.id);

    div.innerHTML = `
      <div class="card">
        <h5 class="card-title">${item[titleKey].toUpperCase()}</h5>
        <p class="releaseDate">${
          dateKey === "release_date" ? "Release" : "First Air Date"
        } : ${formatDate(item[dateKey])}</p>
      </div>
    `;

    // Append the item to the slider
    document.querySelector(".grid .swiper-wrapper").appendChild(div);

    // Add a click event listener to navigate to the details page when clicked
    div.addEventListener("click", () => {
      const itemId = item.id;
      window.location.href = `${urlKey}.html?id=${itemId}`;
    });
  });

  // Initialize a vertical slider using the Swiper library
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

  // Add an event listener to update content details when a new item is selected
  swiper.on("slideChange", function () {
    const activeIndex = swiper.activeIndex;
    const activeSlide = swiper.slides[activeIndex];
    const itemId = activeSlide.getAttribute(`data-${idKey}`);

    updateContentOverview(itemId, type);
  });

  // Get the initial active slide and update content details
  const initialSlide = swiper.slides[swiper.activeIndex];
  const initialItemId = initialSlide.getAttribute(`data-${idKey}`);

  updateContentOverview(initialItemId, type);
}

// Update content details for the selected item
async function updateContentOverview(itemId, type) {
  const details = await fetchMediaDetails(itemId, type);

  displayMediaDetails(details, type);
}

// Fetch detailed information about a movie or TV show from the TMDB API
async function fetchMediaDetails(mediaId, type) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  const mediaType = type === "movie" ? "movie" : "tv";

  // Fetch details for the specified media using its ID and type
  const response = await fetch(
    `${API_URL}${mediaType}/${mediaId}?api_key=${API_KEY}&language=en-US`
  );

  return response.json();
}

// Display detailed information about a movie or TV show in the content overview section
function displayMediaDetails(mediaDetails, type) {
  const contentOverview = document.querySelector(".content-overview");
  const isMovie = type === "movie";

  const title = isMovie ? mediaDetails.title : mediaDetails.name;
  const releaseDateKey = isMovie ? "release_date" : "first_air_date";

  // Set the background image and content details
  contentOverview.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.8) 70%, transparent 100%), url(https://image.tmdb.org/t/p/w500/${mediaDetails.backdrop_path})`;
  contentOverview.style.backgroundRepeat = "no-repeat";
  contentOverview.style.backgroundSize = "cover";
  contentOverview.style.backgroundPosition = "center";
  contentOverview.style.transition = "background 1s ease-in-out";

  // Display media details including title, rating, release date, and overview
  contentOverview.innerHTML = `
    <h2 class="title">${title}</h2>
    <div class="rating-releaseDate">
        <div class="rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class "fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half"></i> ${mediaDetails.vote_average.toFixed(
              1
            )} / 10
        </div>
        <p class="releaseDate"><span>${
          isMovie ? "Release Date" : "First Air Date"
        }</span> : ${formatDate(mediaDetails[releaseDateKey])}</p>
    </div>
    <div class="overview">
        ${mediaDetails.overview}
    </div>
    <div class="view-details">
        <a class="btn" href="${type}-details.html?id=${
    mediaDetails.id
  }"><i class="fa-solid fa-play"></i> &nbsp;View Details</a>
    </div>
  `;
}

// Function to display the latest movie
async function displayLatestMovie() {
  // Fetch data for movies currently in theaters
  const data = await fetchAPIData("movie/now_playing");

  // Sort movies by release date to get the latest one
  data.results.sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );

  // Get the latest movie
  const latestMovie = data.results[0];

  const latestSectionEl = document.querySelector(".latest-movie");

  // Set the background image and content details for the latest movie
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
                <p class="releaseDate"><span>Release Date</span> ${formatDate(
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

// Function to display media details
async function displayMediaDetailsPage(mediaType) {
  const UrlParams = window.location.search;
  const mediaId = UrlParams.split("=")[1];

  const media = await fetchMediaDetails(mediaId, mediaType);
  const isMovie = mediaType === "movie";

  displayBackgroundImage(mediaType, media.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
      <div>
        ${
          media.poster_path
            ? `<img src="http://image.tmdb.org/t/p/w500${
                media.poster_path
              }" alt="${isMovie ? media.title : media.name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${
                isMovie ? media.title : media.name
              }">`
        }
      </div>
      <div>
        <h2>${isMovie ? media.title : media.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${media.vote_average.toFixed(1)}
        </p>
        <p><span>${
          isMovie ? "Release Date" : "First Air Date"
        }</span> : ${formatDate(
    isMovie ? media.release_date : media.first_air_date
  )}</p>
        <p>
          ${media.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${media.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        <a href="${media.homepage}" target="_blank" class="btn">
          Visit ${isMovie ? "Movie" : "Show"} Homepage
        </a>
      </div>
    </div>
    <div class="details-bottom">
    <h2>${isMovie ? "Movie Info" : "Show Info"}</h2>
    <ul>
      ${
        isMovie
          ? `<li><span class="text-secondary">Budget</span> : $${addCommasToNumber(
              media.budget
            )}</li>
           <li><span class="text-secondary">Revenue</span> : $${addCommasToNumber(
             media.revenue
           )}</li>
           <li><span class="text-secondary">Runtime</span> : ${
             media.runtime
           } minutes</li>`
          : `<li><span class="text-secondary">Seasons</span> : ${media.number_of_seasons}</li>
           <li><span class="text-secondary">Number Of Episodes</span> : ${media.number_of_episodes}</li>
           <li><span class="text-secondary">Last Episode To Air</span> : Episode ${media.last_episode_to_air.episode_number} - ${media.last_episode_to_air.name}</li>`
      }
      <li><span class="text-secondary">Status</span> : ${media.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
      ${media.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}
    </div>
  </div>
  `;

  document.getElementById(`${mediaType}-details`).appendChild(div);
}

async function displaySimilarShows() {
  const UrlParams = window.location.search;
  const showId = UrlParams.split("=")[1];

  displaySlider(
    `tv/${showId}/similar`,
    "name",
    "show-details",
    ".similar .swiper-wrapper"
  );
}

// Display Backdrop on Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overLayDiv = document.createElement("div");

  overLayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overLayDiv.style.backgroundSize = "cover";
  overLayDiv.style.backgroundPosition = "center";
  overLayDiv.style.backgroundRepeat = "no-repeat";
  overLayDiv.style.height = "120vh";
  overLayDiv.style.width = "100vw";
  overLayDiv.style.position = "absolute";
  overLayDiv.style.top = "5em";
  overLayDiv.style.left = "0";
  overLayDiv.style.zIndex = "-1";
  overLayDiv.style.opacity = "0.2";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overLayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overLayDiv);
  }
}

// sfc /scannow

// Formatting Numbers
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the application
function init() {
  // Determine the current page and display content accordingly
  switch (global.currentPage) {
    case "/index.html":
      displayHeroSlider(
        "trending/movie/day",
        "title",
        "release_date",
        "movie-details"
      );
      displaySlider(
        "movie/top_rated",
        "title",
        "movie-details",
        ".top-rated .swiper-wrapper"
      );
      displaySlider(
        "movie/popular",
        "title",
        "movie-details",
        ".popular .swiper-wrapper"
      );
      displayVerticalSlider(
        "movie/now_playing",
        "movie-id",
        "title",
        "release_date",
        "poster_path",
        "movie-details",
        "movie"
      );
      displayLatestMovie();
      break;
    case "/shows.html":
      displayHeroSlider(
        "trending/tv/day",
        "name",
        "first_air_date",
        "show-details"
      );
      displaySlider(
        "tv/top_rated",
        "name",
        "show-details",
        ".top-rated .swiper-wrapper"
      );
      displaySlider(
        "tv/popular",
        "name",
        "show-details",
        ".popular .swiper-wrapper"
      );
      displaySlider(
        "tv/on_the_air",
        "name",
        "show-details",
        ".airing .swiper-wrapper"
      );
      displayVerticalSlider(
        "tv/airing_today",
        "show-id",
        "name",
        "first_air_date",
        "poster_path",
        "show-details",
        "show"
      );
      break;
    case "/movie-details.html":
      displayMediaDetailsPage("movie");

      break;
    case "/show-details.html":
      displayMediaDetailsPage("show");
      displaySimilarShows();
      break;
    case "/search.html":
      break;
  }

  // Highlight the active navigation link
  highlightActiveLink();
}

// Add a listener to run the initialization when the DOM is ready
document.addEventListener("DOMContentLoaded", init);
