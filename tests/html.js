import test from 'ava';
import html from '../lib/form/html';
import includes from 'lodash/includes';

test('Add Errors - Pass', t => {
  const param = {
    html: '',
    errors: {
      'my-textarea--textarea': 'Field cannot be left blank!',
    },
    input: {
      description: 'I am the Bar Content Type Config textarea description',
      html: '<label for=\'{{textarea.id}}\'>{{textarea.label}} <mark class=\'required--{{textarea.required}}\'>required to {{textarea.required}}</mark></label><textarea id=\'{{textarea.id}}\' name=\'{{textarea.name}}\' placeholder=\'{{textarea.placeholder}}\' />{{textarea.value}}</textarea>',
      id: 'my-textarea',
      inputs: {
        textarea: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f',
          label: 'My Awesome Text Area',
          name: 'my-textarea--textarea',
          placeholder: 'Type something...',
          type: 'textarea',
        },
      },
      name: 'My Awesome Text Area',
      required: 'save',
      type: 'textarea',
    },
    index: undefined,
  };
  const expected = '<p class="form--alert" role="alert" for="91f79620-ba21-4a4a-a4c7-02f456129b0f">Field cannot be left blank!</p>';
  const result = html.error(param.html, param.input, param.errors, param.index);
  t.is(result, expected, 'HTML includes the error');
});

test('Add Errors Repeatable - Pass', t => {
  const param = {
    html: '',
    errors: {
      'my-email--email--0': 'At Least 3 instances are required',
      'my-email--email--1': 'At Least 3 instances are required',
    },
    input: {
      description: 'An email input with domain validation',
      html: '<label for=\'{{email.id}}\'>{{email.label}} <mark class=\'required--{{textarea.required}}\'>required to {{textarea.required}}</mark></label><input type=\'{{email.type}}\' id=\'{{email.id}}\' name=\'{{email.name}}\' value=\'{{email.value}}\' placeholder=\'{{email.placeholder}}\' />',
      id: 'my-email',
      inputs: [
        {
          email: {
            id: '7b142e99-1fd9-4c44-9592-9d59ca1a50ae--0',
            label: 'Email Address of Awesome',
            name: 'my-email--email--0',
            placeholder: 'add your email',
            type: 'email',
            value: 'test@gmail.com',
          },
        },
        {
          email: {
            id: '7b142e99-1fd9-4c44-9592-9d59ca1a50ae--1',
            label: 'Email Address of Awesome',
            name: 'my-email--email--1',
            placeholder: 'add your email',
            type: 'email',
            value: 'test@gmail.com',
          },
        },
      ],
      name: 'Email Address of Awesome',
      repeatable: {
        min: 3,
        max: 5,
      },
      type: 'email',
    },
    index: 0,
  };
  const expected = '<p class="form--alert" role="alert" for="7b142e99-1fd9-4c44-9592-9d59ca1a50ae--0">At Least 3 instances are required</p>';
  const result = html.error(param.html, param.input, param.errors, param.index);
  t.is(result, expected, 'Repeatable instance HTML includes the error');
});

test('Add Required - Pass', t => {
  const param = {
    html: '"<label for="91f79620-ba21-4a4a-a4c7-02f456129b0f">My Awesome Text Area <mark class="required--save">required to save</mark></label><textarea id="91f79620-ba21-4a4a-a4c7-02f456129b0f" name="my-textarea--textarea" placeholder="Type something..." />test</textarea>"',
    input: {
      description: 'I am the Bar Content Type Config textarea description',
      html: '<label for=\'{{textarea.id}}\'>{{textarea.label}} <mark class=\'required--{{textarea.required}}\'>required to {{textarea.required}}</mark></label><textarea id=\'{{textarea.id}}\' name=\'{{textarea.name}}\' placeholder=\'{{textarea.placeholder}}\' />{{textarea.value}}</textarea>',
      id: 'my-textarea',
      inputs: {
        textarea: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f',
          label: 'My Awesome Text Area',
          name: 'my-textarea--textarea',
          placeholder: 'Type something...',
          type: 'textarea',
        },
      },
      name: 'My Awesome Text Area',
      required: 'save',
      type: 'textarea',
    },
    index: undefined,
  };
  const expected = 'aria-required="true" required';
  const result = html.required(param.html, param.input, param.index);
  t.true(includes(result, expected));
});

test('Add Required Checkbox - Pass', t => {
  const param = {
    html: '"<label for="91f79620-ba21-4a4a-a4c7-02f456129b0f">My Awesome Text Area</label><textarea id="91f79620-ba21-4a4a-a4c7-02f456129b0f" name="my-textarea--textarea" placeholder="Type something..." />test</textarea>"',
    input: {
      description: 'I am the Bar Content Type Config textarea description',
      html: '"<label for="91f79620-ba21-4a4a-a4c7-02f456129b0f--1"><input type="checkbox" name="my-checkbox--checkbox" id="91f79620-ba21-4a4a-a4c7-02f456129b0f--1" value="one" >One</label>"',
      id: 'my-checkbox',
      inputs: {
        checkbox: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f--1',
          label: 'My Awesome Checkbox',
          name: 'my-checkbox--checkbox',
          type: 'checkbox',
        },
      },
      name: 'My Awesome Checkbox',
      required: 'save',
      type: 'checkbox',
    },
    index: undefined,
  };
  const expected = 'aria-required="true" required';
  const result = html.required(param.html, param.input, param.index);
  t.false(includes(result, expected));
});

test('Add Required and Repeatable - Pass', t => {
  const param = {
    html: '"<div class="form--repeatable"><label for="91f79620-ba21-4a4a-a4c7-02f456129b0f">Add Your Text <mark class="required--publish">required to publish</mark></label><input type="text" id="91f79620-ba21-4a4a-a4c7-02f456129b0f" name="name--text" placeholder="Text goes here" /></div>"',
    input: {
      description: 'I am the Bar Content Type Config text description',
      html: '<div class=\'form--repeatable\'><label for=\'{{text.id}}\'>{{text.label}} <mark class=\'required--{{text.required}}\'>required to {{text.required}}</mark></label><input type=\'{{text.type}}\' id=\'{{text.id}}\' name=\'{{text.name}}\' placeholder=\'{{text.placeholder}}\' /></div>',
      id: 'text-required',
      inputs: {
        text: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f--1',
          label: 'Add Your Text',
          name: 'name--text',
          placeholder: 'Text goes here',
          type: 'text',
        },
      },
      name: 'Add Your Text',
      required: 'publish',
      repeatable: 'true',
      type: 'text',
    },
    index: undefined,
  };
  const expected = 'aria-required="true" required';
  const result = html.required(param.html, param.input, param.index);
  t.false(includes(result, expected));
});

test('Add Object Required - Pass', t => {
  const param = {
    html: '"<fieldset id="community-links" class="form--fieldset"><legend class="form--legend">Object</legend><p class="form--description">I am the Foo Object text description</p><div class="form--field"><label for="91f79620-ba21-4a4a-a4c7-02f456129b0f--1">Add Your Text <mark class="required--publish">required to publish</mark></label><input type="text" id="91f79620-ba21-4a4a-a4c7-02f456129b0f--1" name="name--text" placeholder="Text goes here"></div><div class="form--field"><label for="91f79620-ba21-4a4a-a4c7-02f456129b0f--2">Add Your URL <mark class="required--publish">required to publish</mark></label><input type="url" id="91f79620-ba21-4a4a-a4c7-02f456129b0f--2" name="name--url" placeholder="http://"></div></fieldset>"',
    input: {
      name: 'Object',
      description: 'I am the Foo Object text description',
      html: '<fieldset id=\'community-links\' class=\'form--fieldset\'><legend class=\'form--legend\'>{{input.name}}</legend><p class=\'form--description\'>{{input.description}}</p><div class=\'form--field\'><label for=\'{{text.id}}\'>{{text.label}} <mark class=\'required--{{text.required}}\'>required to {{text.required}}</mark></label><input type=\'{{text.type}}\' id=\'{{text.id}}\' name=\'{{text.name}}\' placeholder=\'{{text.placeholder1}}\'></div><div class=\'form--field\'><label for=\'{{url.id}}\'>{{url.label}} <mark class=\'required--{{url.required}}\'>required to {{url.required}}</mark></label><input type=\'{{url.type}}\' id=\'{{url.id}}\' name=\'{{url.name}}\' placeholder=\'{{url.placeholder}}\'></div></fieldset>',
      id: 'object-required',
      inputs: {
        text: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f--1',
          label: 'Add Your Text',
          name: 'name--text',
          placeholder: 'Text goes here',
          type: 'text',
          required: 'publish',
        },
        url: {
          id: '91f79620-ba21-4a4a-a4c7-02f456129b0f--2',
          label: 'Add Your URL',
          name: 'name--url',
          placeholder: 'http://',
          type: 'url',
          required: 'publish',
        },
      },
    },
    index: undefined,
  };
  const expected = 'aria-required="true" required';
  const result = html.required(param.html, param.input, param.index);
  t.false(includes(result, expected));
});
