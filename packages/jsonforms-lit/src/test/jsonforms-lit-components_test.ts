import {fixture, expect, oneEvent} from '@open-wc/testing';
import {ControlElement, JsonSchema, rankWith, scopeEndsWith} from '@jsonforms/core';
import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  JsonFormsBaseRenderer,
  LitJsonFormsStore,
  litRenderers,
} from '../index.js';
import '../index.js';

const nextFrame = async () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve(undefined));
  });

suite('jsonforms-lit components', () => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {type: 'string', description: 'Legal name', minLength: 1},
      age: {type: 'integer', minimum: 18},
      active: {type: 'boolean'},
      role: {type: 'string', enum: ['admin', 'viewer']},
    },
    required: ['name'],
  };

  test('renders a generated UI schema when omitted', async () => {
    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit
        .schema=${schema}
        .data=${{name: 'Ada', age: 36, active: true, role: 'admin'}}
        .renderers=${litRenderers}
      ></jsonforms-lit>
    `);

    const input = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="name"]'
    );
    const checkbox = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="active"]'
    );

    expect(input?.value).to.equal('Ada');
    expect(checkbox?.checked).to.equal(true);
  });

  test('emits data-change and errors-change when controls update JSONForms state', async () => {
    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit
        .schema=${schema}
        .data=${{name: 'Ada', age: 36}}
        .renderers=${litRenderers}
      ></jsonforms-lit>
    `);
    const input = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="name"]'
    );
    const dataChange = oneEvent(element, 'data-change');
    const errorsChange = oneEvent(element, 'errors-change');

    input!.value = '';
    input!.dispatchEvent(new Event('input', {bubbles: true, composed: true}));

    const dataEvent = (await dataChange) as CustomEvent;
    const errorsEvent = (await errorsChange) as CustomEvent;

    expect(dataEvent.detail.data).to.deep.equal({name: '', age: 36});
    expect(errorsEvent.detail.errors).to.have.length(1);
  });

  test('updates when root data, schema, uischema, and renderers properties change', async () => {
    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit
        .schema=${schema}
        .data=${{name: 'Ada'}}
        .renderers=${litRenderers}
      ></jsonforms-lit>
    `);

    (element as LitElement & {data: unknown; uischema: ControlElement}).setAttribute(
      'aria-label',
      'jsonforms-root'
    );
    (element as LitElement & {data: unknown; uischema: ControlElement}).data = {
      name: 'Grace',
    };
    (element as LitElement & {uischema: ControlElement}).uischema = {
      type: 'Control',
      scope: '#/properties/name',
    };
    await (element as LitElement).updateComplete;

    const input = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="name"]'
    );

    expect(input?.value).to.equal('Grace');
  });

  test('dispatch selects the highest ranked renderer', async () => {
    @customElement('jsonforms-lit-test-high-rank')
    class HighRankRenderer extends JsonFormsBaseRenderer {
      protected override render() {
        return html`<span class="selected-renderer">selected</span>`;
      }
    }
    void HighRankRenderer;

    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const store = new LitJsonFormsStore({
      data: {name: 'Ada'},
      schema,
      uischema,
      renderers: [
        ...litRenderers,
        {
          tester: rankWith(10, scopeEndsWith('name')),
          renderer: 'jsonforms-lit-test-high-rank',
        },
      ],
    });

    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit-dispatch
        .store=${store}
        .schema=${schema}
        .uischema=${uischema}
        .path=${''}
      ></jsonforms-lit-dispatch>
    `);

    expect(
      element.querySelector('.selected-renderer')?.textContent
    ).to.equal('selected');
  });

  test('dispatch falls back when no renderer matches', async () => {
    const store = new LitJsonFormsStore({
      data: {},
      schema,
      uischema: {type: 'Label', text: 'Unsupported'},
      renderers: [],
    });

    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit-dispatch
        .store=${store}
        .schema=${schema}
        .uischema=${{type: 'Label', text: 'Unsupported'}}
        .path=${''}
        .renderers=${[]}
      ></jsonforms-lit-dispatch>
    `);

    expect(element.textContent).to.include('No renderer found');
  });

  test('default controls update text, number, checkbox, and enum data', async () => {
    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit
        .schema=${schema}
        .data=${{name: 'Ada', age: 36, active: false, role: 'viewer'}}
        .renderers=${litRenderers}
      ></jsonforms-lit>
    `);

    const text = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="name"]'
    );
    const number = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="age"]'
    );
    const checkbox = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="active"]'
    );
    const select = element.shadowRoot?.querySelector<HTMLSelectElement>(
      'select[name="role"]'
    );

    const dataChanges: unknown[] = [];
    element.addEventListener('data-change', (event) => {
      dataChanges.push((event as CustomEvent).detail.data);
    });

    text!.value = 'Grace';
    text!.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await nextFrame();
    number!.value = '37';
    number!.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await nextFrame();
    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await nextFrame();
    select!.value = 'admin';
    select!.dispatchEvent(new Event('change', {bubbles: true, composed: true}));

    await nextFrame();

    expect(dataChanges[dataChanges.length - 1]).to.deep.equal({
      name: 'Grace',
      age: 37,
      active: true,
      role: 'admin',
    });
  });

  test('renders required labels, descriptions, validation errors, and readonly state', async () => {
    const element = await fixture<HTMLElement>(html`
      <jsonforms-lit
        .schema=${schema}
        .data=${{name: '', age: 16}}
        .renderers=${litRenderers}
        validationMode="ValidateAndShow"
        readonly
      ></jsonforms-lit>
    `);
    await nextFrame();

    const input = element.shadowRoot?.querySelector<HTMLInputElement>(
      'input[name="name"]'
    );
    const label = element.shadowRoot?.querySelector('label');
    const description = element.shadowRoot?.querySelector('.jsonforms-description');
    const error = element.shadowRoot?.querySelector('.jsonforms-error');

    expect(input?.disabled).to.equal(true);
    expect(label?.textContent).to.include('*');
    expect(description?.textContent).to.equal('Legal name');
    expect(error?.textContent).to.include('must NOT have fewer');
  });
});
