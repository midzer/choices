import WrappedElement from './wrapped-element';
import { reduceToValues } from './../lib/utils';

export default class WrappedInput extends WrappedElement {
  constructor({ element, classNames, delimiter }) {
    super({ element, classNames });
    this.delimiter = delimiter;
  }

  set value(items) {
    const itemsFiltered = reduceToValues(items);
    const itemsFilteredString = itemsFiltered.join(this.delimiter);

    this.element.setAttribute('value', itemsFilteredString);
    this.element.value = itemsFilteredString;
  }

  // @todo figure out why we need this? Perhaps a babel issue
  get value() {
    return super.value;
  }
}
