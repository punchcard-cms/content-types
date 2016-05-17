# Punchcard Content Types [![Build Status](https://travis-ci.org/punchcard-cms/content-types.svg?branch=master)](https://travis-ci.org/punchcard-cms/content-types) [![Coverage Status](https://coveralls.io/repos/github/punchcard-cms/content-types/badge.svg?branch=master)](https://coveralls.io/github/punchcard-cms/content-types?branch=master)

Combines with [Input Plugins](https://www.npmjs.com/browse/keyword/input-plugin) to create Content Types in the Punchcard CMS

## Installation

```bash
npm install punchcard-content-types --save
```

## Usage

### Defining a Content Type

Content Types are defined as [YAML](http://yaml.org/) files. They include a name, a description, and an array of attributes describing which [Input Plugins](https://www.npmjs.com/browse/keyword/input-plugin) should be used and configured. By default, content types will be looked for in the `content-types` directory from the current running process. If using the [config](https://www.npmjs.com/package/config) module, `contentTypes.directory` can be set to the path being used, again relative to the directory of the current running process.

```yaml
name: My Awesome Content Type
description: I'm making an awesome new content type!
attributes:
  - type: text
    id: favorite-ranger
    name: Favorite Power Ranger
    description: This is my favorite power ranger
    inputs:
      text:
        placeholder: I like the Green Ranger
  - type: select
    id: favorite-ice-cream
    name: Favorite Ice Cream
    inputs:
      select:
        settings:
          options:
            - Chocolate
            - Vanilla
            - Strawberry
        required: true
  - type: date-range
    id: awesome-years
    name: Awesome Years
    inputs:
      startDate:
        label: Start Date
        settings:
          year:
            min: 1980
      endDate:
        label: End Date
        settings:
          year:
            max: 2015
```

### Content Types

There are three ways to retrieve content types; you can retrieve the raw content type definitions, the content type definitions with their input plugins merged together with the definition's settings, and a single content type that has been merged. The later will also allow you to pass in configuration from your application to merge with the definition, allowing, for instance, the value of a given input plugin to be added.

All methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

#### Raw Content Types

Will return an `Array` of content type definitions, each being an `Object`. There are no parameters to pass in.

```javascript
const contentTypes = require('punchcard-content-types');

contentTypes.raw().then(types => {
  // Raw Content Types
  console.log(types);
});
```

#### Merged Content Types

Will return an `Array` of content type definitions, each being an `Object`, with attributes replaced by individual Input Plugin instances that have been merged with the raw content type options. There are no parameters to pass in.

```javascript
const contentTypes = require('punchcard-content-types');

contentTypes().then(types => {
  // Merged Content Types
  console.log(types);
});
```

#### Merged Content Type using config

Will return an `Array` of content type definitions (that contains only one content type), each being an `Object`, with attributes replaced by individual Input Plugin instances that have been merged with the raw content type options. There are no parameters to pass in.

```javascript
const contentTypes = require('punchcard-content-types');
const fooContentObj = {
  'name': 'FooRific',
  'description': 'A very foo content model.',
  'attributes': [
    {
      'type': 'email',
      'id': 'email',
      'name': 'Email',
      'description': 'Your email is your username',
    },
  ],
};
contentTypes(fooContentObj).then(types => {
  // Array with one Content Type
  console.log(types);
});
```

#### Single Content Type

Will return an `Object` of a single merged content type, optionally with userland config that will be merged on top of the merged content type. Users may choose to pass in the `Array` of merged content types in for it to work with, or have it load and merge content types itself.

* `type` **Required** - `id` name of content type to be retrieved.
* `config` - `Object` with keys matching input plugin `id` from content type definitions, values being object containing the keys from `inputs` and values being object to be merged.
* `loadedTypes` - `Array` of loaded, merged content types


```javascript
const contentTypes = require('punchcard-content-types');

const config = {
  'favorite-ice-cream': {
    select: {
      value: 'Vanilla'
    }
  }
}

contentTypes.only('my-awesome-content-type', config).then(types => {
  // Single Content Type
  console.log(types);
});
```

### Input Plugins

The tests for input plugins are available if using the [AVA](https://github.com/sindresorhus/ava) test runner. To do so, add a test file, import the plugin tester, and pass AVA's test and the plugin in to the test scaffolding.

```javascript
import test from 'ava';
import types from 'punchcard-content-types';
import plugin from '../'; // Input Plugin's index.js

types.pluginTests(test, plugin);
```
