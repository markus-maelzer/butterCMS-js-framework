
// select "butter" class to push the content into it later
var selectButterClass = document.getElementsByClassName('butter');

(function init() {
  var object = {
    slugs: [],
    items: []
  }
  for (var i = 0; i < selectButterClass.length; i++) {
    object.slugs.push(selectButterClass[i].dataset.slug)
    object.items.push(selectButterClass[i])
  }
  butterRetrieve(object)
})();

function butterRetrieve(object) {
  butter.content.retrieve(object.slugs).then(function(res) {

    for (var i = 0; i < object.slugs.length; i++) {
      var type = typeof res.data.data[object.slugs[i]] === 'object';
      var data = res.data.data[object.slugs[i]];
      var item = object.items[i];

      if(type) {
        // work with collection
        var bcSelector = processSelectors(item.dataset.bcSelector);

        if(bcSelector.length > 1) {
          for (var i = 0; i < bcSelector.length; i++) {
            processCollection(item, data, bcSelector, i);
          }
        } else {
          processCollection(item, data, bcSelector);
        }
      } else {
        // work with singel item
        if(isImage(item) || isVideo(item)) {
          item.setAttribute('src', data);
        } else {
          item.innerHTML = data;
        }
      }
    }
  })
}

function processCollection(item, data, bcSelector, i) {
  var i = i || 0;

  var markup = item.children[0].cloneNode(true);
  var propElements = markup.querySelectorAll('[data-prop]');

  for (var c = 0; c < propElements.length; c++) {
    if(isImage(propElements[c])) {
      propElements[c].setAttribute('src', data[bcSelector[i]][propElements[c].dataset.prop]);
    } else {
      propElements[c].innerHTML = data[bcSelector[i]][propElements[c].dataset.prop];
    }
  }

  item.appendChild(markup);
}

function isImage(el) {
  return el.nodeName.toLowerCase() === 'img'
}

function isVideo(el) {
  return el.nodeName.toLowerCase() === 'source'
}

function collection(bcSelector, propName, data, item) {
  var bcSelector = bcSelector;
}

function processSelectors(selector) {
  var selector = removeWhitespace(selector);
  if(searchFor(selector, ',')) {
    return splitBy(selector, ',');
  } else if (searchFor(selector, '-')) {
    var c = splitBy(selector, '-');
    var fromTo = [];
    for (var i = c[0]; i <= c[1]; i++) {
      fromTo.push(i);
    }
    console.log(fromTo);
    return fromTo;
  } else {
    return selector;
  }
}

function searchFor(el, search) {
  return el.search(search) >= 0;
}

function splitBy(el, split) {
  return el.split(split);
}

function removeWhitespace(el) {
  return el.replace(/\s/g, '');
}
