"use strict";

const formElement = document.querySelector(".js-form");
const inputElement = document.querySelector(".js-input");
const btnElement = document.querySelector(".js-btn");
const cardsElement = document.querySelector(".js-cards");
const favouritesElement = document.querySelector(".js-favourite-cards");

//estas varuiables son globales y van fuera de todas las funciones
//ademas siendo globales no es olbligatorio pasarlas por parametros en las funciones
let series = [];
let arrayFavourites = [];

//evitar submit por defecto al hacer enter porque no quiero enviar estos datos
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

//busqueda de serie en api/añadir la busqueda ${inputValue} en api

function getDataFromApi(inputValue) {
  fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      series = []; // para que vacieel array si quiero cambiar la busqueda
      for (const serie of data) {
        //creo un objeto con lo que me interesa
        let urlImage;
        if (serie.show.image === null) {
          urlImage =
            "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
        } else {
          urlImage = serie.show.image.medium;
        }
        let objectSerie = {
          id: serie.show.id,
          name: serie.show.name,
          image: urlImage,
        };
        series.push(objectSerie);
      }
      console.log(series);
      paintSeries();
      setInLocalStorage();
      paintFavouriteSeries();
    });
}

// local storage, solo permite guardar strings

function setInLocalStorage() {
  const stringSeries = JSON.stringify(arrayFavourites); //convierte array en string
  localStorage.setItem("favouriteSeries", stringSeries);
}

function getFromLocalStorage() {
  const localStorageFavourites = localStorage.getItem("favouriteSeries"); //recupera info de LS
  if (localStorageFavourites !== null) {
    //cada vez que pido datos hay que ver si hay o esta vacio el LS
    const arrayFavourites = JSON.parse(localStorageFavourites); //convierte string en array
    paintFavouriteSeries(arrayFavourites);
  }
}

// Listener en Evento de btn search
//let dentro para que se actualice cada vez que pulsamos btn
function handleBtn() {
  let inputValue = inputElement.value;
  getDataFromApi(inputValue);
}
btnElement.addEventListener("click", handleBtn);

//funcion pintar las series en tarjetas

function paintSeries() {
  let htmlCode = "";
  for (const serie of series) {
    htmlCode += `<li class="card__list">`;
    htmlCode += `<div class="card__list--item js-card" id="${serie.id}">`;
    htmlCode += `<h4>${serie.name}</h4>`;
    htmlCode += `<img class="card__list--img"
        src="${serie.image}"
        title="${serie.name}"
        alt="${serie.name}"/>`;
  }
  htmlCode += `</div>`;
  htmlCode += `</li>`;
  cardsElement.innerHTML = htmlCode;
  listenSeriesEvents();
}

//funcion pintar las series en tarjetas favoritas
function paintFavouriteSeries() {
  let htmlCode = "";
  htmlCode += `<button class="card__list--button-reset js-reset">Borrar todo</button>`;
  for (const favourite of arrayFavourites) {
    htmlCode += `<li class="section-favourites__cards">`;
    htmlCode += `<div class="section-favourites__cards--item" id="${favourite.id}">`;
    htmlCode += `<h4>${favourite.name}</h4>`;
    htmlCode += `<img class="section-favourites__cards--img"
            src="${favourite.image}"
            title="${favourite.name}"
            alt="${favourite.name}"/>`;
    htmlCode += `<i class="section-favourites__cards--button js-remove gg-trash" id="${favourite.id}"></i>`;
  }
  htmlCode += `</div>`;
  htmlCode += `</li>`;
  favouritesElement.innerHTML = htmlCode;
  setInLocalStorage();
  listenSeriesEvents();
  listenFavouritesEvents();
}

//clickar para añadir/quitar de series favoritas

function handleCard(event) {
  const clickedSeries = parseInt(event.currentTarget.id); //selecciono serie clickada por el id
  const favouriteFoundIndexInArrayFavourites = arrayFavourites.findIndex(
    (favourite) => favourite.id === clickedSeries
  ); //busco si está en arrayFavourites

  if (favouriteFoundIndexInArrayFavourites === -1) {
    // si no está en el array(el indice es -1 significa que no existe ese id)
    for (const serie of series) {
      if (serie.id === clickedSeries) {
        arrayFavourites.push(serie);
      }
    }
  } else {
    // si esta (el indice es diferente de -1)
    arrayFavourites.splice(favouriteFoundIndexInArrayFavourites, 1); // si esta lo quito- el quiere decir solo 1 elemento
  }
  setInLocalStorage();
  paintFavouriteSeries();
  listenSeriesEvents();
}

//listener en todas las tarjetas, escucho en todas y con FOR OF selecion la clickada
function listenSeriesEvents() {
  const cardElements = document.querySelectorAll(".js-card");
  for (const cardElement of cardElements) {
    cardElement.addEventListener("click", handleCard);
  }
}

//clickar para eliminar a series favoritas

function handleRemove(event) {
  const removedSeries = parseInt(event.currentTarget.id); //selecciono serie clickada por el id
  const favouriteFoundIndexInArrayFavourites = arrayFavourites.findIndex(
    (favourite) => favourite.id === removedSeries
  ); //busco si está en arrayFavourites
  arrayFavourites.splice(favouriteFoundIndexInArrayFavourites, 1); // lo quito,-1 quiere decir solo 1 elemento

  setInLocalStorage();
  paintFavouriteSeries();
  listenFavouritesEvents();
}

function handleReset() {
  arrayFavourites = [];
  setInLocalStorage();
  paintFavouriteSeries();
  listenFavouritesEvents();
}

function listenFavouritesEvents() {
  const favouriteElements = document.querySelectorAll(".js-remove");
  const resetElements = document.querySelector(".js-reset");
  for (const favouriteElement of favouriteElements) {
    favouriteElement.addEventListener("click", handleRemove);
  }

  resetElements.addEventListener("click", handleReset);
}

//para arrancar la aplicacion
getFromLocalStorage();
