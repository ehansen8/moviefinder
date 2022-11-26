let FILTER_FORM
let PAGE = 1
let FRIEND_IDS = []
const reload_subscribers = []
let holdTime = null
let holdStart = null
if (document.querySelector('#main')) {
  document.querySelector('#main').addEventListener('show.bs.modal', function (e) {
    if (holdTime > 150) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.bsTarget == "#movie-detail-modal") {
    getMovieDetail(e);
  }
});

if (document.querySelector('#movie-search-form')) {
  document.querySelector('#movie-search-form').addEventListener('submit', post_form);

  document.querySelector('#search-btn-group').addEventListener('hide.bs.dropdown', function (e) {
    var target = e.clickEvent.target.closest('button');
    if (target != null && target.id == 'search-button') {
      e.preventDefault();
    }
  });

  document.querySelector('#search-input').addEventListener('input', function (e) {
    var dropdown = bootstrap.Dropdown.getOrCreateInstance(e.target);
    if (e.target.value) {

      dropdown.show();
    } else {

      dropdown.hide();
    }
  });
}

if (document.querySelector('#filter-form')) {
  FILTER_FORM = document.querySelector('#filter-form');
  FILTER_FORM.addEventListener('submit', watch_together);
}

if (document.querySelector('#reset-filter-form')) {
  document.querySelector('#reset-filter-form').addEventListener('click', function () {
    FILTER_FORM.reset();
    getRecommendations();
  });
}

if (document.querySelector('#friend-list')) {
  document.querySelector('#friend-list').addEventListener('click', watch_together);
}

//'Bookmark & Rate movie is on every page'
document.addEventListener('click', bookmark_movie);
document.addEventListener('click', rate_movie);

if (document.querySelector('#recommendations')) {
  document.querySelector('#recommendations').addEventListener("click", function (e) {
    if (e.target.classList.contains("page-link")) {
      PAGE = e.target.dataset.page;
      reloadSubscribers();
    }
  });
}

if (document.querySelector('#recommendations')) {
  reload_subscribers.push(getRecommendations);
}

if (document.querySelector('#watchlist')) {
  reload_subscribers.push(getWatchlist);
}

var swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',

  slidesPerView: "5.5",
  //spaceBetween: 20,
  preventClicks: false,
  preventClicksPropagation: false,
  onAny: function onAny(e) {
    if (e == "touchStart") {
      holdStart = Date.now();
    }
    if (e == 'touchEnd') {
      holdTime = Date.now() - holdStart;
    }
  },


  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true
  }
});

var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = [].concat(_toConsumableArray(tooltipTriggerList)).map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

function initSwiper() {
  swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',

    slidesPerView: "5.5",
    //spaceBetween: 20,
    preventClicks: false,
    preventClicksPropagation: false,
    onAny: function onAny(e) {
      if (e == "touchStart") {
        holdStart = Date.now();
      }
      if (e == 'touchEnd') {
        holdTime = Date.now() - holdStart;
      }
    },


    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true
    }
  });
}

var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
var popoverList = [].concat(_toConsumableArray(popoverTriggerList)).map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

function reloadSubscribers() {
  reload_subscribers.forEach(function (f) {
    return f();
  });
}

function watch_together(e) {
  e.preventDefault();
  var target = void 0;

  if (e.type != 'submit') {
    target = e.target.closest('a');
    // Returns False if active was there and removed
    // Returns True if active was not there and was added
    var nowActive = target.classList.toggle('active');
    var friendId = target.dataset.friendId;

    if (nowActive) {
      FRIEND_IDS.push(friendId);
    } else {
      FRIEND_IDS = FRIEND_IDS.filter(function (e) {
        return e != friendId;
      });
    }
  }

  getRecommendations();
}

async function bookmark_movie(e) {
  // Target is link w/ rating
  const target = e.target.closest('button')

  // Whatever was clicked was not a rating button
  if (target == null || !target.classList.contains('save-movie')) {
    return
  }

  const url = target.dataset.url
  const movie_id = target.dataset.movieId

  const payload = {
    movie_id: movie_id
  }
  const json = JSON.stringify(payload)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  reloadSubscribers()
}


async function rate_movie(e) {
  // Target is link w/ rating
  const target = e.target
  const parent = target.closest('.rate-movie')

  // Whatever was clicked was not a rating button
  if (target == null || target.tagName != 'A' || !parent.classList.contains('rate-movie')) {
    return
  }

  const rating = target.dataset.rating
  const url = parent.dataset.url
  const movie_id = parent.dataset.movieId
  const payload = {
    rating: rating,
    movie_id: movie_id,
  }

  const json = JSON.stringify(payload)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      'Content-Type': 'application/json',
    },
    body: json,
  })

  reloadSubscribers()
}

async function getWatchlist() {
  const watchlist = document.querySelector('#watchlist')
  const url = watchlist.dataset.url

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    }
  })
  const body = await response.text()
  watchlist.innerHTML = body
  initSwiper()
}

async function getRecommendations() {
  const url = FILTER_FORM.dataset.url
  const jsonForm = formToJSON(new FormData(FILTER_FORM))

  const payload = {
    ids: FRIEND_IDS,
    form: jsonForm,
    page: PAGE
  }

  const json = JSON.stringify(payload)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      'Content-Type': 'application/json',
    },
    body: json,
  })

  const body = await response.text()
  const recommendations = document.querySelector('#recommendations')

  // Replace everything either way
  recommendations.innerHTML = body
  initSwiper()
  getRecommendations();
}

function formToJSON(formData) {
  var object = { genres: [] };
  formData.forEach(function (value, key) {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return object;
}
var currentModalTarget = void 0;

async function getMovieDetail(e) {
  const modalBody = document.querySelector('#movie-detail-modal .modal-body')
  const url = e.target.dataset.url

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
    }
  })
  const body = await response.text()
  modalBody.innerHTML = body
  initSwiper()
}