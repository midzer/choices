# Choices.js - in development
A lightweight, configurable select box/text input plugin. Similar to Select2 and Selectize but without the jQuery dependency. 

Coming soon.

## Setup
```html
<script src="/assets/js/dist/choices.min.js"></script>
<script>
    // Pass multiple elements:
    var choices = new Choices(elements);
    
    // Pass single element:
    var choice = new Choices(element);
    
    // Pass reference
    var choice = new Choices('[data-choice']);
    var choice = new Choices('.js-choice');
    
    // Passing options
    var choices = new Choices(elements, {
        items: [],
        addItems: true,
        removeItems: true,
        removeButton: false,
        editItems: false,
        maxItems: false,
        delimiter: ',',
        allowDuplicates: true,
        allowPaste: true,
        allowSearch: true, 
        regexFilter: false,
        placeholder: true,
        placeholderValue: '',
        prependValue: false,
        appendValue: false,
        selectAll: true,
        loadingText: 'Loading...',
    });
</script>
```

## Installation
To install via NPM, run `npm install --save-dev choices.js` 

## Options
#### items
<strong>Type:</strong> `Array` <strong>Default:</strong> `[]`

<strong>Usage:</strong> Add pre-selected items to input. 

Pass an array of strings: 

`['value 1', 'value 2', 'value 3']`

Pass an array of objects:

```
[{ 
	value: 'Value 1',
	label: 'Label 1', 
	id: 1 
},
{ 
	value: 'Value 2',
	label: 'Label 2', 
	id: 2
}]
```

#### addItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can add items.

#### removeItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can remove items (only affects text and multiple select input types).

#### removeButton
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Usage:</strong> Whether a button should show that, when clicked, will remove an item (only affects text and multiple select input types).

#### editItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Usage:</strong> Whether a user can edit selected items (only affects text input types).

#### maxItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`null`

<strong>Usage:</strong> Optionally set an item limit.

#### delimiter
<strong>Type:</strong> `String` <strong>Default:</strong>`,`

<strong>Usage:</strong> What divides each value (only affects text input types).

#### allowDuplicates
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can input a duplicate item (only affects text input types).

#### allowPaste
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can paste into the input.

#### allowSearch
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can filter options by searching (only affects select input types).

#### regexFilter
<strong>Type:</strong> `Regex` <strong>Default:</strong>`null`

<strong>Usage:</strong> A filter that will need to pass for a user to successfully add an item (only affects text input types).

#### placeholder
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the  placeholder value.

#### placeholderValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> The value of the inputs placeholder.

#### prependValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> Prepend a value to each item added to input (only affects text input types).

#### appendValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> Append a value to each item added to input (only affects text input types).

#### highlightAll
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can highlight items.

#### loadingText
<strong>Type:</strong> `String` <strong>Default:</strong>`Loading...`

<strong>Usage:</strong> The loading text that is shown when options are populated via an AJAX callback.

#### classNames
<strong>Type:</strong> `Object` <strong>Default:</strong>

```
classNames: {
    containerOuter: 'choices',
    containerInner: 'choices__inner',
    input: 'choices__input',
    inputCloned: 'choices__input--cloned',
    list: 'choices__list',
    listItems: 'choices__list--multiple',
    listSingle: 'choices__list--single',
    listDropdown: 'choices__list--dropdown',
    item: 'choices__item',
    itemSelectable: 'choices__item--selectable',
    itemDisabled: 'choices__item--disabled',
    itemOption: 'choices__item--option',
    group: 'choices__group',
    groupHeading : 'choices__heading',
    button: 'choices__button',
    activeState: 'is-active',
    focusState: 'is-focused',
    openState: 'is-open',
    disabledState: 'is-disabled',
    highlightedState: 'is-highlighted',
    hiddenState: 'is-hidden',
    flippedState: 'is-flipped',
    selectedState: 'is-selected',
}
```

<strong>Usage:</strong> Classes added to HTML generated by Choices.

#### callbackOnInit
<strong>Type:</strong> `Function` <strong>Default:</strong>`() => {}`

<strong>Usage:</strong> Function to run once Choices initialises.

#### callbackOnAddItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Usage:</strong> Function to run each time an item is added.

#### callbackOnRemoveItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Usage:</strong> Function to run each time an item is removed.


## Methods
#### highlightAll();
<strong>Usage:</strong> Highlight each chosen item (selected items can be removed).


#### unhighlightAll();
<strong>Usage:</strong> Un-highlight each chosen item.


#### removeItemsByValue(value);
<strong>Usage:</strong> Remove each item by a given value.


#### removeActiveItems(excludedId);
<strong>Usage:</strong> Remove each selectable item.


#### removeSelectedItems();
<strong>Usage:</strong> Remove each item the user has selected.


#### showDropdown();
<strong>Usage:</strong> Show option list dropdown.


#### hideDropdown();
<strong>Usage:</strong> Hide option list dropdown.


#### toggleDropdown();
<strong>Usage:</strong> Toggle dropdown between showing/hidden.


#### setValue(args);
<strong>Usage:</strong> Set value of input based on an array of objects or strings.


#### clearValue();
<strong>Usage:</strong> Clear value of input.


#### clearInput();
<strong>Usage:</strong> Clear input.


#### disable();
<strong>Usage:</strong> Disable input from selecting further options.


#### ajax(fn);
<strong>Usage:</strong> Populate options via a callback.


## Browser compatibility
ES5 browsers and above (http://caniuse.com/#feat=es5). 

## Development
To setup a local environment: clone this repo, navigate into it's directory in a terminal window and run the following command:

```npm install```

### NPM tasks
* ```npm start```
* ```npm run js:build```
* ```npm run css:watch```
* ```npm run css:build```

## Contributions
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using npm scripts...bla bla bla

## License
MIT License 