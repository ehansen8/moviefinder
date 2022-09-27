let FILTER_FORM
let FRIEND_IDS = []
const reload_subscribers = []

if (document.querySelector('#movie-search-form')) {
  document
    .querySelector('#movie-search-form')
    .addEventListener('submit', post_form)


  document
    .querySelector('#search-btn-group')
    .addEventListener('hide.bs.dropdown', (e) => {
      const target = e.clickEvent.target.closest('button')
      if (target != null && target.id == 'search-button') {
        e.preventDefault()
      }
      
    })

  document
    .querySelector('#search-input')
    .addEventListener('input', (e) => {
      const dropdown = bootstrap.Dropdown.getOrCreateInstance(e.target)
      if (e.target.value) {

        dropdown.show()
      } else {

        dropdown.hide()
      }
    })

}

if (document.querySelector('#filter-form')) {
  FILTER_FORM = document.querySelector('#filter-form')
  FILTER_FORM.addEventListener('submit', watch_together)
}

if (document.querySelector('#friend-list')) {
  document
    .querySelector('#friend-list')
    .addEventListener('click', watch_together)
}

//'Bookmark & Rate movie is on every page'
document.addEventListener('click', bookmark_movie)
document.addEventListener('click', rate_movie)


if (document.querySelector('#recommendations')) {
  reload_subscribers.push(getRecommendations)
}

if (document.querySelector('#watchlist')) {
  reload_subscribers.push(getWatchlist)
}


let swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',

  slidesPerView: "5.5",
  //spaceBetween: 20,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]',
)
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
)

function initSwiper() {
  swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',

    slidesPerView: "5.5",
    //spaceBetween: 20,

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}

const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]',
)
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
)

function reloadSubscribers() {
  reload_subscribers.forEach(f => f())
}

async function post_form(e) {
  const spinner = document.querySelector('#search-result-spinner')
  spinner.classList.toggle('visually-hidden')
  e.preventDefault()
  e.stopPropagation()
  const url = e.target.getAttribute('data-action')
  const obj = {}
  const f = new FormData(e.target)
  f.forEach((value, key) => (obj[key] = value))
  const json = JSON.stringify(obj)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': e.target.querySelector('[name=csrfmiddlewaretoken]').value,
      'Content-Type': 'application/json',
    },
    body: json,
  })
  const body = await response.text()
  document.querySelector('#search-results').innerHTML = body
  spinner.classList.toggle('visually-hidden')

}



function watch_together(e) {
  e.preventDefault()
  let target

  if (e.type != 'submit') {
    target = e.target.closest('a')
    // Returns False if active was there and removed
    // Returns True if active was not there and was added
    const nowActive = target.classList.toggle('active')
    const friendId = target.dataset.friendId

    if (nowActive) {
      FRIEND_IDS.push(friendId)
    } else {
      FRIEND_IDS = FRIEND_IDS.filter((e) => e != friendId)
    }
  }

  getRecommendations()
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
      'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
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
}

function formToJSON(formData) {
  var object = {}
  formData.forEach((value, key) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value
      return
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]]
    }
    object[key].push(value)
  })
  return object
}
