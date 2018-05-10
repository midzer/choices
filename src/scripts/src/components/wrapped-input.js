import WrappedElement from './wrapped-element';
import { reduceToValues } from './../lib/utils';

export default class WrappedInput extends WrappedElement {
  constructor(instance, element, classNames) {
    super(instance, element, classNames);
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
  }

  set value(items) {
    const itemsFiltered = reduceToValues(items);
    const itemsFilteredString = itemsFiltered.join(this.parentInstance.config.delimiter);

    this.element.setAttribute('value', itemsFilteredString);
    this.element.value = itemsFilteredString;
  }

  // @todo figure out why we need this? Perhaps a babel issue
  get value() {
    return super.value;
  }
}
