'use strict';

var definitions = [];

function tell(fn, title) {
  definitions.push({ fn: fn, title: title });
}

function match(tale) {
  var i, definition, l = definitions.length;
  for (i = 0; i < l; i++) {
    definition = definitions[i];
    if (definition.title === tale.title) {
      return definition;
    }
  }
  throw new Error(`not found "${tale.title}"`);
}

function executeTale(tale) {
  var matched = match(tale),
      context;
  if (matched) {
    context = JSON.parse(JSON.stringify(tale));
    matched.fn.call(null, context);
  }
  return matched;
}

function generateParent(current, parent) {
  return {
    current: current,
    parent: function() {
      return parent;
    }
  };
}

function runTales(tales, parent) {
  console.log(parent.current, parent.parent());
  tales.forEach((tale) => {
    executeTale({ title: tale.title, description: tale.description });
    if (tale.tales) {
      if (tale.tales.length > 0) {
        runTales(tale.tales, generateParent(tale.tales, parent));
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
      runTales(tales, generateParent(definitions, null));
    }, (error) => {
      throw error;
    });
  });
}


