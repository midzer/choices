import Choices from '../../assets/scripts/src/choices.js';

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

describe('Choices', function() {

    afterEach(function() {
        this.choices.destroy();
    });

    describe('should initialize Choices', function() {

        beforeEach(function() {
            this.input = document.createElement('input');
            this.input.type = "text";
            this.input.className = 'js-choices';

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
        });

        it('should be defined', function() {
            expect(this.choices).toBeDefined();
        });

        it('should have initalised', function() {
            expect(this.choices.initialised).toBe(true);
        });

        it('should have a blank state', function() {
            const blankState = {
                items: [],
                groups: [],
                choices: [],
            };
            expect(this.choices.currentState).toEqual(blankState);
        });

        it('should expose public methods', function(){
            expect(this.choices.init).toEqual(jasmine.any(Function));
            expect(this.choices.destroy).toEqual(jasmine.any(Function));
            expect(this.choices.highlightItem).toEqual(jasmine.any(Function));
            expect(this.choices.unhighlightItem).toEqual(jasmine.any(Function));
            expect(this.choices.highlightAll).toEqual(jasmine.any(Function));
            expect(this.choices.unhighlightAll).toEqual(jasmine.any(Function));
            expect(this.choices.removeItemsByValue).toEqual(jasmine.any(Function));
            expect(this.choices.removeActiveItems).toEqual(jasmine.any(Function));
            expect(this.choices.removeHighlightedItems).toEqual(jasmine.any(Function));
            expect(this.choices.showDropdown).toEqual(jasmine.any(Function));
            expect(this.choices.hideDropdown).toEqual(jasmine.any(Function));
            expect(this.choices.toggleDropdown).toEqual(jasmine.any(Function));
            expect(this.choices.setValue).toEqual(jasmine.any(Function));
            expect(this.choices.clearValue).toEqual(jasmine.any(Function));
            expect(this.choices.disable).toEqual(jasmine.any(Function));
            expect(this.choices.ajax).toEqual(jasmine.any(Function));
            expect(this.choices.clearInput).toEqual(jasmine.any(Function));
            expect(this.choices.clearInput).toEqual(jasmine.any(Function));
        });

        it('should hide passed input', function() {
            expect(this.choices.passedElement.style.display).toEqual('none');
        });

        it('should create an outer container', function() {
            expect(this.choices.containerOuter).toEqual(jasmine.any(HTMLElement));
        });

        it('should create an inner container', function() {
            expect(this.choices.containerInner).toEqual(jasmine.any(HTMLElement));
        });

        it('should create a choice list', function() {
            expect(this.choices.choiceList).toEqual(jasmine.any(HTMLElement));
        });

        it('should create an item list', function() {
            expect(this.choices.itemList).toEqual(jasmine.any(HTMLElement));
        });

        it('should create an input', function() {
            expect(this.choices.input).toEqual(jasmine.any(HTMLElement));
        });

        it('should create a dropdown', function() {
            expect(this.choices.dropdown).toEqual(jasmine.any(HTMLElement));
        });
    });

    describe('should handle text inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('input');
            this.input.type = "text";
            this.input.className = 'js-choices';
            this.input.placeholder = 'Placeholder text';

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
        });

        it('should set value via using setValue()', function() {
            this.choices.setValue(['test1', 'test2']);
            expect(this.choices.currentState.items.length).toEqual(2);
        });

        it('should accept a user inputted value', function() {
            this.choices.input.focus();
            this.choices.input.value = 'test';

            this.choices._onKeyDown({
                target: this.choices.input,
                keyCode: 13,
                ctrlKey: false
            });

            expect(this.choices.currentState.items[0].value).toContain(this.choices.input.value);
        });

        it('should copy the passed placeholder to the cloned input', function() {
            expect(this.choices.input.placeholder).toEqual(this.input.placeholder);
        })
    });

    describe('should handle single select inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = false;

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
        });
    });

    describe('should handle multiple select inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = true;

            for (var i = 1; i < 4; i++) {
                const option = document.createElement('option');

                option.value = `Value ${i}`;
                option.innerHTML = `Value ${i}`;

                if(i % 2) { 
                    option.selected = true;
                }
                
                this.input.appendChild(option);
            }

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
        });

        it('should add any pre-defined values', function() {
            expect(this.choices.currentState.items.length).toBeGreaterThan(1);
        });

        it('should add any unselected options as choices', function() {
            expect(this.choices.currentState.choices.length).toBeGreaterThan(1);
        });
    });
});
