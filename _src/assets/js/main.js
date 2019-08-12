'use strict';

// Selectors
const inputSearch = document.querySelector('.js-input');
const buttonSearch = document.querySelector('.js-search_btn');
const resultSlctr = document.querySelector('.result_shows');
const favShows = document.querySelector('.shows_fav');

let removeFavBtn = [];
let favShowsArray = [];
let showInfo = [];

function renderShowInfo(data) {
  showInfo = data;
  resultSlctr.innerHTML = ''; // se modifica el contenido html de la clase .result_shows(resultSlctr) para que antes de pintar los datos me lo pinte en blanco //
  let showItem;

  for (let showIndex = 0; showIndex < showInfo.length; showIndex++) {
    if (showInfo[showIndex].show.image === null) {
      showItem = `<li class="show_info" data-liindex="${showIndex}"><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV' alt="${
        showInfo[showIndex].show.name
      } class="show_image" avatar"><h3>${
        showInfo[showIndex].show.name
      }</h3></li>`;
    } else {
      showItem = `<li class="show_info" data-liindex="${showIndex}"><img src=${
        showInfo[showIndex].show.image.medium
      } alt="${showInfo[showIndex].show.name} class="show_image" avatar"><h3>${
        showInfo[showIndex].show.name
      }</h3></li>`;
    }
    resultSlctr.innerHTML += showItem;
  }
  const showInfoList = document.querySelectorAll('.show_info');
  for (let listIndex = 0; listIndex < showInfoList.length; listIndex++) {
    showInfoList[listIndex].addEventListener('click', addFavourites);
  }
}

function addFavourites(ev) {
  let clickShow = ev.currentTarget;
  favShowsArray.push(showInfo[clickShow.dataset.liindex]);
  renderFavourites();
  localStorage.setItem('favouritesShows', JSON.stringify(favShowsArray));
}

function getFromLocalStorage() {
  const localStorageFavourites = localStorage.getItem('favouritesShows');
  if (localStorageFavourites !== null) {
    favShowsArray = JSON.parse(localStorageFavourites);
    renderFavourites();
  }
}

function renderFavourites() {
  let showItem;
  favShows.innerHTML = '';
  for (
    let favouriteIndex = 0;
    favouriteIndex < favShowsArray.length;
    favouriteIndex++
  ) {
    if (favShowsArray[favouriteIndex].show.image === null) {
      showItem = `<li class="show_info" data-liindex="${favouriteIndex}"><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV' alt="${
        favShowsArray[favouriteIndex].show.name
      } class="show_image" avatar"><h3>${
        favShowsArray[favouriteIndex].show.name
      } </h3><button class="remove_fav" data-btnindex="${favouriteIndex}">x</button></li>`;
    } else {
      showItem = `<li class="show_info" data-liindex="${favouriteIndex}"><img src=${
        favShowsArray[favouriteIndex].show.image.medium
      } alt="${
        favShowsArray[favouriteIndex].show.name
      } class="show_image" avatar"><h3>${
        favShowsArray[favouriteIndex].show.name
      } </h3><button class="remove_fav" data-btnindex="${favouriteIndex}">x</button></li>`;
    }
    favShows.innerHTML += showItem;
  }
  removeFavBtn = document.querySelectorAll('.remove_fav');
  for (let btn of removeFavBtn) {
    btn.addEventListener('click', removeFav);
  }
}

// Fetch(API) //
function getUrlTv(showName) {
  fetch(`http://api.tvmaze.com/search/shows?q=${showName}`)
    .then(response => response.json())
    .then(data => renderShowInfo(data))
    // eslint-disable-next-line no-console
    .catch(error => console.log(error));
}

// función para limpiar el input
const clearInput = () => (inputSearch.value = '');

//función para busque con la tecla enter
const enterKey = evt => {
  if (evt.key === 'Enter') {
    let showName = inputSearch.value;
    getUrlTv(showName);
  }
};

// Función para eliminar favoritos
function removeFav(evt) {
  let clickRemove = parseInt(evt.currentTarget.dataset.btnindex);
  favShowsArray.splice(clickRemove, 1);
  renderFavourites();
  localStorage.setItem('favouritesShows', JSON.stringify(favShowsArray));
}

// Events Listeners //
buttonSearch.addEventListener('click', function(evt) {
  let showName = inputSearch.value;
  getUrlTv(showName);
});
inputSearch.addEventListener('click', clearInput);
inputSearch.addEventListener('keyup', enterKey);

getFromLocalStorage();
