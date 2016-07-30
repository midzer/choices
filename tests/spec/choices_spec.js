import 'whatwg-fetch';
import 'es6-promise';
import Choices from '../../assets/scripts/src/choices.js';

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

        it('should not re-initialise if passed element again', function() {
            const reinitialise = new Choices(this.choices.passedElement);
            spyOn(reinitialise, '_createTemplates'); 
            expect(reinitialise._createTemplates).not.toHaveBeenCalled();
        })

        it('should have a blank state', function() {
            const blankState = {
                items: [],
                groups: [],
                choices: [],
            };
            expect(this.choices.currentState).toEqual(blankState);
        });

        it('should have config options', function() {
            expect(this.choices.config.items).toEqual(jasmine.any(Array));
            expect(this.choices.config.maxItemCount).toEqual(jasmine.any(Number));
            expect(this.choices.config.addItems).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.removeItems).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.removeItemButton).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.editItems).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.duplicateItems).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.delimiter).toEqual(jasmine.any(String));
            expect(this.choices.config.paste).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.search).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.regexFilter).toEqual(null);
            expect(this.choices.config.placeholder).toEqual(jasmine.any(Boolean));
            expect(this.choices.config.placeholderValue).toEqual(null);
            expect(this.choices.config.prependValue).toEqual(null);
            expect(this.choices.config.appendValue).toEqual(null);
            expect(this.choices.config.loadingText).toEqual(jasmine.any(String));
            expect(this.choices.config.classNames).toEqual(jasmine.any(Object));
            expect(this.choices.config.callbackOnInit).toEqual(jasmine.any(Function));
            expect(this.choices.config.callbackOnAddItem).toEqual(jasmine.any(Function));
            expect(this.choices.config.callbackOnRemoveItem).toEqual(jasmine.any(Function));
            expect(this.choices.config.callbackOnRender).toEqual(jasmine.any(Function));
        });

        it('should expose public methods', function() {
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
        });
    });

    describe('should handle single select inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = false;
            this.input.placeholder = 'Placeholder text';

            for (let i = 1; i < 4; i++) {
                const option = document.createElement('option');

                option.value = `Value ${i}`;
                option.innerHTML = `Value ${i}`;
                
                this.input.appendChild(option);
            }

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
        });

        it('should open the choice list on focussing', function() {
            this.choices.input.focus();
            expect(this.choices.dropdown.classList).toContain('is-active');
        });

        it('should select the first choice', function() {            
            expect(this.choices.currentState.items[0].value).toContain('Value 1');
        });

        it('should highlight the choices on keydown', function() {
            this.choices.input.focus();

            for (var i = 0; i < 2; i++) {
               // Key down to third choice
               this.choices._onKeyDown({
                   target: this.choices.input,
                   keyCode: 40,
                   ctrlKey: false,
                   preventDefault: () => {}
               });
            }

            expect(this.choices.highlightPosition).toBe(2);
        });

        it('should select choice on enter key press', function() {
            this.choices.input.focus();

            // Key down to second choice
            this.choices._onKeyDown({
                target: this.choices.input,
                keyCode: 40,
                ctrlKey: false,
                preventDefault: () => {}
            });
    
            // Key down to select choice
            this.choices._onKeyDown({
                target: this.choices.input,
                keyCode: 13,
                ctrlKey: false
            });

            expect(this.choices.currentState.items.length).toBe(2);
        });

        it('should filter choices when searching', function() {
            this.choices.input.focus();
            this.choices.input.value = 'Value 3';

            // Key down to search
            this.choices._onKeyUp({
                target: this.choices.input,
                keyCode: 13,
                ctrlKey: false
            });

            const mostAccurateResult = this.choices.currentState.choices[0];

            expect(this.choices.isSearching && mostAccurateResult.value === 'Value 3').toBeTruthy;
        });
    });

    describe('should handle multiple select inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = true;

            for (let i = 1; i < 4; i++) {
                const option = document.createElement('option');

                option.value = `Value ${i}`;
                option.innerHTML = `Value ${i}`;

                if(i % 2) { 
                    option.selected = true;
                }
                
                this.input.appendChild(option);
            }

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input, {
                placeholderValue: 'Placeholder text',
                choices: [
                    {value: 'One', label: 'Label One', selected: true, disabled: false},
                    {value: 'Two', label: 'Label Two', disabled: true},
                    {value: 'Three', label: 'Label Three'},
                ],
            });;
        });

        it('should add any pre-defined values', function() {
            expect(this.choices.currentState.items.length).toBeGreaterThan(1);
        });

        it('should add options defined in the config + pre-defined options', function() {
            expect(this.choices.currentState.choices.length).toEqual(6);
        });

        it('should add a placeholder (set in config) to the search input', function() {
            expect(this.choices.input.placeholder).toEqual('Placeholder text');
        });
    });

    describe('should handle AJAX-populated choices', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = false;
            this.input.placeholder = 'Placeholder text';

            for (let i = 1; i < 4; i++) {
                const option = document.createElement('option');

                option.value = `Value ${i}`;
                option.innerHTML = `Value ${i}`;
                
                this.input.appendChild(option);
            }

            document.body.appendChild(this.input);
            
            this.choices = new Choices(this.input);
            spyOn(this.choices, 'ajax'); 

            this.choices.ajax((callback) => {
                fetch('https://restcountries.eu/rest/v1/all')
                    .then((response) => {
                        response.json().then((data) => {
                            callback(data, 'alpha2Code', 'name');
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        });

        it('should call ajax()', function() {
            expect(this.choices.ajax).toHaveBeenCalledWith(jasmine.any(Function));
        });
    });
});
