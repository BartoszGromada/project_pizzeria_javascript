/* eslint-disable linebreak-style */

import {templates, select, settings} from '../settings.js';
import {utils} from '../utils.js';

export class MainPage {
  constructor() {
    const thisMainPage = this;

    thisMainPage.renderPage();
    thisMainPage.getElements();
    thisMainPage.getData();
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
    thisMainPage.opinionsList = document.querySelector(select.containerOf.opinions);
  }
  getData() {
    const thisMainPage = this;
    
    thisMainPage.dataImage = {};
    const urlOne = settings.db.url + '/' + settings.db.gallery;
    const urlTwo = settings.db.url + '/' + settings.db.opinions;

    fetch(urlOne)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisMainPage.dataImages = parsedResponse;
        thisMainPage.renderImageList();
      });

    fetch(urlTwo)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisMainPage.dataOpinions = parsedResponse;
        thisMainPage.renderOpinionsList();
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
  renderOpinionsList() {
    const thisMainPage = this;

    const mappedOpinons = thisMainPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.opinion;
    });
    const mappedOptions = thisMainPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.options;
    });

    const opinionsConvertedToObject = Object.assign({}, mappedOpinons);
    const optionsConvertedToObject = Object.assign({}, mappedOptions);

    const opinionHTML = templates.opinions({opinion: opinionsConvertedToObject});
    const optionsHTML = templates.options({options: optionsConvertedToObject});

    thisMainPage.opinions = utils.createDOMFromHTML(opinionHTML);
    thisMainPage.options = utils.createDOMFromHTML(optionsHTML);

    thisMainPage.opinionsList.appendChild(thisMainPage.opinions);
    thisMainPage.opinionsList.appendChild(thisMainPage.options);

    thisMainPage.initSlider();
  }
  initSlider() {
    const thisMainPage = this;

    thisMainPage.circleList = document.querySelectorAll(select.main.circle);
    
    for (let circle of thisMainPage.circleList) {
      circle.addEventListener('click', function(event) {
        event.preventDefault();
        thisMainPage.changeOpinion();
        thisMainPage.changeCircle();
      });
    }
    thisMainPage.opinions = document.querySelectorAll('.opinion');
    
    let opinionNumber = 0;
    
    setInterval(function(){ 
      
      let selectOpinion = thisMainPage.opinions[opinionNumber];
      let selectCircle = thisMainPage.circleList[opinionNumber]

      selectOpinion.classList.remove('active');
      selectCircle.classList.remove('active');

      if (opinionNumber >= thisMainPage.opinions.length - 1 ) {
        opinionNumber = 0; 
      } 
      else { 
        opinionNumber += 1;
      }
      
      selectOpinion = thisMainPage.opinions[opinionNumber];
      selectCircle = thisMainPage.circleList[opinionNumber];

      selectOpinion.classList.add('active');
      selectCircle.classList.add('active');
    }, 3000);
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