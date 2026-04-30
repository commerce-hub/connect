import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

import {
  CommerceHubConnectReactBinding,
  type CommerceHubConnectReactBindingProps,
} from './commerce-hub-connect-react-binding';
import {
  resolveApiBaseUrl,
  type CommerceHubConnectEnvironment,
  type CommerceHubSdkConfiguration,
  type CommerceHubSdkError,
  type CommerceHubSuccessResult,
  type CommerceHubTenderType,
  type CommerceHubWhiteLabelOptions,
  type InteractionResponse,
} from 'commerce-hub-connect-web-sdk';

type ExampleStatusTone = 'neutral' | 'success' | 'error';

type ExampleFormState = {
  environment: CommerceHubConnectEnvironment;
  email: string;
  paymentSelectionTitle: string;
  paymentSelectionConfirmLabel: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl: string;
  wallet: boolean;
  allowCard: boolean;
  allowBankAccount: boolean;
};

const initialFormState: ExampleFormState = {
  environment: 'qa',
  email: 'gregory.jablonski@fiserv.com',
  paymentSelectionTitle: 'Pay with',
  paymentSelectionConfirmLabel: 'Confirm',
  primaryColor: '#0a5dff',
  secondaryColor: '#627d98',
  textColor: '#0f172a',
  logoUrl: '',
  wallet: true,
  allowCard: true,
  allowBankAccount: true,
};

const environmentOptions: CommerceHubConnectEnvironment[] = ['dev', 'qa', 'cat', 'prod'];

export default function ExampleApp() {
  const [formState, setFormState] = useState(initialFormState);
  const [activeBindingProps, setActiveBindingProps] =
    useState<CommerceHubConnectReactBindingProps | null>(null);
  const [statusTone, setStatusTone] = useState<ExampleStatusTone>('neutral');
  const [statusMessage, setStatusMessage] = useState('Create an interaction to mount the React binding.');
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const appendLog = useCallback((label: string, payload?: unknown) => {
    const lines = [`[${new Date().toLocaleTimeString()}] ${label}`];

    if (payload !== undefined) {
      lines.push(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
    }

    setEventLog((current) => [lines.join('\n'), ...current]);
  }, []);

  const activeInteraction = activeBindingProps?.interaction ?? null;
  const activeEnvironment = activeBindingProps?.environment ?? formState.environment;
  const resolvedApiBaseUrl = useMemo(
    () => resolveApiBaseUrl(formState.environment),
    [formState.environment],
  );

  const handleFieldChange =
    <Key extends keyof ExampleFormState>(field: Key) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const nextValue =
        event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value;

      setFormState((current) => ({
        ...current,
        [field]: nextValue,
      }));
    };

  const handleMount = useCallback(async () => {
    setIsBusy(true);
    setStatusTone('neutral');
    setStatusMessage('Creating a Commerce Hub interaction...');

    try {
      const interaction = await createInteraction(formState);
      const nextBindingProps = buildBindingProps(formState, interaction, appendLog);

      setActiveBindingProps(nextBindingProps);
      setStatusTone('success');
      setStatusMessage(`Mounted interaction ${interaction.interactionId}.`);
      appendLog('mount', interaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatusTone('error');
      setStatusMessage(message);
      appendLog('mount error', message);
    } finally {
      setIsBusy(false);
    }
  }, [appendLog, formState]);

  const handleUpdate = useCallback(() => {
    if (!activeInteraction) {
      const message = 'Mount the widget before applying updates.';
      setStatusTone('error');
      setStatusMessage(message);
      appendLog('update', message);
      return;
    }

    setActiveBindingProps(buildBindingProps(formState, activeInteraction, appendLog));
    setStatusTone('success');
    setStatusMessage('Applied the latest host controls to the React binding.');
    appendLog('update', {
      environment: formState.environment,
      paymentSelectionTitle: formState.paymentSelectionTitle,
      allowedTenderTypes: resolveAllowedTenderTypes(formState),
    });
  }, [activeInteraction, appendLog, formState]);

  const handleDestroy = useCallback(() => {
    if (!activeInteraction) {
      const message = 'Nothing is mounted yet.';
      setStatusTone('neutral');
      setStatusMessage(message);
      appendLog('destroy', message);
      return;
    }

    setActiveBindingProps(null);
    setStatusTone('neutral');
    setStatusMessage('Destroyed the mounted React binding instance.');
    appendLog('destroy', `Destroyed interaction ${activeInteraction.interactionId}.`);
  }, [activeInteraction, appendLog]);

  return (
    <main className="example-shell">
      <section className="hero">
        <h1>Commerce Hub React Binding</h1>
        <p>
          This example mirrors the web SDK host flow with a React wrapper. Create an interaction,
          mount the widget, apply prop updates, or destroy the binding without leaving React.
        </p>
      </section>

      <section className="layout">
        <aside className="panel panel--sticky">
          <div className="stack">
            <div>
              <h2>Host controls</h2>
              <p>These values shape the interaction request and the binding props you apply.</p>
            </div>

            <div className="status" data-tone={statusTone}>
              {statusMessage}
            </div>

            <div className="chip-row">
              <span className="chip">Env: {activeEnvironment}</span>
              <span className="chip">API: {resolvedApiBaseUrl}</span>
              <span className="chip">
                {activeInteraction ? `Interaction: ${activeInteraction.interactionId}` : 'Widget idle'}
              </span>
            </div>

            <div className="grid grid--two">
              <label>
                <span>Environment</span>
                <select value={formState.environment} onChange={handleFieldChange('environment')}>
                  {environmentOptions.map((environment) => (
                    <option key={environment} value={environment}>
                      {environment.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Email</span>
                <input type="email" value={formState.email} onChange={handleFieldChange('email')} />
              </label>
            </div>

            <div className="grid grid--two">
              <label>
                <span>Payment Selection Title</span>
                <input
                  type="text"
                  value={formState.paymentSelectionTitle}
                  onChange={handleFieldChange('paymentSelectionTitle')}
                />
              </label>

              <label>
                <span>Confirm Label</span>
                <input
                  type="text"
                  value={formState.paymentSelectionConfirmLabel}
                  onChange={handleFieldChange('paymentSelectionConfirmLabel')}
                />
              </label>
            </div>

            <div className="grid grid--two">
              <label>
                <span>Primary Color</span>
                <input
                  type="text"
                  value={formState.primaryColor}
                  onChange={handleFieldChange('primaryColor')}
                />
              </label>

              <label>
                <span>Secondary Color</span>
                <input
                  type="text"
                  value={formState.secondaryColor}
                  onChange={handleFieldChange('secondaryColor')}
                />
              </label>
            </div>

            <div className="grid grid--two">
              <label>
                <span>Text Color</span>
                <input type="text" value={formState.textColor} onChange={handleFieldChange('textColor')} />
              </label>

              <label>
                <span>Logo URL</span>
                <input type="text" value={formState.logoUrl} onChange={handleFieldChange('logoUrl')} />
              </label>
            </div>

            <div className="toggle-grid">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formState.wallet}
                  onChange={handleFieldChange('wallet')}
                />
                <span>Enable wallet flow</span>
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formState.allowCard}
                  onChange={handleFieldChange('allowCard')}
                />
                <span>Allow cards</span>
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formState.allowBankAccount}
                  onChange={handleFieldChange('allowBankAccount')}
                />
                <span>Allow bank accounts</span>
              </label>
            </div>

            <div className="button-row">
              <button type="button" onClick={() => void handleMount()} disabled={isBusy}>
                {isBusy ? 'Creating interaction…' : activeInteraction ? 'Create new interaction' : 'Create + mount'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleUpdate}
                disabled={isBusy || !activeInteraction}
              >
                Apply update
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleDestroy}
                disabled={isBusy || !activeInteraction}
              >
                Destroy
              </button>
            </div>
          </div>
        </aside>

        <section className="stack">
          <article className="panel">
            <div>
              <h2>React binding preview</h2>
              <p>
                The binding renders below when an interaction exists. Use the update button to push
                the latest host form values into the wrapper props.
              </p>
            </div>

            <div id="mount-target" className="mount-target">
              {activeBindingProps ? (
                <CommerceHubConnectReactBinding {...activeBindingProps} className="binding-mount" />
              ) : (
                <div className="empty-state">
                  Create and mount the React binding example to render the Commerce Hub widget.
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div>
              <h2>Event log</h2>
              <p>Callback payloads and host actions are recorded here.</p>
            </div>

            <pre>{eventLog.length ? eventLog.join('\n\n') : 'No events yet.'}</pre>
          </article>
        </section>
      </section>
    </main>
  );
}

async function createInteraction(formState: ExampleFormState): Promise<InteractionResponse> {
  const response = await fetch(`${resolveApiBaseUrl(formState.environment)}/merchant/interaction/create`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionReferenceId: `react-binding-example-${Date.now()}`,
      authType: 'FINAL_SALE',
      email: formState.email,
      allowedTenderTypes: resolveAllowedTenderTypes(formState),
      wallet: formState.wallet,
      allowEmailChange: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`interaction/create failed with ${response.status}`);
  }

  return response.json() as Promise<InteractionResponse>;
}

function buildBindingProps(
  formState: ExampleFormState,
  interaction: InteractionResponse,
  appendLog: (label: string, payload?: unknown) => void,
): CommerceHubConnectReactBindingProps {
  return {
    interaction,
    environment: formState.environment,
    configuration: buildConfiguration(formState, appendLog),
    whiteLabel: buildWhiteLabel(formState),
    replaceContents: true,
  };
}

function buildConfiguration(
  formState: ExampleFormState,
  appendLog: (label: string, payload?: unknown) => void,
): CommerceHubSdkConfiguration {
  return {
    email: formState.email,
    wallet: formState.wallet,
    paymentSelectionTitle: formState.paymentSelectionTitle,
    paymentSelectionConfirmLabel: formState.paymentSelectionConfirmLabel,
    onSuccess: (result: CommerceHubSuccessResult) => appendLog('onSuccess', result),
    onError: (error: CommerceHubSdkError) => appendLog('onError', error),
  };
}

function buildWhiteLabel(formState: ExampleFormState): CommerceHubWhiteLabelOptions {
  return {
    primaryColor: formState.primaryColor,
    secondaryColor: formState.secondaryColor,
    textColor: formState.textColor,
    logoUrl: formState.logoUrl || undefined,
  };
}

function resolveAllowedTenderTypes(formState: ExampleFormState): CommerceHubTenderType[] {
  const allowed: CommerceHubTenderType[] = [];

  if (formState.allowCard) {
    allowed.push('CARD');
  }

  if (formState.allowBankAccount) {
    allowed.push('BANK_ACCOUNT');
  }

  return allowed.length ? allowed : ['CARD'];
}
