/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import {BaseWidget} from './BaseWidget.js';
import {settings, select} from '../settings.js';
import {utils} from '../utils.js';

export class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    console.log(thisWidget.dom.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    console.log(thisWidget.dom.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
    
  }
  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.renderValue(thisWidget.value);
  }
  parseValue(value) {
    const thisWidget = this;
    console.log(value);
    thisWidget.newValue = utils.numberToHour(value);
    console.log(thisWidget.newValue);
    thisWidget.renderValue(thisWidget.newValue);
  }
  isValid() {
    return true;
  }
  renderValue(value) {
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
  }
}
