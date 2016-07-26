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

      // Maintains state of allIds and allInputs
      updateIdsAndInputs = function updateIdsAndInputs(id, oldId) {
        if (allInputs.hasOwnProperty(oldId)) {
          allInputs[id] = allInputs[oldId];
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
            splitChild = child.htmlFor.split('--'),
            index = splitChild[splitChild.length - 1];
        if (!isNaN(index)) {
          splitChild[splitChild.length - 1] = index - 1;
          child.htmlFor = splitChild.join('--');
        }
      },

      // decrement index of id by 1 and calls updateIdsAndInputs
      decrementId = function decrementId(node) {
        var child = node,
            splitChild = child.id.split('--'),
            index = splitChild[splitChild.length - 1],
            oldChildId = child.id;
        if (!isNaN(index)) {
          splitChild[splitChild.length - 1] = index - 1;
          child.id = splitChild.join('--');
          updateIdsAndInputs(child.id, oldChildId);
        }
      },

      // decrement index of name by 1
      decrementName = function decrementName(node) {
        var child = node,
            childName = child.getAttribute('name');
        if (childName) {
          childName = childName.split('--');
          if (!isNaN(childName[childName.length - 1])) {
            childName[childName.length - 1] = childName[childName.length - 1] - 1;
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
        else if (child.htmlFor && child.htmlFor !== '') {
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
        if (!isNaN(nodeId[nodeId.length - 1])) {
          nodeId[nodeId.length - 1]--;
        }
        node.id = nodeId.join('--');
        Array.prototype.forEach.call(childNodes, updateNode);
      },

      // Removes indexing from instance
      removeIndex = function removeIndex(instance) {
        var container = instance,
            childNodes = container.querySelectorAll('*'),
            name;
        container.id = splitPop(container.id, '--');
        Array.prototype.forEach.call(childNodes, function setAttributes(key) {
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
      },

      // Handles delete events
      deleteHandler = function deleteHandler(e) {
        var node = e.currentTarget.parentNode,
            siblingNode = node.nextElementSibling,
            container,
            parent = node.parentNode,
            attribute = parent.id;

        // removes child and update length

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
        if (allRepeatables[attribute].length === 1) {
          container = parent.querySelector('.form--repeatable');
          removeIndex(container);
          container.removeChild(container.querySelector('.form--delete'));
        }
      },

      // Add new input to allInputs
      setIDsAndInputs = function setIDsAndInputs(idMap) {
        Object.keys(idMap).forEach(function setIdandInput(id) {
          if (allInputs.hasOwnProperty(id)) {
            allInputs[idMap[id]] = Object.assign({}, allInputs[id]);
            if (!allIDs.hasOwnProperty(idMap[id])) {
              allIDs[idMap[id]] = document.getElementById(idMap[id]);

              // Adds validation to new input
              allIDs[idMap[id]].addEventListener(allInputs[idMap[id]].validation.on, validate);
            }
          }
        });
      },

      // Create and return delete button
      newDeleteButton = function newDeleteButton(attribute) {
        var element = document.createElement('button');
        element.type = 'button';
        element.textContent = 'Delete';
        element.id = attribute + '--delete';
        element.setAttribute('class', 'form--delete');
        element.addEventListener('click', deleteHandler);

        return element;
      },

      // Update values of current instance
      updateCurrentInstance = function updateCurrentInstance(instance, attribute) {
        var container = instance,
            index = allRepeatables[attribute].length;

        // Adds new delete button to container
        container.appendChild(newDeleteButton(attribute));

        // Adds index to id
        container.id = container.id + '--' + (index - 1);

        // Updates all children of container
        Array.prototype.forEach.call(container.querySelectorAll('*'), function setAttributes(node) {
          var child = node,
              oldChildId;
          if (child.id !== '') {
            oldChildId = child.id;
            child.id = child.id + '--' + (index - 1);
            updateIdsAndInputs(child.id, oldChildId);
            if (child.getAttribute('name')) {
              child.setAttribute('name', child.getAttribute('name') + '--' + (index - 1));
            }
          }
          else if (child.htmlFor && child.htmlFor !== '') {
            child.htmlFor = child.htmlFor + '--' + (index - 1);
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
          idMap[child.id] = splitPop(child.id, '--') + '--' + index;
          child.id = idMap[child.id];
        }
      },

      // Adds index to HTMLFor
      setHtmlFor = function setHtmlFor(node, map, index) {
        var child = node,
            idMap = map;
        if (idMap.hasOwnProperty(child.htmlFor)) {
          child.htmlFor = idMap[child.htmlFor];
        }
        else {
          idMap[child.htmlFor] = splitPop(child.htmlFor, '--') + '--' + index;
          child.htmlFor = idMap[child.htmlFor];
        }
      },

      // Adds index to name attribute if exists
      setName = function setName(node, index) {
        var child = node,
            childName = child.getAttribute('name');
        if (childName) {
          childName = splitPop(childName, '--');
          child.setAttribute('name', childName + '--' + index);
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
        container.id = splitPop(container.id, '--') + '--' + index;
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
          else if (child.htmlFor && child.htmlFor !== '') {
            setHtmlFor(child, idMap, index);
          }
        });

        // Adds event listener to delete button
        container.querySelector('.form--delete').addEventListener('click', deleteHandler);

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
            container = e.currentTarget.parentNode.querySelector('.form--repeatable'),
            newContainer,
            attribute = e.currentTarget.parentNode.id,
            idMap = {};

        // Modify name of initial instance and adds delete button
        if (allRepeatables[attribute].length === 1) {
          updateCurrentInstance(container, attribute);
        }

        // Gets updated values first instance
        container = e.currentTarget.parentNode.querySelector('.form--repeatable');

        // deep clones the existing instance
        newContainer = container.cloneNode(true);

        // Updates each element in container
        firstInput = newInstance(newContainer, idMap, allRepeatables[attribute].length);

        // Increments length of attribute
        allRepeatables[attribute].length++;
        addNewContainer(container, newContainer);

        setIDsAndInputs(idMap);

        // Return focus to first input of new instance
        firstInput.focus();
      };

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
}());
