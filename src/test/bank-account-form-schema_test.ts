import {
  generateDefaultUISchema,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import {assert} from '@open-wc/testing';

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

const loadFormJson = async (): Promise<Record<string, unknown>> => {
  const response = await fetch('/form.json');

  assert.isTrue(
    response.ok,
    'form.json should be served from the repository root'
  );

  return response.json() as Promise<Record<string, unknown>>;
};

suite('bank account form schema', () => {
  test('serves the JSON schema itself without form wrappers', async () => {
    const schema = await loadFormJson();

    assert.equal(schema.type, 'object');
    assert.notProperty(schema, 'schema');
    assert.notProperty(schema, 'uischema');
    assert.notProperty(schema, 'validations');
  });

  test('supports the default JSONForms vertical UI schema from the schema source', async () => {
    const schema = (await loadFormJson()) as JsonSchema;
    const uischema = generateDefaultUISchema(schema, 'VerticalLayout');

    assert.sameMembers(collectControlScopes(uischema), achFieldScopes);
  });

  test('keeps confirm account equality metadata on the schema property', async () => {
    const schema = (await loadFormJson()) as JsonSchema;
    const confirmAccountNumber = schema.properties?.['confirmAccountNumber'] as
      | Record<string, unknown>
      | undefined;

    assert.equal(confirmAccountNumber?.['x-equalsField'], 'accountNumber');
  });
});
