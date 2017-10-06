import { isType } from '../lib/utils';

export default class WrappedElement {
  constructor(instance, element, classNames) {
    this.instance = instance;
    this.element = isType('String', element) ? document.querySelector(element) : element;

    if (!this.element || !['text', 'select-one', 'select-multiple'].includes(this.element.type)) {
      return false;
    }

    this.classNames = classNames;
    this.type = this.element.type;
    this.placeholder = this.element.getAttribute('placeholder');
  }

  hide() {
    // Hide passed input
    this.element.classList.add(
      this.classNames.input,
      this.classNames.hiddenState,
    );

    // Remove element from tab index
    this.element.tabIndex = '-1';

    // Backup original styles if any
    const origStyle = this.element.getAttribute('style');

    if (origStyle) {
      this.element.setAttribute('data-choice-orig-style', origStyle);
    }

    this.element.setAttribute('style', 'display:none;');
    this.element.setAttribute('aria-hidden', 'true');
    this.element.setAttribute('data-choice', 'active');
  }
}
