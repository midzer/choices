export const hasClass = (elem, className) => {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

/**
 * Capitalises the first letter of each word in a string 
 * @param  {String} str String to capitalise
 * @return {String}     Capitalised string
 */
export const capitalise = function(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isType = function(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
};

/**
 * Merges unspecified amount of objects into new object
 * @private
 * @return {Object} Merged object of arguments
 */
export const extend = function() {
    let extended = {};
    let deep = false;
    let length = arguments.length;

    /**
     * Merge one object into another
     * @param  {Object} obj  Object to merge into extended object
     */
    let merge = function (obj) {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                // If deep merge and property is an object, merge properties
                if (deep && isType('Object', obj[prop])) {
                    extended[prop] = extend( true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each passed argument
    for (let i = 0; i < length; i++) {
        // store argument at position i
        let obj = arguments[i];

        // If we are in fact dealing with an object, merge it. Otherwise throw error
        if (isType('Object', obj)) {
            merge(obj);
        } else {
            console.error('Custom options must be an object');
        }
    }

    return extended;
};

/**
 * CSS transition end event listener
 * @return
 */
export const whichTransitionEvent = function(){
    var t,
    el = document.createElement("fakeelement");

    var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
        if (el.style[t] !== undefined){
            return transitions[t];
        }
    }
}

/**
 * CSS animation end event listener
 * @return
 */
export const whichAnimationEvent = function() {
    var t,
        el = document.createElement('fakeelement');

    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
};

/**
 *  Get the ancestors of each element in the current set of matched elements, 
 *  up to but not including the element matched by the selector
 * @param  {NodeElement} elem     Element to begin search from
 * @param  {NodeElement} parent   Parent to find
 * @param  {String} selector Class to find
 * @return {Array}          Array of parent elements
 */
export const getParentsUntil = function(elem, parent, selector) {
    var parents = [];
    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {

        // Check if parent has been reached
        if (parent) {

            var parentType = parent.charAt(0);

            // If parent is a class
            if (parentType === '.') {
                if (elem.classList.contains(parent.substr(1))) {
                    break;
                }
            }

            // If parent is an ID
            if (parentType === '#') {
                if (elem.id === parent.substr(1)) {
                    break;
                }
            }

            // If parent is a data attribute
            if (parentType === '[') {
                if (elem.hasAttribute(parent.substr(1, parent.length - 1))) {
                    break;
                }
            }

            // If parent is a tag
            if (elem.tagName.toLowerCase() === parent) {
                break;
            }

        }
        if (selector) {
            var selectorType = selector.charAt(0);

            // If selector is a class
            if (selectorType === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    parents.push(elem);
                }
            }

            // If selector is an ID
            if (selectorType === '#') {
                if (elem.id === selector.substr(1)) {
                    parents.push(elem);
                }
            }

            // If selector is a data attribute
            if (selectorType === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                    parents.push(elem);
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                parents.push(elem);
            }

        } else {
            parents.push(elem);
        }
    }

    // Return parents if any exist
    if (parents.length === 0) {
        return null;
    } else {
        return parents;
    }
};

export const wrap = function (element, wrapper) {
    wrapper = wrapper || document.createElement('div');
    if (element.nextSibling) {
        element.parentNode.insertBefore(wrapper, element.nextSibling);
    } else {
        element.parentNode.appendChild(wrapper);
    }
    return wrapper.appendChild(element);
};

export const getSiblings = function (elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    for ( ; sibling; sibling = sibling.nextSibling ) {
        if ( sibling.nodeType === 1 && sibling !== elem ) {
            siblings.push( sibling );
        }
    }
    return siblings;
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
 * Debounce an event handler.
 * @param  {Function} func      Function to run after wait
 * @param  {Number} wait      The delay before the function is executed
 * @param  {Boolean} immediate  If  passed, trigger the function on the leading edge, instead of the trailing. 
 * @return {Function}           A function will be called after it stops being called for a given delay
 */
export const debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/**
 * Get an element's distance from the top of the page
 * @private
 * @param  {NodeElement} el Element to test for
 * @return {Number} Elements Distance from top of page
 */
export const getElemDistance = function(el) {
    var location = 0;
    if (el.offsetParent) {
        do {
            location += el.offsetTop;
            el = el.offsetParent;
        } while (el);
    }
    return location >= 0 ? location : 0;
};

/**
 * Determine element height multiplied by any offsets
 * @private
 * @param  {Node} el Element to test for
 * @return {Number}    Height of element
 */
export const getElementOffset = function(el, offset) {
    var elOffset = offset;
    if(elOffset > 1) elOffset = 1;
    if(elOffset > 0) elOffset = 0;

    return Math.max(el.offsetHeight*elOffset);
};

/**
 * Get scroll position based on top/bottom position
 * @private
 * @return {String} Position of scroll
 */
export const getScrollPosition = function(position) {
    if(position === 'bottom') {
        // Scroll position from the bottom of the viewport
        return Math.max((window.scrollY || window.pageYOffset) + (window.innerHeight || document.documentElement.clientHeight));
    } else {
        // Scroll position from the top of the viewport
        return (window.scrollY || window.pageYOffset);
    }
};

/**
 * Determine whether an element is within the viewport
 * @param  {Node}  el Element to test for
 * @return {String} Position of scroll
 * @return {Boolean}
 */
export const isInView = function(el, position, offset) {
    // If the user has scrolled further than the distance from the element to the top of its parent
    return this.getScrollPosition(position) > (this.getElemDistance(el) + this.getElementOffset(el, offset)) ? true : false;
};

/**
 * Remove html tags from a string
 * @param  {String}  Initial string/html
 * @return {String}  Sanitised string
 */
export const stripHTML = function(html) {
   let el = document.createElement("DIV");
   el.innerHTML = html;
   return el.textContent || el.innerText || "";
};

/** 
 * Adds animation to an element and removes it upon animation completion
 * @param  {Element} el        Element to add animation to
 * @param  {String} animation Animation class to add to element
 * @return
 */
export const addAnimation = (el, animation) => {
    let animationEvent = whichAnimationEvent();

    let removeAnimation = () => {
        el.classList.remove(animation);
        el.removeEventListener(animationEvent, removeAnimation, false);
    };

    el.classList.add(animation);
    el.addEventListener(animationEvent, removeAnimation, false);
};


/**
 * Get a random number between a range
 * @param  {Number} min Minimum range
 * @param  {Number} max Maximum range
 * @return {Number}     Random number
 */
export const getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Turn a string into a node
 * @param  {String} String to convert
 * @return {Node}   Converted node element
 */
export const strToEl = (function() {
    var tmpEl = document.createElement('div');
    return function(str) {
        var r;
        tmpEl.innerHTML = str;
        r = tmpEl.children[0];

        while (tmpEl.firstChild) {
            tmpEl.removeChild(tmpEl.firstChild);
        }

        return r;
    };
}());

/** 
 * Calculates the width of a passed input based on its value
 * @return {Number} Width of input
 */
export const getWidthOfInput = () => {
    let tmp = document.createElement('span');
    tmp.className = "tmp-element";
    tmp.innerHTML = inputEl.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    document.body.appendChild(tmp);
    let theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    return theWidth;
}