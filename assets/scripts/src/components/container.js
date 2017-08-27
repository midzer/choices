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
    this.isDisabled = false;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  addEventListeners() {
    this.element.addEventListener('focus', this.onFocus);
    this.element.addEventListener('blur', this.onBlur);
  }

  removeEventListeners() {
    this.element.removeEventListener('focus', this.onFocus);
    this.element.removeEventListener('blur', this.onBlur);
  }

  onFocus() {
    this.isFocussed = true;
  }

  onBlur() {
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

  setActiveDescendant(activeDescendant) {
    this.element.setAttribute('aria-activedescendant', activeDescendant);
  }

  removeActiveDescendant() {
    this.element.removeAttribute('aria-activedescendant');
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
    this.removeActiveDescendant();
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      this.element.classList.remove(this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  focus() {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  addFocusState() {
    this.element.classList.add(this.classNames.focusState);
  }

  removeFocusState() {
    this.element.classList.remove(this.classNames.focusState);
  }

  enable() {
    this.element.classList.remove(this.config.classNames.disabledState);
    this.element.removeAttribute('aria-disabled');
    if (this.instance.isSelectOneElement) {
      this.element.setAttribute('tabindex', '0');
    }
    this.isDisabled = false;
  }

  disable() {
    this.element.classList.add(this.config.classNames.disabledState);
    this.element.setAttribute('aria-disabled', 'true');
    if (this.instance.isSelectOneElement) {
      this.element.setAttribute('tabindex', '-1');
    }
    this.isDisabled = true;
  }

  addLoadingState() {
    this.element.classList.add(this.classNames.loadingState);
    this.element.setAttribute('aria-busy', 'true');
  }

  removeLoadingState() {
    this.element.classList.remove(this.classNames.loadingState);
    this.element.removeAttribute('aria-busy');
  }
}
