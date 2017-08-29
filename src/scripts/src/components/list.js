export default class List {
  constructor(instance, element) {
    this.instance = instance;
    this.element = element;
    this.classNames = this.instance.config.classNames;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
    this.hasChildren = !!this.element.children;
  }

  /**
   * Clear List contents
   */
  clear() {
    this.element.innerHTML = '';
  }

  /**
   * Scroll to passed position on Y axis
   */
  scrollTo(scrollPos) {
    this.element.scrollTop = scrollPos;
  }

  /**
   * Append node to element
   */
  append(node) {
    this.element.appendChild(node);
  }

  /**
   * Find element that matches passed selector
   * @return {HTMLElement}
  */
  getChild(selector) {
    return this.element.querySelector(selector);
  }
}
