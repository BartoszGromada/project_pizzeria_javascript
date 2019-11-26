/* eslint-disable linebreak-style */

import {templates, select, settings} from '../settings.js';
import {utils} from '../utils.js';

export class MainPage {
  constructor() {
    const thisMainPage = this;

    thisMainPage.renderPage();
    thisMainPage.getElements();
    thisMainPage.getData();
    thisMainPage.initSlajder();
  }
  renderPage() {
    const thisMainPage = this;
    const generatedHTML = templates.mainPage();
    thisMainPage.element = utils.createDOMFromHTML(generatedHTML);
    const MainContainer = document.querySelector(select.containerOf.mainPage);
    MainContainer.appendChild(thisMainPage.element);
  }
  getElements() {
    const thisMainPage = this;

    thisMainPage.imageList = document.querySelector(select.containerOf.image);
    thisMainPage.circleList = document.querySelectorAll(select.main.circle);
  }
  getData() {
    const thisMainPage = this;
    
    thisMainPage.dataImage = {};
    const url = settings.db.url + '/' + settings.db.gallery;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisMainPage.dataImages = parsedResponse;
        console.log('dane pobrane z API: ', thisMainPage.dataImages);
        thisMainPage.renderImageList();
      });
  }
  renderImageList() {
    const thisMainPage = this;
    const mappedImages = thisMainPage.dataImages.map(function(imageObject) {
      return imageObject.image;
    });
    const arrayConvertedToObject = Object.assign({}, mappedImages);
    const generatedHTML = templates.image({image: arrayConvertedToObject});
    thisMainPage.element = utils.createDOMFromHTML(generatedHTML);
    thisMainPage.imageList.appendChild(thisMainPage.element);
  }
  initSlajder() {
    const thisMainPage = this;

    for (let circle of thisMainPage.circleList) {
      circle.addEventListener('click', function(event) {
        event.preventDefault();
        thisMainPage.changeOpinion();
        thisMainPage.changeCircle();
      });
    }
  }
  changeOpinion() {
    const clickedElement = event.target;
    const opinonClass = clickedElement.getAttribute('data-opinion');
    const selectOpinon = document.querySelector('.' + opinonClass);
    const activeOpinion = document.querySelector('.opinion.active');
    activeOpinion.classList.remove('active');
    selectOpinon.classList.add('active');
  }
  changeCircle() {
    const clickedElement = event.target;
    const activeCircle = document.querySelector('.carusel-option .active');
    activeCircle.classList.remove('active');
    clickedElement.classList.add('active');
  }
}