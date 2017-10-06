var butter = Butter('7224488e24c2f449ccdc3402aa8000f9da281aee');
// select Butter Class
var selectButterClass = document.getElementsByClassName('butter');

// initialize butterRetrieve function for each element selected
(function init() {
  for (var i = 0; i < selectButterClass.length; i++) {
    butterRetrieve(selectButterClass[i]);
  }
})();

// retrieve data from butter
function butterRetrieve(item) {
  // get data slug
  var dataButter = item.dataset.slug;
  // remove whitespace with regex
  dataButter = dataButter.replace(/\s/g, '');

  // init retrieve function with data slug
  butter.content.retrieve([dataButter]).then(function(res) {
    // check data type of response data
    var type = typeof res.data.data[dataButter] === 'object';
    // set variable for data from buttercms
    var data = res.data.data[dataButter];

    // if type is an object ->
    if(type) {
      // get selector for collection data
      var bcSelector = item.dataset.bcSelector;
      // get property name for the collection data
      var propName = Object.keys(data[0])[0];
      // check if selector has a ","
      if(bcSelector.search(',') >= 0) {
        // split the slector on all commas
        bcSelector = bcSelector.split(',');
        // loop through the data and check if the selector
        // maches with the iteration count
        // then add the data that matched to the item
        for (var i = 0; i < data.length; i++) {
          for (var c = 0; c < bcSelector.length; c++) {
            if(i == bcSelector[c]) {
              item.innerHTML += data[i][propName];
            }
          }
        }
      } else if (bcSelector === 'all') {
        for (var i = 0; i < data.length; i++) {
          item.innerHTML += data[i][propName];
        }
      } else {
        item.innerHTML = data[bcSelector][propName];
      }
    } else {
      item.innerHTML = data;
    }
  })
}


// old code
function collection(bcSelector, propName, data, item) {
  var bcSelector = bcSelector;
  var propName = processSelectors(propName);

  if (bcSelector === 'all' || bcSelector === "") {
    for (var i = 0; i < data.length; i++) {
      iterateProps(propName, data[i], item)
    }
  } else if(searchForComma(bcSelector)) {
    bcSelector = processSelectors(bcSelector);
    for (var i = 0; i < data.length; i++) {
      for (var c = 0; c < bcSelector.length; c++) {
        if(i == bcSelector[c]) {
          iterateProps(propName, data[i], item)
        }
      }
    }
  } else {
    item.innerHTML = data[bcSelector][propName];
  }
}

function iterateProps(propName, data, item) {
  for (var i = 0; i < propName.length; i++) {
    if(data[propName[i]] !== "") {
      addItem(item, data[propName[i]])
    }
  }
}

function addItem(item, data) {
  item.innerHTML += data;
}

function processSelectors(selector) {
  var selector = removeWhitespace(selector);
  if(searchForComma(selector)) {
    return splitComma(selector)
  } else {
    return selector;
  }
}

function searchForComma(el) {
  return el.search(',') >= 0;
}

function splitComma(el) {
  return el.split(',');
}

function removeWhitespace(el) {
  return el.replace(/\s/g, '');
}
