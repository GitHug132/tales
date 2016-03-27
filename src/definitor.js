'use strict';

var definitions = [];

function context(fn, title) {
  definitions.push({ fn: fn, title: title });
}

function matchContext(context) {
  var i, definition, l = definitions.length;
  for (i = 0; i < l; i++) {
    definition = definitions[i];
    if (definition.title === context.title) {
      return definition;
    } else {
      throw new Error('context not found', context.title);
    }
  }
}

function executeContext(context) {
  var matched = matchContext(context);
  return matched;
}

function runContext(items) {
  var parent_context = definitions;
  items.forEach((item) => {
    executeContext({ title: item.title, description: item.description });
    if (item.items) {
      if (item.items.length > 0) {
        runContext(item.items);
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
    }).then((tale) => {
      runContext(tale);
    }, (error) => {
      throw error;
    });
  });
}


