export default class Dropdown {
  constructor(instance, element, classNames) {
    this.instance = instance;
    this.element = element;
    this.classNames = classNames;
    this.dimensions = this.element.getBoundingClientRect();
    this.position = Math.ceil(this.dimensions.top + window.scrollY + this.element.offsetHeight);
    this.isActive = false;
  }

  /**
   * Determine whether to hide or show dropdown based on its current state
   * @return {Object} Class instance
   * @public
   */
  toggle() {
    if (this.isActive) {
      this.hide();
    } else {
      this.show();
    }

    return this.instance;
  }

  /**
   * Show dropdown to user by adding active state class
   * @return {Object} Class instance
   * @public
   */
  show() {
    this.element.classList.add(this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isActive = true;
    return this.instance;
  }

  /**
   * Hide dropdown from user
   * @return {Object} Class instance
   * @public
   */
  hide() {
    this.element.classList.remove(this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'false');
    this.isActive = false;
    return this.instance;
  }
}
