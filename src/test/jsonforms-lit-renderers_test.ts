import {assert} from '@open-wc/testing';

import {
  enumOptionLabel,
  enumPromptLabel,
} from '../internal/jsonforms-lit/renderers.js';

suite('JSON Forms Lit renderers', () => {
  test('uses configured enum labels while retaining code fallback', () => {
    const schema = {
      enum: ['CA', 'NY', 'TX'],
      'x-enumLabels': {CA: 'California', NY: 'New York'},
    };

    assert.equal(enumOptionLabel(schema, 'CA'), 'California');
    assert.equal(enumOptionLabel(schema, 'NY'), 'New York');
    assert.equal(enumOptionLabel(schema, 'TX'), 'TX');
  });

  test('formats the enum prompt like other dropdowns', () => {
    assert.equal(enumPromptLabel('State'), 'Select state');
    assert.equal(
      enumPromptLabel('Bank account type'),
      'Select bank account type'
    );
  });
});
