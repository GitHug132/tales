(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Context = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parse = parse;
  exports.Context = Context;
  function parse(text) {
    function parseTales(text) {
      var f_c = text.replace(/#.*/g, '');
      var item_re = /(?:\n{0,1}(.+))+/g;
      var tab_re = /((?:\n {2}|\n\t{1}).+)+/g;
      var item, tab, current_item;
      var result = [];

      tab = tab_re.exec(f_c);
      if (!tab) {
        tab = [];
      }
      while ((item = item_re.exec(f_c)) !== null) {
        if (item.index === item_re.lastIndex) {
          item_re.lastIndex++;
        }
        if (item[0] === tab[0]) {
          if (tab.index === tab_re.lastIndex) {
            tab_re.lastIndex++;
          }
          current_item.subtale += tab[0].replace(/\n {2}|\n\t{1}/g, '\n') + '\n';
          tab = tab_re.exec(f_c);
          if (!tab) {
            tab = [];
          }
        } else {
          current_item = {
            tale: item[0],
            subtale: ""
          };
          result.push(current_item);
        }
      }
      return result;
    }
    var result = [],
        tale,
        tales;
    var title_re = /(.+)/,
        title,
        description;
    parseTales(text).forEach(function (item) {
      tale = {};
      title = title_re.exec(item.tale);
      description = item.tale.replace(title[0], '').trim().replace(/\n/g, ' ').replace(/(  )+/g, ' ').replace(/(  )+/g, ' ');
      tale.title = title[0].trim().replace(/(  )+/g, ' ').replace(/(  )+/g, ' ');
      tale.description = description.trim();
      if (item.subtale !== "") {
        tale.tales = parse(item.subtale);
      }
      result.push(tale);
    });
    return result;
  }

  function Context() {
    var definitions = {
      items: [],
      parent: null
    },
        current_parent = definitions;

    this.getParent = function getParent() {
      return current_parent;
    };

    this.setParent = function setParent(parent) {
      current_parent = parent;
    };
  }

  Context.prototype.tell = function tell(fn, title) {
    var definitions = this.getParent();
    definitions.items.push({
      fn: fn,
      title: title,
      items: [],
      parent: definitions
    });
  };

  function match(tale, definitions) {
    var i,
        definition,
        l = definitions.items.length;
    for (i = 0; i < l; i++) {
      definition = definitions.items[i];
      if (definition.title === tale.title) {
        return definition;
      }
    }
    throw new Error('not found "' + tale.title + '"');
  }

  Context.prototype.executeTale = function executeTale(tale, parent) {
    var matched, context;

    matched = match(tale, parent);
    if (matched) {
      this.setParent(matched);
      context = JSON.parse(JSON.stringify(tale));
      matched.fn(context);
      this.setParent(parent);
    }
    return matched;
  };

  Context.prototype.runTales = function runTales(tales, parent) {
    var _this = this;

    var executed;

    tales.forEach(function (tale) {
      executed = _this.executeTale({ title: tale.title, description: tale.description }, parent);
      if (tale.tales) {
        if (tale.tales.length > 0) {
          _this.runTales(tale.tales, executed);
        }
      }
    });
  };

  Context.prototype.run = function run() {
    var _this2 = this;

    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    arg.forEach(function (url) {
      fetch(url).then(function (response) {
        if (response.ok) {
          return response.text().then(function (text) {
            return parse(text);
          });
        } else {
          throw new Error(response.url + ' ' + response.statusText + ' (' + response.status + ')');
        }
      }).then(function (tales) {
        _this2.runTales(tales, _this2.getParent());
      }, function (error) {
        throw error;
      });
    });
  };
});