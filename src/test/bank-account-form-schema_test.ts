import {generateDefaultUISchema, type UISchemaElement} from '@jsonforms/core';
import {assert} from '@open-wc/testing';

import {
  bankAccountJsonFormsSchema,
  bankAccountJsonFormsUiSchema,
} from '../internal/forms/bank-account-jsonforms.js';

const achFieldScopes = [
  '#/properties/accountNickname',
  '#/properties/routingNumber',
  '#/properties/accountNumber',
  '#/properties/confirmAccountNumber',
];

const collectControlScopes = (uischema: UISchemaElement): string[] => {
  const layout = uischema as {elements?: Array<{scope?: string}>};

  return layout.elements?.map((element) => element.scope ?? '') ?? [];
};

suite('bank account form schema', () => {
  test('exports the JSON schema itself without form wrappers', () => {
    const schema = bankAccountJsonFormsSchema as Record<string, unknown>;

    assert.equal(schema.type, 'object');
    assert.notProperty(schema, 'schema');
    assert.notProperty(schema, 'uischema');
    assert.notProperty(schema, 'validations');
  });

  test('generates the default JSONForms vertical UI schema from the schema source', () => {
    assert.deepEqual(
      bankAccountJsonFormsUiSchema,
      generateDefaultUISchema(bankAccountJsonFormsSchema, 'VerticalLayout')
    );
    assert.sameMembers(
      collectControlScopes(bankAccountJsonFormsUiSchema),
      achFieldScopes
    );
  });

  test('keeps confirm account equality metadata on the schema property', () => {
    const confirmAccountNumber = bankAccountJsonFormsSchema.properties?.[
      'confirmAccountNumber'
    ] as Record<string, unknown> | undefined;

    assert.equal(confirmAccountNumber?.['x-equalsField'], 'accountNumber');
  });
});
