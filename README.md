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
identifier: favorite-ranger
workflow: self-publish
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
        options:
          - Chocolate
          - Vanilla
          - Strawberry
        required: publish
  - type: email
    id: my-email
    name: Email Address of Awesome
    repeatable:
      min: 2
      max: 4
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

// Content Type object must be an array
contentTypes([fooContentObj]).then(types => {
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

### Create your forms

#### Usage

##### In your node application:

```javascript
cont content = require('punchcard-content-types');

content.only('my-awesome-content-type').then(type => {
  return content.form(type);
}).then(form => {
  // use form object within your html to create a content type form (see below)
});
```

##### In your HTML

```html
<form action="{{action}}" method="post" enctype="multipart/form-data" novalidate>

  {{form.html | safe}}

  <button type="submit">Submit</button>
  <button type="cancel">Cancel</button>
</form>


<script>
  {{form.scripts | safe}}
</script>
```

#### Form response object

```javascript
form.html // string of wrapped form elements; should be placed inside a <form> tag
form.script // Validation and UX scripts, wrapped for browser via browserify
```

### Input Plugins

Forms are created using [input plugins](https://www.npmjs.com/search?q=input-plugin-) which are available as npm modules. Content-types automatically searches for these input plugins inside your application's `node_modules` directory, found using `npm root`.

You can also use your own, non-npm-based input plugins in your application. Content-types uses [Node Config](https://github.com/lorenwest/node-config) for configuration, ([at least for now it does](https://github.com/punchcard-cms/content-types/issues/97)) so to use your own plugins you have two options: `local` and `core`. Both configurations are processed in the same way, so you may add configurations for either or both options.

You may use a string, or an array of strings. They must be full paths, not relative paths, or your application will error.

#### Usage

##### In your application configuration

```
config = {
  ...
  content: {
    directory: './fixtures/content-types',
    plugins: {
      local: {
        directory: ['/first/path/to/core/input/plugins', '/second/path/to/core/input/plugins'],
      },
      core: {
        directory: '/path/to/core/input/plugins',
      },
    },
  },
  ...
 };
```
