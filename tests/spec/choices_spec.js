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
        });
    });

    describe('should handle single select inputs', function() {
        beforeEach(function() {
            this.input = document.createElement('select');
            this.input.className = 'js-choices';
            this.input.multiple = false;
            this.input.placeholder = 'Placeholder text';

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
            
            this.choices = new Choices(this.input, {
                placeholderValue: 'Placeholder text',
            });;
        });

        it('should add any pre-defined values', function() {
            expect(this.choices.currentState.items.length).toBeGreaterThan(1);
        });

        it('should add any unselected options as choices', function() {
            expect(this.choices.currentState.choices.length).toBeGreaterThan(1);
        });

        it('should add a placeholder (set in config) to the search input', function() {
            expect(this.choices.input.placeholder).toEqual('Placeholder text');
        });
    });
});
