var fs = require('fs');

global.fetch = function fetch(url) {
  return new Promise((resolve, reject) => {
    var text = fs.readFileSync(url, 'utf8');
    var response = {
      ok: true,
      text: function() {
        return new Promise((resolve, reject) => {
          resolve(text);
        });
      },
      json: function() {
        return new Promise((resolve, reject) => {
          resolve(JSON.parse(text));
        });
      }
    };
    resolve(response);
  });
};
