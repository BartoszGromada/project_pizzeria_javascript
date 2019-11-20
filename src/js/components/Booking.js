/* eslint-disable linebreak-style */
import {templates, select, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';
import {DataPicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';

export class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  getData() {
    const thisBooking = this;

    const startDateparam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.minDate);
    const dateEndDateparam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.maxDate);

    const params = {
      booking: [
        startDateparam,
        dateEndDateparam,
      ],
      eventCurrent: [
        settings.db.notRepeatParam,
        startDateparam,
        dateEndDateparam,
      ],
      eventRepeat: [
        settings.db.repeatParam,
        dateEndDateparam,
      ],
    };
    
    const urls = {
      booking:      settings.db.url + '/' + settings.db.booking 
                                    + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' + settings.db.event 
                                    + '?' + params.eventCurrent.join('&'),
      eventRepeat:  settings.db.url + '/' + settings.db.event 
                                    + '?' + params.eventRepeat.join('&'),
    };

    console.log(urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat),
    ])
      .then(function(allResponse) {
        const bookingsResponse = allResponse[0];
        const eventCurrentResponse = allResponse[1];
        const eventRepeatResponse = allResponse[2];
        return Promise.all([
          bookingsResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventCurrent, eventRepeat]) {
        thisBooking.parseData(bookings, eventCurrent, eventRepeat);
        console.log(bookings);
        console.log(eventCurrent);
        console.log(eventRepeat);
      });
  }
  parseData(bookings, eventCurrent, eventRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      console.log(item.date);
      console.log(item.hour);
      console.log(item.duration);
      console.log(item.table);
    }

    for (let item of eventCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const maxDate = thisBooking.dataPicker.maxDate;

    for (let item of eventRepeat) {
      if (item.repeat == 'daily') {
        const itemDateParse = new Date(item.date);
        for (let loopDate = itemDateParse; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5 ) {

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.dataPicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);f

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' 
      || 
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } 
      else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector(select.booking.formSubmit);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.email = thisBooking.dom.wrapper.querySelector(select.booking.email);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.startersCheck = thisBooking.dom.wrapper.querySelectorAll(select.booking.startersCheck);
  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dataPicker = new DataPicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    });

    thisBooking.dom.submit.addEventListener('click', function() {
      event.preventDefault();
      thisBooking.sendBooking();
    });

    thisBooking.tableVerification();
  }
  tableVerification() {
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function(event) {
        event.preventDefault();
        if (table.classList.contains(classNames.booking.tableBooked)) {
          return window.alert('This table is booked, please booking another.');
        } 
        else {
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.clickedElement = event.target;
          thisBooking.tableNumber = thisBooking.clickedElement.getAttribute(settings.booking.tableIdAttribute);
        }
      });
    }
  }
  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      title: 'Boooking for ' + thisBooking.peopleAmount.value + ' person.',
      table: thisBooking.tableNumber,
      date: thisBooking.dataPicker.value,
      hour: thisBooking.hourPicker.value,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      phone: thisBooking.dom.phone.value,
      email: thisBooking.dom.email.value,
      starters: [],
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        payload.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url,options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);
        thisBooking.getData();
      });
    
  }
}