import { useEffect, useState } from 'react';
import type { CommerceHubConnectReactBindingProps } from './commerce-hub-connect-react-binding';
import { CommerceHubConnectReactBinding } from './commerce-hub-connect-react-binding';

const initialProps: CommerceHubConnectReactBindingProps = {
  interaction: {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    allowedTenderTypes: ['CARD'],
    allowEmailChange: true,
  },
  configuration: {
    onSuccess: () => undefined,
    onError: () => undefined,
  },
  whiteLabel: {
    primaryColor: '#0a5dff',
  },
  environment: 'qa',
};

const updatedProps: CommerceHubConnectReactBindingProps = {
  ...initialProps,
  interaction: {
    ...initialProps.interaction,
    status: 'PAYMENT_SOURCE_REQUESTED',
    paymentSources: [
      {
        id: 'card-1',
        name: 'Primary Visa',
        tenderType: 'CARD',
        card: {
          cardNumber: '4111111111111111',
          cvv: '***',
          expirationMonth: '12',
          expirationYear: '30',
          nameOnCard: 'Smoke Tester',
          network: 'Visa',
        },
      },
    ],
  },
  configuration: {
    ...initialProps.configuration,
    paymentSelectionTitle: 'Saved methods',
  },
  whiteLabel: {
    primaryColor: '#1d4ed8',
  },
};

export default function FixtureApp() {
  const [bindingProps, setBindingProps] = useState(initialProps);
  const [mounted, setMounted] = useState(true);
  const [status, setStatus] = useState<'running' | 'passed' | 'failed'>('running');
  const [message, setMessage] = useState('Mounting the React binding...');

  useEffect(() => {
    let cancelled = false;

    async function runScenario() {
      await waitFor(() => document.body.textContent?.includes('Sign in'));

      if (cancelled) {
        return;
      }

      setMessage('Updating the React binding...');
      setBindingProps(updatedProps);
      await waitFor(() => document.body.textContent?.includes('Saved methods'));

      if (cancelled) {
        return;
      }

      setMessage('Unmounting the React binding...');
      setMounted(false);
      await waitFor(() => {
        const fixtureHost = document.getElementById('binding-fixture');
        return !fixtureHost?.querySelector('[data-commerce-hub-connect-react-binding="true"]');
      });

      if (!cancelled) {
        setMessage('React binding lifecycle passed.');
        setStatus('passed');
      }
    }

    runScenario().catch((error) => {
      if (cancelled) {
        return;
      }

      setStatus('failed');
      setMessage(error instanceof Error ? error.message : String(error));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="binding-fixture-shell">
      <section className="binding-fixture-card">
        <h1>Commerce Hub React binding fixture</h1>
        <p>
          This page is a verification fixture for the React wrapper over the framework-agnostic
          web SDK.
        </p>
        <div id="react-binding-status" data-react-binding-status={status}>
          {message}
        </div>
      </section>
      <section id="binding-fixture" className="binding-fixture-card">
        {mounted ? <CommerceHubConnectReactBinding {...bindingProps} /> : null}
      </section>
    </main>
  );
}

function assertFixture(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitFor(
  condition: () => unknown,
  timeoutMs: number = 5000,
  intervalMs: number = 50,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (condition()) {
      return;
    }

    await delay(intervalMs);
  }

  assertFixture(condition(), 'The React binding fixture timed out.');
}

function delay(timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });
}
