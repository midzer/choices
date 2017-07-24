import 'whatwg-fetch';
import 'es6-promise';
import 'core-js/fn/object/assign';
import { expect } from 'chai';

import Choices from './choices.js';
import itemReducer from './reducers/items.js';
import choiceReducer from './reducers/choices.js';
import {
  addItem as addItemAction,
  addChoice as addChoiceAction
} from './actions/actions.js';

describe('Choices', () => {
  describe('should initialize Choices', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should be defined', () => {
      expect(instance).not.be.undefined;
    });

    it('should have initialised', () => {
      expect(instance.initialised).to.be.true;
    });

    it('should not re-initialise if passed element again', () => {
      const reinitialise = new Choices(instance.passedElement);
      spyOn(reinitialise, '_createTemplates');
      expect(reinitialise._createTemplates).not.toHaveBeenCalled();
    });

    it('should have a blank state', () => {
      expect(instance.currentState.items.length).to.equal(0);
      expect(instance.currentState.groups.length).to.equal(0);
      expect(instance.currentState.choices.length).to.equal(0);
    });

    it('should have config options', () => {
      expect(instance.config.silent).to.be.a('boolean');
      expect(instance.config.items).to.be.an('array');
      expect(instance.config.choices).to.be.an('array');
      expect(instance.config.renderChoiceLimit).to.be.a('number');
      expect(instance.config.maxItemCount).to.be.a('number');
      expect(instance.config.addItems).to.be.a('boolean');
      expect(instance.config.removeItems).to.be.a('boolean');
      expect(instance.config.removeItemButton).to.be.a('boolean');
      expect(instance.config.editItems).to.be.a('boolean');
      expect(instance.config.duplicateItems).to.be.a('boolean');
      expect(instance.config.delimiter).to.be.a('string');
      expect(instance.config.paste).to.be.a('boolean');
      expect(instance.config.searchEnabled).to.be.a('boolean');
      expect(instance.config.searchChoices).to.be.a('boolean');
      expect(instance.config.searchFloor).to.be.a('number');
      expect(instance.config.searchResultLimit).to.be.a('number');
      // expect(instance.config.searchFields).to.equal(jasmine.any(Array) || jasmine.any(String));
      expect(instance.config.position).to.be.a('string');
      expect(instance.config.regexFilter).to.be.null;
      expect(instance.config.sortFilter).to.be.a('function');
      expect(instance.config.shouldSort).to.be.a('boolean');
      expect(instance.config.shouldSortItems).to.be.a('boolean');
      expect(instance.config.placeholder).to.be.a('boolean');
      expect(instance.config.placeholderValue).to.be.null;
      expect(instance.config.prependValue).to.be.null;
      expect(instance.config.appendValue).to.be.null;
      expect(instance.config.renderSelectedChoices).to.be.a('string');
      expect(instance.config.loadingText).to.be.a('string');
      expect(instance.config.noResultsText).to.be.a('string');
      expect(instance.config.noChoicesText).to.be.a('string');
      expect(instance.config.itemSelectText).to.be.a('string');
      expect(instance.config.classNames).to.be.an('object');
      expect(instance.config.callbackOnInit).to.be.null;
      expect(instance.config.callbackOnCreateTemplates).to.be.null;
    });

    it('should expose public methods', () => {
      expect(instance.init).to.be.a('function');
      expect(instance.destroy).to.be.a('function');
      expect(instance.render).to.be.a('function');
      expect(instance.renderGroups).to.be.a('function');
      expect(instance.renderItems).to.be.a('function');
      expect(instance.renderChoices).to.be.a('function');
      expect(instance.highlightItem).to.be.a('function');
      expect(instance.unhighlightItem).to.be.a('function');
      expect(instance.highlightAll).to.be.a('function');
      expect(instance.unhighlightAll).to.be.a('function');
      expect(instance.removeItemsByValue).to.be.a('function');
      expect(instance.removeActiveItems).to.be.a('function');
      expect(instance.removeHighlightedItems).to.be.a('function');
      expect(instance.showDropdown).to.be.a('function');
      expect(instance.hideDropdown).to.be.a('function');
      expect(instance.toggleDropdown).to.be.a('function');
      expect(instance.getValue).to.be.a('function');
      expect(instance.setValue).to.be.a('function');
      expect(instance.setValueByChoice).to.be.a('function');
      expect(instance.setChoices).to.be.a('function');
      expect(instance.disable).to.be.a('function');
      expect(instance.enable).to.be.a('function');
      expect(instance.ajax).to.be.a('function');
      expect(instance.clearStore).to.be.a('function');
      expect(instance.clearInput).to.be.a('function');
    });

    it('should hide passed input', () => {
      expect(instance.passedElement.style.display).to.equal('none');
    });

    it('should create an outer container', () => {
      expect(instance.containerOuter).to.equal(jasmine.any(HTMLElement));
    });

    it('should create an inner container', () => {
      expect(instance.containerInner).to.equal(jasmine.any(HTMLElement));
    });

    it('should create a choice list', () => {
      expect(instance.choiceList).to.equal(jasmine.any(HTMLElement));
    });

    it('should create an item list', () => {
      expect(instance.itemList).to.equal(jasmine.any(HTMLElement));
    });

    it('should create an input', () => {
      expect(instance.input).to.equal(jasmine.any(HTMLElement));
    });

    it('should create a dropdown', () => {
      expect(instance.dropdown).to.equal(jasmine.any(HTMLElement));
    });

    it('should backup and recover original styles', function () {
      const origStyle = 'background-color: #ccc; margin: 5px padding: 10px;';

      instance.destroy();
      input.setAttribute('style', origStyle);
      instance = new Choices(input);

      let style = input.getAttribute('data-choice-orig-style');
      expect(style).to.equal(origStyle);

      instance.destroy();
      style = input.getAttribute('data-choice-orig-style');
      expect(style).toBeNull();

      style = input.getAttribute('style');
      expect(style).to.equal(origStyle);
    });
  });

  describe('should accept text inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should accept a user inputted value', () => {
      instance = new Choices(input);

      instance.input.focus();
      instance.input.value = 'test';

      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      expect(instance.currentState.items[0].value).toContain(instance.input.value);
    });

    it('should copy the passed placeholder to the cloned input', () => {
      instance = new Choices(input);

      expect(instance.input.placeholder).to.equal(input.placeholder);
    });

    it('should not allow duplicates if duplicateItems is false', () => {
      instance = new Choices(input, {
        duplicateItems: false,
        items: ['test 1'],
      });

      instance.input.focus();
      instance.input.value = 'test 1';

      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      expect(instance.currentState.items[instance.currentState.items.length - 1]).not.toContain(instance.input.value);
    });

    it('should filter input if regexFilter is passed', () => {
      instance = new Choices(input, {
        regexFilter: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      });

      instance.input.focus();
      instance.input.value = 'josh@joshuajohnson.co.uk';

      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      instance.input.focus();
      instance.input.value = 'not an email address';

      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      const lastItem = instance.currentState.items[instance.currentState.items.length - 1];

      expect(lastItem.value).to.equal('josh@joshuajohnson.co.uk');
      expect(lastItem.value).not.to.equal('not an email address');
    });

    it('should prepend and append values if passed', () => {
      instance = new Choices(input, {
        prependValue: 'item-',
        appendValue: '-value',
      });

      instance.input.focus();
      instance.input.value = 'test';

      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      const lastItem = instance.currentState.items[instance.currentState.items.length - 1];

      expect(lastItem.value).not.to.equal('test');
      expect(lastItem.value).to.equal('item-test-value');
    });
  });

  describe('should accept single select inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Label ${i}`;

        input.appendChild(option);
      }

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should open the choice list on focusing', () => {
      instance = new Choices(input);
      instance.input.focus();
      expect(instance.dropdown.classList).toContain(instance.config.classNames.activeState);
    });

    it('should select the first choice', () => {
      instance = new Choices(input);
      expect(instance.currentState.items[0].value).toContain('Value 1');
    });

    it('should highlight the choices on keydown', () => {
      instance = new Choices(input, {
        renderChoiceLimit: -1
      });
      instance.input.focus();

      for (let i = 0; i < 2; i++) {
        // Key down to third choice
        instance._onKeyDown({
          target: instance.input,
          keyCode: 40,
          ctrlKey: false,
          preventDefault: () => {}
        });
      }

      expect(instance.highlightPosition).toBe(2);
    });

    it('should select choice on enter key press', () => {
      instance = new Choices(input);
      instance.input.focus();

      // Key down to second choice
      instance._onKeyDown({
        target: instance.input,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {}
      });

      // Key down to select choice
      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(instance.currentState.items.length).toBe(2);
    });

    it('should trigger add/change event on selection', () => {
      instance = new Choices(input);

      const changeSpy = jasmine.createSpy('changeSpy');
      const addSpy = jasmine.createSpy('addSpy');
      const passedElement = instance.passedElement;

      passedElement.addEventListener('change', changeSpy);
      passedElement.addEventListener('addItem', addSpy);

      instance.input.focus();

      // Key down to second choice
      instance._onKeyDown({
        target: instance.input,
        keyCode: 40,
        ctrlKey: false,
        preventDefault: () => {}
      });

      // Key down to select choice
      instance._onKeyDown({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false,
        preventDefault: () => {}
      });

      const returnValue = changeSpy.calls.mostRecent().args[0].detail.value;
      expect(returnValue).to.be.a('string');
      expect(changeSpy).toHaveBeenCalled();
      expect(addSpy).toHaveBeenCalled();
    });

    it('should open the dropdown on click', () => {
      instance = new Choices(input);
      const container = instance.containerOuter;
      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(document.activeElement === instance.input && container.classList.contains('is-open')).to.be.true;
    });

    it('should close the dropdown on double click', () => {
      instance = new Choices(input);
      const container = instance.containerOuter,
        openState = instance.config.classNames.openState;

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(document.activeElement === instance.input && container.classList.contains(openState)).toBe(false);
    });

    it('should trigger showDropdown on dropdown opening', () => {
      instance = new Choices(input);
      const container = instance.containerOuter;

      const showDropdownSpy = jasmine.createSpy('showDropdownSpy');
      const passedElement = instance.passedElement;

      passedElement.addEventListener('showDropdown', showDropdownSpy);

      instance.input.focus();

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(showDropdownSpy).toHaveBeenCalled();
    });

    it('should trigger hideDropdown on dropdown closing', () => {
      instance = new Choices(input);
      const container = instance.containerOuter;

      const hideDropdownSpy = jasmine.createSpy('hideDropdownSpy');
      const passedElement = instance.passedElement;

      passedElement.addEventListener('hideDropdown', hideDropdownSpy);

      instance.input.focus();

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      instance._onClick({
        target: container,
        ctrlKey: false,
        preventDefault: () => {}
      });

      expect(hideDropdownSpy).toHaveBeenCalled();
    });

    it('should filter choices when searching', () => {
      instance = new Choices(input);

      const searchSpy = jasmine.createSpy('searchSpy');
      const passedElement = instance.passedElement;

      passedElement.addEventListener('search', searchSpy);

      instance.input.focus();
      instance.input.value = '3 ';

      // Key down to search
      instance._onKeyUp({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      const mostAccurateResult = instance.currentState.choices.filter(function (choice) {
        return choice.active;
      });

      expect(instance.isSearching && mostAccurateResult[0].value === 'Value 3').to.be.true;
      expect(searchSpy).toHaveBeenCalled();
    });

    it('shouldn\'t filter choices when searching', () => {
      instance = new Choices(input, {
        searchChoices: false
      });

      instance.setValue(['Javascript', 'HTML', 'Jasmine']);

      const searchSpy = jasmine.createSpy('searchSpy');
      const passedElement = instance.passedElement;

      passedElement.addEventListener('search', searchSpy);

      instance.input.focus();
      instance.input.value = 'Javascript';

      // Key down to search
      instance._onKeyUp({
        target: instance.input,
        keyCode: 13,
        ctrlKey: false
      });

      const activeOptions = instance.currentState.choices.filter(function (choice) {
        return choice.active;
      });

      expect(activeOptions.length).to.equal(instance.currentState.choices.length);
      expect(searchSpy).toHaveBeenCalled();
    });

    it('shouldn\'t sort choices if shouldSort is false', () => {
      instance = new Choices(input, {
        shouldSort: false,
        choices: [{
          value: 'Value 5',
          label: 'Label Five'
        }, {
          value: 'Value 6',
          label: 'Label Six'
        }, {
          value: 'Value 7',
          label: 'Label Seven'
        }, ],
      });

      expect(instance.currentState.choices[0].value).to.equal('Value 5');
    });

    it('should sort choices if shouldSort is true', () => {
      instance = new Choices(input, {
        shouldSort: true,
        choices: [{
          value: 'Value 5',
          label: 'Label Five'
        }, {
          value: 'Value 6',
          label: 'Label Six'
        }, {
          value: 'Value 7',
          label: 'Label Seven'
        }, ],
      });

      expect(instance.currentState.choices[0].value).to.equal('Value 1');
    });
  });

  describe('should accept multiple select inputs', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);

      instance = new Choices(input, {
        placeholderValue: 'Placeholder text',
        choices: [{
          value: 'One',
          label: 'Label One',
          selected: true,
          disabled: false
        }, {
          value: 'Two',
          label: 'Label Two',
          disabled: true
        }, {
          value: 'Three',
          label: 'Label Three'
        }, ],
      });
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should add any pre-defined values', () => {
      expect(instance.currentState.items.length).toBeGreaterThan(1);
    });

    it('should add options defined in the config + pre-defined options', () => {
      expect(instance.currentState.choices.length).to.equal(6);
    });

    it('should add a placeholder defined in the config to the search input', () => {
      expect(instance.input.placeholder).to.equal('Placeholder text');
    });
  });

  describe('should handle public methods on select input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.multiple = true;
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should handle highlightItem()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.highlightItem(randomItem);

      expect(randomItem.highlighted).to.be.true;
    });

    it('should handle unhighlightItem()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.unhighlightItem(randomItem);

      expect(randomItem.highlighted).toBe(false);
    });

    it('should handle highlightAll()', () => {
      const items = instance.currentState.items;

      instance.highlightAll();

      const unhighlightedItems = items.some((item) => item.highlighted === false);

      expect(unhighlightedItems).toBe(false);
    });

    it('should handle unhighlightAll()', () => {
      const items = instance.currentState.items;

      instance.unhighlightAll();

      const highlightedItems = items.some((item) => item.highlighted === true);

      expect(highlightedItems).toBe(false);
    });

    it('should handle removeHighlightedItems()', () => {
      const items = instance.currentState.items;
      instance.highlightAll();
      instance.removeHighlightedItems();

      const activeItems = items.some((item) => item.active === true);

      expect(activeItems).toBe(false);
    });

    it('should handle showDropdown()', () => {
      instance.showDropdown();
      const hasOpenState = instance.containerOuter.classList.contains(instance.config.classNames.openState);
      const hasAttr = instance.containerOuter.getAttribute('aria-expanded') === 'true';
      const hasActiveState = instance.dropdown.classList.contains(instance.config.classNames.activeState);
      expect(hasOpenState && hasAttr && hasActiveState).to.be.true;
    });

    it('should handle hideDropdown()', () => {
      instance.showDropdown();
      instance.hideDropdown();
      const hasOpenState = instance.containerOuter.classList.contains(instance.config.classNames.openState);
      const hasAttr = instance.containerOuter.getAttribute('aria-expanded') === 'true';
      const hasActiveState = instance.dropdown.classList.contains(instance.config.classNames.activeState);

      expect(hasOpenState && hasAttr && hasActiveState).toBe(false);
    });

    it('should handle toggleDropdown()', () => {
      spyOn(instance, 'hideDropdown');
      instance.showDropdown();
      instance.toggleDropdown();
      expect(instance.hideDropdown).toHaveBeenCalled();
    });

    it('should handle hideDropdown()', () => {
      instance.showDropdown();
      expect(instance.containerOuter.classList).toContain(instance.config.classNames.openState);
    });

    it('should handle getValue()', () => {
      const valueObjects = instance.getValue();
      const valueStrings = instance.getValue(true);

      expect(valueStrings[0]).to.be.a('string');
      expect(valueObjects[0]).to.be.an('object');
      expect(valueObjects).to.be.an('array');
      expect(valueObjects.length).to.equal(5);
    });

    it('should handle setValue()', () => {
      instance.setValue(['Set value 1', 'Set value 2', 'Set value 3']);
      const valueStrings = instance.getValue(true);

      expect(valueStrings[valueStrings.length - 1]).toBe('Set value 3');
      expect(valueStrings[valueStrings.length - 2]).toBe('Set value 2');
      expect(valueStrings[valueStrings.length - 3]).toBe('Set value 1');
    });

    it('should handle setValueByChoice()', () => {
      const choices = instance.store.getChoicesFilteredByActive();
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];

      instance.highlightAll();
      instance.removeHighlightedItems();
      instance.setValueByChoice(randomChoice.value);

      const value = instance.getValue(true);

      expect(value[0]).toBe(randomChoice.value);
    });

    it('should handle setChoices()', () => {
      instance.setChoices([{
        label: 'Group one',
        id: 1,
        disabled: false,
        choices: [{
          value: 'Child One',
          label: 'Child One',
          selected: true
        }, {
          value: 'Child Two',
          label: 'Child Two',
          disabled: true
        }, {
          value: 'Child Three',
          label: 'Child Three'
        }, ]
      }, {
        label: 'Group two',
        id: 2,
        disabled: false,
        choices: [{
          value: 'Child Four',
          label: 'Child Four',
          disabled: true
        }, {
          value: 'Child Five',
          label: 'Child Five'
        }, {
          value: 'Child Six',
          label: 'Child Six'
        }, ]
      }], 'value', 'label');


      const groups = instance.currentState.groups;
      const choices = instance.currentState.choices;

      expect(groups[groups.length - 1].value).to.equal('Group two');
      expect(groups[groups.length - 2].value).to.equal('Group one');
      expect(choices[choices.length - 1].value).to.equal('Child Six');
      expect(choices[choices.length - 2].value).to.equal('Child Five');
    });

    it('should handle setChoices() with blank values', () => {
      instance.setChoices([{
        label: 'Choice one',
        value: 'one'
      }, {
        label: 'Choice two',
        value: ''
      }], 'value', 'label', true);


      const choices = instance.currentState.choices;
      expect(choices[0].value).to.equal('one');
      expect(choices[1].value).to.equal('');
    });

    it('should handle clearStore()', () => {
      instance.clearStore();

      expect(instance.currentState.items).to.equal([]);
      expect(instance.currentState.choices).to.equal([]);
      expect(instance.currentState.groups).to.equal([]);
    });

    it('should handle disable()', () => {
      instance.disable();

      expect(instance.input.disabled).to.be.true;
      expect(instance.containerOuter.classList.contains(instance.config.classNames.disabledState)).to.be.true;
      expect(instance.containerOuter.getAttribute('aria-disabled')).toBe('true');
    });

    it('should handle enable()', () => {
      instance.enable();

      expect(instance.input.disabled).toBe(false);
      expect(instance.containerOuter.classList.contains(instance.config.classNames.disabledState)).toBe(false);
      expect(instance.containerOuter.hasAttribute('aria-disabled')).toBe(false);
    });

    it('should handle ajax()', () => {
      spyOn(instance, 'ajax');

      instance.ajax((callback) => {
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

      expect(instance.ajax).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('should handle public methods on select-one input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.placeholder = 'Placeholder text';

      for (let i = 1; i < 10; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should handle disable()', () => {
      instance.disable();

      expect(instance.containerOuter.getAttribute('tabindex')).toBe('-1');
    });

    it('should handle enable()', () => {
      instance.enable();

      expect(instance.containerOuter.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('should handle public methods on text input types', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'js-choices';
      input.value = 'Value 1, Value 2, Value 3, Value 4';

      document.body.appendChild(input);
      instance = new Choices(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should handle clearInput()', () => {
      instance.clearInput();
      expect(instance.input.value).toBe('');
    });

    it('should handle removeItemsByValue()', () => {
      const items = instance.currentState.items;
      const randomItem = items[Math.floor(Math.random() * items.length)];

      instance.removeItemsByValue(randomItem.value);
      expect(randomItem.active).toBe(false);
    });
  });

  describe('should react to config options', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      for (let i = 1; i < 4; i++) {
        const option = document.createElement('option');

        option.value = `Value ${i}`;
        option.innerHTML = `Value ${i}`;

        if (i % 2) {
          option.selected = true;
        }

        input.appendChild(option);
      }

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should flip the dropdown', () => {
      instance = new Choices(input, {
        position: 'top',
      });

      const container = instance.containerOuter;
      instance.input.focus();
      expect(container.classList.contains(instance.config.classNames.flippedState)).to.be.true;
    });

    it('shouldn\'t flip the dropdown', () => {
      instance = new Choices(input, {
        position: 'bottom'
      });

      const container = instance.containerOuter;
      instance.input.focus();
      expect(container.classList.contains(instance.config.classNames.flippedState)).toBe(false);
    });

    it('should render selected choices', () => {
      instance = new Choices(input, {
        renderSelectedChoices: 'always',
        renderChoiceLimit: -1
      });
      const renderedChoices = instance.choiceList.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(3);
    });

    it('shouldn\'t render selected choices', () => {
      instance = new Choices(input, {
        renderSelectedChoices: 'auto',
        renderChoiceLimit: -1
      });
      const renderedChoices = instance.choiceList.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(1);
    });

    it('shouldn\'t render choices up to a render limit', () => {
      // Remove existing choices (to make test simpler)
      while (input.firstChild) {
        input.removeChild(input.firstChild);
      }

      instance = new Choices(input, {
        choices: [
          {
            value: 'Option 1',
            selected: false,
          },
          {
            value: 'Option 2',
            selected: false,
          },
          {
            value: 'Option 3',
            selected: false,
          },
          {
            value: 'Option 4',
            selected: false,
          },
          {
            value: 'Option 5',
            selected: false,
          },
        ],
        renderSelectedChoices: 'auto',
        renderChoiceLimit: 4
      });

      const renderedChoices = instance.choiceList.querySelectorAll('.choices__item');
      expect(renderedChoices.length).to.equal(4);
    });
  });

  describe('should allow custom properties provided by the user on items or choices', () => {
    let input;
    let instance;

    it('should allow the user to supply custom properties for an item', () => {
      const randomItem = {
        id: 8999,
        choiceId: 9000,
        groupId: 9001,
        value: 'value',
        label: 'label',
        customProperties: {
          foo: 'bar'
        },
        keyCode: null
      };

      const expectedState = [{
        id: randomItem.id,
        choiceId: randomItem.choiceId,
        groupId: randomItem.groupId,
        value: randomItem.value,
        label: randomItem.label,
        active: true,
        highlighted: false,
        customProperties: randomItem.customProperties,
        keyCode: randomItem.keyCode
      }];

      const action = addItemAction(
        randomItem.value,
        randomItem.label,
        randomItem.id,
        randomItem.choiceId,
        randomItem.groupId,
        randomItem.customProperties,
        randomItem.keyCode
      );

      expect(itemReducer([], action)).to.equal(expectedState);
    });

    it('should allow the user to supply custom properties for a choice', () => {
      const randomChoice = {
        id: 123,
        elementId: 321,
        groupId: 213,
        value: 'value',
        label: 'label',
        disabled: false,
        customProperties: {
          foo: 'bar'
        },
        keyCode: null
      };

      const expectedState = [{
        id: randomChoice.id,
        elementId: randomChoice.elementId,
        groupId: randomChoice.groupId,
        value: randomChoice.value,
        label: randomChoice.label,
        disabled: randomChoice.disabled,
        selected: false,
        active: true,
        score: 9999,
        customProperties: randomChoice.customProperties,
        keyCode: randomChoice.keyCode
      }];

      const action = addChoiceAction(
        randomChoice.value,
        randomChoice.label,
        randomChoice.id,
        randomChoice.groupId,
        randomChoice.disabled,
        randomChoice.elementId,
        randomChoice.customProperties,
        randomChoice.keyCode
      );

      expect(choiceReducer([], action)).to.equal(expectedState);
    });
  });

  describe('should allow custom properties provided by the user on items or choices', () => {
    let input;
    let instance;

    beforeEach(() => {
      input = document.createElement('select');
      input.className = 'js-choices';
      input.setAttribute('multiple', '');

      document.body.appendChild(input);
    });

    afterEach(() => {
      instance.destroy();
    });

    it('should allow the user to supply custom properties for a choice that will be inherited by the item when the user selects the choice', () => {
      const expectedCustomProperties = {
        isBestOptionEver: true
      };

      instance = new Choices(input);
      instance.setChoices([{
        value: '42',
        label: 'My awesome choice',
        selected: false,
        disabled: false,
        customProperties: expectedCustomProperties
      }], 'value', 'label', true);

      instance.setValueByChoice('42');
      const selectedItems = instance.getValue();

      expect(selectedItems.length).toBe(1);
      expect(selectedItems[0].customProperties).toBe(expectedCustomProperties);
    });

    it('should allow the user to supply custom properties when directly creating a selected item', () => {
      const expectedCustomProperties = {
        isBestOptionEver: true
      };

      instance = new Choices(input);

      instance.setValue([{
        value: 'bar',
        label: 'foo',
        customProperties: expectedCustomProperties
      }]);
      const selectedItems = instance.getValue();

      expect(selectedItems.length).toBe(1);
      expect(selectedItems[0].customProperties).toBe(expectedCustomProperties);
    });
  });
});
