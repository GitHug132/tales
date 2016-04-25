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
    global.tales = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.parse = parse;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function parseTales(text) {
    var f_c = text.replace(/#.*/g, ''),
        item_re = /(?:\n{0,1}(.+))+/g,
        tab_re = /((?:\n {2}|\n\t{1}).+)+/g,
        item,
        tab,
        current_item,
        result = [];

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

  function parse(text) {
    var result = [],
        tale,
        tales,
        title_re = /(.+)/,
        title,
        description;
    parseTales(text).forEach(function (item) {
      tale = {};
      title = title_re.exec(item.tale);
      description = item.tale.replace(title[0], '').trim().replace(/(  )+/g, ' ').replace(/(  )+/g, ' ');
      tale.title = title[0].trim().replace(/(  )+/g, ' ').replace(/(  )+/g, ' ');
      tale.description = description.trim();
      if (item.subtale !== "") {
        tale.tales = parse(item.subtale);
      }
      result.push(tale);
    });
    return result;
  }

  function match(tale, definitions) {
    var result,
        arg,
        min = Infinity,
        params;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = definitions.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var definition = _step.value;

        if (definition.title.constructor === String) {
          if (definition.title === tale.title) {
            return definition;
          }
        } else if (definition.title.constructor === RegExp) {
          arg = tale.title.match(definition.title);
          if (arg) {
            if (arg[0] === arg.input) {
              params = arg.slice(1);
              if (min > params.length) {
                min = params.length;
                result = definition;
              }
            }
          }
        } else {
          throw new Error('unrecognized type of data for "' + definition.title + '" at "' + tale.title + '"');
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (result) {
      return result;
    }
    throw new Error('not found "' + tale.title + '"');
  }

  function executeTale(tale, parent) {
    var matched, context;
    matched = match(tale, parent);
    if (matched) {
      this.setParent(matched);
      context = JSON.parse(JSON.stringify(tale));
      matched.fn(context);
      this.setParent(parent);
    }
    return matched;
  }

  function runTales(tales, parent) {
    var _this = this;

    var executed;
    tales.forEach(function (tale) {
      executed = executeTale.call(_this, { title: tale.title, description: tale.description }, parent);
      if (tale.tales) {
        if (tale.tales.length > 0) {
          runTales.call(_this, tale.tales, executed);
        }
      }
    });
  }

  var Context = exports.Context = function () {
    function Context() {
      _classCallCheck(this, Context);

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

    _createClass(Context, [{
      key: 'tell',
      value: function tell(fn, title) {
        var definitions = this.getParent();
        definitions.items.push({
          fn: fn,
          title: title,
          items: [],
          parent: definitions
        });
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        var result = {
          ok: false,
          tales: []
        },
            process = function process(resolve, reject) {
          var urls = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = arg[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var url = _step2.value;

              urls.push(fetch(url).then(function (response) {
                if (response.ok) {
                  return response.text().then(function (text) {
                    return parse(text);
                  });
                } else {
                  throw new Error(response.url + ' ' + response.statusText + ' (' + response.status + ')');
                }
              }).then(function (tales) {
                runTales.call(_this2, tales, _this2.getParent());
                result.tales.push(url);
              }, function (error) {
                throw error;
              }));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          Promise.all(urls).then(function () {
            result.ok = true;
            resolve(result);
          }, function (error) {
            reject(error);
          });
        };
        return new Promise(process);
      }
    }]);

    return Context;
  }();
});