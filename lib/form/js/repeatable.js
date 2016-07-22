/* eslint-env browser */
/* global allPlugins, allInputs, allSettings, allIDs, allRepeatables, validate */

(function formRepeatable() {
  'use strict';

  // Splits the string and pops the last element
  var splitPop = function pop(input, splitter) {
    var blocks = input.split(splitter);
    blocks.pop();
    blocks = blocks.join(splitter);

    return blocks;
  };

  // Iterates through every instance of input-plugins
  Object.keys(allSettings).forEach(function repeatableHandler(input) {
    var idAdd = input + '--add',
        idDelete = input + '--delete',
        deleteHandler,
        addHandler,
        addButton;

    deleteHandler = function deleteEventHandler(e) {
      var node = e.currentTarget.parentNode,
          siblingNode = node.nextElementSibling,
          splitChild,
          nodeId,
          container,
          name,
          childNodes = node.querySelectorAll('*'),
          parent = node.parentNode,
          deleteNode;

      // update allInputs and allIds;
      childNodes.forEach(function deleteIDandInput(child) {
        if (allInputs.hasOwnProperty(child.id)) {
          delete allInputs[child.id];
        }
        if (allIDs.hasOwnProperty(child.id)) {
          delete allIDs[child.id];
        }
      });

      parent.removeChild(node);
      allRepeatables[input].length--;

      deleteNode = function deleteElement(key) {
        var index,
            oldChildId,
            childName,
            htmlFor,
            child = key;
        if (child.id && child.id !== '') {
          splitChild = child.id.split('--');
          index = splitChild[splitChild.length - 1];
          if (!isNaN(index)) {
            splitChild[splitChild.length - 1] = index - 1;
            oldChildId = child.id;
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
          childName = child.getAttribute('name');
          if (childName) {
            childName = childName.split('--');
            index = childName[childName.length - 1];
            if (!isNaN(index)) {
              childName[childName.length - 1] = index - 1;
              child.setAttribute('name', childName.join('--'));
            }
          }
        }
        else if (child.htmlFor && child.htmlFor !== '') {
          splitChild = child.htmlFor.split('--');
          htmlFor = splitChild[splitChild.length - 1];
          if (!isNaN(htmlFor)) {
            splitChild[splitChild.length - 1] = htmlFor - 1;
            child.htmlFor = splitChild.join('--');
          }
        }
      };

      // change ids and names of subsequest instances
      while (siblingNode) {
        if (siblingNode.getAttribute('class') === 'form--repeatable') {
          nodeId = siblingNode.id.split('--');
          nodeId[nodeId.length - 1]--;
          nodeId = nodeId.join('--');
          siblingNode.id = nodeId;
          childNodes = siblingNode.querySelectorAll('*');
          childNodes.forEach(deleteNode);
        }
        siblingNode = siblingNode.nextElementSibling;
      }

      if (allRepeatables[input].length === 1) {
        container = parent.querySelectorAll('.form--repeatable')[0];
        nodeId = splitPop(container.id, '--');
        container.id = nodeId;
        childNodes = container.querySelectorAll('*');
        childNodes.forEach(function setAttributes(key) {
          var child = key;
          if (child.id !== '') {
            child.id = splitPop(child.id, '--');
            name = child.getAttribute('name');
            if (name) {
              name = splitPop(name, '--');
              child.setAttribute('name', name);
            }
          }
          else if (child.htmlFor && child.htmlFor !== '') {
            child.htmlFor = splitPop(child.htmlFor, '--');
          }
        });
        container.removeChild(container.querySelectorAll('#' + input + '--delete')[0]);
      }
    };

    // Handles add button event
    addHandler = function addEventHandler(e) {
      // Holds the first input element of instance
      var focusChild,
          container,
          newElement,
          newContainer,
          idMap = {},
          childNodes,
          containerSet,
          lastContainer;

      // selects first container of instance
      container = e.currentTarget.parentNode.querySelectorAll('.form--repeatable')[0];

      // Modify name of initial instance and adds delete button
      if (allRepeatables[input].length === 1) {
        newElement = document.createElement('button');
        newElement.type = 'button';
        newElement.innerHTML = 'Delete';
        newElement.id = input + '--delete';
        newElement.setAttribute('class', 'delete--button');
        newElement.addEventListener('click', deleteHandler);
        container.appendChild(newElement);
        container.id = container.id + '--' + (allRepeatables[input].length - 1);
        childNodes = container.querySelectorAll('*');
        childNodes.forEach(function setAttributes(key) {
          var name,
              child = key;
          if (child.id !== '') {
            child.id = child.id + '--' + (allRepeatables[input].length - 1);
            name = child.getAttribute('name');
            if (name) {
              child.setAttribute('name', name + '--' + (allRepeatables[input].length - 1));
            }
          }
          else if (child.htmlFor && child.htmlFor !== '') {
            child.htmlFor = child.htmlFor + '--' + (allRepeatables[input].length - 1);
          }
        });
      }

      // deep clones the existing instance
      newContainer = container.cloneNode(true);
      newContainer.id = newContainer.id.split('--')[0] + '--' + allRepeatables[input].length;
      childNodes = newContainer.querySelectorAll('*');
      childNodes.forEach(function cloneAttribute(key) {
        var childName,
            newId,
            id,
            child = key,
            htmlFor,
            newHtmlFor;
        if (child.id !== '') {
          id = splitPop(child.id, '--');
          childName = child.getAttribute('name');
          if (childName) {
            childName = splitPop(childName, '--');
            child.setAttribute('name', childName + '--' + allRepeatables[input].length);
          }

          if (idMap.hasOwnProperty(id)) {
            child.id = idMap[id];
          }
          else {
            newId = id + '--' + allRepeatables[input].length;
            idMap[id] = newId;
            child.id = newId;
          }

          if (child.type === 'checkbox' || child.type === 'radio') {
            child.checked = false;
          }
          else if (child.tagName === 'SELECT') {
            child.selectedIndex = 0;
          }
          else if (child.id.indexOf(idDelete) < 0) {
            child.value = '';
          }

          if (child.id.indexOf(idDelete) > -1) {
            child.addEventListener('click', deleteHandler);
          }
          if (!focusChild) {
            focusChild = child;
          }
        }
        else if (child.htmlFor && child.htmlFor !== '') {
          htmlFor = splitPop(child.htmlFor, '--');
          if (idMap.hasOwnProperty(htmlFor)) {
            child.htmlFor = idMap[htmlFor];
          }
          else {
            newHtmlFor = htmlFor + '--' + allRepeatables[input].length;
            idMap[htmlFor] = newHtmlFor;
            child.htmlFor = newHtmlFor;
          }
        }
      });

      // Increments length of attribute
      allRepeatables[input].length++;
      containerSet = container.parentNode.querySelectorAll('.form--repeatable');

      // Retrives element next to last container
      lastContainer = containerSet[containerSet.length - 1].nextSibling;

      container.parentNode.insertBefore(newContainer, lastContainer);

      // Return focus to first input of new instance
      focusChild.focus();

      // Add new input to allInputs
      Object.keys(idMap).forEach(function setIdandInput(id) {
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
    document.querySelectorAll('.delete--button').forEach(function addsDeleteEvent(button) {
      button.addEventListener('click', deleteHandler);
    });

    addButton = document.getElementById(idAdd);
    if (addButton) {
      addButton.addEventListener('click', addHandler);
    }
  });
}());
