/* eslint-disable linebreak-style */
import {templates, select} from '../settings.js';
import {utils} from '../utils.js';
import { amountWidget } from './AmountWidget.js';

export class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = [];
    thisBooking.dom.wrapper = element;
    
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    const bookingWrapper = document.querySelector(select.containerOf.booking);
    bookingWrapper.appendChild(thisBooking.dom.wrapper);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
  }
}
