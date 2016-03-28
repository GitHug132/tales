function parse(text) {
  'use strict';
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
        }
        result.push(current_item);
      }
    }
    return result;
  }
  var result = [],
      tale, tales;
  var title_re = /(.+)/,
      title,
      description;
  parseTales(text).forEach((item) => {
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
