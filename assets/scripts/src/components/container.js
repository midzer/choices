/**
 * Container
 */
export default class Container {
  constructor(instance, element) {
    this.instance = instance;
    this.element = element;
    this.config = instance.config;
    this.classNames = instance.config.classNames;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
  }

  shouldFlip(dropdownPos) {
    if (!dropdownPos) {
      return false;
    }

    const body = document.body;
    const html = document.documentElement;
    const winHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );

    // If flip is enabled and the dropdown bottom position is
    // greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.config.position === 'auto') {
      shouldFlip = dropdownPos >= winHeight;
    } else if (this.config.position === 'top') {
      shouldFlip = true;
    }

    return shouldFlip;
  }

  open(dropdownPos) {
    this.element.classList.add(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    if (this.shouldFlip(dropdownPos)) {
      this.element.classList.add(this.classNames.flippedState);
      this.isFlipped = true;
    }
  }

  close() {
    this.element.classList.remove(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'false');
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      this.element.classList.remove(this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  focus() {
    this.element.classList.add(this.classNames.focusState);
    this.isFocussed = true;
  }

  blur() {
    this.element.classList.remove(this.classNames.focusState);
    this.isFocussed = false;
  }
}
