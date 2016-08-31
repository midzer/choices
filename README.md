# Choices.js [![Build Status](https://travis-ci.org/jshjohnson/Choices.svg?branch=master)](https://travis-ci.org/jshjohnson/Choices) 
A vanilla, lightweight (~15kb gzipped 🎉), configurable select box/text input plugin. Similar to Select2 and Selectize but without the jQuery dependency.

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

    // Pass jQuery element
    const choices = new Choices($('.js-choice')[0]);
    
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
        flip: true,
        regexFilter: null,
        shouldSort: true,
        sortFilter: sortByAlpha,
        sortFields: ['label', 'value'],
        placeholder: true,
        placeholderValue: null,
        prependValue: null,
        appendValue: null,
        loadingText: 'Loading...',
        noResultsText: 'No results round',
        noChoicesText: 'No choices to choose from',
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
        callbackOnHighlightItem: (id, value, passedInput) => {},
        callbackOnUnhighlightItem: (id, value, passedInput) => {},
        callbackOnChange: (value, passedInput) => {},
    });
</script>
```

## Installation

`npm install choices.js --save`

## Terminology
| Word   | Definition |
| ------ | ---------- |
| Choice | A choice is a value a user can select. A choice would be equivelant to the `<option></option>` element within a select input.  |
| Group  | A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.|
| Item   | An item is an inputted value (text input) or a selected choice (select element). In the context of a select element, an item is equivelent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivelant to `<input type="text" value="Hello">`|


## Configuration options
### items
**Type:** `Array`  **Default:**  `[]`

**Input types affected:** `text`

**Usage:** Add pre-selected items (see terminology) to text input. 

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
**Type:** `Array`  **Default:**  `[]`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Add choices (see terminology) to select input. 

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
**Type:** `Number` **Default:** `-1`

**Input types affected:** `text`, `select-multiple`

**Usage:** The amount of items a user can input/select ("-1" indicates no limit).

### addItems
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`

**Usage:** Whether a user can add items to the passed input's value.

### removeItems
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether a user can remove items.

### removeItemButton
**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Whether a button should show that, when clicked, will remove an item.

### editItems
**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`

**Usage:** Whether a user can edit items. An items value can be edited by pressing the backspace.

### duplicateItems
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether a user can input/choose a duplicate item.

### delimiter
**Type:** `String` **Default:** `,`

**Input types affected:** `text`

**Usage:** What divides each value. By default the delimited value would be `"Value 1, Value 2, Value 3"`.

### paste
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether a user can paste into the input.

### search
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`

**Usage:** Whether a user should be allowed to search avaiable choices. Note that multiple select boxes will always show search inputs.

### flip
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Whether the dropdown should appear above the input if there is not enough space within the window. 

### regexFilter
**Type:** `Regex` **Default:** `null`

**Input types affected:** `text`

**Usage:** A filter that will need to pass for a user to successfully add an item.

### shouldSort
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Whether choices should be sorted. If false, choices will appear in the order they were given. 

### sortFilter
**Type:** `Function` **Default:** sortByAlpha

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The function that will sort choices before they are displayed (unless a user is searching). By default choices are sorted by alphabetical order.

**Example:**

```js
// Sorting via length of label from largest to smallest
const example = new Choices(element, {
    sortFilter: function(a, b) {
        return b.label.length - a.label.length;
    },
};
```

### sortFields
**Type:** `Array/String` **Default:** `['label', 'value']`

**Input types affected:**`select-one`, `select-multiple`

**Usage:** Specify which fields should be used for sorting. 

### placeholder
**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the  placeholder value.

### placeholderValue
**Type:** `String` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** The value of the inputs placeholder.

### prependValue
**Type:** `String` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Prepend a value to each item added/selected.

### appendValue
**Type:** `String` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Append a value to each item added/selected.

### loadingText
**Type:** `String` **Default:** `Loading...`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The text that is shown whilst choices are being populated via AJAX.

### noResultsText
**Type:** `String` **Default:** `No results round`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The text that is shown when a user's search has returned no results.

### noChoicesText
**Type:** `String` **Default:** `No choices to choose from`

**Input types affected:** `select-multiple`

**Usage:** The text that is shown when a user has selected all possible choices.

### classNames
**Type:** `Object` **Default:**

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

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Classes added to HTML generated by Choices. By default classnames follow the [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) notation.

### callbackOnInit
**Type:** `Function` **Default:** `() => {}`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run once Choices initialises.

### callbackOnAddItem
**Type:** `Function` **Default:** `(id, value, passedInput) => {}`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run each time an item is added (programmatically or by the user).

### callbackOnRemoveItem
**Type:** `Function` **Default:** `(id, value, passedInput) => {}`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run each time an item is removed (programmatically or by the user).

### callbackOnHighlightItem
**Type:** `Function` **Default:** `(id, value, passedInput) => {}`

**Input types affected:** `text`, `select-multiple`

**Usage:** Function to run each time an item is highlighted.

### callbackOnUnhighlightItem
**Type:** `Function` **Default:** `(id, value, passedInput) => {}`

**Input types affected:** `text`, `select-multiple`

**Usage:** Function to run each time an item is unhighlighted.

### callbackOnChange
**Type:** `Function` **Default:** `(value, passedInput) => {}`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run each time an item is added/removed by a user.


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

### destroy();
**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Kills the instance of Choices, removes all event listeners and returns passed input to its initial state.

### init();
**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Creates a new instance of Choices, adds event listeners, creates templates and renders a Choices element to the DOM.

**Note:** This is called implicitly when a new instance of Choices is created. This would be used after a Choices instance had already been destroyed (using `destroy()`). 

### highlightAll();
**Input types affected:** `text`, `select-multiple`

**Usage:** Highlight each chosen item (selected items can be removed).


### unhighlightAll();
**Input types affected:** `text`, `select-multiple`

**Usage:** Un-highlight each chosen item.


### removeItemsByValue(value);
**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each item by a given value.


### removeActiveItems(excludedId);
**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each selectable item.


### removeHighlightedItems();
**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each item the user has selected.


### showDropdown();
**Input types affected:** `select-one`, `select-multiple`

**Usage:** Show option list dropdown (only affects select inputs).


### hideDropdown();
**Input types affected:** `text`, `select-multiple`

**Usage:** Hide option list dropdown (only affects select inputs).


### toggleDropdown();
**Input types affected:** `text`, `select-multiple`

**Usage:** Toggle dropdown between showing/hidden.

### setChoices(choices, value, label);
**Input types affected:** `select-one`, `select-multiple`

**Usage:** Set choices of select input via an array of objects, a value name and a label name. This behaves the same as passing items via the `choices` option but can be called after initialising Choices. This can also be used to add groups of choices (see example 2);

**Example 1:**

```js
const example = new Choices(element);

example.setChoices([
    {value: 'One', label: 'Label One', disabled: true},
    {value: 'Two', label: 'Label Two' selected: true},
    {value: 'Three', label: 'Label Three'},
], 'value', 'label');
```

**Example 2:**

```js
const example = new Choices(element);

example.setChoices([{
    label: 'Group one',
    id: 1,
    disabled: false,
    choices: [
        {value: 'Child One', label: 'Child One', selected: true},
        {value: 'Child Two', label: 'Child Two',  disabled: true},
        {value: 'Child Three', label: 'Child Three'},
    ]
}, 
{
    label: 'Group two',
    id: 2,
    disabled: false,
    choices: [
        {value: 'Child Four', label: 'Child Four', disabled: true},
        {value: 'Child Five', label: 'Child Five'},
        {value: 'Child Six', label: 'Child Six'},
    ]
}], 'value', 'label');
```

### getValue(valueOnly)
**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Get value(s) of input (i.e. inputted items (text) or selected choices (select)). Optionally pass an argument of `true` to only return values rather than value objects.

**Example:**

```js
const example = new Choices(element);
const values = example.getValue(true); // returns ['value 1', 'value 2'];
const valueArray = example.getValue(); // returns [{ active: true, choiceId: 1, highlighted: false, id: 1, label: 'Label 1', value: 'Value 1'},  { active: true, choiceId: 2, highlighted: false, id: 2, label: 'Label 2', value: 'Value 2'}];
```

### setValue(args);
**Input types affected:** `text`

**Usage:** Set value of input based on an array of objects or strings. This behaves exactly the same as passing items via the `items` option but can be called after initialising Choices.

**Example:**

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
**Input types affected:** `select-one`, `select-multiple`

**Usage:** Set value of input based on existing Choice.

**Example:**

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

### clearStore();
**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Removes all items, choices and groups. Use with caution.


### clearInput();
**Input types affected:** `text`

**Usage:** Clear input of any user inputted text.


### disable();
**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Disables input from accepting new value/sselecting further choices.

### enable();
**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Enables input to accept new values/select further choices.


### ajax(fn);
**Input types affected:** `select-one`, `select-multiple`

**Usage:** Populate options via a callback.

**Example:**

```js
var example = new Choices(element);

example.ajax(function(callback) {
    fetch(url)
        .then(function(response) {
            response.json().then(function(data) {
                callback(data, 'value', 'label');
            });
        })
        .catch(function(error) {
            console.log(error);
        });
});
```


## Browser compatibility
Choices is compiled using [Babel](https://babeljs.io/) to enable support for [ES5 browsers](http://caniuse.com/#feat=es5). If you need to support a browser that does not support one of the features listed below, I suggest including a polyfill from the very good [polyfill.io](https://cdn.polyfill.io/v2/docs/):

**Polyfill example used for the demo:**

```html
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=es5,fetch,Element.prototype.classList,requestAnimationFrame,Node.insertBefore,Node.firstChild"></script>
```

**Features used in Choices:**

* Array.prototype.forEach
* Array.prototype.map
* Array.prototype.find
* Array.prototype.some
* Array.prototype.reduce
* Array.prototype.indexOf
* Element.prototype.classList
* window.requestAnimationFrame

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

## Misc
Thanks to [@mikefrancis](https://github.com/mikefrancis/) for [sending me on a hunt](https://twitter.com/_mikefrancis/status/701797835826667520) for a non-jQuery solution for select boxes that eventually led to this being built!
