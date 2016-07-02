# Choices.js [![Build Status](https://travis-ci.org/jshjohnson/Choices.svg?branch=master)](https://travis-ci.org/jshjohnson/Choices) 
A lightweight, configurable select box/text input plugin. Similar to Select2 and Selectize but without the jQuery dependency.

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
    
    // Passing options (with default options)
    var choices = new Choices(elements, {
        items: [],
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
        callbackOnRender: () => {},
    });
</script>
```

## Installation
To install via NPM, run `npm install --save-dev choices.js`

## Terminology
| Word   | Definition |
| ------ | ---------- |
| Choice | A choice is a value a user can select. A choice would be equivelant to the `<option></option>` element within a select input.  |
| Group  | A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.|
| Item   | An item is an inputted value (text input) or a selected choice (select element). In the context of a select element, an item is equivelent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivelant to `<input type="text" value="Hello">`|

## Options
### items
<strong>Type:</strong>  <strong>Default:</strong> `[]`

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

### maxItemCount
<strong>Type:</strong> `Number` <strong>Default:</strong>`-1`

<strong>Usage:</strong> The amount of items a user can input/select ("-1" indicates no limit).

### addItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can add items to the passed input's value.

### removeItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can remove items (only affects text and multiple select input types).

### removeButton
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Usage:</strong> Whether a button should show that, when clicked, will remove an item (only affects text and multiple select input types).

### editItems
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`false`

<strong>Usage:</strong> Whether a user can edit selected items (only affects text input types).

<strong>Usage:</strong> Optionally set an item limit (`-1` indicates no limit).

### delimiter
<strong>Type:</strong> `String` <strong>Default:</strong>`,`

<strong>Usage:</strong> What divides each value (only affects text input types).

### duplicates
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can input a duplicate item (only affects text input types).

### paste
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can paste into the input.

### search
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether a user can filter options by searching (only affects select input types).

### regexFilter
<strong>Type:</strong> `Regex` <strong>Default:</strong>`null`

<strong>Usage:</strong> A filter that will need to pass for a user to successfully add an item (only affects text input types).

### placeholder
<strong>Type:</strong> `Boolean` <strong>Default:</strong>`true`

<strong>Usage:</strong> Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the  placeholder value.

### placeholderValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> The value of the inputs placeholder.

### prependValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> Prepend a value to each item added to input (only affects text input types).

### appendValue
<strong>Type:</strong> `String` <strong>Default:</strong>`null`

<strong>Usage:</strong> Append a value to each item added to input (only affects text input types).

### loadingText
<strong>Type:</strong> `String` <strong>Default:</strong>`Loading...`

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

<strong>Usage:</strong> Classes added to HTML generated by Choices. By default classnames follow the [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) notation.

### callbackOnInit
<strong>Type:</strong> `Function` <strong>Default:</strong>`() => {}`

<strong>Usage:</strong> Function to run once Choices initialises.

### callbackOnAddItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Usage:</strong> Function to run each time an item is added.

### callbackOnRemoveItem
<strong>Type:</strong> `Function` <strong>Default:</strong>`(id, value, passedInput) => {}`

<strong>Usage:</strong> Function to run each time an item is removed.


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
<strong>Usage:</strong> Highlight each chosen item (selected items can be removed).


### unhighlightAll();
<strong>Usage:</strong> Un-highlight each chosen item.


### removeItemsByValue(value);
<strong>Usage:</strong> Remove each item by a given value.


### removeActiveItems(excludedId);
<strong>Usage:</strong> Remove each selectable item.


### removeHighlightedItems();
<strong>Usage:</strong> Remove each item the user has selected.


### showDropdown();
<strong>Usage:</strong> Show option list dropdown (only affects select inputs).


### hideDropdown();
<strong>Usage:</strong> Hide option list dropdown (only affects select inputs).


### toggleDropdown();
<strong>Usage:</strong> Toggle dropdown between showing/hidden.


### setValue(args);
<strong>Usage:</strong> Set value of input based on an array of objects or strings. This behaves exactly the same as passing items via the `items` option but can be called after initialising Choices on an text input (only affects text inputs).


### clearValue();
<strong>Usage:</strong> Clear value of input.


### clearInput();
<strong>Usage:</strong> Clear input of any user inputted text (only affects text inputs).


### disable();
<strong>Usage:</strong> Disable input from selecting further options.


### ajax(fn);
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
