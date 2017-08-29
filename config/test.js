const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

function ignoreExtensions(extensions = [], returnValue = {}) {
  function noop() {
    return returnValue;
  }

  extensions.forEach((ext) => {
    require.extensions[ext] = noop;
  });
}

function mockStorage() {
  return {
    removeItem: function(key) {
      delete this[key];
    },
    getItem: function(key) {
      return this[key];
    },
    setItem: function(key, value) {
      this[key] = value;
    },
    clear: function() {}
  }
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
global.HTMLElement = window.HTMLElement;
global.window.localStorage = mockStorage;
global.window.sessionStorage = mockStorage;

copyProps(window, global);
ignoreExtensions(['.scss', '.css']);
ignoreExtensions(['.jpg', '.png', '.svg'], '');
