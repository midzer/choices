/* eslint-disable */

/**
 * Generates a string of random chars
 * @param  {Number} length Length of the string to generate
 * @return {String} String of random chars
 */
export const generateChars = function(length) {
  let chars = '';

  for (let i = 0; i < length; i++) {
    const randomChar = getRandomNumber(0, 36);
    chars += randomChar.toString(36);
  }

  return chars;
};

/**
 * Generates a unique id based on an element
 * @param  {HTMLElement} element Element to generate the id from
 * @param  {String} Prefix for the Id
 * @return {String} Unique Id
 */
export const generateId = function(element, prefix) {
  let id = element.id || (element.name && (`${element.name}-${generateChars(2)}`)) || generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = prefix + id;

  return id;
};

/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const getType = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isType = function(type, obj) {
  const clas = getType(obj);
  return obj !== undefined && obj !== null && clas === type;
};

/**
 * Tests to see if a passed object is an element
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isElement = o => (
  typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
  o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
);

/**
 * Merges unspecified amount of objects into new object
 * @private
 * @return {Object} Merged object of arguments
 */
export const extend = function() {
  const extended = {};
  const length = arguments.length;

  /**
   * Merge one object into another
   * @param  {Object} obj  Object to merge into extended object
   */
  const merge = function(obj) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
         if (isType('Object', obj[prop])) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
       }
    }
  };

  // Loop through each passed argument
  for (let i = 0; i < length; i++) {
    // store argument at position i
    const obj = arguments[i];

    // If we are in fact dealing with an object, merge it.
    if (isType('Object', obj)) {
      merge(obj);
    }
  }

  return extended;
};

export const wrap = function(element, wrapper) {
  wrapper = wrapper || document.createElement('div');
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }
  return wrapper.appendChild(element);
};

/**
 * Find ancestor in DOM tree
 * @param  {NodeElement} el  Element to start search from
 * @param  {[type]} cls Class of parent
 * @return {NodeElement}     Found parent element
 */
export const findAncestor = function(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
};

/**
 * Find ancestor in DOM tree by attribute name
 * @param  {NodeElement} el  Element to start search from
 * @param  {string} attr Attribute name of parent
 * @return {?NodeElement}     Found parent element or null
 */
export const findAncestorByAttrName = function(el, attr) {
  let target = el;

  while (target) {
    if (target.hasAttribute(attr)) {
      return target;
    }

    target = target.parentElement;
  }

  return null;
};

/**
 * Get the next or previous element from a given start point
 * @param  {HTMLElement} startEl    Element to start position from
 * @param  {String}      className  The class we will look through
 * @param  {Number}      direction  Positive next element, negative previous element
 * @return {[HTMLElement}           Found element
 */
export const getAdjacentEl = (startEl, className, direction = 1) => {
  if (!startEl || !className) return;

  const parent = startEl.parentNode.parentNode;
  const children = Array.from(parent.querySelectorAll(className));

  const startPos = children.indexOf(startEl);
  const operatorDirection = direction > 0 ? 1 : -1;

  return children[startPos + operatorDirection];
};

/**
 * Determine whether an element is within
 * @param  {HTMLElement} el        Element to test
 * @param  {HTMLElement} parent    Scrolling parent
 * @param  {Number} direction      Whether element is visible from above or below
 * @return {Boolean}
 */
export const isScrolledIntoView = (el, parent, direction = 1) => {
  if (!el) return;

  let isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible = (parent.scrollTop + parent.offsetHeight) >= (el.offsetTop + el.offsetHeight);
  } else {
    // In view from top
    isVisible = el.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

/**
 * Escapes html in the string
 * @param  {String} html Initial string/html
 * @return {String}  Sanitised string
 */
export const stripHTML = html =>
  html.replace(/&/g, '&amp;')
    .replace(/>/g, '&rt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');

/**
 * Get a random number between a range
 * @param  {Number} min Minimum range
 * @param  {Number} max Maximum range
 * @return {Number}     Random number
 */
export const getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Turn a string into a node
 * @param  {String} String to convert
 * @return {HTMLElement}   Converted node element
 */
export const strToEl = (function() {
  const tmpEl = document.createElement('div');
  return function(str) {
    const cleanedInput = str.trim();
    let r;
    tmpEl.innerHTML = cleanedInput;
    r = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return r;
  };
}());

/**
 * Determines the width of a passed input based on its value and passes
 * it to the supplied callback function.
 */
export const calcWidthOfInput = (input, callback) => {
  const value = input.value || input.placeholder;
  let width = input.offsetWidth;

  if (value) {
    const testEl = strToEl(`<span>${stripHTML(value)}</span>`);
    testEl.style.position = 'absolute';
    testEl.style.padding = '0';
    testEl.style.top = '-9999px';
    testEl.style.left = '-9999px';
    testEl.style.width = 'auto';
    testEl.style.whiteSpace = 'pre';

    if (document.body.contains(input) && window.getComputedStyle) {
      const inputStyle = window.getComputedStyle(input);

      if (inputStyle) {
        testEl.style.fontSize = inputStyle.fontSize;
        testEl.style.fontFamily = inputStyle.fontFamily;
        testEl.style.fontWeight = inputStyle.fontWeight;
        testEl.style.fontStyle = inputStyle.fontStyle;
        testEl.style.letterSpacing = inputStyle.letterSpacing;
        testEl.style.textTransform = inputStyle.textTransform;
        testEl.style.padding = inputStyle.padding;
      }
    }

    document.body.appendChild(testEl);

    requestAnimationFrame(() => {
      if (value && testEl.offsetWidth !== input.offsetWidth) {
        width = testEl.offsetWidth + 4;
      }

      document.body.removeChild(testEl);

      callback.call(this, `${width}px`);
    });
  } else {
    callback.call(this, `${width}px`);
  }
};

/**
 * Sorting function for current and previous string
 * @param  {String} a Current value
 * @param  {String} b Next value
 * @return {Number}   -1 for after previous,
 *                    1 for before,
 *                    0 for same location
 */
export const sortByAlpha = (a, b) => {
  const labelA = (a.label || a.value).toLowerCase();
  const labelB = (b.label || b.value).toLowerCase();

  if (labelA < labelB) return -1;
  if (labelA > labelB) return 1;
  return 0;
};

/**
 * Sort by numeric score
 * @param  {Object} a Current value
 * @param  {Object} b Next value
 * @return {Number}   -1 for after previous,
 *                    1 for before,
 *                    0 for same location
 */
export const sortByScore = (a, b) => a.score - b.score;

/**
 * Dispatch native event
 * @param  {NodeElement} element Element to trigger event on
 * @param  {String} type         Type of event to trigger
 * @param  {Object} customArgs   Data to pass with event
 * @return {Object}              Triggered event
 */
export const dispatchEvent = (element, type, customArgs = null) => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

/**
 * Tests value against a regular expression
 * @param  {string} value   Value to test
 * @return {Boolean}        Whether test passed/failed
 * @private
 */
export const regexFilter = (value, regex) => {
  if (!value || !regex) {
    return false;
  }

  const expression = new RegExp(regex.source, 'i');
  return expression.test(value);
};

export const getWindowHeight = () => {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
};

export const reduceToValues = (items, key = 'value') => {
  const values = items.reduce((prev, current) => {
    prev.push(current[key]);
    return prev;
  }, []);

  return values;
}

export const isIE11 = () => {
  return !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
};

export const existsInArray = (array, value) => {
  return array.some((item) => {
    if (isType('String', value)) {
      return item.value === value.trim();
    }

    return item.value === value;
  })
};