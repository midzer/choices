export default class List {
  constructor({ element }) {
    Object.assign(this, { element });

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
  scrollTo(scrollPos = 0) {
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
