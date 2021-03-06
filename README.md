# Selection Lists Component

## 1. Overview
Selection Lists is the component based on [`Ember.Component`](http://emberjs.com). It represents two list
with drag'n'drop capabilities from one to another. It accepts to array where the first is the array of
possible items, the second is the array of the selected items that appear in the second column. However,
the items of the first column are available items - selected. The members of the array might of any type.

v0.0.5

### 1.1 Features
* Drag'n'Drop of multiple items
* Multiple selection with `ctrl`, `shift` keys
* Select all with `shift+a`
* Arrow `up` and `down` navigation

### 1.2. Dependencies
1. jQuery >= 1.9
2. Handlebars
3. EmberJS >= 1.0

### 1.3. Browser support
* IE 10+
* Chrome
* Firefox
* Opera

## 2. Use
Selection Lists component is based on `Ember.Components`, thus it can be instantiated from the
Handlebars template:

		<script type="text/x-handlebars">
			{{selection-lists}}
		</script>

It also accepts the set of attributes for
component customization which are described the the chapter API.

## 3. API
The constructor can accept the following parameters:

* {string}  `availableItemsTitle`     Title of the column A
* {string}  `chosenItemsTitle`        Title of the column B
* {array}   `availableItems`          Array of all possible items
* {array}   `chosenItems`             Array of chosen items that appear in column B
* {string}  `chosenItemChanged`       Name of the function to be invoked in the hosting controller when swapping occurs
* {string}  `sortProperties`          The string with enumerated by comma sorting properties inside the array item
* {string}  `rowRender`               Render that is used to the template of list item

Example:

		{{selection-lists
	        availableItemsTitle='Column A:'
	        chosenItemsTitle='Column B'
	        availableItems=SNB.allItems
	        chosenItems=SNB.selectedItems
	        chosenItemChanged="chosenItemChanged"
	        sortProperties="val"
	        rowRender='<img src="http://icons.iconarchive.com/icons/aha-soft/people/16/engineer-icon.png" /> {{view.content}}'
    }}


## 4. Credits
* Sergey N. Bolshchikov (New ProImage)
* Liat Ziv (New ProImage)
* Ilan Goldfeld (New ProImage)

## 5. Licence
The MIT License (MIT)

Copyright (c) 2013 New ProImage
