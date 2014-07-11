# select-transformer

Transforms HTML select elements into groups of radio buttons or checkboxes.

### Rationale

The humble `<select>` element provides a good interface for selecting one or more named options, but we often want to display these options using checkboxes or radio buttons. Rather than having separate implementations for each of these, this module allows you to just use `<select>`s and it will transform them into groups of inputs and handle the two-way binding to keep them in sync.

## Usage

```javascript
import SelectTransformer from 'select-transformer'; // see Module Formats below
new SelectTransformer(document.querySelector('select#my-select'));
```

The `select.multiple` property is used to decide whether to use radio buttons or checkboxes.

`<optgroup>` elements are wrapped in an `<div class="st-group">` element that you can use for styling.

There is some very basic styling in `dist/assets/default.css` that you can use as a base.

### jQuery

```javascript
$('select#my-select').selectTransformer();
```

### Other DOM Manipulation Libraries

SelectTransformer uses a minimal set of jQuery fuctions, which could easily be provided by another library (such as domquery). You can use `SelectTransformer.setDOM()` to provide a jQuery-like object, but this hasn't been tested.

## Installation

### Module Formats

You will find all the popular formats in `dist/`.
