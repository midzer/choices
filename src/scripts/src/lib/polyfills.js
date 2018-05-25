import 'core-js/fn/array/from';
import 'core-js/fn/array/find';

(function CustomEventPolyfill() {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }

  function CustomEvent (event, params = { bubbles: false, cancelable: false, detail: undefined }) {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}());
