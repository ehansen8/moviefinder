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