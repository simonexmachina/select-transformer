/* jshint expr: true */
var SelectTransformer = window.SelectTransformer.default,
    $fixture,
    expect = chai.expect;

before(function() {
  $fixture = $('<div id="fixture"></div>');
  $(document.body).append($fixture);
});
afterEach(function() {
  $fixture.html('');
});

describe('select-transformer', function() {
  it('transforms a select into radio buttons', function() {
    var st = new SelectTransformer(createSelect([1, 2]));
    expect($.contains($fixture[0], st.el)).to.be.true;
    expect($(st.select).is(':visible')).to.be.false;
    expect(st.el.className).to.have.string('st-container');
    expect(st.el.className).to.have.string('st-group');
    expect($(st.el).find('input[type="radio"]')).to.have.length(2);
    expect($(st.el).find('input[type="checkbox"]')).to.have.length(0);
    expect($(st.el).text()).to.equal('12');
  });
  it('transforms a multi-select into checkboxes', function() {
    var st = new SelectTransformer(createSelect([1, 2], true));
    expect($(st.el).find('input[type="checkbox"]')).to.have.length(2);
  });
  it('keeps radio buttons and the select in sync', function() {
    var select = createSelect([1, 2]),
        st = new SelectTransformer(select);
    expect(getSelected(select)).to.eql([true, false]); // because radio buttons

    // change the select
    select.options[1].selected = true;
    $(select).trigger('change');
    expect(getSelected(select)).to.eql(getChecked(st.el));

    // change an input
    $(st.el).find('.st-option:first-child input').attr('checked', true).trigger('change');
    expect(getChecked(st.el)).to.eql(getSelected(select));
  });
  it('keeps checkboxes and the select in sync', function() {
    var select = createSelect([1, 2], true),
        st = new SelectTransformer(select);
    expect(getSelected(select)).to.eql([false, false]); // because checkboxes

    // change the select
    select.options[1].selected = true;
    $(select).trigger('change');
    expect(getSelected(select)).to.eql(getChecked(st.el));

    // change an input
    $(st.el).find('.st-option:first-child input').attr('checked', true).trigger('change');
    expect(getChecked(st.el)).to.eql(getSelected(select));
  });
  it('#update handles options being added and removed', function() {
    var select = createSelect([1, 2]),
        st = new SelectTransformer(select);
    expect($(st.el).find('input')).to.have.length(2);

    addOption(3, select);
    st.update();
    expect($(st.el).find('input')).to.have.length(3);

    select.innerHTML = '';
    st.update();
    expect($(st.el).find('input')).to.have.length(0);
  });
  it('handles optgroups', function() {
    var select = createSelect([1, 2]),
        optGroup = addOptgroup('Group', select);
    addOptions([3, 4], optGroup);
    var st = new SelectTransformer(select);
    $group = $(st.el).find('.st-group');
    expect($group).to.have.length(1);
    expect($group.find('input[type="radio"]')).to.have.length(2);
    expect($group.text()).to.equal('34');
  });
  it('adds a class to indicate an option with no value', function() {
    var select = createSelect([1, 2], false, 'Prompt'),
        st = new SelectTransformer(select),
        $first = $(st.el).find('.st-option:first-child');
    expect($first).to.have.length(1);
    expect($first.hasClass('st-no-value')).to.be.true;
  });
});

function createSelect(options, multiple, prompt) {
  var select = document.createElement('SELECT');
  select.multiple = multiple;
  if (prompt) {
    var opt = document.createElement('OPTION');
    opt.value = '';
    opt.text = prompt;
    select.appendChild(opt);
  }
  addOptions(options, select);
  $fixture.append(select);
  return select;
}
function addOptions(options, parent) {
  for (var i = 0; i < options.length; i++) {
    addOption(options[i], parent);
  }
}
function addOption(option, parent) {
  var opt = document.createElement('OPTION');
  opt.text = opt.value = option;
  parent.appendChild(opt);
}
function addOptgroup(label, select) {
  var optGroup = document.createElement('OPTGROUP');
  optGroup.text = label;
  select.appendChild(optGroup);
  return optGroup;
}
var slice = Array.prototype.slice;
function getSelected(select) {
  return slice.call(select.options).map(function(option) {
    return option.selected;
  });
}

function getChecked(el) {
  return $(el).find('.st-option input').get().map(function(input) {
    return input.checked;
  });
}
