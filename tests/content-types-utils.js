import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import utils from '../lib/content-types/utils';

const correct = {
  name: 'Foo Bar Baz',
  id: 'foo-bar-baz',
  identifier: 'name',
  attributes: [
    {
      type: 'text',
      id: 'text',
      name: 'Text',
    },
    {
      type: 'email',
      id: 'email',
      name: 'Email',
      repeatable: true,
    },
    {
      type: 'text',
      id: 'name',
      name: 'Name',
      inputs: {
        text: {
          required: 'save',
        },
        textarea: {
          required: 'publish',
        },
      },
    },
  ],
};


//////////////////////////////
// check content-type main configuration
//////////////////////////////
test('configuration check - object', t => {
  const type = 'foo';

  const result = utils.check.type(type);
  t.is(result, 'Type must be an object', 'Should be an object');
});

test('configuration check - name', t => {
  const type = {};

  let result = utils.check.type(type);
  t.is(result, 'Content types require a name', 'Should have a name');

  type.name = '';
  result = utils.check.type(type);
  t.is(result, 'Content types require a name', 'Should have a name');
});

test('configuration check - name/string', t => {
  const type = {
    name: 123,
  };

  let result = utils.check.type(type);
  t.is(result, 'Content type name must be string', 'Name should be a string');

  type.name = [];
  result = utils.check.type(type);
  t.is(result, 'Content type name must be string', 'Name should be a string');
});

test('configuration check - id', t => {
  const type = {
    name: 'foo',
  };

  let result = utils.check.type(type);
  t.is(result, 'Content types require an id', 'Should have an id');

  type.id = '';
  result = utils.check.type(type);
  t.is(result, 'Content types require an id', 'Should have an id');
});

test('configuration check - id/string', t => {
  const type = {
    name: 'foo',
    id: 123,
  };

  let result = utils.check.type(type);
  t.is(result, 'Content type id must be string', 'ID should be a string');

  type.id = [];
  result = utils.check.type(type);
  t.is(result, 'Content type id must be string', 'ID should be a string');
});

test('configuration check - id/kebab', t => {
  const type = {
    name: 'foo',
    id: 'FooFoo',
  };

  const result = utils.check.type(type);
  t.is(result, 'FooFoo needs to be written in kebab case (e.g. foofoo)', 'ID should be kebab');
});

test('Content Type config check identifier', t => {
  const type = cloneDeep(correct);
  type.identifier = [];
  const check = utils.check.type(type);
  t.is(check, 'Identifier in content type \'Foo Bar Baz\' must be a string', 'identifier must be a string');
});

test('Content Type config check identifier exists', t => {
  const type = cloneDeep(correct);
  type.identifier = 'sandwich';
  const check = utils.check.type(type);
  t.is(check, 'Identifier \'sandwich\' is not an attribute in content type \'Foo Bar Baz\'.', 'identifier must be a string');
});

test('Content Type config check identifier exists', t => {
  const type = cloneDeep(correct);
  type.identifier = 'name';
  const check = utils.check.type(type);
  t.is(check, 'Attribute \'name\' in content type \'Foo Bar Baz\' cannot be the identifier. Only attributes with one input can be the identifier. Duh.', 'identifier must be a string');
});

test('Content Type config uses attributes check', t => {
  const type = cloneDeep(correct);
  type.identifier = 'name';
  delete type.attributes;
  const check = utils.check.type(type);
  t.is(check, 'Content type \'Foo Bar Baz\' must have attributes', 'identifier must be a string');
});


//////////////////////////////
// check content-type attributes configuration
//////////////////////////////
test('Content Type check attributes exists', t => {
  const type = {
    name: 'Foo',
    id: 'foo',
  };
  const check = utils.check.attributes(type);
  t.is(check, 'Content type \'Foo\' must have attributes', 'A Content Type must have attributes');
});

test('Content Type attributes is an array', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: 'attributes',
  };
  const check = utils.check.attributes(type);
  t.is(check, 'Attributes in content type \'test\' must be an array', 'Content Type attributes must be an array');
});

test('Content Type - at least one attribute', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [],
  };
  const check = utils.check.attributes(type);
  t.is(check, 'Content type \'test\' must have at least one attribute', 'Content Type should have at least one attribute');
});

test('Content Type config attribute name/string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: ['foo'],
    }],
  };
  let check = utils.check.attributes(type);
  t.is(check, 'Attribute names in content type \'test\' must be a string', 'Content Type attributes require a name');

  type.attributes = [{
    name: [],
  }, {
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: true,
  }];
  check = utils.check.attributes(type);
  t.is(check, 'Attribute names in content type \'test\' must be a string', 'Content Type attributes require a name');
});

test('Content Type config check attribute id is string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: [],
    }, {
      name: 'bar',
    }],
  };
  let check = utils.check.attributes(type);
  t.is(check, 'Attribute id in \'foo\' in content type \'test\' must be a string', 'Attribute id must be a string');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: {},
  }];
  check = utils.check.attributes(type);
  t.is(check, 'Attribute id in \'bar\' in content type \'test\' must be a string', 'Attribute id must be a string');
});

test('Content Type config check attribute requires type', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: 'foo',
      type: '',
    }, {
      name: 'bar',
    }],
  };
  let check = utils.check.attributes(type);
  t.is(check, 'Attribute \'foo\' in content type \'test\' must have a type', 'Content Type attributes require a type');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: 'bar',
  }];
  check = utils.check.attributes(type);
  t.is(check, 'Attribute \'bar\' in content type \'test\' must have a type', 'Content Type attributes require a type');
});

test('Content Type config check attribute type is string', t => {
  const type = {
    name: 'test',
    id: 'test',
    attributes: [{
      name: 'foo',
      id: 'foo',
      type: [],
    }, {
      name: 'bar',
      id: 'bar',
    }],
  };
  let check = utils.check.attributes(type);
  t.is(check, 'Attribute type in \'foo\' in content type \'test\' must be a string.', 'Attribute type must be a string');

  type.attributes = [{
    name: 'foo',
    id: 'foo',
    type: 'text',
  }, {
    name: 'bar',
    id: 'bar',
    type: {},
  }];
  check = utils.check.attributes(type);
  t.is(check, 'Attribute type in \'bar\' in content type \'test\' must be a string.', 'Attribute type must be a string');
});

test('configuration check - winner', t => {
  const type = {
    name: 'Foo',
    id: 'foo',
    identifier: 'name',
    attributes: [
      {
        type: 'text',
        id: 'text',
        name: 'Text',
      },
      {
        type: 'email',
        id: 'email',
        name: 'Email',
      },
      {
        type: 'text',
        id: 'name',
        name: 'Name',
      },
    ],
  };

  const result = utils.check.type(type);
  t.true(result, 'Should be happy with a proper content type config');
});
