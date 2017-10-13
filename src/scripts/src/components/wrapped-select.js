import WrappedElement from './wrapped-element';

export default class WrappedSelect extends WrappedElement {
  constructor(instance, element, classNames) {
    super(instance, element, classNames);
    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
  }

  conceal() {
    super.conceal();
  }

  reveal() {
    super.reveal();
  }
}
