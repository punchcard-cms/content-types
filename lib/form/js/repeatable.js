/* eslint-env browser */

(function formRepeatable() {

  // Splits the string and pops the last element
  var splitPop = function (input, splitter) {
    input = input.split(splitter);
    input.pop();
    input = input.join(splitter);
    return input;
  }

  // Iterates through every instance of input-plugins
  Object.keys(allSettings).forEach(function (input) {
    var idAdd = input + '--add';
    var idDelete = input + '--delete';

    // handles delete button events
    var deleteHandler = function (e) {
      var node = e.currentTarget.parentNode;
      var siblingNode = node.nextElementSibling;
      var nodeId;
      var splitChild;
      var id;
      var htmlFor;

      // Selects all elements under it
      var childNodes = node.querySelectorAll('*');

      // update allInputs and allIds;
      childNodes.forEach(function (child) {
        if (allInputs.hasOwnProperty(child.id)){
          delete allInputs[child.id];
        }
        if (allIDs.hasOwnProperty(child.id)) {
          delete allIDs[child.id];
        }
      });

      var parent = node.parentNode;
      parent.removeChild(node);
      allRepeatables[input].length--;

      // change ids and names of subsequest instances
      while (siblingNode) {
        if (siblingNode.getAttribute('class') == 'form--repeatable') {
          nodeId = siblingNode.id.split("--");
          nodeId[nodeId.length-1]--;
          nodeId = nodeId.join('--');
          siblingNode.id = nodeId;
          childNodes = siblingNode.querySelectorAll('*');
          childNodes.forEach(function (child) {
            if (child.id && child.id != '') {
              splitChild = child.id.split('--');
              index = splitChild[splitChild.length-1];
              if (!isNaN(index)) {
                splitChild[splitChild.length-1] = index - 1;
                var oldChildId = child.id;
                child.id = splitChild.join('--');

                // Maintains state of allInputs
                if (allInputs.hasOwnProperty(oldChildId)) {
                  allInputs[child.id] = allInputs[oldChildId];
                  delete allInputs[oldChildId];
                }
                if (allIDs.hasOwnProperty(oldChildId)) {
                  // Maintains state of allIDs for changing inputs
                  allIDs[child.id] = allIDs[oldChildId];
                  delete allIDs[oldChildId];
                }
              }
              var childName = child.getAttribute('name');
              if (childName) {
                childName = childName.split('--');
                index = childName[childName.length-1];
                if (!isNaN(index)) {
                  childName[childName.length-1] = index - 1;
                  child.setAttribute('name', childName.join('--'));
                }
              }
            }
            else if (child.htmlFor && child.htmlFor != "") {
              splitChild = child.htmlFor.split('--');
              htmlFor = splitChild[splitChild.length-1];
              if (!isNaN(htmlFor)) {
                splitChild[splitChild.length-1] = htmlFor - 1;
                child.htmlFor = splitChild.join('--');
              }
            }
          });
        }
        siblingNode = siblingNode.nextElementSibling;
      }

      if (allRepeatables[input].length == 1) {
        var container, nodeId, id, name, htmlFor;
        container = parent.querySelectorAll('.form--repeatable')[0];
        nodeId = splitPop(container.id, '--')
        container.id = nodeId;
        childNodes = container.querySelectorAll('*');
        childNodes.forEach(function(child) {
          if (child.id != '') {
            child.id = splitPop(child.id, '--');
            name = child.getAttribute('name');
            if(name) {
              name = splitPop(name, '--');
              child.setAttribute('name', name);
            }
          }
          else if (child.htmlFor && child.htmlFor != '') {
            child.htmlFor = splitPop(child.htmlFor, '--');
          }
        });
        container.removeChild(container.querySelectorAll('#' + input + '--delete')[0]);
      }
    };

    // Handles add button event
    var addHandler = function (e) {

      // Holds the first input element of instance
      var focusChild;

      // selects first container of instance
      var container = e.currentTarget.parentNode.querySelectorAll('.form--repeatable')[0];

      // Modify name of initial instance and adds delete button
      if (allRepeatables[input].length == 1) {
        var newElement = document.createElement('button');
        newElement.type = 'button';
        newElement.innerHTML = 'Delete';
        newElement.id = input + '--delete';
        newElement.setAttribute('class', 'delete--button')
        newElement.addEventListener("click", deleteHandler);
        container.appendChild(newElement);
        container.id = container.id + '--' + (allRepeatables[input].length-1);
        var childNodes = container.querySelectorAll('*')
        childNodes.forEach( function(child) {
          if (child.id != "") {
            child.id = child.id + '--' + (allRepeatables[input].length-1);
            var name = child.getAttribute('name');
            if (name) {
              child.setAttribute('name', name +  '--' + (allRepeatables[input].length-1));
            }
          }
          else if (child.htmlFor && child.htmlFor != "") {
            child.htmlFor = child.htmlFor + '--' + (allRepeatables[input].length-1);
          }
        });
      }

      // deep clones the existing instance
      var newContainer = container.cloneNode(true);
      var idMap = {};

      newContainer.id = newContainer.id.split('--')[0] + '--' + allRepeatables[input].length;
      var childNodes = newContainer.querySelectorAll('*');
      childNodes.forEach( function (child) {
        if (child.id != ''){
          id = splitPop(child.id, '--');
          var name = child.getAttribute('name');
          if (name) {
            name = splitPop(name, '--');
            child.setAttribute('name', name +  '--' + allRepeatables[input].length);
          }

          if (idMap.hasOwnProperty(id)){
            child.id = idMap[id];
          }
          else {
            var newId = id + '--' + allRepeatables[input].length;
            idMap[id] = newId;
            child.id = newId;
          }

          if (child.type == 'checkbox' || child.type == 'radio') {
            child.checked = false;
          }
          else if (child.selectedIndex != null) {
            child.selectedIndex = 0;
          }
          else if (child.id.indexOf(idDelete) < 0){
            child.value = '';
          }

          if (child.id.indexOf(idDelete) > -1) {
            child.addEventListener('click', deleteHandler);
          }
          if (!focusChild) {
            focusChild = child;
          }
        }
        else if (child.htmlFor && child.htmlFor != '') {
          var htmlFor = splitPop(child.htmlFor, '--');
          if (idMap.hasOwnProperty(htmlFor)){
            child.htmlFor = idMap[htmlFor];
          }
          else {
            var newHtmlFor = htmlFor + '--' + allRepeatables[input].length;
            idMap[htmlFor] = newHtmlFor;
            child.htmlFor = newHtmlFor;
          }
        }
      });

      // Increments length of attribute
      allRepeatables[input].length++;
      var containerSet = container.parentNode.querySelectorAll('.form--repeatable');

      // Retrives element next to last container
      var lastContainer = containerSet[containerSet.length-1].nextSibling;

      container.parentNode.insertBefore(newContainer, lastContainer);

      // Return focus to first input of new instance
      focusChild.focus();

      // Add new input to allInputs
      Object.keys(idMap).forEach( function (id) {
        if (allInputs.hasOwnProperty(id)) {
          allInputs[idMap[id]] = Object.assign({}, allInputs[id]);
          if (!allIDs.hasOwnProperty(idMap[id])) {

            // Maintains state of allIDs for new inputs
            allIDs[idMap[id]] = document.getElementById(idMap[id]);

            // Adds validation to new input
            allIDs[idMap[id]].addEventListener(allInputs[idMap[id]].validation.on, validate);
          }
        }
      });
    };

    // Adds event listener for existing delete button
    document.querySelectorAll('.delete--button').forEach(function (button) {
      button.addEventListener('click', deleteHandler);
    });

    var addButton = document.getElementById(idAdd);

    if (addButton) {
      addButton.addEventListener('click', addHandler);
    }
  });
}());
