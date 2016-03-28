'use strict';

var tales = [];

function tell(fn, title) {
  tales.push({ fn: fn, title: title });
}

function match(tale) {
  var i, _tale, l = tales.length;
  for (i = 0; i < l; i++) {
    _tale = tales[i];
    if (_tale.title === tale.title) {
      return _tale;
    } else {
      throw new Error('tale not found', tale.title);
    }
  }
}

function executeTale(tale) {
  var matched = match(tale),
      context;
  if (matched) {
    context = tale; // linea innecesaria
    matched.fn.call(null, context);
  }
  return matched;
}

function runTales(tales) {
  tales.forEach((tale) => {
    executeTale({ title: tale.title, description: tale.description });
    if (tale.items) {
      if (tale.items.length > 0) {
        runTales(tale.items);
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
      runTales(tales);
    }, (error) => {
      throw error;
    });
  });
}


