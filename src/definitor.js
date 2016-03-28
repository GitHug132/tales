'use strict';

function Context() {

  var definitions = {
        items:[],
        parent: null
      },
      current_parent = definitions;

  function getParent() {
    return current_parent;
  }

  function setParent(parent) {
    current_parent = parent;
  }

}

Context.prototype.tell = function tell(fn, title) {
  console.log('tell', title);
  var definitions = this.getParent();
  definitions.items.push({
    fn: fn,
    title: title,
    items: [],
    parent: definitions
  });
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

Context.prototype.executeTable = function executeTale(tale, parent) {
  var matched,
      context;

  matched = match(tale, parent);
  if (matched) {
    this.setParent(matched);
    console.log('set parent >', matched);
    context = JSON.parse(JSON.stringify(tale));
    matched.fn.call(null, context);
    this.setParent(parent);
    console.log('set parent <', parent);
  }
  return matched;
}

Context.prototype.runTales = function runTales(tales, parent) {
  var executed;
  console.log('runTales', tales, parent);

  tales.forEach((tale) => {
    executed = this.executeTale({ title: tale.title, description: tale.description }, parent);
    if (tale.tales) {
      if (tale.tales.length > 0) {
        this.runTales(tale.tales, executed);
      }
    }
  });
}

Context.prototype.run = function run(...arg) {
  arg.forEach((url) => {
    fetch(url).then((response) => {
      if (response.ok) {
        return response.text().then((text) => { return parse(text); });
      } else {
        throw new Error(`${response.url} ${response.statusText} (${response.status})`);
      }
    }).then((tales) => {
      this.runTales(tales, this.getParent());
    }, (error) => {
      throw error;
    });
  });
}


