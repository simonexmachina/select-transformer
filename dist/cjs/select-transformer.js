"use strict";
/* global jQuery */
var dom = jQuery;

var SelectTransformer = function(select, opts) {
  // handle being passed a jQuery object
  if (!(select instanceof Element)) select = select[0];
  this.select = select;
  dom(this.select).data('SelectTransformer', this);

  this.inputType = this.select.multiple ? 'checkbox' : 'radio';
  for (var i in opts || {}) {
    if (opts.hasOwnProperty(i)) this.options[i] = opts[i];
  }

  this.build();
  this.listen();

  this.root = new STOptionSet(this);
  this.root.el = this.el;
  this.root.update(this.select);

  this.select.style.display = 'none';
  this.insert();
};

SelectTransformer.prototype.build = function() {
  this.el = document.createElement('div');
  this.el.className = 'st-container st-group';
};
SelectTransformer.prototype.listen = function() {
  dom(this.select).on('change', this.update.bind(this));
  dom(this.el).on('change', this.inputChanged.bind(this));
};
SelectTransformer.prototype.insert = function() {
  this.select.parentNode.insertBefore(this.el, this.select);
};
SelectTransformer.prototype.update = function() {
  this.root.update(this.select);
};
SelectTransformer.prototype.inputChanged = function(ev) {
  var input = ev.target,
      options = this.select.options, i;
  for (i = 0; i < options.length; i++) {
    if (options[i].value == input.value) options[i].selected = input.checked;
  }
  dom(this.select).trigger('change');
};
SelectTransformer.init = function(el) {
  return new SelectTransformer(el);
};
SelectTransformer.setDom = function(jQueryish) {
  dom = jQueryish;
};

var STOptionSet = function(transformer) {
  this.transformer = transformer;

  this.inputs = [];
  this.groups = [];
};
STOptionSet.prototype.update = function(parent) {
  var newInputs = [],
      newGroups = [];
  // construct a set of Inputs and OptGroups for the select
  dom(parent.children)
    .filter('option, optgroup')
    .each(function(i, el) {
      var child;
      if (el.tagName == 'OPTION') {
        child = this.inputFor(el);
        if (!child) {
          child = new STInput(el, this.transformer);
          this.inputs.push(child);
        }
        child.update();
        newInputs.push(child);
      }
      else {
        child = this.groupFor(el);
        if (!child) {
          child = new STOptGroup(el, this.transformer);
          this.groups.push(child);
        }
        child.update(el);
        newGroups.push(child);
      }
      this.el.appendChild(child.el);
    }.bind(this)
  );
  // handle removing inputs or groups that have been removed
  prune.call(this, 'inputs', newInputs);
  prune.call(this, 'groups', newGroups);

  function prune(prop, newMembers) {
    var oldMembers = this[prop];
    for (var i = 0; i < oldMembers.length; i++) {
      var input = oldMembers[i];
      if (newMembers.indexOf(input) == -1) {
        dom(input.el).remove();
      }
    }
    this[prop] = newMembers;
  }
};

STOptionSet.prototype.inputFor = function(optionEl) {
  for (var i = 0; i < this.inputs.length; i++) {
    var input = this.inputs[i];
    if (input.optionEl == optionEl) return input;
  }
};
STOptionSet.prototype.groupFor = function(optgroupEl) {
  for (var i = 0; i < this.groups.length; i++) {
    var group = this.groups[i];
    if (group.optgroupEl == optgroupEl) return group;
  }
};
STOptionSet.prototype.findOption = function(optionEl) {
  var input = this.inputFor(optionEl);
  if (!input) {
    for (var i = 0; !input && i < this.groups.length; i++) {
      input = group.findOption(optionEl);
    }
  }
  return input;
};

var STOptGroup = function(optgroup, transformer) {
  this.optgroupEl = optgroup;
  STOptionSet.call(this, transformer);
  this.build(optgroup);
  this.update(optgroup);
};
STOptGroup.prototype = Object.create(STOptionSet.prototype);
STOptGroup.prototype.build = function(optgroup) {
  this.el = document.createElement('div');
  this.el.className = 'st-group';
  var label = document.createElement('div');
  label.className = 'st-group-label';
  label.innerText = optgroup.label;
  this.el.appendChild(label);
};

var STInput = function(optionEl, transformer) {
  var el, input, label;

  el = document.createElement('label');
  el.className = 'st-option' + (optionEl.value ? '' : ' st-no-value');

  input = document.createElement('input');
  input.name = transformer.select.name;
  input.type = transformer.inputType;

  label = document.createElement('span');

  el.appendChild(input);
  el.appendChild(label);

  this.optionEl = optionEl;
  this.el = el;
  this.input = input;
  this.label = label;
};
STInput.prototype.update = function() {
  var option = this.optionEl;
  this.input.value = option.value;
  this.input.checked = option.selected;
  this.label.innerHTML = option.innerHTML;
};

if (jQuery) {
  jQuery.fn.selectTransformer = function(options) {
 		return this.each(function() {
 			new SelectTransformer(this, options);
 		});
 	};
}

exports["default"] = SelectTransformer;