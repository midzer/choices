import WrappedElement from './wrapped-element';
import { reduceToValues } from './../lib/utils';

export default class WrappedInput extends WrappedElement {
  constructor(instance, element, classNames) {
    super(instance, element, classNames);
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
  }

  getElement() {
    super.getElement();
  }

  conceal() {
    super.conceal();
  }

  reveal() {
    super.reveal();
  }

  enable() {
    super.enable();
  }

  disable() {
    super.enable();
  }

  setValue(items) {
    const itemsFiltered = reduceToValues(items);
    const itemsFilteredString = itemsFiltered.join(this.parentInstance.config.delimiter);

    this.element.setAttribute('value', itemsFilteredString);
    this.element.value = itemsFilteredString;
  }
}
