import { getWidthOfInput } from '../lib/utils';

/**
 * Input
 */
export default class Input {
  constructor(instance, element, classNames) {
    this.instance = instance;
    this.element = element;
    this.classNames = classNames;
  }

  /**
   * Set value of input to blank
   * @return {Object} Class instance
   * @public
   */
  clear(setWidth = true) {
    if (this.element.value) {
      this.element.value = '';
    }

    if (setWidth) {
      this.setWidth();
    }

    return this.instance;
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   * @return
   */
  setWidth() {
    if (this.instance.placeholder) {
      // If there is a placeholder, we only want to set the width of the input when it is a greater
      // length than 75% of the placeholder. This stops the input jumping around.
      if (
        this.element.value &&
        this.element.value.length >= (this.instance.placeholder.length / 1.25)
      ) {
        this.element.style.width = getWidthOfInput(this.element);
      }
    } else {
      // If there is no placeholder, resize input to contents
      this.element.style.width = getWidthOfInput(this.element);
    }
  }
}
