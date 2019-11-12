/* eslint-disable linebreak-style */

export class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.value = initialValue;
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseValue(value);

    if (newValue != thisWidget.value && thisWidget.isValid(newValue)) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
  parseValue(value) {
    return parseInt(value);
  }
  isValid(value) {
    return !isNaN(value) &&
      value >= settings.amountWidget.defaultMin &&
      value <= settings.amountWidget.defaultMax;
  }
}
