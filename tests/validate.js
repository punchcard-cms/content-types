import test from 'ava';

import types from '../lib/content-types';
import validation from '../lib/form/validate';

import config from './fixtures/config/default';


test('Split Values - Pass', t => {
  const input = {
    'something-new--text': 'Foo bar baz',
    'my-textarea--textarea': 'This is some long text',
    'my-email--email--0': 'test@email.one',
    'my-email--email--1': 'test@email.two',
    'sunset-date': '2016-05-25',
  };

  const expected = [
    {
      plugin: 'something-new',
      input: 'text',
      index: undefined,
      value: 'Foo bar baz',
    },
    {
      plugin: 'my-textarea',
      input: 'textarea',
      index: undefined,
      value: 'This is some long text',
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '0',
      value: 'test@email.one',
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '1',
      value: 'test@email.two',
    },
  ];

  const result = validation.split(input);

  t.deepEqual(result, expected, 'Raw is split properly and invalid items are ignored');
});

test('Join Values - Pass with Errors', t => {
  const input = [
    {
      plugin: 'something-new',
      input: 'text',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-textarea',
      input: 'textarea',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '0',
      validation: 'Invalid Email Address',
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '1',
      validation: 'Invalid Email Address',
    },
  ];

  const expected = {
    'my-email--email--0': 'Invalid Email Address',
    'my-email--email--1': 'Invalid Email Address',
  };

  const result = validation.join(input);

  t.deepEqual(result, expected, 'Validated input is built properly and only includes items that are invalid');
});

test('Join Values - Pass without Errors', t => {
  const input = [
    {
      plugin: 'something-new',
      input: 'text',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-textarea',
      input: 'textarea',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '0',
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '1',
      validation: true,
    },
  ];

  const result = validation.join(input);

  t.true(result, 'Validated input returns `true` if there are no invalid items');
});

test('Join Values - Pass without Errors', t => {
  const input = [
    {
      plugin: 'something-new',
      input: 'text',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-textarea',
      input: 'textarea',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '0',
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '1',
      validation: true,
    },
  ];

  const result = validation.join(input);

  t.true(result, 'Validated input returns `true` if there are no invalid items');
});

// Skipping until we can figure out why `t.throws` doesn't actually catch the throw
test('Join Values - Throws Error', t => {
  const input = [
    {
      plugin: 'something-new',
      input: 'text',
      index: undefined,
    },
    {
      plugin: 'my-textarea',
      input: 'textarea',
      index: undefined,
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '0',
      validation: true,
    },
    {
      plugin: 'my-email',
      input: 'email',
      index: '1',
      validation: true,
    },
  ];

  try {
    validation.join(input);

    t.fail();
  }
  catch (e) {
    t.is(e.message, 'Validation for \'something-new--text\' requires a validation key!');
  }
});

test('Validate - Pass', t => {
  return types.only('bar', {}, '', config).then(ct => {
    const input = {
      'something-new--text': 'Foo bar baz',
      'my-textarea--textarea': 'This is some long text',
      'my-email--email--0': 'test@email.one',
      'my-email--email--1': 'test@email.two',
    };

    const result = validation(input, ct);
    t.true(result, 'All validation passes');
  });
});

test('Validate - Fail', t => {
  return types.only('bar', {}, '', config).then(ct => {
    const input = {
      'something-new--text': 'Foo bar baz',
      'my-textarea--textarea': 'This is some long text',
      'my-email--email--0': 'test@email',
      'my-email--email--1': 'test@email.two',
    };

    const expected = {
      'my-email--email--0': 'Not a valid e-mail address.',
    };

    const result = validation(input, ct);
    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});

test('Validate Repeatable - Pass', t => {
  return types.only('bar', {}, '', config).then(ct => {
    const input = {
      'something-new--text': 'Foo bar baz',
      'my-textarea--textarea': 'This is some long text',
      'my-email--email--0': 'test@email.one',
      'my-email--email--1': 'test@email.two',
    };
    const result = validation(input, ct);
    t.true(result, 'All validation passes');
  });
});

test('Validate Repeatable - Fail', t => {
  return types.only('bar', {}, '', config).then(ct => {
    const input = {
      'something-new--text': 'Foo bar baz',
      'my-textarea--textarea': 'This is some long text',
      'my-email--email': 'test@email',
    };
    const expected = {
      'my-email--email': 'At Least 2 instances are required',
    };
    const result = validation(input, ct);
    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});

test('Required - Pass', t => {
  return types.only('baz', {}, '', config).then(ct => {
    const input = {
      'plugin-required-save--text': 'Baz plugin',
      'input-required-save--text': 'Baz input',
    };

    const result = validation(input, ct);

    t.true(result, 'All validation passes');
  });
});

test('Required Publish with Empty Save', t => {
  return types.only('baz', {}, '', config).then(ct => {
    const input = {
      'plugin-required-save--text': '',
      'input-required-save--text': '',
    };

    const expected = {
      'plugin-required-save--text': 'Field is required to be saved!',
      'input-required-save--text': 'Field is required to be saved!',
    };

    const result = validation(input, ct);

    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});

test('Required Publish with Empty Publish and Save', t => {
  return types.only('baz', {}, '', config).then(ct => {
    const input = {
      'plugin-required-save--text': '',
      'input-required-publish--text': '',
    };

    const expected = {
      'plugin-required-save--text': 'Field is required to be saved!',
      'input-required-publish--text': 'Field is required to be published!',
    };

    const result = validation(input, ct);

    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});


test('Required Save with Empty Publish', t => {
  return types.only('baz', {}, '', config).then(ct => {
    const input = {
      'plugin-required-publish--text': '',
      'input-required-publish--text': '',
    };

    const result = validation(input, ct, 'save');

    t.true(result, 'No errors for just publish on save');
  });
});

test('Validation fails if required check is wrong', t => {
  return types.only('baz', {}, '', config).then(ct => {
    const input = {
      'plugin-required-publish--text': '',
      'input-required-publish--text': '',
    };

    validation(input, ct, 'foo');

    t.fail();
  }).catch(e => {
    t.is(e.message, 'Parameter `check` must either be `save` or `publish`', 'Errors out as expected');
  });
});
