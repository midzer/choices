# Choices.js [![Build Status](https://travis-ci.org/jshjohnson/Choices.svg?branch=master)](https://travis-ci.org/jshjohnson/Choices) 
A lightweight, configurable select box/text input plugin. Similar to Select2 and Selectize but without the jQuery dependency.

[Demo](https://joshuajohnson.co.uk/Choices/)

## Setup

```html
<!-- Include base CSS (optional) -->
<link rel="stylesheet" href="assets/styles/css/base.min.css">
<!-- Include Choices CSS -->
<link rel="stylesheet" href="assets/styles/css/choices.min.css">
<!-- Include Choices JavaScript -->
<script src="/assets/scripts/dist/choices.min.js"></script>
<script>
    // Pass multiple elements:
    const choices = new Choices(elements);
    
    // Pass single element:
    const choices = new Choices(element);
    
    // Pass reference
    const choices = new Choices('[data-choice']);
    const choices = new Choices('.js-choice');
    
    // Passing options (with default options)
    const choices = new Choices(elements, {
        items: [],
        choices: [],
        maxItemCount: -1,
        addItems: true,
        removeItems: true,
        removeItemButton: false,
        editItems: false,
        duplicateItems: true,
        delimiter: ',',
        paste: true,
        search: true, 
        regexFilter: null,
        placeholder: true,
        placeholderValue: null,
        prependValue: null,
        appendValue: null,
        loadingText: 'Loading...',
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
            itemChoice: 'choices__item--choice',
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
            loadingState: 'is-loading',
        },
        callbackOnInit: () => {},
        callbackOnAddItem: (id, value, passedInput) => {},
        callbackOnRemoveItem: (id, value, passedInput) => {},
        callbackOnChange: (value, passedInput) => {},
        callbackOnRender: () => {},
    });
</script>
```

## Installation

`npm install choices.js --save-dev`

## Terminology
| Word   | Definition |
| ------ | ---------- |
| Choice | A choice is a value a user can select. A choice would be equivelant to the `<option></option>` element within a select input.  |
| Group  | A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.|
| Item   | An item is an inputted value (text input) or a selected choice (select element). In the context of a select element, an item is equivelent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivelant to `<input type="text" value="Hello">`|

## Configuration options
### items
<strong>Type:</strong> `Array`  <strong>Default:</strong> `[]`

<strong>Usage:</strong> Add pre-selected items (see terminology) to text input. 

<strong>Input types affected:</strong> `text`

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

### choices
<strong>Type:</strong> `Array`  <strong>Default:</strong> `[]`

<strong>Usage:</strong> Add choices (see terminology) to select input. 

<strong>Input types affected:</strong> `select-one`, `select-multiple`

Pass an array of objects:

```
[{ 
	value: 'Option 1',
	label: 'Option 1', 
	selected: true,
	disabled: false,
},
{ 
	value: 'Option 2',
	label: 'Option 2', 
	selected: false,
	disabled: true,
}]
```

### maxItemCount
<strong>Type:</strong> `Number` <strong>Default:</strong>`-1`

<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> The amount of items a user can input/select ("-1" indicates no limit).

### addItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Whether a user can add items to the passed input's value.

### removeItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Whether a user can remove items (only affects text and multiple select input types).

### removeButton
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Whether a button should show that, when clicked, will remove an item (only affects text and multiple select input types).

### editItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Whether a user can edit selected items (only affects text input types).

<strong>Usage:</strong> Optionally set an item limit (`-1` indicates no limit).

### delimiter
<strong>Type:</strong> `String` <strong>Default:</strong>`,`

<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> What divides each value.

### duplicates
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Whether a user can input a duplicate item.

### paste
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `text`, `select-multiple`.

<strong>Usage:</strong> Whether a user can paste into the input.

### search
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `select-one`, `select-multiple`.

<strong>Usage:</strong> Whether a user can filter options by searching (only affects select input types).

### regexFilter
<strong>Type:</strong> `Regex` <strong>Default:</strong>`null`

<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> A filter that will need to pass for a user to successfully add an item.

### placeholder
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the  placeholder value.

### placeholderValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> The value of the inputs placeholder.

### prependValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Prepend a value to each item added to input (only affects text input types).

### appendValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Append a value to each item added to input (only affects text input types).

### loadingText
<strong>Type:</strong> `String` <strong>Default:</strong>`Loading...`

<strong>Input types affected:</strong> `select-one`, `select-multiple`

<strong>Usage:</strong> The loading text that is shown when options are populated via an AJAX callback.

### classNames
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
    itemOption: 'choices__item--choice',
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
    selectedState: 'is-highlighted',
}
```

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Classes added to HTML generated by Choices. By default classnames follow the [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) notation.


### callbackOnInit
<strong>Type:</strong> `Function` <strong>Default:</strong>`() => {}`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Function to run once Choices initialises.

### callbackOnAddItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Function to run each time an item is added (programmatically or by the user).

### callbackOnRemoveItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Function to run each time an item is removed (programmatically or by the user).

### callbackOnChange
<strong>Type:</strong> `Function` <strong>Default:</strong>`(value, passedInput) => {}`

<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Function to run each time an item is added/removed by a user.


## Methods
Methods can be called either directly or by chaining:

```js
// Calling a method by chaining
const choices = new Choices(element, {
    addItems: false,
    removeItems: false,
}).setValue(['Set value 1', 'Set value 2']).disable();

// Calling a method directly
const choices = new Choices(element, {
    addItems: false,
    removeItems: false,
});

choices.setValue(['Set value 1', 'Set value 2'])
choices.disable();
```

### highlightAll();
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Highlight each chosen item (selected items can be removed).


### unhighlightAll();
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Un-highlight each chosen item.


### removeItemsByValue(value);
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Remove each item by a given value.


### removeActiveItems(excludedId);
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Remove each selectable item.


### removeHighlightedItems();
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Remove each item the user has selected.


### showDropdown();
<strong>Input types affected:</strong> `select-one`, `select-multiple`

<strong>Usage:</strong> Show option list dropdown (only affects select inputs).


### hideDropdown();
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Hide option list dropdown (only affects select inputs).


### toggleDropdown();
<strong>Input types affected:</strong> `text`, `select-multiple`

<strong>Usage:</strong> Toggle dropdown between showing/hidden.

### setChoices(choices, value, label);
<strong>Input types affected:</strong> `select-one`, `select-multiple`

<strong>Usage:</strong> Set choices of select input via an array of objects, a value name and a label name. This behaves exactly the same as passing items via the `choices` option but can be called after initialising Choices.

<strong>Example:</strong>

```js
const choices = new Choices(element);

choices.setChoices([
    {value: 'One', label: 'Label One', disabled: true},
    {value: 'Two', label: 'Label Two' selected: true},
    {value: 'Three', label: 'Label Three'},
], 'value', 'label');
```

### setValue(args);
<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Set value of input based on an array of objects or strings. This behaves exactly the same as passing items via the `items` option but can be called after initialising Choices.

<strong>Example:</strong>

```js
const example = new Choices(element);

// via an array of objects

example.setValue([
    {value: 'One', label: 'Label One'},
    {value: 'Two', label: 'Label Two'},
    {value: 'Three', label: 'Label Three'},
]);

// or via an array of strings

example.setValue(['Four','Five','Six']);
```

### setValueByChoice(value);
<strong>Input types affected:</strong> `select-one`, `select-multiple`

<strong>Usage:</strong> Set value of input based on existing Choice.

<strong>Example:</strong>

```js
const example = new Choices(element, {
    choices: [
        {value: 'One', label: 'Label One'},
        {value: 'Two', label: 'Label Two', disabled: true},
        {value: 'Three', label: 'Label Three'},
    ],
});

example.setValueByChoice('Two'); // Choice with value of 'Two' has now been selected.
```

### clearValue();
<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Clear value of input.


### clearInput();
<strong>Input types affected:</strong> `text`

<strong>Usage:</strong> Clear input of any user inputted text.


### disable();
<strong>Input types affected:</strong> `text`, `select-one`, `select-multiple`

<strong>Usage:</strong> Disable input from selecting further options.


### ajax(fn);
<strong>Input types affected:</strong> `select-one`, `select-multiple`

<strong>Usage:</strong> Populate options via a callback.


## Browser compatibility
ES5 browsers and above (http://caniuse.com/#feat=es5). 

## Development
To setup a local environment: clone this repo, navigate into it's directory in a terminal window and run the following command:

```npm install```

### NPM tasks
| Task                | Usage                                                        |
| ------------------- | ------------------------------------------------------------ |
| `npm start`         | Fire up local server for development                         |
| `npm run js:build`  | Compile Choices to an uglified JavaScript file               |
| `npm run css:watch` | Watch SCSS files for changes. On a change, run build process |
| `npm run css:build` | Compile, minify and prefix SCSS files to CSS                 |

## Contributions
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using npm scripts...bla bla bla

## License
MIT License 
