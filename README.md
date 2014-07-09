# select-transformer

Transforms HTML select elements into groups of radio buttons or checkboxes.

### Rationale

The humble `<select>` element provides a good interface for selecting one or more named options, but we often want to display these options using checkboxes or radio buttons. Rather than having separate implementation for each of these options, this module allows you to just use `<select>`s and it will transform them into groups of inputs and handle the two-way binding to keep them in sync.

## Usage

```
import SelectTransformer from 'select-transformer'; // see Module Formats below
new SelectTransformer(document.querySelector('select#my-select'));
```

The module checks the `select.multiple` property to decide whether to use radio buttons or checkboxes.

### jQuery

```
$('select#my-select').selectTransformer();
```

### Other DOM Manipulation Libraries

SelectTransformer uses a minimal set of jQuery fuctions, which could easily be provided by another library (such as domquery). You can use `SelectTransformer.setDOM()` to provide a jQuery-like object, but this hasn't been tested.

## Installation

### Module Formats

You will find all the popular formats in `dist/`.
