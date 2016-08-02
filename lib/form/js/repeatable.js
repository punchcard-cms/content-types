/* eslint-env browser */
/* global allPlugins, allInputs, allSettings, allIDs, allRepeatables, validate */

(function formRepeatable() {
  'use strict';

  // Splits the string and pops the last element
  var splitPop = function splitPop(input, splitter) {
        var blocks = input.split(splitter);
        blocks.pop();
        blocks = blocks.join(splitter);

        return blocks;
      },

      updateIndex = function updateIndex(input, index) {
        var inputString = input;
        inputString = inputString.split('--');
        if (inputString.length > 1) {
          inputString[1] = index;
        }
        else {
          inputString.push(index);
        }

        return inputString.join('--');
      },

      // Removes add button
      setAdd = function setAdd(node) {
        var childNodes = node.querySelectorAll('.form--repeatable'),
            element = document.createElement('button');
        element.type = 'button';
        element.textContent = 'Add';
        element.id = node.id + '--add';
        element.setAttribute('class', 'form--add');

        // rule disable as adding 'add' button is required in deleteHandler and addHandler requires to add 'Delete' button
        element.addEventListener('click', addHandler); // eslint-disable-line no-use-before-define
        node.insertBefore(element, childNodes[childNodes.length - 1].nextSibling);
      },

      // update index of id to 'index'
      updateId = function updateId(id, index) {
        var splitId = id.split('--'),
            num = splitId[1];

        if (!isNaN(num)) {
          if (index === undefined) {
            return splitPop(id, '--');
          }
          splitId[1] = index;

          return splitId.join('--');
        }
        splitId.push(index);

        return splitId.join('--');
      },

      // Update Siblings in allInputs
      updateSiblings = function updateSiblings(id, index) {
        Object.keys(allInputs[id].siblings).forEach(function siblings(key) {
          allInputs[id].siblings[key] = updateId(allInputs[id].siblings[key], index);
        });
      },

      // Maintains state of allIds and allInputs
      updateIdsAndInputs = function updateIdsAndInputs(id, oldId, index) {
        if (allInputs.hasOwnProperty(oldId)) {
          allInputs[id] = allInputs[oldId];
          updateSiblings(id, index);
          delete allInputs[oldId];
        }
        if (allIDs.hasOwnProperty(oldId)) {
          allIDs[id] = allIDs[oldId];
          delete allIDs[oldId];
        }
      },

      // decrement index of htmlfor by 1
      decrementHtmlFor = function decrementHtmlFor(node) {
        var child = node,
            splitChild = child.getAttribute('for').split('--'),
            index = splitChild[1];
        if (!isNaN(index)) {
          splitChild[1] = index - 1;
          child.setAttribute('for', splitChild.join('--'));
        }
      },

      // decrement index of id by 1 and calls updateIdsAndInputs
      decrementId = function decrementId(node) {
        var child = node,
            splitChild = child.id.split('--'),
            index = splitChild[1],
            oldChildId = child.id;
        if (!isNaN(index)) {
          splitChild[1] = index - 1;
          child.id = splitChild.join('--');
          updateIdsAndInputs(child.id, oldChildId, index - 1);
        }
      },

      // decrement index of name by 1
      decrementName = function decrementName(node) {
        var child = node,
            childName = child.getAttribute('name');
        if (childName) {
          childName = childName.split('--');
          if (!isNaN(childName[2])) {
            childName[2] = childName[2] - 1;
            child.setAttribute('name', childName.join('--'));
          }
        }
      },

      // Updates node
      updateNode = function updateNode(key) {
        var child = key;
        if (child.id && child.id !== '') {
          decrementId(child);
          decrementName(child);
        }
        else if (child.getAttribute('for') && child.getAttribute('for') !== '') {
          decrementHtmlFor(child);
        }
      },

      // Delete node from allIDs and allInputs
      deleteIdsAndInputs = function deleteIdsAndInputs(nodes) {
        var childNodes = nodes;
        Array.prototype.forEach.call(childNodes, function deleteIDandInput(child) {
          if (allInputs.hasOwnProperty(child.id)) {
            delete allInputs[child.id];
          }
          if (allIDs.hasOwnProperty(child.id)) {
            delete allIDs[child.id];
          }
        });
      },

      // Update values of instance
      updateInstance = function updateInstance(instance) {
        var nodeId = instance.id.split('--'),
            childNodes = instance.querySelectorAll('*'),
            node = instance;

        // Decrements id of container
        if (!isNaN(nodeId[1])) {
          nodeId[1]--;
        }
        node.id = nodeId.join('--');
        Array.prototype.forEach.call(childNodes, updateNode);
      },

      // Handles delete events
      deleteHandler = function deleteHandler(e) {
        var node = e.currentTarget.parentNode,
            siblingNode = node.nextElementSibling,
            containers,
            parent = node.parentNode,
            attribute = parent.id;
        if (allRepeatables[attribute].length === allRepeatables[attribute].max) {
          setAdd(node.parentNode);
        }

        // removes child
        parent.removeChild(node);
        allRepeatables[attribute].length--;
        deleteIdsAndInputs(node.querySelectorAll('*'));

        // change ids and names of subsequest instances
        while (siblingNode) {
          if (siblingNode.getAttribute('class') === 'form--repeatable') {
            updateInstance(siblingNode);
          }
          siblingNode = siblingNode.nextElementSibling;
        }

        // remove index if there is just one instance left
        if (allRepeatables[attribute].length === allRepeatables[attribute].min) {
          containers = parent.querySelectorAll('.form--repeatable');
          Array.prototype.forEach.call(containers, function removeDelete(instance) {
            instance.removeChild(instance.querySelector('.form--delete'));
          });
        }
      },

      // Create and return delete button
      newDeleteButton = function newDeleteButton(attribute, index) {
        var element = document.createElement('button');
        element.type = 'button';
        element.textContent = 'Delete';
        element.id = attribute + '--delete--' + index;
        element.setAttribute('class', 'form--delete');
        element.addEventListener('click', deleteHandler);

        return element;
      },

      // Add new input to allInputs
      setIDsAndInputs = function setIDsAndInputs(idMap, index) {
        Object.keys(idMap).forEach(function setIdandInput(id) {
          if (allInputs.hasOwnProperty(id)) {
            allInputs[idMap[id]] = Object.assign({}, allInputs[id]);
            updateSiblings(id, index);
            if (!allIDs.hasOwnProperty(idMap[id])) {
              allIDs[idMap[id]] = document.getElementById(idMap[id]);

              // Adds validation to new input
              allIDs[idMap[id]].addEventListener(allInputs[idMap[id]].validation.on, validate);
            }
          }
        });
      },

      // Adds index to id
      setId = function setId(node, map, index) {
        var child = node,
            idMap = map;
        if (idMap.hasOwnProperty(child.id)) {
          child.id = idMap[child.id];
        }
        else {
          // idMap[child.id] = splitPop(child.id, '--') + '--' + index;
          idMap[child.id] = updateIndex(child.id, index);
          child.id = idMap[child.id];
        }
      },

      // Adds index to HTMLFor
      setHtmlFor = function setHtmlFor(node, map, index) {
        var child = node,
            idMap = map,
            htmlFor = child.getAttribute('for');
        if (idMap.hasOwnProperty(htmlFor)) {
          child.setAttribute('for', idMap[htmlFor]);
        }
        else {
          idMap[htmlFor] = updateIndex(htmlFor, index);
          child.setAttribute('for', idMap[htmlFor]);
        }
      },

      // Adds index to name attribute if exists
      setName = function setName(node, index) {
        var child = node,
            childName = child.getAttribute('name');
        if (childName) {
          childName = childName.split('--');
          if (childName.length > 2) {
            childName[2] = index;
          }
          else {
            childName.push(index);
          }
          child.setAttribute('name', childName.join('--'));
        }
      },

      // Clear value of input
      clearValues = function clearValues(node) {
        var child = node;
        if (child.type === 'checkbox' || child.type === 'radio') {
          child.checked = false;
        }
        else if (child.tagName === 'SELECT') {
          child.selectedIndex = 0;
        }
        else if (child.getAttribute('class') !== 'form--delete') {
          child.value = '';
        }
      },

      // Updates attribute of instance and returns the first input
      newInstance = function newInstance(instance, map, index) {
        var idMap = map,
            container = instance,
            firstInput;

        // Adds index to id of container
        container.id = updateIndex(container.id, index);
        Array.prototype.forEach.call(container.querySelectorAll('.form--alert'), function removeAlert(alert) {
          container.removeChild(alert);
        });
        Array.prototype.forEach.call(container.querySelectorAll('*'), function cloneAttribute(child) {
          if (child.id !== '') {
            setName(child, index);
            setId(child, idMap, index);
            clearValues(child);

            // Sets first input as focus element
            if (!firstInput) {
              firstInput = child;
            }
          }
          else if (child.getAttribute('for') && child.getAttribute('for') !== '') {
            setHtmlFor(child, idMap, index);
          }
        });
        if (container.querySelector('.form--delete')) {
          // Adds event listener to delete button
          container.querySelector('.form--delete').addEventListener('click', deleteHandler);
        }

        return firstInput;
      },

      // Adds new container to parent
      addNewContainer = function addNewContainer(container, newContainer) {
        var containerSet = container.parentNode.querySelectorAll('.form--repeatable'),
            lastContainer = containerSet[containerSet.length - 1].nextSibling;
        container.parentNode.insertBefore(newContainer, lastContainer);
      },

      // Handles add button event
      addHandler = function addHandler(e) {
        var firstInput,
            container = e.currentTarget.parentNode.querySelectorAll('.form--repeatable'),
            newContainer,
            attribute = e.currentTarget.parentNode.id,
            idMap = {};

        // Modify name of initial instance and adds delete button
        if (allRepeatables[attribute].length === allRepeatables[attribute].min) {
          Array.prototype.forEach.call(container, function addDelete(instance, index) {
            // Adds new delete button to container
            instance.appendChild(newDeleteButton(attribute, index));
          });
        }

        // Gets updated values first instance
        container = e.currentTarget.parentNode.querySelector('.form--repeatable');

        // deep clones the existing instance
        newContainer = container.cloneNode(true);

        // Updates each element in container
        firstInput = newInstance(newContainer, idMap, allRepeatables[attribute].length);

        addNewContainer(container, newContainer);

        setIDsAndInputs(idMap, allRepeatables[attribute].length);

        // Increments length of attribute
        allRepeatables[attribute].length++;

        // Return focus to first input of new instance
        firstInput.focus();

        if (allRepeatables[attribute].length === allRepeatables[attribute].max) {
          e.currentTarget.parentNode.removeChild(e.currentTarget);
        }
      };

  window.onload = function windowOnLoad() {
    // Iterates through every instance of input-plugins
    Object.keys(allSettings).forEach(function repeatableHandler(input) {
      var idAdd = input + '--add',
          addButton;

      // Adds event listener for existing delete button
      Array.prototype.forEach.call(document.querySelectorAll('.form--delete'), function addsDeleteEvent(button) {
        button.addEventListener('click', deleteHandler);
      });

      addButton = document.getElementById(idAdd);
      if (addButton) {
        addButton.addEventListener('click', addHandler);
      }
    });
  };
}());
