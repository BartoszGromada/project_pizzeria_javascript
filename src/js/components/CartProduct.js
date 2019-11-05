/* eslint-disable linebreak-style */

import {select} from '../settings.js';
import {amountWidget} from './AmountWidget.js';

export class cartProduct {
  constructor (menuProduct, element) {
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
 
    thisCartProduct.getElements(element);

    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    thisCartProduct.getData();

  }
  getElements(element) {
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }
  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new amountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.amountWidget.value = thisCartProduct.amount;

    thisCartProduct.dom.amountWidget.addEventListener('updated', function() {
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amountWidget.value;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }
  remove() {
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions() {
    const thisCartProduct = this;

    thisCartProduct.dom.remove.addEventListener('click', function() {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
  getData() {
    const thisCartProduct = this;
    const payloadData = {};

    payloadData.id = thisCartProduct.name,
    payloadData.price = thisCartProduct.price,
    payloadData.pricesingle = thisCartProduct.priceSingle,
    payloadData.amount = thisCartProduct.amount,
    payloadData.params = thisCartProduct.params;

    return payloadData;
  }
}