import {expect} from '@open-wc/testing';
import {Actions, ControlElement, JsonSchema} from '@jsonforms/core';
import {
  LitJsonFormsStore,
  JsonFormsMiddleware,
  litRenderers,
} from '../index.js';

suite('LitJsonFormsStore', () => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {type: 'string'},
    },
    required: ['name'],
  };

  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name',
  };

  test('initializes from schema, uischema, data, renderers, and readonly config', () => {
    const store = new LitJsonFormsStore({
      data: {name: 'Ada'},
      schema,
      uischema,
      renderers: litRenderers,
      readonly: true,
      validationMode: 'ValidateAndShow',
      config: {trim: true},
      i18n: {locale: 'en-US'},
    });

    const state = store.getState();

    expect(state.jsonforms.core?.data).to.deep.equal({name: 'Ada'});
    expect(state.jsonforms.core?.schema).to.deep.equal(schema);
    expect(state.jsonforms.core?.uischema).to.deep.equal(uischema);
    expect(state.jsonforms.renderers).to.equal(litRenderers);
    expect(state.jsonforms.readonly).to.equal(true);
    expect(state.jsonforms.config).to.deep.equal({trim: true});
    expect(state.jsonforms.i18n?.locale).to.equal('en-US');
  });

  test('updates data through JSONForms actions and notifies subscribers', () => {
    const store = new LitJsonFormsStore({
      data: {name: 'Ada'},
      schema,
      uischema,
      renderers: litRenderers,
    });
    let notificationCount = 0;
    const unsubscribe = store.subscribe(() => {
      notificationCount += 1;
    });

    store.dispatch(Actions.update('name', () => 'Grace'));
    unsubscribe();
    store.dispatch(Actions.update('name', () => 'Ignored'));

    expect(store.getState().jsonforms.core?.data).to.deep.equal({
      name: 'Ignored',
    });
    expect(notificationCount).to.equal(1);
  });

  test('applies additional errors, validation mode, and middleware', () => {
    const seenActions: string[] = [];
    const middleware: JsonFormsMiddleware = (state, action, defaultReducer) => {
      seenActions.push(action.type);
      return defaultReducer(state, action);
    };
    const additionalErrors = [
      {
        instancePath: '/name',
        schemaPath: '#/required',
        keyword: 'required',
        params: {},
        message: 'Name is required by the host',
      },
    ];
    const store = new LitJsonFormsStore({
      data: {},
      schema,
      uischema,
      renderers: litRenderers,
      validationMode: 'NoValidation',
      additionalErrors,
      middleware,
    });

    store.setValidationMode('ValidateAndHide');

    expect(seenActions).to.include(Actions.setValidationMode('NoValidation').type);
    expect(store.getState().jsonforms.core?.additionalErrors).to.deep.equal(
      additionalErrors
    );
    expect(store.getState().jsonforms.core?.validationMode).to.equal(
      'ValidateAndHide'
    );
  });
});
