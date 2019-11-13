/* eslint-disable linebreak-style */

import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select} from '../settings.js';
import {settings} from 'cluster';

export class DataPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    
    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = thisWidget.minDate + settings.dataPicker.maxDaysInFuture;
  }
}
