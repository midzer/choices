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
Type: `` Default: ``

Usage: 

#### addItems
Type: `` Default: ``

Usage:

#### removeItems
Type: `` Default: ``

Usage:

#### removeButton
Type: `` Default: ``

Usage:

#### editItems
Type: `` Default: ``

Usage:

#### maxItems
Type: `` Default: ``

Usage:

#### delimiter
Type: `` Default: ``

Usage:

#### allowDuplicates
Type: `` Default: ``

Usage:

#### allowPaste
Type: `` Default: ``

Usage:

#### allowSearch
Type: `` Default: ``

Usage:

#### regexFilter
Type: `` Default: ``

Usage:

#### placeholder
Type: `` Default: ``

Usage:

#### placeholderValue
Type: `` Default: ``

Usage:

#### prependValue
Type: `` Default: ``

Usage:

#### appendValue
Type: `` Default: ``

Usage:

#### selectAll
Type: `` Default: ``

Usage:

#### loadingText
Type: `` Default: ``

Usage:

#### templates
Type: `` Default: ``

Usage:

#### classNames
Type: `` Default: ``

Usage:

#### callbackOnInit
Type: `` Default: ``

Usage:

#### callbackOnAddItem
Type: `` Default: ``

Usage:

#### callbackOnRemoveItem
Type: `` Default: ``

Usage:


## Methods
#### method();
Usage: 

## Browser compatibility
Coming soon

## Development
To setup a local environment: clone this repo, navigate into it's directory in a terminal window and run the following command:
* ```npm install```

### NPM tasks
* ```npm start```
* ```npm run js:build```
* ```npm run css:watch```

## Contributions
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using Gulp...bla bla bla

## License
MIT License 