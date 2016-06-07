import test from 'ava';
import types from '../lib/content-types';
import validation from '../lib/form/validate';


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
    }
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
    }
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
    }
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
    }
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
    }
  ];

  try {
    validation.join(input);

    t.fail();
  }
  catch(e) {
    t.is(e.message, 'Validation for \'something-new--text\' requires a validation key!');
  }
});

test('Validate - Pass', t => {
  return types.only('bar').then(ct => {
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
  return types.only('bar').then(ct => {
    const input = {
      'something-new--text': 'Foo bar baz',
      'my-textarea--textarea': 'This is some long text',
      'my-email--email--0': 'test@email',
      'my-email--email--1': 'test@email.two',
    };

    const expected = {
      'my-email--email--0': 'Not a valid e-mail address.'
    };

    const result = validation(input, ct);

    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});

test('Required - Pass', t => {
  return types.only('baz').then(ct => {
    const input = {
      'plugin-required--text': 'Baz plugin',
      'input-required--text': 'Baz input',
    };

    const result = validation(input, ct);

    t.true(result, 'All validation passes');
  });
});

test('Required - Fail', t => {
  return types.only('baz').then(ct => {
    const input = {
      'plugin-required--text': '',
      'input-required--text': '',
    };

    const expected = {
      'plugin-required--text': 'Field cannot be left blank!',
      'input-required--text': 'Field cannot be left blank!'
    };

    const result = validation(input, ct);

    t.deepEqual(result, expected, 'Returns an object of inputs that have failed');
  });
});
