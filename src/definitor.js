'use strict';

var definitions = {
      items:[],
      parent: null
    },
    current_parent = definitions;

function tell(fn, title) {
  console.log('tell', title);
  var definitions = getParent();
  definitions.items.push({
    fn: fn,
    title: title,
    items: [],
    parent: definitions
  });
}

function getParent() {
  return current_parent;
}

function setParent(parent) {
  current_parent = parent;
}

function match(tale, definitions) {
  var i, definition, l = definitions.items.length;
  for (i = 0; i < l; i++) {
    definition = definitions.items[i];
    if (definition.title === tale.title) {
      return definition;
    }
  }
  throw new Error(`not found "${tale.title}"`);
}

function executeTale(tale, parent) {
  var matched,
      context;

  matched = match(tale, parent);
  if (matched) {
    setParent(matched);
    console.log('set parent >', matched);
    context = JSON.parse(JSON.stringify(tale));
    matched.fn.call(null, context);
    setParent(parent);
    console.log('set parent <', parent);
  }
  return matched;
}

function runTales(tales, parent) {
  var executed;
  console.log('runTales', tales, parent);

  tales.forEach((tale) => {
    executed = executeTale({ title: tale.title, description: tale.description }, parent);
    if (tale.tales) {
      if (tale.tales.length > 0) {
        runTales(tale.tales, executed);
      }
    }
  });
}

function run(...arg) {
  arg.forEach((url) => {
    fetch(url).then((response) => {
      if (response.ok) {
        return response.text().then((text) => { return parse(text); });
      } else {
        throw new Error(`${response.url} ${response.statusText} (${response.status})`);
      }
    }).then((tales) => {
      runTales(tales, getParent());
    }, (error) => {
      throw error;
    });
  });
}


